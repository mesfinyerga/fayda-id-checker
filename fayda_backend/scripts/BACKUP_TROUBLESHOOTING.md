# Backup System Troubleshooting

## PostgreSQL Version Mismatch

If you see:
```
pg_dump: error: aborting because of server version mismatch
pg_dump: detail: server version: 18.0; pg_dump version: 17.4
```

### Solution 1: Update PostgreSQL Client Tools (Recommended)

**Windows:**
1. Download PostgreSQL 18 client tools from: https://www.postgresql.org/download/windows/
2. Install and ensure `pg_dump` from version 18 is in PATH
3. Verify: `pg_dump --version` should show 18.x

**Alternative: Use pg_dump from PostgreSQL 18 installation**
- Path usually: `C:\Program Files\PostgreSQL\18\bin\pg_dump.exe`
- Use full path in backup script or add to PATH

### Solution 2: Force Compatibility (May work)

pg_dump 17.4 should generally work with PostgreSQL 18.0 for most operations.

If issues persist:
1. Use `--no-password` flag (already in script)
2. Ensure connection credentials are correct
3. Try full backup path: `"C:\Program Files\PostgreSQL\18\bin\pg_dump.exe"`

### Solution 3: Manual Backup via pgAdmin

1. Open pgAdmin 4
2. Right-click `faydaidcheck` database
3. Select **Backup...**
4. Choose options and save backup file

---

## Other Common Issues

### Issue: "password authentication failed"
**Solution:** Verify `DATABASE_URL` in `.env` has correct password

### Issue: "connection refused"
**Solution:** Ensure PostgreSQL is running on the specified port (5433)

### Issue: "database does not exist"
**Solution:** Verify database name in `DATABASE_URL` matches your database

---

## Quick Test

To verify backup system works:

```powershell
# Test connection
python -c "from scripts.backup_db import get_db_connection_info; print(get_db_connection_info())"

# Test backup (may show version warning but should complete)
python scripts/backup_db.py backup --schema-only
```

Version warnings are usually safe to ignore for minor version differences.

