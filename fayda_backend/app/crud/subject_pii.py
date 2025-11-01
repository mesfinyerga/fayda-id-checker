"""
CRUD operations for Subject PII with encryption support.
"""

from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from app.models.subject_pii import SubjectPII
from app.core.pii_encryption import get_pii_encryption


class SubjectPIIManager:
    """PII management with encryption/decryption"""
    
    def __init__(self, db: Session):
        self.db = db
        self.encryption = get_pii_encryption(db)
    
    def create_pii(
        self, 
        verification_id: str, 
        pii_data: Dict[str, Any]
    ) -> SubjectPII:
        """
        Create encrypted PII record.
        
        Args:
            verification_id: UUID of the verification
            pii_data: Dictionary with plaintext PII fields:
                - full_name: str
                - dob: str (date of birth)
                - id_number: str
                - address: Optional[str]
                - phone: Optional[str]
        
        Returns:
            Created SubjectPII record
        """
        # Encrypt all PII fields
        encrypted_data = self.encryption.encrypt_pii_batch({
            "full_name": pii_data.get("full_name"),
            "dob": pii_data.get("dob"),
            "id_number": pii_data.get("id_number"),
            "address": pii_data.get("address"),
            "phone": pii_data.get("phone")
        })
        
        # Create PII record with encrypted data
        pii_record = SubjectPII(
            verification_id=verification_id,
            full_name=encrypted_data["full_name"],
            dob=encrypted_data["dob"],
            id_number=encrypted_data["id_number"],
            address=encrypted_data.get("address"),
            phone=encrypted_data.get("phone")
        )
        
        self.db.add(pii_record)
        self.db.commit()
        self.db.refresh(pii_record)
        
        return pii_record
    
    def get_pii(self, verification_id: str) -> Optional[Dict[str, Any]]:
        """
        Get and decrypt PII record.
        
        Args:
            verification_id: UUID of the verification
        
        Returns:
            Dictionary with decrypted PII fields, or None if not found
        """
        pii_record = self.db.query(SubjectPII).filter(
            SubjectPII.verification_id == verification_id
        ).first()
        
        if not pii_record:
            return None
        
        # Decrypt all PII fields
        decrypted_data = self.encryption.decrypt_pii_batch({
            "full_name": pii_record.full_name,
            "dob": pii_record.dob,
            "id_number": pii_record.id_number,
            "address": pii_record.address,
            "phone": pii_record.phone
        })
        
        return {
            "verification_id": str(pii_record.verification_id),
            **decrypted_data
        }
    
    def update_pii(
        self, 
        verification_id: str, 
        pii_data: Dict[str, Any]
    ) -> Optional[SubjectPII]:
        """
        Update encrypted PII record.
        
        Args:
            verification_id: UUID of the verification
            pii_data: Dictionary with PII fields to update
        
        Returns:
            Updated SubjectPII record, or None if not found
        """
        pii_record = self.db.query(SubjectPII).filter(
            SubjectPII.verification_id == verification_id
        ).first()
        
        if not pii_record:
            return None
        
        # Encrypt updated fields
        fields_to_update = {}
        for field in ["full_name", "dob", "id_number", "address", "phone"]:
            if field in pii_data and pii_data[field] is not None:
                fields_to_update[field] = pii_data[field]
        
        if fields_to_update:
            encrypted_data = self.encryption.encrypt_pii_batch(fields_to_update)
            
            # Update fields
            for field, encrypted_value in encrypted_data.items():
                setattr(pii_record, field, encrypted_value)
            
            self.db.commit()
            self.db.refresh(pii_record)
        
        return pii_record
    
    def delete_pii(self, verification_id: str) -> bool:
        """
        Delete PII record (cascade delete handled by foreign key).
        
        Args:
            verification_id: UUID of the verification
        
        Returns:
            True if deleted, False if not found
        """
        pii_record = self.db.query(SubjectPII).filter(
            SubjectPII.verification_id == verification_id
        ).first()
        
        if not pii_record:
            return False
        
        self.db.delete(pii_record)
        self.db.commit()
        return True

