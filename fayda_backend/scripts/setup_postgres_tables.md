# Quick Setup Guide: View Tables in pgAdmin 4

## ✅ Your Database Connection is Working!

Your PostgreSQL 18 connection is successfully configured. The database `faydaidcheck` exists and is connected.

## 📋 Expected Tables

After running migrations, you should see these tables in pgAdmin 4:

1. **tenant** - Multi-tenant organization table
2. **users** - User accounts (with tenant_id)
3. **payments** - Payment transactions (with tenant_id)
4. **verification** - KYC verification records
5. **subject_pii** - Encrypted personal information
6. **evidence_object** - File attachments for verifications
7. **audit_event** - Audit log entries

## 🛠️ Steps to See All Tables

### Step 1: Run Database Migrations

Open PowerShell in the `fayda_backend` directory and run:

```powershell
alembic upgrade head
```

This will:
- Create any missing tables
- Add required columns (like `tenant_id` to existing tables)
- Enable PostgreSQL extensions (pgcrypto, uuid-ossp)
- Set up Row Level Security (RLS) policies

### Step 2: Refresh pgAdmin 4

1. In pgAdmin 4, right-click on **Databases** → **faydaidcheck**
2. Click **Refresh**
3. Expand **Schemas** → **public** → **Tables**
4. You should now see all the tables listed above

### Step 3: Verify Tables Have Data (Optional)

Run the seed script to add sample data:

```powershell
python scripts/seed_dev.py
```

This creates:
- Default tenant
- Admin user: `admin@fayda.com` / `admin123`
- Regular user: `user@fayda.com` / `user123`
- Sample payment records

## 🔍 Troubleshooting

### If tables don't appear in pgAdmin 4:

1. **Check connection**: Run `python scripts/check_db_connection.py`
2. **Check migrations**: Run `alembic current` to see current migration
3. **Re-run migrations**: Run `alembic upgrade head`
4. **Check schema**: In pgAdmin, make sure you're looking in `public` schema

### If you see old Prisma tables:

You may see old tables like `_prisma_migrations`, `Institution`, `User` (capital U). These are from a previous setup and won't interfere with the new tables. The application uses:
- `users` (lowercase) - not `User`
- `tenant` - not `Institution`

## 📊 View Table Data in pgAdmin 4

1. Navigate to: **Databases** → **faydaidcheck** → **Schemas** → **public** → **Tables**
2. Right-click any table (e.g., `users`)
3. Select **View/Edit Data** → **All Rows**
4. You'll see all data in that table

## ✅ Quick Test

Run this to verify everything is working:

```powershell
python scripts/check_db_connection.py
```

You should see all expected tables listed with their row counts!

