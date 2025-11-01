"""
Generate a secure encryption key for PII encryption.

This script generates a cryptographically secure 32-byte key
suitable for AES-256 encryption using PostgreSQL pgcrypto.
"""

import secrets
import sys


def generate_key():
    """Generate a secure 32-byte encryption key"""
    # Generate 32 bytes (256 bits) for AES-256
    key = secrets.token_hex(32)  # 64 hex characters = 32 bytes
    
    print("=" * 60)
    print("🔐 PII Encryption Key Generator")
    print("=" * 60)
    print()
    print("Generated 32-byte encryption key:")
    print()
    print(f"PII_ENCRYPTION_KEY={key}")
    print()
    print("=" * 60)
    print("⚠️  IMPORTANT:")
    print("   1. Add this to your .env file")
    print("   2. Keep this key SECRET and never commit it to version control")
    print("   3. Use the same key for all environments or data will be unreadable")
    print("   4. Store a backup securely (if you lose this key, data cannot be decrypted)")
    print("=" * 60)
    
    return key


if __name__ == "__main__":
    generate_key()

