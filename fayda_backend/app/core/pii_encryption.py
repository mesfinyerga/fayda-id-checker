"""
PII Encryption Module using PostgreSQL pgcrypto

This module provides encryption and decryption functionality for Personally
Identifiable Information (PII) using PostgreSQL's pgcrypto extension.

Requirements:
- PostgreSQL with pgcrypto extension enabled
- PII_ENCRYPTION_KEY environment variable (32-byte key for AES-256)
"""

import os
from typing import Optional, Dict, Any
from sqlalchemy import text
from sqlalchemy.orm import Session


class PIIEncryption:
    """PII encryption using PostgreSQL pgcrypto"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.encryption_key = self._get_encryption_key()
    
    def _get_encryption_key(self) -> str:
        """Get encryption key from environment"""
        key = os.getenv("PII_ENCRYPTION_KEY")
        if not key:
            raise ValueError(
                "PII_ENCRYPTION_KEY environment variable not set. "
                "Set this in your .env file with a 32-byte key for AES-256 encryption."
            )
        
        # For passphrase-based keys, validate minimum length
        # For direct keys, validate it's exactly 32 bytes
        if len(key.encode('utf-8')) < 16:
            raise ValueError(
                "PII_ENCRYPTION_KEY must be at least 16 characters. "
                "For best security, use a 32-byte key."
            )
        
        return key
    
    def encrypt_pii(self, plaintext: str) -> Optional[bytes]:
        """Encrypt PII using pgcrypto pgp_sym_encrypt"""
        if not plaintext:
            return None
        
        try:
            query = text("""
                SELECT pgp_sym_encrypt(:plaintext, :key, 'cipher-algo=aes256')
            """)
            
            result = self.db.execute(query, {
                "plaintext": str(plaintext),
                "key": self.encryption_key
            })
            
            encrypted_data = result.scalar()
            return encrypted_data
        except Exception as e:
            raise ValueError(f"Failed to encrypt PII: {str(e)}")
    
    def decrypt_pii(self, encrypted_data: bytes) -> Optional[str]:
        """Decrypt PII using pgcrypto pgp_sym_decrypt"""
        if not encrypted_data:
            return None
        
        try:
            query = text("""
                SELECT pgp_sym_decrypt(:encrypted_data, :key)
            """)
            
            result = self.db.execute(query, {
                "encrypted_data": encrypted_data,
                "key": self.encryption_key
            })
            
            decrypted_data = result.scalar()
            return decrypted_data
        except Exception as e:
            raise ValueError(f"Failed to decrypt PII: {str(e)}")
    
    def encrypt_pii_batch(self, pii_data: Dict[str, Any]) -> Dict[str, Optional[bytes]]:
        """Encrypt multiple PII fields in a batch"""
        encrypted_data = {}
        
        for field, value in pii_data.items():
            if value is not None:
                encrypted_data[field] = self.encrypt_pii(str(value))
            else:
                encrypted_data[field] = None
        
        return encrypted_data
    
    def decrypt_pii_batch(self, encrypted_data: Dict[str, Any]) -> Dict[str, Optional[str]]:
        """Decrypt multiple PII fields in a batch"""
        decrypted_data = {}
        
        for field, encrypted_value in encrypted_data.items():
            if encrypted_value is not None:
                decrypted_data[field] = self.decrypt_pii(encrypted_value)
            else:
                decrypted_data[field] = None
        
        return decrypted_data


def get_pii_encryption(db: Session) -> PIIEncryption:
    """
    Get PII encryption instance for a database session.
    
    Usage:
        encryption = get_pii_encryption(db)
        encrypted = encryption.encrypt_pii("John Doe")
        decrypted = encryption.decrypt_pii(encrypted)
    """
    return PIIEncryption(db)


def generate_encryption_key() -> str:
    """
    Generate a secure 32-byte encryption key.
    For production, store this securely and never commit to version control.
    
    Returns:
        A 32-byte hex string suitable for AES-256 encryption
    """
    import secrets
    return secrets.token_hex(32)

