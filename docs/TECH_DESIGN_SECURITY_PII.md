# PII Security & Encryption Technical Design

**Version**: 1.0  
**Last Updated**: August 30, 2025  
**Status**: ❌ Missing - Critical Implementation Required  

## Overview

This document outlines the implementation of PII (Personally Identifiable Information) encryption for the Fayda ID Checker. PII encryption is **critical** for compliance with data protection regulations and security best practices.

## Current State Analysis

### Critical Security Issue
- **Current State**: PII stored in plaintext BYTEA fields
- **Risk Level**: CRITICAL - Immediate security vulnerability
- **Impact**: Non-compliance with data protection regulations

### Existing Schema
```sql
-- Current subject_pii table (INSECURE)
CREATE TABLE subject_pii (
    verification_id UUID PRIMARY KEY REFERENCES verification(id),
    full_name BYTEA NOT NULL,        -- Plaintext PII
    dob BYTEA NOT NULL,              -- Plaintext PII
    id_number BYTEA NOT NULL,        -- Plaintext PII
    address BYTEA,                   -- Plaintext PII
    phone BYTEA                      -- Plaintext PII
);
```

## Solution Options

### Option A: PostgreSQL pgcrypto (Recommended for MVP)

#### Implementation Overview
Use PostgreSQL's built-in `pgcrypto` extension for symmetric encryption with environment-based keys.

#### Environment Configuration
```bash
# .env
# PII Encryption Key (32-byte key for AES-256)
PII_ENCRYPTION_KEY=your-32-byte-encryption-key-here-12345678901234567890123456789012

# Alternative: Generate from passphrase
PII_ENCRYPTION_PASSPHRASE=your-secure-passphrase-here

# Key rotation settings
PII_KEY_ROTATION_DAYS=90
PII_KEY_VERSION=1
```

#### Core Encryption Module
```python
# app/core/pii_encryption.py
import os
import base64
from typing import Optional
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.config import settings

class PIIEncryption:
    """PII encryption using PostgreSQL pgcrypto"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.encryption_key = self._get_encryption_key()
    
    def _get_encryption_key(self) -> str:
        """Get encryption key from environment"""
        key = os.getenv("PII_ENCRYPTION_KEY")
        if not key:
            raise ValueError("PII_ENCRYPTION_KEY environment variable not set")
        
        # Validate key length (32 bytes for AES-256)
        if len(key) != 32:
            raise ValueError("PII_ENCRYPTION_KEY must be exactly 32 bytes")
        
        return key
    
    def encrypt_pii(self, plaintext: str) -> bytes:
        """Encrypt PII using pgcrypto pgp_sym_encrypt"""
        if not plaintext:
            return None
        
        query = text("""
            SELECT pgp_sym_encrypt(:plaintext, :key, 'cipher-algo=aes256')
        """)
        
        result = self.db.execute(query, {
            "plaintext": plaintext,
            "key": self.encryption_key
        })
        
        encrypted_data = result.scalar()
        return encrypted_data
    
    def decrypt_pii(self, encrypted_data: bytes) -> str:
        """Decrypt PII using pgcrypto pgp_sym_decrypt"""
        if not encrypted_data:
            return None
        
        query = text("""
            SELECT pgp_sym_decrypt(:encrypted_data, :key)
        """)
        
        result = self.db.execute(query, {
            "encrypted_data": encrypted_data,
            "key": self.encryption_key
        })
        
        decrypted_data = result.scalar()
        return decrypted_data
    
    def encrypt_pii_batch(self, pii_data: dict) -> dict:
        """Encrypt multiple PII fields"""
        encrypted_data = {}
        
        for field, value in pii_data.items():
            if value:
                encrypted_data[field] = self.encrypt_pii(str(value))
        
        return encrypted_data
    
    def decrypt_pii_batch(self, encrypted_data: dict) -> dict:
        """Decrypt multiple PII fields"""
        decrypted_data = {}
        
        for field, encrypted_value in encrypted_data.items():
            if encrypted_value:
                decrypted_data[field] = self.decrypt_pii(encrypted_value)
        
        return decrypted_data

# Global encryption instance
def get_pii_encryption(db: Session) -> PIIEncryption:
    """Get PII encryption instance"""
    return PIIEncryption(db)
```

#### CRUD Integration
```python
# app/crud/subject_pii.py
from sqlalchemy.orm import Session
from app.models.subject_pii import SubjectPII
from app.core.pii_encryption import get_pii_encryption
from app.schemas.subject_pii import SubjectPIICreate, SubjectPIIOut

class SubjectPIIManager:
    """PII management with encryption"""
    
    def __init__(self, db: Session):
        self.db = db
        self.encryption = get_pii_encryption(db)
    
    def create_pii(self, verification_id: str, pii_data: SubjectPIICreate) -> SubjectPII:
        """Create encrypted PII record"""
        # Encrypt PII data
        encrypted_data = self.encryption.encrypt_pii_batch({
            "full_name": pii_data.full_name,
            "dob": pii_data.dob,
            "id_number": pii_data.id_number,
            "address": pii_data.address,
            "phone": pii_data.phone
        })
        
        # Create PII record
        pii_record = SubjectPII(
            verification_id=verification_id,
            **encrypted_data
        )
        
        self.db.add(pii_record)
        self.db.commit()
        self.db.refresh(pii_record)
        
        return pii_record
    
    def get_pii(self, verification_id: str) -> SubjectPIIOut:
        """Get and decrypt PII record"""
        pii_record = self.db.query(SubjectPII).filter(
            SubjectPII.verification_id == verification_id
        ).first()
        
        if not pii_record:
            return None
        
        # Decrypt PII data
        decrypted_data = self.encryption.decrypt_pii_batch({
            "full_name": pii_record.full_name,
            "dob": pii_record.dob,
            "id_number": pii_record.id_number,
            "address": pii_record.address,
            "phone": pii_record.phone
        })
        
        return SubjectPIIOut(
            verification_id=pii_record.verification_id,
            **decrypted_data
        )
    
    def update_pii(self, verification_id: str, pii_data: SubjectPIICreate) -> SubjectPII:
        """Update encrypted PII record"""
        # Encrypt new PII data
        encrypted_data = self.encryption.encrypt_pii_batch({
            "full_name": pii_data.full_name,
            "dob": pii_data.dob,
            "id_number": pii_data.id_number,
            "address": pii_data.address,
            "phone": pii_data.phone
        })
        
        # Update PII record
        pii_record = self.db.query(SubjectPII).filter(
            SubjectPII.verification_id == verification_id
        ).first()
        
        if not pii_record:
            raise ValueError("PII record not found")
        
        for field, encrypted_value in encrypted_data.items():
            setattr(pii_record, field, encrypted_value)
        
        self.db.commit()
        self.db.refresh(pii_record)
        
        return pii_record
```

#### API Integration
```python
# app/api/endpoints/subject_pii.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud.subject_pii import SubjectPIIManager
from app.schemas.subject_pii import SubjectPIICreate, SubjectPIIOut
from app.deps.tenant import set_tenant_context_for_request

router = APIRouter()

@router.post("/{verification_id}/pii", response_model=SubjectPIIOut)
def create_subject_pii(
    verification_id: str,
    pii_data: SubjectPIICreate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Create encrypted PII record"""
    try:
        pii_manager = SubjectPIIManager(db)
        pii_record = pii_manager.create_pii(verification_id, pii_data)
        
        # Return decrypted data for response
        return pii_manager.get_pii(verification_id)
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{verification_id}/pii", response_model=SubjectPIIOut)
def get_subject_pii(
    verification_id: str,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(set_tenant_context_for_request)
):
    """Get decrypted PII record"""
    pii_manager = SubjectPIIManager(db)
    pii_data = pii_manager.get_pii(verification_id)
    
    if not pii_data:
        raise HTTPException(status_code=404, detail="PII record not found")
    
    return pii_data
```

### Option B: HashiCorp Vault Integration (Enterprise)

#### Implementation Overview
Use HashiCorp Vault's transit engine for advanced key management and rotation.

#### Environment Configuration
```bash
# .env
# Vault Configuration
VAULT_URL=https://vault.example.com:8200
VAULT_TOKEN=your-vault-token
VAULT_TRANSIT_PATH=transit
VAULT_KEY_NAME=fayda-pii-key

# Vault AppRole (alternative to token)
VAULT_ROLE_ID=your-role-id
VAULT_SECRET_ID=your-secret-id
```

#### Vault Integration Module
```python
# app/core/vault_client.py
import hvac
import base64
from typing import Optional
from app.core.config import settings

class VaultClient:
    """HashiCorp Vault client for PII encryption"""
    
    def __init__(self):
        self.client = hvac.Client(
            url=settings.vault_url,
            token=settings.vault_token
        )
        
        # Verify connection
        if not self.client.is_authenticated():
            raise Exception("Failed to authenticate with Vault")
    
    def encrypt_pii(self, plaintext: str) -> str:
        """Encrypt PII using Vault transit engine"""
        if not plaintext:
            return None
        
        try:
            response = self.client.secrets.transit.encrypt_data(
                name=settings.vault_key_name,
                plaintext=base64.b64encode(plaintext.encode()).decode()
            )
            
            return response['data']['ciphertext']
        
        except Exception as e:
            raise Exception(f"Vault encryption failed: {str(e)}")
    
    def decrypt_pii(self, ciphertext: str) -> str:
        """Decrypt PII using Vault transit engine"""
        if not ciphertext:
            return None
        
        try:
            response = self.client.secrets.transit.decrypt_data(
                name=settings.vault_key_name,
                ciphertext=ciphertext
            )
            
            return base64.b64decode(response['data']['plaintext']).decode()
        
        except Exception as e:
            raise Exception(f"Vault decryption failed: {str(e)}")
    
    def rotate_key(self) -> bool:
        """Rotate encryption key"""
        try:
            self.client.secrets.transit.rotate_key(
                name=settings.vault_key_name
            )
            return True
        except Exception as e:
            raise Exception(f"Key rotation failed: {str(e)}")
```

## Migration Strategy

### Data Migration Script
```python
# scripts/migrate_pii_encryption.py
import os
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.subject_pii import SubjectPII
from app.core.pii_encryption import get_pii_encryption

def migrate_pii_encryption():
    """Migrate existing plaintext PII to encrypted"""
    print("Starting PII encryption migration...")
    
    db = SessionLocal()
    encryption = get_pii_encryption(db)
    
    try:
        # Get all existing PII records
        pii_records = db.query(SubjectPII).all()
        
        print(f"Found {len(pii_records)} PII records to migrate")
        
        for record in pii_records:
            # Decrypt existing data (if it was encrypted)
            try:
                # Try to decrypt existing data
                decrypted_data = encryption.decrypt_pii_batch({
                    "full_name": record.full_name,
                    "dob": record.dob,
                    "id_number": record.id_number,
                    "address": record.address,
                    "phone": record.phone
                })
            except:
                # Data is plaintext, treat as string
                decrypted_data = {
                    "full_name": record.full_name.decode() if record.full_name else None,
                    "dob": record.dob.decode() if record.dob else None,
                    "id_number": record.id_number.decode() if record.id_number else None,
                    "address": record.address.decode() if record.address else None,
                    "phone": record.phone.decode() if record.phone else None
                }
            
            # Re-encrypt with new key
            encrypted_data = encryption.encrypt_pii_batch(decrypted_data)
            
            # Update record
            for field, encrypted_value in encrypted_data.items():
                setattr(record, field, encrypted_value)
        
        db.commit()
        print("PII encryption migration completed successfully!")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    migrate_pii_encryption()
```

### Migration Alembic Script
```python
# alembic/versions/xxx_add_pii_encryption.py
"""add_pii_encryption

Revision ID: xxx
Revises: 51280404d243
Create Date: 2025-08-30 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

def upgrade() -> None:
    """Enable pgcrypto extension and add encryption functions"""
    
    # Enable pgcrypto extension (if not already enabled)
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")
    
    # Create encryption helper functions
    op.execute("""
        CREATE OR REPLACE FUNCTION encrypt_pii_field(
            plaintext TEXT,
            encryption_key TEXT
        ) RETURNS BYTEA AS $$
        BEGIN
            RETURN pgp_sym_encrypt(plaintext, encryption_key, 'cipher-algo=aes256');
        END;
        $$ LANGUAGE plpgsql;
    """)
    
    op.execute("""
        CREATE OR REPLACE FUNCTION decrypt_pii_field(
            encrypted_data BYTEA,
            encryption_key TEXT
        ) RETURNS TEXT AS $$
        BEGIN
            RETURN pgp_sym_decrypt(encrypted_data, encryption_key);
        END;
        $$ LANGUAGE plpgsql;
    """)

def downgrade() -> None:
    """Remove encryption functions"""
    op.execute("DROP FUNCTION IF EXISTS encrypt_pii_field(TEXT, TEXT)")
    op.execute("DROP FUNCTION IF EXISTS decrypt_pii_field(BYTEA, TEXT)")
```

## Testing Strategy

### Unit Tests
```python
# tests/test_pii_encryption.py
import pytest
from app.core.pii_encryption import PIIEncryption
from app.db.session import get_db

@pytest.fixture
def pii_encryption(db_session):
    return PIIEncryption(db_session)

def test_encrypt_decrypt_pii(pii_encryption):
    """Test PII encryption and decryption"""
    test_data = "John Doe"
    
    # Encrypt
    encrypted = pii_encryption.encrypt_pii(test_data)
    assert encrypted is not None
    assert encrypted != test_data
    
    # Decrypt
    decrypted = pii_encryption.decrypt_pii(encrypted)
    assert decrypted == test_data

def test_encrypt_decrypt_batch(pii_encryption):
    """Test batch PII encryption and decryption"""
    test_data = {
        "full_name": "John Doe",
        "dob": "1990-01-01",
        "id_number": "123456789",
        "address": "123 Main St",
        "phone": "+1234567890"
    }
    
    # Encrypt batch
    encrypted_data = pii_encryption.encrypt_pii_batch(test_data)
    assert len(encrypted_data) == len(test_data)
    
    # Decrypt batch
    decrypted_data = pii_encryption.decrypt_pii_batch(encrypted_data)
    assert decrypted_data == test_data

def test_empty_data_handling(pii_encryption):
    """Test handling of empty/null data"""
    # Empty string
    encrypted = pii_encryption.encrypt_pii("")
    assert encrypted is None
    
    decrypted = pii_encryption.decrypt_pii(None)
    assert decrypted is None
```

### Integration Tests
```python
# tests/test_pii_crud.py
import pytest
from app.crud.subject_pii import SubjectPIIManager
from app.schemas.subject_pii import SubjectPIICreate

def test_create_encrypted_pii(db_session):
    """Test creating encrypted PII record"""
    pii_manager = SubjectPIIManager(db_session)
    
    pii_data = SubjectPIICreate(
        full_name="John Doe",
        dob="1990-01-01",
        id_number="123456789",
        address="123 Main St",
        phone="+1234567890"
    )
    
    # Create encrypted record
    pii_record = pii_manager.create_pii("test-verification-id", pii_data)
    assert pii_record is not None
    
    # Verify data is encrypted
    assert pii_record.full_name != "John Doe"
    assert isinstance(pii_record.full_name, bytes)

def test_retrieve_decrypted_pii(db_session):
    """Test retrieving and decrypting PII"""
    pii_manager = SubjectPIIManager(db_session)
    
    # Create encrypted record
    pii_data = SubjectPIICreate(
        full_name="Jane Smith",
        dob="1985-05-15",
        id_number="987654321"
    )
    
    pii_manager.create_pii("test-verification-id", pii_data)
    
    # Retrieve and decrypt
    retrieved_data = pii_manager.get_pii("test-verification-id")
    assert retrieved_data.full_name == "Jane Smith"
    assert retrieved_data.dob == "1985-05-15"
```

## Security Best Practices

### Key Management
```python
# app/core/key_management.py
import os
import secrets
import base64
from cryptography.fernet import Fernet

class KeyManager:
    """Secure key management utilities"""
    
    @staticmethod
    def generate_encryption_key() -> str:
        """Generate a secure 32-byte encryption key"""
        return base64.b64encode(secrets.token_bytes(32)).decode()
    
    @staticmethod
    def validate_key_strength(key: str) -> bool:
        """Validate encryption key strength"""
        if not key or len(key) != 32:
            return False
        
        # Check for sufficient entropy
        unique_chars = len(set(key))
        return unique_chars >= 20
    
    @staticmethod
    def rotate_key_safely(old_key: str, new_key: str, db: Session):
        """Safely rotate encryption keys"""
        # Implementation for key rotation
        pass
```

### Audit Logging
```python
# app/core/audit.py
def log_pii_access(
    db: Session,
    tenant_id: UUID,
    actor_id: UUID,
    verification_id: str,
    action: str,
    fields_accessed: list
):
    """Log PII access for audit trail"""
    audit_event = AuditEvent(
        tenant_id=tenant_id,
        actor_id=actor_id,
        action=f"pii_{action}",
        target_type="subject_pii",
        target_id=verification_id,
        metadata={
            "fields_accessed": fields_accessed,
            "encryption_version": "1"
        }
    )
    db.add(audit_event)
    db.commit()
```

## Compliance Considerations

### Data Protection Regulations
- **PDPP (Ethiopia)**: Encryption at rest and in transit
- **GDPR (EU)**: Appropriate technical measures
- **ISO 27001**: Cryptographic controls

### Audit Requirements
- All PII access logged with actor and timestamp
- Encryption key rotation tracked
- Data breach notification procedures

### Data Subject Rights
- Right to erasure (secure deletion)
- Right to data portability (encrypted export)
- Right to rectification (secure updates)

## Implementation Checklist

### Phase 1: Core Implementation
- [ ] Set up environment variables for encryption keys
- [ ] Implement PIIEncryption class with pgcrypto
- [ ] Create CRUD operations with encryption
- [ ] Add API endpoints for PII management
- [ ] Write comprehensive tests

### Phase 2: Migration
- [ ] Create data migration script
- [ ] Test migration on staging data
- [ ] Execute production migration
- [ ] Verify data integrity post-migration

### Phase 3: Security Hardening
- [ ] Implement key rotation procedures
- [ ] Add audit logging for PII access
- [ ] Set up monitoring and alerting
- [ ] Conduct security testing

### Phase 4: Compliance
- [ ] Implement data subject rights
- [ ] Add data breach notification
- [ ] Create compliance reporting
- [ ] Conduct compliance audit

## Conclusion

PII encryption is a **critical security requirement** that must be implemented immediately. The pgcrypto-based solution provides a robust, compliant foundation that can be enhanced with Vault integration for enterprise deployments.

**Next Steps**:
1. Implement Option A (pgcrypto) immediately
2. Set up secure key management
3. Migrate existing data
4. Add comprehensive testing
5. Plan for Vault integration (optional)
