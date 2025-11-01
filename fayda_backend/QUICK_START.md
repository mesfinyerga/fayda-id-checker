# 🚀 Quick Start: View Tables in pgAdmin 4

## ✅ Good News!

Your database connection is **working perfectly**! All required tables already exist in your PostgreSQL 18 database.

## 📋 Your Tables (All Present!)

All 7 expected application tables are in your database:

1. ✅ **tenant** - Multi-tenant organizations (1 row)
2. ✅ **users** - User accounts (4 rows) 
3. ✅ **payments** - Payment transactions
4. ✅ **verification** - KYC verification records
5. ✅ **subject_pii** - Encrypted personal information
6. ✅ **evidence_object** - File attachments
7. ✅ **audit_event** - Audit log entries

## 🔍 How to View Tables in pgAdmin 4

### Step 1: Navigate to Your Database

1. In pgAdmin 4, expand the tree on the left:
   - **Servers** → **PostgreSQL 18** → **Databases** → **faydaidcheck**
   
2. If you don't see `faydaidcheck`, refresh by right-clicking **Databases** and selecting **Refresh**

### Step 2: View Tables

1. Expand: **faydaidcheck** → **Schemas** → **public** → **Tables**
2. You should see all tables listed above

### Step 3: View Table Data

**Option A: View All Rows**
1. Right-click any table (e.g., `users`)
2. Select **View/Edit Data** → **All Rows**
3. See all data in that table

**Option B: Query Tool**
1. Right-click the table
2. Select **View/Edit Data** → **First 100 Rows**
3. Use the SQL query editor at the bottom

**Option C: Properties**
1. Right-click the table
2. Select **Properties**
3. View table structure, indexes, constraints, etc.

## 📊 Sample Queries

### View all users:
```sql
SELECT * FROM users;
```

### View users with tenant info:
```sql
SELECT u.id, u.email, u.full_name, u.role, t.name AS tenant_name 
FROM users u 
JOIN tenant t ON u.tenant_id = t.id;
```

### Count rows in each table:
```sql
SELECT 
    'tenant' AS table_name, COUNT(*) AS row_count FROM tenant
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'verification', COUNT(*) FROM verification;
```

## 🛠️ Troubleshooting

### Tables Not Visible?

1. **Refresh the tree**: Right-click **faydaidcheck** → **Refresh**
2. **Check schema**: Make sure you're looking in **Schemas** → **public** → **Tables**
3. **Verify connection**: The database should show "Connected" in green

### See Old Prisma Tables?

You may see some old tables from a previous setup:
- `Institution` (old)
- `User` (old, with capital U)
- `Verification` (old, with capital V)
- `_prisma_migrations` (old migration tracker)

**These are safe to ignore** - your application uses:
- `tenant` (not Institution)
- `users` (lowercase, not User)
- `verification` (lowercase, not Verification)

## ✅ Verify Everything Works

Run this command to see all tables:

```powershell
cd fayda_backend
python scripts/check_db_connection.py
```

You should see all tables listed with their row counts!

## 🎉 You're All Set!

Your database is connected and all tables are ready. You can now:
- View data in pgAdmin 4
- Run the application: `uvicorn app.main:app --reload`
- Add seed data: `python scripts/seed_dev.py` (optional)

