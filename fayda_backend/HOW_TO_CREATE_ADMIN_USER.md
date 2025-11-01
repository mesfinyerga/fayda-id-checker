# 🔐 How to Create an Admin User

**Complete guide for creating admin users in Fayda ID Checker**

This guide covers all methods to create admin users, from quick development setup to production-ready configurations.

---

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Method 1: Seed Script (Development)](#-method-1-seed-script-development)
3. [Method 2: Create Admin Script (Recommended)](#-method-2-create-admin-script-recommended)
4. [Method 3: Using API Endpoint](#-method-3-using-api-endpoint)
5. [Method 4: Manual Database Creation](#-method-4-manual-database-creation-advanced)
6. [Verification](#-verification)
7. [Security Best Practices](#-security-best-practices)
8. [Troubleshooting](#-troubleshooting)
9. [Quick Reference](#-quick-reference)

---

## 🚀 Quick Start

**For Development (Fastest):**
```powershell
cd fayda_backend
python scripts/seed_dev.py
```
Default admin: `admin@fayda.com` / `admin123`

**For Production (Recommended):**
```powershell
cd fayda_backend
python scripts/create_admin_user.py
```
Follow the interactive prompts to create a custom admin user.

---

## 🎯 Method 1: Seed Script (Development)

The seed script creates a complete development environment with default admin and test users.

### When to Use
- ✅ Development or testing environment
- ✅ Quick setup for new database
- ✅ Demo or training purposes
- ❌ **Never use in production**

### Steps

1. **Navigate to backend directory:**
   ```powershell
   cd fayda_backend
   ```

2. **Run the seed script:**
   ```powershell
   python scripts/seed_dev.py
   ```

3. **What gets created:**
   - Default tenant (`default`)
   - **Admin user**: `admin@fayda.com` / `admin123`
   - Regular user: `user@fayda.com` / `user123`
   - Sample payment records

### Default Credentials

| User Type | Email | Password | Role |
|-----------|-------|----------|------|
| Admin | `admin@fayda.com` | `admin123` | `admin` |
| User | `user@fayda.com` | `user123` | `user` |

### Example Output

```
Seeding development database...
Created default tenant: b558422b-ea3d-4d23-9b95-3bdad55bbfad
Created admin user: admin@fayda.com
Created regular user: user@fayda.com
Created payment: PAY-ADMIN-001
Created payment: PAY-ADMIN-002
Created payment: PAY-USER-001
Database seeding completed successfully!
```

---

## 🎯 Method 2: Create Admin Script (Recommended)

The `create_admin_user.py` script is the **recommended method** for creating admin users. It provides flexibility and works in both development and production environments.

### When to Use
- ✅ Production environment
- ✅ Custom credentials needed
- ✅ Creating multiple admin users
- ✅ Specific user details required

### Prerequisites

- Database is set up and migrations are run
- `.env` file is configured with `DATABASE_URL`
- Python environment is activated

### Option A: Interactive Mode (Easiest)

The script guides you through creating an admin user step-by-step.

**Run without any arguments:**
```powershell
cd fayda_backend
python scripts/create_admin_user.py
```

**Or explicitly:**
```powershell
python scripts/create_admin_user.py --interactive
```

**What you'll be prompted for:**
1. **Email address** (required)
   - Must be unique
   - Valid email format

2. **Password** (required)
   - Enter password (hidden)
   - Confirm password (hidden)
   - Must match

3. **Full name** (optional)
   - Default: "Admin User"
   - Press Enter to use default

4. **Phone number** (optional)
   - Format: `+251911234567`
   - Press Enter to skip

5. **Company name** (optional)
   - Press Enter to skip

**Example Session:**
```
============================================================
🔐 Create Admin User (Interactive Mode)
============================================================

Enter admin email: admin@mycompany.com
Enter admin password: ********
Confirm password: ********
Enter full name (optional, default: 'Admin User'): John Doe
Enter phone number (optional): +251911234567
Enter company name (optional): My Company

============================================================
🔐 Creating Admin User
============================================================

✅ Admin user created successfully!

📋 User Details:
   Email: admin@mycompany.com
   Name: John Doe
   Role: admin
   Status: active
   Tenant: default (b558422b-ea3d-4d23-9b95-3bdad55bbfad)

============================================================
```

### Option B: Command Line Mode

Create admin users directly from the command line for automation or scripting.

**Basic command:**
```powershell
python scripts/create_admin_user.py \
  --email admin@example.com \
  --password SecurePassword123
```

**Full command with all options:**
```powershell
python scripts/create_admin_user.py \
  --email admin@example.com \
  --password "MySecureP@ssw0rd123!" \
  --name "System Administrator" \
  --phone "+251911234567" \
  --company "Fayda Inc"
```

**Short flags:**
```powershell
python scripts/create_admin_user.py \
  -e admin@example.com \
  -p "SecurePass123" \
  -n "Admin Name"
```

### Handling Existing Users

If a user with the same email already exists, the script will:

1. **Show current user information:**
   ```
   ❌ User with email 'admin@example.com' already exists!
      Current role: user
   ```

2. **Ask if you want to promote them:**
   ```
   💡 Do you want to change this user to admin? (yes/no): yes
   ✅ User 'admin@example.com' has been updated to admin role!
   ```

This feature allows you to promote existing users to admin without creating duplicates.

### Script Features

- ✅ **Automatic tenant creation** - Creates default tenant if missing
- ✅ **Password hashing** - Automatically hashes passwords securely
- ✅ **Duplicate detection** - Checks if user already exists
- ✅ **Role promotion** - Can upgrade existing users to admin
- ✅ **Error handling** - Clear error messages and rollback on failure
- ✅ **Detailed output** - Shows created user details

---

## 🔄 Method 3: Using API Endpoint

If you already have an admin user, you can promote other users to admin via the API.

### When to Use
- ✅ You already have admin access
- ✅ Need to promote existing users
- ✅ Programmatic user management
- ✅ Bulk role changes

### Prerequisites

- Existing admin user with valid JWT token
- Backend API running
- User to promote exists in database

### Steps

#### Step 1: Login as Admin

```bash
POST http://localhost:8000/api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

username=admin@fayda.com&password=admin123
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### Step 2: Get User ID

```bash
GET http://localhost:8000/api/v1/admin/users
Authorization: Bearer <your-admin-token>
```

Find the user ID you want to promote.

#### Step 3: Change User Role

```bash
PUT http://localhost:8000/api/v1/admin/users/{user_id}/role
Authorization: Bearer <your-admin-token>
Content-Type: application/json

{
  "new_role": "admin"
}
```

**Response:**
```json
{
  "id": 2,
  "email": "user@example.com",
  "role": "admin",
  "status": "active",
  ...
}
```

### Using cURL

```bash
# Login
TOKEN=$(curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@fayda.com&password=admin123" \
  | jq -r '.access_token')

# Promote user
curl -X PUT "http://localhost:8000/api/v1/admin/users/2/role" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"new_role": "admin"}'
```

### Using Python Requests

```python
import requests

# Login
response = requests.post(
    "http://localhost:8000/api/v1/auth/login",
    data={"username": "admin@fayda.com", "password": "admin123"}
)
token = response.json()["access_token"]

# Promote user
headers = {"Authorization": f"Bearer {token}"}
response = requests.put(
    f"http://localhost:8000/api/v1/admin/users/2/role",
    headers=headers,
    json={"new_role": "admin"}
)
print(response.json())
```

---

## 🛠️ Method 4: Manual Database Creation (Advanced)

Direct database insertion for emergency situations or advanced users.

### When to Use
- ⚠️ Emergency access recovery
- ⚠️ Direct database access available
- ⚠️ Advanced troubleshooting
- ⚠️ Scripts not working

### Prerequisites

- Direct PostgreSQL access (psql or pgAdmin)
- Python installed (for password hashing)
- Database connection credentials

### Steps

#### Step 1: Get Tenant ID

```sql
-- Connect to database
psql -U postgres -d faydaidcheck

-- Get default tenant ID
SELECT id, name FROM tenant WHERE name = 'default';
```

Example output:
```
                  id                  |  name
--------------------------------------+---------
 b558422b-ea3d-4d23-9b95-3bdad55bbfad | default
```

#### Step 2: Generate Password Hash

```powershell
# In Python
python -c "from app.core.security import get_password_hash; print(get_password_hash('YourPassword123'))"
```

Or in Python script:
```python
from app.core.security import get_password_hash
hash = get_password_hash("YourPassword123")
print(hash)
```

Example output:
```
$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYx6VHj4LCS
```

#### Step 3: Insert Admin User

```sql
INSERT INTO users (
    tenant_id,
    full_name,
    email,
    hashed_password,
    status,
    role,
    plan_type,
    created_at
) VALUES (
    'b558422b-ea3d-4d23-9b95-3bdad55bbfad',  -- Tenant ID from Step 1
    'Admin User',
    'admin@example.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYx6VHj4LCS',  -- Hash from Step 2
    'active',
    'admin',
    'premium',
    NOW()
);
```

#### Step 4: Verify Creation

```sql
SELECT id, email, role, status, created_at 
FROM users 
WHERE email = 'admin@example.com';
```

### Important Notes

- ⚠️ **Tenant ID is required** - User must belong to a tenant
- ⚠️ **Password must be hashed** - Never insert plain text passwords
- ⚠️ **UUID format** - Tenant ID must be valid UUID
- ⚠️ **Timestamps** - Use `NOW()` for `created_at`
- ⚠️ **Role must be lowercase** - `"admin"` not `"Admin"`

---

## ✅ Verification

After creating an admin user, verify it works correctly.

### Method 1: Database Query

```sql
-- Check if admin user exists
SELECT id, email, role, status, created_at 
FROM users 
WHERE role = 'admin';

-- Check specific user
SELECT * FROM users WHERE email = 'admin@example.com';
```

### Method 2: API Login Test

```bash
# Test login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=YourPassword"

# Should return JWT token
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer"
}
```

### Method 3: Admin Endpoint Access

```bash
# Test admin access
curl -X GET "http://localhost:8000/api/v1/admin/users" \
  -H "Authorization: Bearer <your-token>"

# Should return list of users (admin only)
[
  {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin",
    ...
  }
]
```

### Method 4: Python Script

```powershell
python -c "
from app.db.session import SessionLocal
from app.models.user import User

db = SessionLocal()
admins = db.query(User).filter(User.role == 'admin').all()
print(f'Found {len(admins)} admin user(s):')
for admin in admins:
    print(f'  - {admin.email} (ID: {admin.id})')
"
```

### Method 5: Frontend Login

1. Open frontend application
2. Navigate to login page
3. Enter admin credentials
4. Should redirect to admin dashboard
5. Check that admin-only features are visible

### Verification Checklist

- [ ] User exists in database with `role = 'admin'`
- [ ] Can login via API (`POST /api/v1/auth/login`)
- [ ] JWT token received contains correct role
- [ ] Can access admin endpoints (`GET /api/v1/admin/users`)
- [ ] Frontend shows admin dashboard for this user
- [ ] Admin-only features are accessible

---

## 🔒 Security Best Practices

### Password Requirements

- ✅ **Minimum 12 characters** (16+ recommended)
- ✅ **Mix of character types:**
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special characters (!@#$%^&*)
- ✅ **Avoid common patterns:**
  - No dictionary words
  - No personal information
  - No repeated characters (aaa, 111)
  - No sequential patterns (abc, 123)

**Good Password Examples:**
- `MyS3cure#P@ssw0rd!`
- `K8#vL2$mP9@nQ5&xR`
- `F@ydaAdm1n2024!`

**Bad Password Examples:**
- `admin123` ❌ Too short, too simple
- `password` ❌ Common word
- `Admin2024` ❌ No special characters

### Production Environment

1. **Never use default credentials:**
   - ❌ Don't use `admin@fayda.com` / `admin123` in production
   - ✅ Create unique admin users
   - ✅ Use strong, unique passwords

2. **Use the create_admin_user script:**
   - ✅ Handles password hashing correctly
   - ✅ Creates proper tenant associations
   - ✅ Includes error handling

3. **Multiple admin accounts:**
   - ✅ Create at least 2-3 admin accounts
   - ✅ Use different emails for each
   - ✅ Store credentials securely (password manager)
   - ✅ Document admin users (securely)

4. **Credential management:**
   - ✅ Store in password manager (1Password, LastPass, Bitwarden)
   - ✅ Never commit to git or documentation
   - ✅ Use environment variables for automation
   - ✅ Rotate passwords every 90 days

### Access Control

- ✅ Limit admin user creation to authorized personnel
- ✅ Monitor admin user activity
- ✅ Use two-factor authentication (when implemented)
- ✅ Regularly audit admin users list
- ✅ Remove admin access for former employees immediately

---

## 🆘 Troubleshooting

### Error: "User already exists"

**Problem:** Trying to create admin with email that already exists.

**Solution 1:** Use the promotion feature:
```powershell
python scripts/create_admin_user.py -e existing@email.com -p "password"
# When prompted, choose "yes" to promote user
```

**Solution 2:** Delete existing user (if safe):
```sql
DELETE FROM users WHERE email = 'existing@email.com';
```

**Solution 3:** Use different email:
```powershell
python scripts/create_admin_user.py -e different@email.com -p "password"
```

### Error: "Can't access admin endpoints"

**Symptoms:**
- Login succeeds but admin endpoints return 403 Forbidden
- Frontend doesn't show admin dashboard

**Checklist:**

1. **Verify role is set correctly:**
   ```sql
   SELECT email, role FROM users WHERE email = 'admin@example.com';
   ```
   Should show `role = 'admin'` (lowercase, exactly)

2. **Check JWT token payload:**
   - Decode JWT token at https://jwt.io
   - Verify `role` field is `"admin"`
   - Verify token hasn't expired

3. **Verify endpoint requirements:**
   - Admin endpoints use `verify_admin_role` dependency
   - Non-admin users cannot access these endpoints

4. **Try re-login:**
   - Logout and login again
   - Get fresh JWT token

### Error: "Password not working"

**Symptoms:**
- Can't login with known password
- Login returns "Incorrect username or password"

**Solutions:**

1. **Verify password hash:**
   ```python
   from app.core.security import verify_password, get_password_hash
   # Check if password matches hash in database
   verify_password("your-password", "$2b$12$...hash_from_db...")
   ```

2. **Reset password via script:**
   ```powershell
   # Create new admin with same email (will prompt to update)
   python scripts/create_admin_user.py -e admin@example.com -p "NewPassword123"
   ```

3. **Check database:**
   ```sql
   -- Verify user exists and is active
   SELECT email, status, role FROM users WHERE email = 'admin@example.com';
   ```

### Error: "Tenant not found"

**Problem:** Script can't find or create default tenant.

**Solution:**
```sql
-- Create default tenant manually
INSERT INTO tenant (id, name, status, created_at)
VALUES (gen_random_uuid(), 'default', 'active', NOW());
```

Then run the script again.

### Error: "SQLAlchemy relationship error"

**Problem:** Error about missing 'Verification' model when running scripts.

**Solution:** This was fixed in recent updates. Ensure you have the latest version of scripts with:
```python
from app.db.base import *  # Imports all models
```

If error persists, update scripts from repository.

### Error: "Connection refused" or "Database error"

**Problem:** Can't connect to database.

**Solutions:**

1. **Check database is running:**
   ```powershell
   # PostgreSQL
   pg_isready -h localhost -p 5433
   ```

2. **Verify DATABASE_URL in .env:**
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5433/faydaidcheck
   ```

3. **Test connection:**
   ```powershell
   python scripts/check_db_connection.py
   ```

---

## 📝 Quick Reference

### Development Setup

```powershell
cd fayda_backend
python scripts/seed_dev.py
# Login: admin@fayda.com / admin123
```

### Production Setup

```powershell
cd fayda_backend

# Interactive (recommended)
python scripts/create_admin_user.py

# Command line
python scripts/create_admin_user.py \
  -e admin@company.com \
  -p "SecureP@ssw0rd123!"
```

### Promote Existing User

```bash
PUT /api/v1/admin/users/{user_id}/role
Authorization: Bearer <admin-token>
Content-Type: application/json

{"new_role": "admin"}
```

### List All Admins

```powershell
python -c "from app.db.session import SessionLocal; from app.models.user import User; db = SessionLocal(); [print(f'{u.email} - {u.role}') for u in db.query(User).filter(User.role == 'admin').all()]"
```

### Verify Admin Access

```bash
# Login
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -d "username=admin@example.com&password=password"

# Test admin endpoint
curl -X GET "http://localhost:8000/api/v1/admin/users" \
  -H "Authorization: Bearer <token>"
```

---

## 📚 Additional Resources

- [Backend README](./README.md) - General backend documentation
- [Database Setup](./SETUP_POSTGRES.md) - PostgreSQL setup guide
- [Deployment Guide](../DEPLOYMENT_GUIDE.md) - Production deployment
- [API Documentation](http://localhost:8000/docs) - Interactive API docs

---

## ✅ Summary

**For Quick Development:**
```powershell
python scripts/seed_dev.py
```

**For Production:**
```powershell
python scripts/create_admin_user.py
```

**Need Help?**
- Check [Troubleshooting](#-troubleshooting) section
- Run scripts with `--help` flag
- Review error messages carefully
- Check database connection first

---

**Last Updated:** Today  
**Status:** ✅ All methods tested and working
