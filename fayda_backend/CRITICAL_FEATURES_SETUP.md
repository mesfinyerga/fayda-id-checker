# 🔐 Critical Features Setup Guide

This guide helps you set up the three critical features:
1. **PII Encryption** - Encrypt personally identifiable information
2. **Evidence Storage** - Store evidence files (MinIO/S3)
3. **Backup System** - Automated database backups

---

## 1. 🔐 PII Encryption Setup

### Step 1: Generate Encryption Key

```powershell
cd fayda_backend
python scripts/generate_encryption_key.py
```

This will output a secure 32-byte key. **Copy this key.**

### Step 2: Add Key to .env

Open `fayda_backend/.env` and add:

```env
PII_ENCRYPTION_KEY=your-generated-key-here
```

**⚠️ IMPORTANT:**
- Keep this key SECRET
- Never commit it to version control
- Use the same key in all environments (or data will be unreadable)
- Store a backup securely

### Step 3: Verify pgcrypto Extension

Make sure pgcrypto is enabled in your database:

```sql
-- Run in pgAdmin 4 or psql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### Step 4: Test Encryption

```powershell
python scripts/test_pii_storage_backup.py
```

You should see: `✅ PII Encryption - PASS`

---

## 2. 📦 Evidence Storage Setup

### Option A: MinIO (Local Development)

#### Step 1: Install MinIO

**Windows:**
```powershell
# Download from: https://min.io/download
# Or use Docker:
docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"
```

**Linux/Mac:**
```bash
# Using Docker (recommended)
docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"
```

#### Step 2: Configure .env

Add to `fayda_backend/.env`:

```env
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_SECURE=false
MINIO_BUCKET_NAME=fayda-evidence
```

#### Step 3: Install Dependencies

```powershell
pip install minio
```

#### Step 4: Access MinIO Console

- URL: `http://localhost:9001`
- Username: `minioadmin`
- Password: `minioadmin`

### Option B: AWS S3 (Production)

#### Step 1: Get AWS Credentials

Get your AWS Access Key ID and Secret Access Key from AWS Console.

#### Step 2: Configure .env

Add to `fayda_backend/.env`:

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=fayda-evidence
```

#### Step 3: Install Dependencies

```powershell
pip install boto3
```

#### Step 4: Create S3 Bucket

Create the bucket in AWS Console or it will be created automatically.

### Test Storage

```powershell
python scripts/test_pii_storage_backup.py
```

You should see: `✅ EVIDENCE STORAGE - PASS` or `⚠️ NOT CONFIGURED` (if not set up yet)

---

## 3. 💾 Backup System Setup

### Step 1: Verify PostgreSQL Client Tools

The backup script requires `pg_dump` and `psql`:

**Windows:**
- Should be installed with PostgreSQL
- Located in: `C:\Program Files\PostgreSQL\18\bin\`
- Add to PATH if needed

**Linux:**
```bash
sudo apt-get install postgresql-client  # Ubuntu/Debian
# or
sudo yum install postgresql  # CentOS/RHEL
```

**Mac:**
```bash
brew install postgresql
```

### Step 2: Verify Installation

```powershell
pg_dump --version
psql --version
```

Both should show version information.

### Step 3: Configure Backup Settings (Optional)

Add to `fayda_backend/.env`:

```env
BACKUP_RETENTION_DAYS=30
BACKUP_SCHEDULE=daily
```

### Step 4: Create Manual Backup

```powershell
python scripts/backup_db.py backup
```

This creates a backup in the `backups/` directory.

### Step 5: List Backups

```powershell
python scripts/backup_db.py list
```

### Step 6: Restore Backup

```powershell
python scripts/backup_db.py restore --file backups/faydaidcheck_full_20250101_120000.sql
```

### Test Backup System

```powershell
python scripts/test_pii_storage_backup.py
```

---

## 🚀 Quick Setup Script

Run this to set up everything at once:

```powershell
# 1. Generate encryption key
python scripts/generate_encryption_key.py

# 2. Add to .env (manual step - copy the key)

# 3. Install dependencies
pip install minio boto3

# 4. Test everything
python scripts/test_pii_storage_backup.py
```

---

## ✅ Verification Checklist

- [ ] PII encryption key generated and added to `.env`
- [ ] `pgcrypto` extension enabled in PostgreSQL
- [ ] MinIO running (or AWS S3 configured)
- [ ] Storage credentials in `.env`
- [ ] `pg_dump` and `psql` available
- [ ] All tests pass: `python scripts/test_pii_storage_backup.py`

---

## 📝 Usage Examples

### Using PII Encryption

```python
from app.crud.subject_pii import SubjectPIIManager
from app.db.session import get_db

db = next(get_db())
pii_manager = SubjectPIIManager(db)

# Create encrypted PII
pii_manager.create_pii(
    verification_id="uuid-here",
    pii_data={
        "full_name": "John Doe",
        "dob": "1990-01-01",
        "id_number": "1234567890",
        "address": "123 Main St",
        "phone": "+251911234567"
    }
)

# Get and decrypt PII
decrypted_pii = pii_manager.get_pii("verification-uuid")
```

### Using Evidence Storage

```python
from app.core.storage import get_storage

storage = get_storage()

# Upload file
object_key = storage.generate_object_key(tenant_id, verification_id, filename)
storage.upload_file(file_data, object_key, content_type)

# Download file
file_data = storage.download_file(object_key)

# Get presigned URL
url = storage.generate_presigned_url(object_key, expires_in=3600)
```

### Using Backup System

```powershell
# Create backup
python scripts/backup_db.py backup

# Create schema-only backup
python scripts/backup_db.py backup --schema-only

# List backups
python scripts/backup_db.py list

# Restore backup
python scripts/backup_db.py restore --file backups/faydaidcheck_full_20250101_120000.sql

# Cleanup old backups
python scripts/backup_db.py cleanup --retention-days 30
```

---

## 🎉 Next Steps

Once all three features are set up:

1. ✅ Test PII encryption with real data
2. ✅ Upload test evidence files
3. ✅ Create and verify database backups
4. ✅ Set up automated backups (cron/scheduled task)

All critical features are now implemented! 🚀

