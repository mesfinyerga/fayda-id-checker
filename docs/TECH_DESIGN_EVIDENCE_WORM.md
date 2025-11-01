# Evidence Storage & WORM Technical Design

**Version**: 1.0  
**Last Updated**: August 30, 2025  
**Status**: ❌ Missing - Critical Implementation Required  

## Overview

This document outlines the implementation of evidence storage for KYC verification documents using MinIO/S3 with WORM (Write Once, Read Many) policies for compliance and audit requirements.

## Current State Analysis

### Critical Missing Component
- **Current State**: No evidence storage system implemented
- **Risk Level**: CRITICAL - Blocks KYC operations
- **Impact**: Cannot store verification documents, photos, or evidence files

### Existing Schema
```sql
-- Current evidence_object table (no storage integration)
CREATE TABLE evidence_object (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_id UUID REFERENCES verification(id),
    tenant_id UUID REFERENCES tenant(id),
    object_key VARCHAR NOT NULL,        -- No actual storage
    media_type VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Solution Architecture

### Storage Provider Options

#### Option A: MinIO (Recommended for Development/Staging)
- **Pros**: Self-hosted, S3-compatible, cost-effective
- **Cons**: Requires infrastructure management
- **Use Case**: Development, staging, small-scale production

#### Option B: AWS S3 (Recommended for Production)
- **Pros**: Managed service, high availability, compliance features
- **Cons**: Higher cost, vendor lock-in
- **Use Case**: Production, enterprise deployments

#### Option C: Hybrid Approach
- **Pros**: Flexibility, cost optimization
- **Cons**: Complexity, data synchronization
- **Use Case**: Multi-environment deployments

## Implementation Design

### Environment Configuration
```bash
# .env
# Storage Configuration
STORAGE_PROVIDER=minio  # or 's3', 'hybrid'
STORAGE_ENDPOINT=http://localhost:9000
STORAGE_ACCESS_KEY=your-access-key
STORAGE_SECRET_KEY=your-secret-key
STORAGE_BUCKET=fayda-evidence
STORAGE_REGION=us-east-1

# WORM Configuration
WORM_ENABLED=true
WORM_RETENTION_DAYS=2555  # 7 years for KYC compliance
WORM_LEGAL_HOLD=false

# Security Configuration
STORAGE_ENCRYPTION=true
STORAGE_KMS_KEY_ID=your-kms-key-id

# Performance Configuration
STORAGE_MAX_FILE_SIZE=10485760  # 10MB
STORAGE_ALLOWED_TYPES=image/jpeg,image/png,application/pdf
```

### Core Storage Module
```python
# app/core/storage.py
import os
import uuid
from typing import Optional, BinaryIO, Dict, Any
from datetime import datetime, timedelta
import boto3
from botocore.exceptions import ClientError
from minio import Minio
from minio.error import S3Error
from fastapi import UploadFile, HTTPException
from app.core.config import settings

class EvidenceStorage:
    """Evidence storage with WORM policies"""
    
    def __init__(self):
        self.provider = settings.storage_provider
        self.bucket = settings.storage_bucket
        self.client = self._initialize_client()
        self._ensure_bucket_exists()
    
    def _initialize_client(self):
        """Initialize storage client based on provider"""
        if self.provider == "minio":
            return Minio(
                settings.storage_endpoint,
                access_key=settings.storage_access_key,
                secret_key=settings.storage_secret_key,
                secure=settings.storage_endpoint.startswith("https")
            )
        elif self.provider == "s3":
            return boto3.client(
                's3',
                aws_access_key_id=settings.storage_access_key,
                aws_secret_access_key=settings.storage_secret_key,
                region_name=settings.storage_region
            )
        else:
            raise ValueError(f"Unsupported storage provider: {self.provider}")
    
    def _ensure_bucket_exists(self):
        """Ensure storage bucket exists with WORM policies"""
        try:
            if self.provider == "minio":
                if not self.client.bucket_exists(self.bucket):
                    self.client.make_bucket(self.bucket)
                    self._setup_worm_policies()
            elif self.provider == "s3":
                self.client.head_bucket(Bucket=self.bucket)
        except (S3Error, ClientError):
            # Bucket doesn't exist, create it
            if self.provider == "s3":
                self.client.create_bucket(Bucket=self.bucket)
            self._setup_worm_policies()
    
    def _setup_worm_policies(self):
        """Setup WORM (Write Once, Read Many) policies"""
        if not settings.worm_enabled:
            return
        
        if self.provider == "minio":
            # MinIO Object Lock (WORM) configuration
            self.client.set_bucket_versioning(
                self.bucket,
                config={
                    "Status": "Enabled"
                }
            )
            
            # Set retention policy
            self.client.set_bucket_lifecycle(
                self.bucket,
                config={
                    "Rules": [{
                        "ID": "WORM-Retention",
                        "Status": "Enabled",
                        "Filter": {"Prefix": ""},
                        "NoncurrentVersionExpiration": {
                            "NoncurrentDays": settings.worm_retention_days
                        },
                        "AbortIncompleteMultipartUpload": {
                            "DaysAfterInitiation": 1
                        }
                    }]
                }
            )
        
        elif self.provider == "s3":
            # S3 Object Lock configuration
            self.client.put_object_lock_configuration(
                Bucket=self.bucket,
                ObjectLockConfiguration={
                    'ObjectLockEnabled': 'Enabled',
                    'Rule': {
                        'DefaultRetention': {
                            'Mode': 'COMPLIANCE',
                            'Days': settings.worm_retention_days
                        }
                    }
                }
            )
    
    def generate_object_key(self, tenant_id: str, verification_id: str, 
                           file_extension: str) -> str:
        """Generate structured object key"""
        file_uuid = str(uuid.uuid4())
        return f"{tenant_id}/{verification_id}/{file_uuid}.{file_extension}"
    
    def upload_evidence(self, file: UploadFile, tenant_id: str, 
                       verification_id: str) -> Dict[str, Any]:
        """Upload evidence file with WORM protection"""
        # Validate file
        self._validate_file(file)
        
        # Generate object key
        file_extension = file.filename.split('.')[-1].lower()
        object_key = self.generate_object_key(tenant_id, verification_id, file_extension)
        
        # Upload with WORM headers
        metadata = {
            'tenant_id': tenant_id,
            'verification_id': verification_id,
            'uploaded_by': 'system',  # Will be set from JWT
            'upload_timestamp': datetime.utcnow().isoformat(),
            'content_type': file.content_type,
            'original_filename': file.filename
        }
        
        try:
            if self.provider == "minio":
                result = self.client.put_object(
                    self.bucket,
                    object_key,
                    file.file,
                    file.size,
                    content_type=file.content_type,
                    metadata=metadata
                )
            elif self.provider == "s3":
                result = self.client.put_object(
                    Bucket=self.bucket,
                    Key=object_key,
                    Body=file.file,
                    ContentType=file.content_type,
                    Metadata=metadata,
                    ObjectLockMode='COMPLIANCE' if settings.worm_enabled else None
                )
            
            return {
                "object_key": object_key,
                "bucket": self.bucket,
                "size": file.size,
                "content_type": file.content_type,
                "etag": result.etag if hasattr(result, 'etag') else None
            }
        
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload evidence: {str(e)}"
            )
    
    def download_evidence(self, object_key: str) -> Optional[BinaryIO]:
        """Download evidence file"""
        try:
            if self.provider == "minio":
                return self.client.get_object(self.bucket, object_key)
            elif self.provider == "s3":
                response = self.client.get_object(Bucket=self.bucket, Key=object_key)
                return response['Body']
        except Exception as e:
            raise HTTPException(
                status_code=404,
                detail=f"Evidence file not found: {str(e)}"
            )
    
    def generate_presigned_url(self, object_key: str, 
                              operation: str = "get_object",
                              expires_in: int = 3600) -> str:
        """Generate presigned URL for secure access"""
        try:
            if self.provider == "minio":
                return self.client.presigned_get_object(
                    self.bucket, object_key, expires=timedelta(seconds=expires_in)
                )
            elif self.provider == "s3":
                return self.client.generate_presigned_url(
                    operation,
                    Params={'Bucket': self.bucket, 'Key': object_key},
                    ExpiresIn=expires_in
                )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate presigned URL: {str(e)}"
            )
    
    def delete_evidence(self, object_key: str) -> bool:
        """Delete evidence file (subject to WORM policies)"""
        if settings.worm_enabled:
            raise HTTPException(
                status_code=403,
                detail="Cannot delete evidence: WORM protection enabled"
            )
        
        try:
            if self.provider == "minio":
                self.client.remove_object(self.bucket, object_key)
            elif self.provider == "s3":
                self.client.delete_object(Bucket=self.bucket, Key=object_key)
            return True
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to delete evidence: {str(e)}"
            )
    
    def _validate_file(self, file: UploadFile):
        """Validate uploaded file"""
        # Check file size
        if file.size > settings.storage_max_file_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {settings.storage_max_file_size} bytes"
            )
        
        # Check content type
        allowed_types = settings.storage_allowed_types.split(',')
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Allowed types: {allowed_types}"
            )

# Global storage instance
storage = EvidenceStorage()
```

### CRUD Integration
```python
# app/crud/evidence.py
from sqlalchemy.orm import Session
from app.models.evidence_object import EvidenceObject
from app.core.storage import storage
from app.schemas.evidence import EvidenceCreate, EvidenceOut
from fastapi import UploadFile
import uuid

class EvidenceManager:
    """Evidence management with storage integration"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def upload_evidence(self, file: UploadFile, tenant_id: str, 
                       verification_id: str) -> EvidenceObject:
        """Upload evidence file and create database record"""
        # Upload to storage
        upload_result = storage.upload_evidence(file, tenant_id, verification_id)
        
        # Create database record
        evidence_object = EvidenceObject(
            id=uuid.uuid4(),
            verification_id=verification_id,
            tenant_id=tenant_id,
            object_key=upload_result["object_key"],
            media_type=upload_result["content_type"]
        )
        
        self.db.add(evidence_object)
        self.db.commit()
        self.db.refresh(evidence_object)
        
        return evidence_object
    
    def get_evidence(self, evidence_id: str) -> EvidenceObject:
        """Get evidence object by ID"""
        return self.db.query(EvidenceObject).filter(
            EvidenceObject.id == evidence_id
        ).first()
    
    def get_verification_evidence(self, verification_id: str) -> list[EvidenceObject]:
        """Get all evidence for a verification"""
        return self.db.query(EvidenceObject).filter(
            EvidenceObject.verification_id == verification_id
        ).all()
    
    def delete_evidence(self, evidence_id: str) -> bool:
        """Delete evidence (subject to WORM policies)"""
        evidence = self.get_evidence(evidence_id)
        if not evidence:
            return False
        
        # Delete from storage
        storage.delete_evidence(evidence.object_key)
        
        # Delete from database
        self.db.delete(evidence)
        self.db.commit()
        
        return True
```

### API Endpoints
```python
# app/api/endpoints/evidence.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud.evidence import EvidenceManager
from app.schemas.evidence import EvidenceOut, EvidenceList
from app.deps.tenant import set_tenant_context_for_request
from app.core.storage import storage
import io

router = APIRouter()

@router.post("/{verification_id}/evidence", response_model=EvidenceOut)
async def upload_evidence(
    verification_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Upload evidence file for verification"""
    try:
        evidence_manager = EvidenceManager(db)
        evidence = evidence_manager.upload_evidence(file, tenant_id, verification_id)
        
        return EvidenceOut(
            id=str(evidence.id),
            verification_id=str(evidence.verification_id),
            object_key=evidence.object_key,
            media_type=evidence.media_type,
            created_at=evidence.created_at
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{verification_id}/evidence", response_model=EvidenceList)
async def list_evidence(
    verification_id: str,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """List all evidence for verification"""
    evidence_manager = EvidenceManager(db)
    evidence_list = evidence_manager.get_verification_evidence(verification_id)
    
    return EvidenceList(
        evidence=[
            EvidenceOut(
                id=str(e.id),
                verification_id=str(e.verification_id),
                object_key=e.object_key,
                media_type=e.media_type,
                created_at=e.created_at
            ) for e in evidence_list
        ]
    )

@router.get("/evidence/{evidence_id}/download")
async def download_evidence(
    evidence_id: str,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Download evidence file"""
    evidence_manager = EvidenceManager(db)
    evidence = evidence_manager.get_evidence(evidence_id)
    
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    
    try:
        file_stream = storage.download_evidence(evidence.object_key)
        
        return StreamingResponse(
            file_stream,
            media_type=evidence.media_type,
            headers={
                "Content-Disposition": f"attachment; filename=evidence_{evidence_id}"
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/evidence/{evidence_id}/url")
async def get_evidence_url(
    evidence_id: str,
    expires_in: int = 3600,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Get presigned URL for evidence download"""
    evidence_manager = EvidenceManager(db)
    evidence = evidence_manager.get_evidence(evidence_id)
    
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
    
    try:
        presigned_url = storage.generate_presigned_url(
            evidence.object_key, expires_in=expires_in
        )
        
        return {
            "url": presigned_url,
            "expires_in": expires_in,
            "media_type": evidence.media_type
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/evidence/{evidence_id}")
async def delete_evidence(
    evidence_id: str,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Delete evidence (subject to WORM policies)"""
    evidence_manager = EvidenceManager(db)
    
    try:
        success = evidence_manager.delete_evidence(evidence_id)
        if not success:
            raise HTTPException(status_code=404, detail="Evidence not found")
        
        return {"message": "Evidence deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## WORM Policy Implementation

### MinIO WORM Configuration
```yaml
# docker-compose.yml (MinIO setup)
version: '3.8'
services:
  minio:
    image: minio/minio:latest
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: your-access-key
      MINIO_ROOT_PASSWORD: your-secret-key
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

volumes:
  minio_data:
```

### S3 WORM Configuration
```python
# scripts/setup_s3_worm.py
import boto3
from botocore.exceptions import ClientError

def setup_s3_worm(bucket_name: str, retention_days: int = 2555):
    """Setup S3 bucket with WORM policies"""
    s3_client = boto3.client('s3')
    
    try:
        # Enable Object Lock
        s3_client.put_object_lock_configuration(
            Bucket=bucket_name,
            ObjectLockConfiguration={
                'ObjectLockEnabled': 'Enabled',
                'Rule': {
                    'DefaultRetention': {
                        'Mode': 'COMPLIANCE',
                        'Days': retention_days
                    }
                }
            }
        )
        
        # Enable versioning
        s3_client.put_bucket_versioning(
            Bucket=bucket_name,
            VersioningConfiguration={'Status': 'Enabled'}
        )
        
        print(f"WORM policies configured for bucket: {bucket_name}")
        
    except ClientError as e:
        print(f"Failed to configure WORM: {e}")
```

## Security Considerations

### Access Control
```python
# app/core/storage_security.py
from app.deps.tenant import get_current_tenant_id
from app.models.evidence_object import EvidenceObject

def validate_evidence_access(
    db: Session,
    evidence_id: str,
    tenant_id: str
) -> bool:
    """Validate tenant has access to evidence"""
    evidence = db.query(EvidenceObject).filter(
        EvidenceObject.id == evidence_id,
        EvidenceObject.tenant_id == tenant_id
    ).first()
    
    return evidence is not None
```

### Encryption at Rest
```python
# app/core/storage_encryption.py
def setup_storage_encryption():
    """Setup storage encryption"""
    if settings.storage_encryption:
        # Configure server-side encryption
        if settings.provider == "s3":
            # Use AWS KMS for encryption
            encryption_config = {
                'ServerSideEncryption': 'aws:kms',
                'SSEKMSKeyId': settings.storage_kms_key_id
            }
        else:
            # MinIO encryption
            encryption_config = {
                'ServerSideEncryption': 'AES256'
            }
        
        return encryption_config
```

## Monitoring & Compliance

### Storage Metrics
```python
# app/core/storage_monitoring.py
from prometheus_client import Counter, Histogram, Gauge

# Metrics
storage_uploads_total = Counter(
    'storage_uploads_total',
    'Total number of evidence uploads',
    ['tenant_id', 'verification_id', 'status']
)

storage_downloads_total = Counter(
    'storage_downloads_total',
    'Total number of evidence downloads',
    ['tenant_id', 'verification_id']
)

storage_file_size_bytes = Histogram(
    'storage_file_size_bytes',
    'Evidence file sizes',
    ['tenant_id', 'media_type']
)

storage_usage_bytes = Gauge(
    'storage_usage_bytes',
    'Total storage usage',
    ['tenant_id', 'bucket']
)

def track_upload(tenant_id: str, verification_id: str, file_size: int, 
                media_type: str, status: str):
    """Track upload metrics"""
    storage_uploads_total.labels(
        tenant_id=tenant_id,
        verification_id=verification_id,
        status=status
    ).inc()
    
    storage_file_size_bytes.labels(
        tenant_id=tenant_id,
        media_type=media_type
    ).observe(file_size)
```

### Compliance Reporting
```python
# app/services/compliance_service.py
def generate_storage_compliance_report(tenant_id: str, 
                                     start_date: datetime,
                                     end_date: datetime) -> dict:
    """Generate storage compliance report"""
    evidence_objects = db.query(EvidenceObject).filter(
        EvidenceObject.tenant_id == tenant_id,
        EvidenceObject.created_at.between(start_date, end_date)
    ).all()
    
    total_files = len(evidence_objects)
    total_size = sum(obj.size for obj in evidence_objects)
    
    # Check WORM compliance
    worm_compliant = all(
        storage.is_worm_protected(obj.object_key) 
        for obj in evidence_objects
    )
    
    return {
        "tenant_id": tenant_id,
        "period": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat()
        },
        "storage_metrics": {
            "total_files": total_files,
            "total_size_bytes": total_size,
            "average_file_size": total_size / total_files if total_files > 0 else 0
        },
        "compliance": {
            "worm_enabled": settings.worm_enabled,
            "worm_compliant": worm_compliant,
            "retention_days": settings.worm_retention_days
        }
    }
```

## Testing Strategy

### Unit Tests
```python
# tests/test_storage.py
import pytest
from unittest.mock import Mock, patch
from app.core.storage import EvidenceStorage
from fastapi import UploadFile

@pytest.fixture
def mock_storage():
    with patch('app.core.storage.Minio') as mock_minio:
        storage = EvidenceStorage()
        yield storage

def test_upload_evidence(mock_storage):
    """Test evidence upload"""
    file = Mock(spec=UploadFile)
    file.filename = "test.jpg"
    file.content_type = "image/jpeg"
    file.size = 1024
    
    result = mock_storage.upload_evidence(
        file, "tenant-123", "verification-456"
    )
    
    assert result["object_key"] is not None
    assert result["content_type"] == "image/jpeg"

def test_worm_protection(mock_storage):
    """Test WORM protection"""
    # Attempt to delete WORM-protected file
    with pytest.raises(HTTPException) as exc_info:
        mock_storage.delete_evidence("test-key")
    
    assert exc_info.value.status_code == 403
```

### Integration Tests
```python
# tests/test_evidence_api.py
def test_upload_evidence_api(client, tenant_user):
    """Test evidence upload API"""
    with open("tests/fixtures/test_image.jpg", "rb") as f:
        response = client.post(
            "/api/verifications/test-verification/evidence",
            files={"file": ("test.jpg", f, "image/jpeg")},
            headers={"Authorization": f"Bearer {tenant_user.token}"}
        )
    
    assert response.status_code == 200
    data = response.json()
    assert data["media_type"] == "image/jpeg"
```

## Implementation Checklist

### Phase 1: Core Storage
- [ ] Set up MinIO/S3 environment
- [ ] Implement EvidenceStorage class
- [ ] Create CRUD operations with storage integration
- [ ] Add API endpoints for evidence management
- [ ] Implement file validation and security

### Phase 2: WORM Implementation
- [ ] Configure WORM policies on storage bucket
- [ ] Implement retention policies
- [ ] Add legal hold functionality
- [ ] Test WORM compliance

### Phase 3: Security & Monitoring
- [ ] Implement access control
- [ ] Add encryption at rest
- [ ] Set up monitoring and metrics
- [ ] Create compliance reporting

### Phase 4: Production Readiness
- [ ] Performance testing and optimization
- [ ] Disaster recovery procedures
- [ ] Backup and restore testing
- [ ] Security audit and penetration testing

## Conclusion

Evidence storage with WORM policies is **critical** for KYC operations and compliance. The MinIO/S3-based solution provides robust, scalable storage with enterprise-grade security features.

**Next Steps**:
1. Set up MinIO development environment
2. Implement core storage functionality
3. Add WORM policies and compliance features
4. Integrate with existing verification workflow
5. Plan for production S3 deployment
