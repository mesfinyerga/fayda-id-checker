# PostgreSQL 18 Setup Guide

This guide is specifically for your PostgreSQL 18 + pgAdmin 4 setup with database "faydaidcheck".

## 1. Database Connection Details

Based on your setup:
- **Host**: localhost
- **Port**: 5432 (default)
- **Database**: faydaidcheck
- **Username**: postgres (or your custom username)
- **Password**: Your PostgreSQL password

## 2. Environment Configuration

Create your `.env` file:

```bash
cp env.example .env
```

Edit `.env` and update the DATABASE_URL:

```env
# Replace 'your_password' with your actual PostgreSQL password
DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/faydaidcheck

# Generate a secure JWT secret
JWT_SECRET_KEY=your-super-secure-jwt-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
APP_ENV=dev
```

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## 4. Run Database Migrations

```bash
# Apply the multi-tenancy schema
alembic upgrade head
```

This will:
- Create all new tables (tenant, verification, subject_pii, evidence_object, audit_event)
- Add tenant_id columns to existing users and payments tables
- Enable Row Level Security (RLS) policies
- Create necessary indexes

## 5. Migrate Existing Data (if any)

If you have existing data in SQLite:

```bash
python scripts/migrate_sqlite_to_pg.py
```

## 6. Seed Development Data

```bash
python scripts/seed_dev.py
```

This creates:
- Default tenant
- Admin user: `admin@fayda.com` / `admin123`
- Regular user: `user@fayda.com` / `user123`
- Sample payment records

## 7. Verify in pgAdmin 4

After running migrations, you should see these tables in pgAdmin 4:

### New Multi-Tenant Tables:
- `tenant`
- `verification`
- `subject_pii`
- `evidence_object`
- `audit_event`

### Modified Tables:
- `users` (now has `tenant_id` column)
- `payments` (now has `tenant_id` column)

### RLS Policies:
Check that RLS is enabled on:
- `verification`
- `evidence_object`
- `audit_event`

## 8. Start the Application

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 9. Test the Setup

1. **API Documentation**: http://localhost:8000/docs
2. **Login with seeded users**:
   - Admin: `admin@fayda.com` / `admin123`
   - User: `user@fayda.com` / `user123`

## Troubleshooting

### Connection Issues
- Verify PostgreSQL is running: `pg_ctl status`
- Check connection in pgAdmin 4
- Ensure password is correct in DATABASE_URL

### Migration Issues
- Check PostgreSQL logs for errors
- Ensure database "faydaidcheck" exists
- Verify user has CREATE privileges

### RLS Issues
- Check that `pgcrypto` extension is enabled
- Verify RLS policies are created correctly

## Database Schema Overview

Your database will now have:

1. **Multi-tenant isolation** via RLS
2. **UUID primary keys** for new tables
3. **Encrypted PII storage** (BYTEA fields)
4. **Comprehensive audit logging**
5. **Backward compatibility** with existing endpoints

All existing functionality remains unchanged while adding enterprise-grade multi-tenancy!
