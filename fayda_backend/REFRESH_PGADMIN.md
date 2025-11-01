# 🔄 How to See Tables in pgAdmin 4

## ✅ Good News: All Tables Exist!

All 7 required tables **are already created** in your database:
- ✅ tenant
- ✅ users
- ✅ payments
- ✅ verification
- ✅ subject_pii
- ✅ evidence_object
- ✅ audit_event

## 🔍 Why They Don't Appear in pgAdmin 4

pgAdmin 4 caches the database structure. If tables were created while pgAdmin was open, you need to **refresh** the view.

## 🛠️ How to See Your Tables

### Method 1: Refresh the Database (Recommended)

1. **Right-click** on `faydaidcheck` database in the left panel
2. Select **Refresh** (or press `F5`)
3. Expand: **Schemas** → **public** → **Tables**
4. All 7 tables should now be visible!

### Method 2: Refresh the Schema

1. Expand: **faydaidcheck** → **Schemas** → **public**
2. **Right-click** on `public` schema
3. Select **Refresh**
4. Expand **Tables** - they should appear!

### Method 3: Close and Reconnect

1. Close pgAdmin 4 completely
2. Reopen pgAdmin 4
3. Reconnect to PostgreSQL 18
4. Navigate to: **Databases** → **faydaidcheck** → **Schemas** → **public** → **Tables**

## ✅ Quick Verification

Run this command to confirm tables exist:

```powershell
cd fayda_backend
$env:DATABASE_URL="postgresql+psycopg://postgres:sefnlove!@localhost:5433/faydaidcheck"
python scripts/create_tables_now.py
```

You should see: "✅ All required tables already exist!"

## 📋 View Table Data in pgAdmin 4

Once tables are visible:

1. Expand **Tables** under **public** schema
2. **Right-click** any table (e.g., `users`)
3. Select **View/Edit Data** → **All Rows**
4. See all data in that table

## 🔍 Run SQL Query

1. Right-click **faydaidcheck** database
2. Select **Query Tool**
3. Run:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_type = 'BASE TABLE'
   ORDER BY table_name;
   ```

This will show all your tables!

## 🎉 Success!

Once you refresh, you'll see all 7 tables with their data. The tables are definitely there - pgAdmin just needs to refresh its cache!

