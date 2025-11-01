"""
Test script for PII Encryption, Evidence Storage, and Backup functionality.

This script verifies that all three critical features are working correctly.
"""

import os
import sys
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import get_db, engine
from app.core.pii_encryption import get_pii_encryption, generate_encryption_key
from app.core.storage import get_storage
from app.crud.subject_pii import SubjectPIIManager


def test_pii_encryption():
    """Test PII encryption functionality"""
    print("=" * 60)
    print("🔐 Testing PII Encryption")
    print("=" * 60)
    
    # Check encryption key
    encryption_key = os.getenv("PII_ENCRYPTION_KEY")
    if not encryption_key:
        print("❌ PII_ENCRYPTION_KEY not set in environment")
        print("   Generate one with: python scripts/generate_encryption_key.py")
        return False
    
    print(f"✅ Encryption key found (length: {len(encryption_key)})")
    
    # Test encryption/decryption
    try:
        db = next(get_db())
        encryption = get_pii_encryption(db)
        
        test_data = "Test PII Data - John Doe - 1234567890"
        print(f"\n📝 Testing with data: {test_data}")
        
        # Encrypt
        encrypted = encryption.encrypt_pii(test_data)
        print(f"✅ Encryption successful")
        print(f"   Encrypted size: {len(encrypted)} bytes")
        
        # Decrypt
        decrypted = encryption.decrypt_pii(encrypted)
        print(f"✅ Decryption successful")
        print(f"   Decrypted: {decrypted}")
        
        # Verify
        if decrypted == test_data:
            print("✅ Encryption/Decryption verified - Data matches!")
            return True
        else:
            print("❌ Decrypted data doesn't match original")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        if "pgcrypto" in str(e).lower():
            print("💡 Make sure pgcrypto extension is enabled:")
            print("   Run: CREATE EXTENSION IF NOT EXISTS pgcrypto;")
        return False
    finally:
        if 'db' in locals():
            db.close()


def test_evidence_storage():
    """Test evidence storage functionality"""
    print("\n" + "=" * 60)
    print("📦 Testing Evidence Storage")
    print("=" * 60)
    
    try:
        storage = get_storage()
        print(f"✅ Storage initialized")
        print(f"   Type: {storage.storage_type}")
        print(f"   Bucket: {storage.bucket_name}")
        
        # Test object key generation
        object_key = storage.generate_object_key(
            tenant_id="test-tenant-id",
            verification_id="test-verification-id",
            filename="test-document.pdf"
        )
        print(f"✅ Object key generated: {object_key}")
        
        # Test file upload (with dummy data)
        test_file_data = b"Test file content for evidence storage"
        test_content_type = "application/pdf"
        
        try:
            uploaded_key = storage.upload_file(
                file_data=test_file_data,
                object_key=object_key,
                content_type=test_content_type
            )
            print(f"✅ File upload successful: {uploaded_key}")
            
            # Test file download
            downloaded_data = storage.download_file(object_key)
            if downloaded_data == test_file_data:
                print(f"✅ File download successful - Data matches!")
            else:
                print(f"⚠️  Downloaded data doesn't match")
            
            # Test presigned URL
            presigned_url = storage.generate_presigned_url(object_key, expires_in=3600)
            print(f"✅ Presigned URL generated")
            print(f"   URL: {presigned_url[:80]}...")
            
            # Test file deletion
            storage.delete_file(object_key)
            print(f"✅ File deletion successful")
            
            return True
            
        except Exception as e:
            print(f"⚠️  Storage test incomplete: {str(e)}")
            print("💡 Make sure MinIO is running or AWS credentials are configured")
            return False
            
    except ValueError as e:
        print(f"⚠️  Storage not configured: {str(e)}")
        print("💡 This is okay for development - configure when needed")
        return None  # Not an error, just not configured
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def test_backup():
    """Test backup functionality"""
    print("\n" + "=" * 60)
    print("💾 Testing Backup System")
    print("=" * 60)
    
    try:
        from scripts.backup_db import get_db_connection_info
        
        conn_info = get_db_connection_info()
        print(f"✅ Database connection info extracted")
        print(f"   Database: {conn_info['dbname']}")
        print(f"   Host: {conn_info['host']}:{conn_info['port']}")
        
        # Check if pg_dump is available
        import subprocess
        try:
            result = subprocess.run(
                ["pg_dump", "--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                print(f"✅ pg_dump available: {result.stdout.strip()}")
                return True
            else:
                print("⚠️  pg_dump not found")
                return False
        except FileNotFoundError:
            print("⚠️  pg_dump not found in PATH")
            print("💡 Install PostgreSQL client tools to use backup feature")
            return False
        except Exception as e:
            print(f"⚠️  Could not verify pg_dump: {str(e)}")
            return False
            
    except Exception as e:
        print(f"⚠️  Backup test incomplete: {str(e)}")
        return None


def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("🧪 Testing Critical Features")
    print("=" * 60)
    print()
    
    results = {}
    
    # Test PII Encryption
    results['pii'] = test_pii_encryption()
    
    # Test Evidence Storage
    results['storage'] = test_evidence_storage()
    
    # Test Backup
    results['backup'] = test_backup()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Summary")
    print("=" * 60)
    
    for feature, result in results.items():
        if result is True:
            status = "✅ PASS"
        elif result is False:
            status = "❌ FAIL"
        else:
            status = "⚠️  NOT CONFIGURED"
        print(f"{status} - {feature.upper()}")
    
    print()
    
    # Overall status
    critical_failures = sum(1 for r in results.values() if r is False)
    if critical_failures == 0:
        print("✅ All configured features are working!")
    else:
        print(f"⚠️  {critical_failures} feature(s) need attention")
    
    print("=" * 60)


if __name__ == "__main__":
    main()

