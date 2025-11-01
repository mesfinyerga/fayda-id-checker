# PDPP Compliance Technical Design

**Version**: 1.0  
**Last Updated**: August 30, 2025  
**Status**: ❌ Missing - Critical Implementation Required  

## Overview

This document outlines the implementation of Personal Data Protection Proclamation (PDPP) compliance for the Fayda ID Checker, including data localization, consent management, and data subject rights.

## PDPP Requirements Analysis

### Key Compliance Areas
1. **Data Localization**: Data must be stored within Ethiopia
2. **Consent Management**: Explicit consent for data processing
3. **Data Subject Rights**: Right to access, rectification, erasure
4. **Breach Notification**: 72-hour notification requirement
5. **Data Minimization**: Collect only necessary data
6. **Purpose Limitation**: Use data only for specified purposes

### Current State
- **Data Localization**: ❌ No regional data routing
- **Consent Management**: ❌ No consent tracking
- **Data Subject Rights**: ❌ No rights management
- **Breach Notification**: ❌ No incident response
- **Audit Trail**: ✅ Basic audit events exist

## Solution Architecture

### Data Localization Framework

#### Environment Configuration
```bash
# .env
# Data Localization Configuration
DATA_REGION=ETHIOPIA  # ETHIOPIA, EU, HYBRID
DATA_LOCALIZATION_ENABLED=true

# Regional Database URLs
DATABASE_URL_ETHIOPIA=postgresql+psycopg://user:pass@ethiopia-db:5432/faydaidcheck
DATABASE_URL_EU=postgresql+psycopg://user:pass@eu-db:5432/faydaidcheck

# Regional Storage
STORAGE_ENDPOINT_ETHIOPIA=http://ethiopia-minio:9000
STORAGE_ENDPOINT_EU=http://eu-s3.amazonaws.com

# Compliance Settings
PDPP_ENFORCED=true
CONSENT_REQUIRED=true
BREACH_NOTIFICATION_EMAIL=compliance@fayda.com
```

#### Data Region Model
```python
# app/models/data_region.py
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base
import datetime
import uuid

class DataRegion(Base):
    __tablename__ = "data_region"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)  # ETHIOPIA, EU
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Regional settings
    database_url = Column(String, nullable=False)
    storage_endpoint = Column(String, nullable=False)
    compliance_requirements = Column(String, nullable=True)  # JSON
```

#### Regional Data Routing
```python
# app/core/data_localization.py
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.data_region import DataRegion
from app.models.tenant import Tenant
from app.core.config import settings

class DataLocalizationService:
    """Service for managing data localization and regional routing"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_tenant_region(self, tenant_id: str) -> str:
        """Get tenant's data region"""
        tenant = self.db.query(Tenant).filter(Tenant.id == tenant_id).first()
        return getattr(tenant, 'data_region', 'ETHIOPIA')  # Default to Ethiopia
    
    def get_regional_database_url(self, region: str) -> str:
        """Get database URL for specific region"""
        region_config = self.db.query(DataRegion).filter(
            DataRegion.name == region,
            DataRegion.is_active == True
        ).first()
        
        if region_config:
            return region_config.database_url
        
        # Fallback to environment variables
        if region == "ETHIOPIA":
            return os.getenv("DATABASE_URL_ETHIOPIA", settings.database_url)
        elif region == "EU":
            return os.getenv("DATABASE_URL_EU")
        else:
            return settings.database_url
    
    def get_regional_storage_endpoint(self, region: str) -> str:
        """Get storage endpoint for specific region"""
        region_config = self.db.query(DataRegion).filter(
            DataRegion.name == region,
            DataRegion.is_active == True
        ).first()
        
        if region_config:
            return region_config.storage_endpoint
        
        # Fallback to environment variables
        if region == "ETHIOPIA":
            return os.getenv("STORAGE_ENDPOINT_ETHIOPIA")
        elif region == "EU":
            return os.getenv("STORAGE_ENDPOINT_EU")
        else:
            return settings.storage_endpoint
    
    def validate_data_transfer(self, from_region: str, to_region: str, 
                             data_type: str) -> bool:
        """Validate cross-region data transfer"""
        if from_region == to_region:
            return True
        
        # Check if transfer is allowed
        if from_region == "ETHIOPIA" and to_region == "EU":
            # Ethiopia to EU transfer requires special approval
            return self._check_eu_transfer_approval()
        
        return True
    
    def _check_eu_transfer_approval(self) -> bool:
        """Check if EU data transfer is approved"""
        # Implement approval logic
        return False  # Default to false for compliance
```

### Consent Management

#### Consent Model
```python
# app/models/consent.py
from sqlalchemy import Column, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime
import uuid

class Consent(Base):
    __tablename__ = "consent"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenant.id"), nullable=False)
    verification_id = Column(UUID(as_uuid=True), ForeignKey("verification.id"), nullable=False)
    
    # Consent details
    consent_type = Column(String, nullable=False)  # KYC, MARKETING, THIRD_PARTY
    consent_version = Column(String, nullable=False)  # Version of consent text
    consent_text = Column(Text, nullable=False)  # Full consent text
    consent_text_amharic = Column(Text, nullable=True)  # Amharic version
    
    # Consent status
    is_granted = Column(Boolean, nullable=False)
    granted_at = Column(DateTime, nullable=True)
    withdrawn_at = Column(DateTime, nullable=True)
    
    # Consent metadata
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    consent_method = Column(String, nullable=False)  # WEB, MOBILE, API
    
    # Additional data
    metadata = Column(JSONB, default={})
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Relationships
    tenant = relationship("Tenant", back_populates="consents")
    verification = relationship("Verification", back_populates="consents")
```

#### Consent Service
```python
# app/services/consent_service.py
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.models.consent import Consent
from app.models.verification import Verification
from app.core.data_localization import DataLocalizationService
import datetime

class ConsentService:
    """Service for managing consent and compliance"""
    
    def __init__(self, db: Session):
        self.db = db
        self.localization = DataLocalizationService(db)
    
    def create_consent(self, tenant_id: str, verification_id: str,
                      consent_type: str, consent_text: str,
                      consent_text_amharic: Optional[str] = None,
                      ip_address: Optional[str] = None,
                      user_agent: Optional[str] = None) -> Consent:
        """Create new consent record"""
        
        # Get consent version
        consent_version = self._get_consent_version(consent_type)
        
        consent = Consent(
            tenant_id=tenant_id,
            verification_id=verification_id,
            consent_type=consent_type,
            consent_version=consent_version,
            consent_text=consent_text,
            consent_text_amharic=consent_text_amharic,
            is_granted=True,
            granted_at=datetime.datetime.utcnow(),
            consent_method="WEB",
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        self.db.add(consent)
        self.db.commit()
        self.db.refresh(consent)
        
        return consent
    
    def withdraw_consent(self, consent_id: str) -> bool:
        """Withdraw consent"""
        consent = self.db.query(Consent).filter(Consent.id == consent_id).first()
        
        if not consent:
            return False
        
        consent.is_granted = False
        consent.withdrawn_at = datetime.datetime.utcnow()
        
        self.db.commit()
        
        # Log consent withdrawal
        self._log_consent_withdrawal(consent)
        
        return True
    
    def get_verification_consents(self, verification_id: str) -> List[Consent]:
        """Get all consents for a verification"""
        return self.db.query(Consent).filter(
            Consent.verification_id == verification_id
        ).all()
    
    def check_consent_required(self, tenant_id: str, consent_type: str) -> bool:
        """Check if consent is required for operation"""
        # Check tenant's consent requirements
        tenant = self.db.query(Tenant).filter(Tenant.id == tenant_id).first()
        
        if not tenant:
            return True  # Default to requiring consent
        
        # Check tenant's consent settings
        consent_settings = getattr(tenant, 'consent_settings', {})
        return consent_settings.get(consent_type, True)
    
    def _get_consent_version(self, consent_type: str) -> str:
        """Get current consent version for type"""
        # This could be stored in configuration or database
        versions = {
            "KYC": "1.0",
            "MARKETING": "1.0",
            "THIRD_PARTY": "1.0"
        }
        return versions.get(consent_type, "1.0")
    
    def _log_consent_withdrawal(self, consent: Consent):
        """Log consent withdrawal for audit"""
        # Create audit event
        audit_event = AuditEvent(
            tenant_id=consent.tenant_id,
            action="consent_withdrawn",
            target_type="consent",
            target_id=str(consent.id),
            metadata={
                "consent_type": consent.consent_type,
                "verification_id": str(consent.verification_id)
            }
        )
        self.db.add(audit_event)
        self.db.commit()
```

### Data Subject Rights Management

#### Data Subject Rights Model
```python
# app/models/data_subject_rights.py
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime
import uuid

class DataSubjectRights(Base):
    __tablename__ = "data_subject_rights"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenant.id"), nullable=False)
    verification_id = Column(UUID(as_uuid=True), ForeignKey("verification.id"), nullable=False)
    
    # Request details
    request_type = Column(String, nullable=False)  # ACCESS, RECTIFICATION, ERASURE, PORTABILITY
    request_status = Column(String, nullable=False, default="pending")  # pending, processing, completed, rejected
    request_reason = Column(Text, nullable=True)
    
    # Processing details
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Response data
    response_data = Column(JSONB, default={})
    rejection_reason = Column(Text, nullable=True)
    
    # Metadata
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Relationships
    tenant = relationship("Tenant", back_populates="data_subject_rights")
    verification = relationship("Verification", back_populates="data_subject_rights")
```

#### Data Subject Rights Service
```python
# app/services/data_subject_rights_service.py
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.models.data_subject_rights import DataSubjectRights
from app.models.verification import Verification
from app.models.subject_pii import SubjectPII
import datetime

class DataSubjectRightsService:
    """Service for managing data subject rights"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_rights_request(self, tenant_id: str, verification_id: str,
                            request_type: str, request_reason: Optional[str] = None,
                            ip_address: Optional[str] = None,
                            user_agent: Optional[str] = None) -> DataSubjectRights:
        """Create data subject rights request"""
        
        rights_request = DataSubjectRights(
            tenant_id=tenant_id,
            verification_id=verification_id,
            request_type=request_type,
            request_reason=request_reason,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        self.db.add(rights_request)
        self.db.commit()
        self.db.refresh(rights_request)
        
        return rights_request
    
    def process_access_request(self, rights_request_id: str) -> Dict[str, Any]:
        """Process data access request"""
        rights_request = self.db.query(DataSubjectRights).filter(
            DataSubjectRights.id == rights_request_id
        ).first()
        
        if not rights_request:
            raise ValueError("Rights request not found")
        
        # Get verification data
        verification = self.db.query(Verification).filter(
            Verification.id == rights_request.verification_id
        ).first()
        
        # Get PII data (decrypted)
        pii_data = self.db.query(SubjectPII).filter(
            SubjectPII.verification_id == rights_request.verification_id
        ).first()
        
        # Prepare response data
        response_data = {
            "verification_id": str(verification.id),
            "status": verification.status,
            "created_at": verification.created_at.isoformat(),
            "pii_data": self._decrypt_pii_data(pii_data) if pii_data else None
        }
        
        # Update request status
        rights_request.request_status = "completed"
        rights_request.processed_at = datetime.datetime.utcnow()
        rights_request.completed_at = datetime.datetime.utcnow()
        rights_request.response_data = response_data
        
        self.db.commit()
        
        return response_data
    
    def process_erasure_request(self, rights_request_id: str) -> bool:
        """Process data erasure request"""
        rights_request = self.db.query(DataSubjectRights).filter(
            DataSubjectRights.id == rights_request_id
        ).first()
        
        if not rights_request:
            raise ValueError("Rights request not found")
        
        # Check if erasure is allowed
        if not self._can_erase_data(rights_request.verification_id):
            rights_request.request_status = "rejected"
            rights_request.rejection_reason = "Data cannot be erased due to legal requirements"
            self.db.commit()
            return False
        
        # Perform data erasure
        self._erase_verification_data(rights_request.verification_id)
        
        # Update request status
        rights_request.request_status = "completed"
        rights_request.processed_at = datetime.datetime.utcnow()
        rights_request.completed_at = datetime.datetime.utcnow()
        
        self.db.commit()
        
        return True
    
    def _can_erase_data(self, verification_id: str) -> bool:
        """Check if data can be erased"""
        # Check legal requirements (e.g., KYC retention periods)
        verification = self.db.query(Verification).filter(
            Verification.id == verification_id
        ).first()
        
        if not verification:
            return False
        
        # Check if within retention period (e.g., 7 years for KYC)
        retention_period = datetime.timedelta(days=2555)  # 7 years
        if datetime.datetime.utcnow() - verification.created_at < retention_period:
            return False
        
        return True
    
    def _erase_verification_data(self, verification_id: str):
        """Erase verification data"""
        # Soft delete by marking as erased
        verification = self.db.query(Verification).filter(
            Verification.id == verification_id
        ).first()
        
        if verification:
            verification.status = "erased"
            verification.erased_at = datetime.datetime.utcnow()
        
        # Erase PII data
        pii_data = self.db.query(SubjectPII).filter(
            SubjectPII.verification_id == verification_id
        ).first()
        
        if pii_data:
            # Overwrite with null data
            pii_data.full_name = None
            pii_data.dob = None
            pii_data.id_number = None
            pii_data.address = None
            pii_data.phone = None
            pii_data.erased_at = datetime.datetime.utcnow()
    
    def _decrypt_pii_data(self, pii_data: SubjectPII) -> Dict[str, Any]:
        """Decrypt PII data for access request"""
        # Use PII encryption service to decrypt
        from app.core.pii_encryption import get_pii_encryption
        encryption = get_pii_encryption(self.db)
        
        return encryption.decrypt_pii_batch({
            "full_name": pii_data.full_name,
            "dob": pii_data.dob,
            "id_number": pii_data.id_number,
            "address": pii_data.address,
            "phone": pii_data.phone
        })
```

### Breach Notification System

#### Breach Notification Model
```python
# app/models/breach_notification.py
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime
import uuid

class BreachNotification(Base):
    __tablename__ = "breach_notification"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenant.id"), nullable=False)
    
    # Breach details
    breach_type = Column(String, nullable=False)  # UNAUTHORIZED_ACCESS, DATA_LOSS, SYSTEM_BREACH
    breach_severity = Column(String, nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    breach_description = Column(Text, nullable=False)
    
    # Affected data
    affected_records_count = Column(Integer, nullable=True)
    affected_data_types = Column(JSONB, default=[])  # List of affected data types
    affected_individuals_count = Column(Integer, nullable=True)
    
    # Timeline
    breach_discovered_at = Column(DateTime, nullable=False)
    notification_sent_at = Column(DateTime, nullable=True)
    resolution_completed_at = Column(DateTime, nullable=True)
    
    # Status
    status = Column(String, nullable=False, default="discovered")  # discovered, notified, investigating, resolved
    
    # Response details
    response_actions = Column(JSONB, default=[])
    regulatory_notifications = Column(JSONB, default=[])
    
    # Metadata
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Relationships
    tenant = relationship("Tenant", back_populates="breach_notifications")
```

#### Breach Notification Service
```python
# app/services/breach_notification_service.py
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.models.breach_notification import BreachNotification
from app.core.config import settings
import datetime

class BreachNotificationService:
    """Service for managing data breach notifications"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_breach_notification(self, tenant_id: str, breach_type: str,
                                 breach_severity: str, breach_description: str,
                                 affected_records_count: Optional[int] = None,
                                 affected_data_types: Optional[List[str]] = None) -> BreachNotification:
        """Create breach notification"""
        
        breach = BreachNotification(
            tenant_id=tenant_id,
            breach_type=breach_type,
            breach_severity=breach_severity,
            breach_description=breach_description,
            affected_records_count=affected_records_count,
            affected_data_types=affected_data_types or [],
            breach_discovered_at=datetime.datetime.utcnow()
        )
        
        self.db.add(breach)
        self.db.commit()
        self.db.refresh(breach)
        
        # Send immediate notification if critical
        if breach_severity in ["HIGH", "CRITICAL"]:
            self._send_immediate_notification(breach)
        
        return breach
    
    def send_regulatory_notification(self, breach_id: str) -> bool:
        """Send notification to regulatory authorities"""
        breach = self.db.query(BreachNotification).filter(
            BreachNotification.id == breach_id
        ).first()
        
        if not breach:
            return False
        
        # Check if within 72-hour requirement
        time_since_discovery = datetime.datetime.utcnow() - breach.breach_discovered_at
        if time_since_discovery > datetime.timedelta(hours=72):
            # Log late notification
            self._log_late_notification(breach)
        
        # Send notification to authorities
        notification_sent = self._send_to_authorities(breach)
        
        if notification_sent:
            breach.notification_sent_at = datetime.datetime.utcnow()
            breach.status = "notified"
            self.db.commit()
        
        return notification_sent
    
    def _send_immediate_notification(self, breach: BreachNotification):
        """Send immediate notification for critical breaches"""
        # Send email to compliance team
        self._send_compliance_email(breach)
        
        # Send SMS to on-call team
        self._send_sms_alert(breach)
        
        # Create incident ticket
        self._create_incident_ticket(breach)
    
    def _send_to_authorities(self, breach: BreachNotification) -> bool:
        """Send notification to regulatory authorities"""
        try:
            # Prepare notification data
            notification_data = {
                "breach_id": str(breach.id),
                "tenant_id": str(breach.tenant_id),
                "breach_type": breach.breach_type,
                "breach_severity": breach.breach_severity,
                "breach_description": breach.breach_description,
                "affected_records_count": breach.affected_records_count,
                "affected_data_types": breach.affected_data_types,
                "breach_discovered_at": breach.breach_discovered_at.isoformat(),
                "notification_sent_at": datetime.datetime.utcnow().isoformat()
            }
            
            # Send to Ethiopian Data Protection Authority
            # Implementation depends on authority's API
            # For now, log the notification
            breach.regulatory_notifications.append({
                "authority": "Ethiopian DPA",
                "sent_at": datetime.datetime.utcnow().isoformat(),
                "status": "sent"
            })
            
            return True
            
        except Exception as e:
            # Log notification failure
            breach.regulatory_notifications.append({
                "authority": "Ethiopian DPA",
                "sent_at": datetime.datetime.utcnow().isoformat(),
                "status": "failed",
                "error": str(e)
            })
            return False
    
    def _send_compliance_email(self, breach: BreachNotification):
        """Send email to compliance team"""
        # Implementation for email sending
        pass
    
    def _send_sms_alert(self, breach: BreachNotification):
        """Send SMS alert to on-call team"""
        # Implementation for SMS sending
        pass
    
    def _create_incident_ticket(self, breach: BreachNotification):
        """Create incident ticket in ticketing system"""
        # Implementation for ticketing system integration
        pass
    
    def _log_late_notification(self, breach: BreachNotification):
        """Log late notification for audit"""
        # Create audit event for late notification
        audit_event = AuditEvent(
            tenant_id=breach.tenant_id,
            action="breach_notification_late",
            target_type="breach_notification",
            target_id=str(breach.id),
            metadata={
                "breach_type": breach.breach_type,
                "hours_since_discovery": (datetime.datetime.utcnow() - breach.breach_discovered_at).total_seconds() / 3600
            }
        )
        self.db.add(audit_event)
        self.db.commit()
```

## API Implementation

### Consent API Endpoints
```python
# app/api/endpoints/consent.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.consent_service import ConsentService
from app.schemas.consent import ConsentCreate, ConsentOut
from app.deps.tenant import set_tenant_context_for_request

router = APIRouter()

@router.post("/{verification_id}/consent", response_model=ConsentOut)
async def create_consent(
    verification_id: str,
    consent_data: ConsentCreate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Create consent for verification"""
    try:
        consent_service = ConsentService(db)
        consent = consent_service.create_consent(
            tenant_id=tenant_id,
            verification_id=verification_id,
            consent_type=consent_data.consent_type,
            consent_text=consent_data.consent_text,
            consent_text_amharic=consent_data.consent_text_amharic,
            ip_address=consent_data.ip_address,
            user_agent=consent_data.user_agent
        )
        
        return ConsentOut(
            id=str(consent.id),
            consent_type=consent.consent_type,
            is_granted=consent.is_granted,
            granted_at=consent.granted_at
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/consent/{consent_id}/withdraw")
async def withdraw_consent(
    consent_id: str,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Withdraw consent"""
    consent_service = ConsentService(db)
    success = consent_service.withdraw_consent(consent_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Consent not found")
    
    return {"message": "Consent withdrawn successfully"}
```

### Data Subject Rights API
```python
# app/api/endpoints/data_rights.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.data_subject_rights_service import DataSubjectRightsService
from app.schemas.data_rights import RightsRequestCreate, RightsRequestOut

router = APIRouter()

@router.post("/{verification_id}/rights", response_model=RightsRequestOut)
async def create_rights_request(
    verification_id: str,
    rights_data: RightsRequestCreate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Create data subject rights request"""
    try:
        rights_service = DataSubjectRightsService(db)
        rights_request = rights_service.create_rights_request(
            tenant_id=tenant_id,
            verification_id=verification_id,
            request_type=rights_data.request_type,
            request_reason=rights_data.request_reason,
            ip_address=rights_data.ip_address,
            user_agent=rights_data.user_agent
        )
        
        return RightsRequestOut(
            id=str(rights_request.id),
            request_type=rights_request.request_type,
            request_status=rights_request.request_status,
            submitted_at=rights_request.submitted_at
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/rights/{request_id}/data")
async def get_requested_data(
    request_id: str,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Get data for access request"""
    rights_service = DataSubjectRightsService(db)
    
    try:
        data = rights_service.process_access_request(request_id)
        return data
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## Compliance Monitoring

### Compliance Dashboard
```python
# app/api/endpoints/compliance.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.consent_service import ConsentService
from app.services.breach_notification_service import BreachNotificationService

router = APIRouter()

@router.get("/compliance/overview")
async def get_compliance_overview(
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Get compliance overview for tenant"""
    
    # Get consent statistics
    consent_service = ConsentService(db)
    consent_stats = consent_service.get_consent_statistics(tenant_id)
    
    # Get breach notifications
    breach_service = BreachNotificationService(db)
    breach_stats = breach_service.get_breach_statistics(tenant_id)
    
    # Get data subject rights requests
    rights_service = DataSubjectRightsService(db)
    rights_stats = rights_service.get_rights_statistics(tenant_id)
    
    return {
        "consent": consent_stats,
        "breaches": breach_stats,
        "data_rights": rights_stats,
        "compliance_score": calculate_compliance_score(consent_stats, breach_stats, rights_stats)
    }

def calculate_compliance_score(consent_stats, breach_stats, rights_stats):
    """Calculate overall compliance score"""
    score = 100
    
    # Deduct points for missing consents
    if consent_stats["missing_consents"] > 0:
        score -= consent_stats["missing_consents"] * 5
    
    # Deduct points for breaches
    if breach_stats["total_breaches"] > 0:
        score -= breach_stats["total_breaches"] * 10
    
    # Deduct points for unresolved rights requests
    if rights_stats["pending_requests"] > 0:
        score -= rights_stats["pending_requests"] * 2
    
    return max(0, score)
```

## Testing Strategy

### Unit Tests
```python
# tests/test_pdpp_compliance.py
import pytest
from app.services.consent_service import ConsentService
from app.services.data_subject_rights_service import DataSubjectRightsService

def test_consent_creation(db_session):
    """Test consent creation"""
    consent_service = ConsentService(db_session)
    
    consent = consent_service.create_consent(
        tenant_id="tenant-123",
        verification_id="verification-456",
        consent_type="KYC",
        consent_text="I consent to KYC processing"
    )
    
    assert consent.is_granted is True
    assert consent.consent_type == "KYC"

def test_data_access_request(db_session):
    """Test data access request"""
    rights_service = DataSubjectRightsService(db_session)
    
    request = rights_service.create_rights_request(
        tenant_id="tenant-123",
        verification_id="verification-456",
        request_type="ACCESS"
    )
    
    assert request.request_type == "ACCESS"
    assert request.request_status == "pending"
```

### Integration Tests
```python
# tests/test_compliance_api.py
def test_consent_api(client, tenant_user):
    """Test consent API endpoints"""
    # Create consent
    response = client.post(
        "/api/verifications/test-verification/consent",
        json={
            "consent_type": "KYC",
            "consent_text": "I consent to KYC processing",
            "consent_text_amharic": "የKYC ሂደት እስማማለሁ"
        },
        headers={"Authorization": f"Bearer {tenant_user.token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["consent_type"] == "KYC"
    assert data["is_granted"] is True
```

## Implementation Checklist

### Phase 1: Core Compliance
- [ ] Implement data localization framework
- [ ] Create consent management system
- [ ] Add data subject rights management
- [ ] Implement breach notification system

### Phase 2: Regional Deployment
- [ ] Set up regional database instances
- [ ] Configure regional storage
- [ ] Implement data transfer controls
- [ ] Test regional routing

### Phase 3: Compliance Features
- [ ] Add consent templates (Amharic/English)
- [ ] Implement regulatory notification
- [ ] Create compliance dashboard
- [ ] Add audit logging

### Phase 4: Production Readiness
- [ ] Legal review of consent texts
- [ ] Regulatory approval process
- [ ] Compliance testing
- [ ] Documentation and training

## Conclusion

PDPP compliance is **critical** for operating in Ethiopia. The implementation provides comprehensive data protection, consent management, and regulatory compliance features.

**Next Steps**:
1. Implement data localization framework
2. Create consent management system
3. Add data subject rights
4. Set up breach notification
5. Conduct legal review
