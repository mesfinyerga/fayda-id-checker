# PostgreSQL Readiness Guide

**Version**: 1.0  
**Last Updated**: August 30, 2025  
**Status**: ✅ Ready for Implementation  

## Overview

This guide provides step-by-step instructions for setting up PostgreSQL for the Fayda ID Checker, including database creation, user setup, migration procedures, and testing.

## Prerequisites

### System Requirements
- **PostgreSQL**: Version 16 or 17 (recommended)
- **Operating System**: Windows, macOS, or Linux
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: Minimum 10GB free space

### Software Installation
- **PostgreSQL**: Download from [postgresql.org](https://www.postgresql.org/download/)
- **pgAdmin 4**: Optional GUI tool for database management
- **psql**: Command-line client (included with PostgreSQL)

## Database Setup

### 1. Install PostgreSQL

#### Windows Installation
```bash
# Download PostgreSQL installer from postgresql.org
# Run installer as Administrator
# Default installation path: C:\Program Files\PostgreSQL\17\
# Default port: 5432
# Remember the postgres user password!
```

#### macOS Installation
```bash
# Using Homebrew
brew install postgresql@17
brew services start postgresql@17

# Or download from postgresql.org
```

#### Linux Installation (Ubuntu/Debian)
```bash
# Add PostgreSQL repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update

# Install PostgreSQL
sudo apt-get install postgresql-17 postgresql-contrib-17

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database and User

#### Connect to PostgreSQL
```bash
# Connect as postgres superuser
sudo -u postgres psql

# Or on Windows (if added to PATH)
psql -U postgres -h localhost
```

#### Create Database and User
```sql
-- Create database
CREATE DATABASE faydaidcheck;

-- Create application user
CREATE USER fayda_app WITH PASSWORD 'your-secure-password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE faydaidcheck TO fayda_app;

-- Connect to the new database
\c faydaidcheck

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO fayda_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fayda_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fayda_app;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO fayda_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO fayda_app;

-- Exit psql
\q
```

### 3. Verify Installation
```bash
# Test connection with application user
psql -U fayda_app -d faydaidcheck -h localhost

# Test basic operations
SELECT version();
SELECT current_database();
SELECT current_user;

# Exit
\q
```

## Environment Configuration

### 1. Update Environment Variables
```bash
# .env
DATABASE_URL=postgresql+psycopg://fayda_app:your-secure-password@localhost:5432/faydaidcheck

# Alternative format for connection pooling
DATABASE_URL=postgresql+psycopg://fayda_app:your-secure-password@localhost:5432/faydaidcheck?pool_size=20&max_overflow=30
```

### 2. Test Database Connection
```python
# Test connection script
import psycopg2
from sqlalchemy import create_engine
import os

# Test direct connection
try:
    conn = psycopg2.connect(
        host="localhost",
        database="faydaidcheck",
        user="fayda_app",
        password="your-secure-password"
    )
    print("Direct connection successful!")
    conn.close()
except Exception as e:
    print(f"Direct connection failed: {e}")

# Test SQLAlchemy connection
try:
    engine = create_engine(os.getenv("DATABASE_URL"))
    with engine.connect() as conn:
        result = conn.execute("SELECT version()")
        print("SQLAlchemy connection successful!")
        print(f"PostgreSQL version: {result.scalar()}")
except Exception as e:
    print(f"SQLAlchemy connection failed: {e}")
```

## Migration Procedures

### 1. Install Dependencies
```bash
# Install psycopg (PostgreSQL adapter)
pip install psycopg[binary]

# Verify installation
python -c "import psycopg; print('psycopg installed successfully')"
```

### 2. Run Alembic Migrations
```bash
# Navigate to backend directory
cd fayda_backend

# Initialize Alembic (if not already done)
alembic init alembic

# Run migrations
alembic upgrade head

# Verify migration status
alembic current
alembic history
```

### 3. Verify Migration Results
```sql
-- Connect to database
psql -U fayda_app -d faydaidcheck

-- List all tables
\dt

-- Check table structure
\d tenant
\d users
\d verification
\d subject_pii
\d evidence_object
\d audit_event
\d payments

-- Check extensions
SELECT * FROM pg_extension WHERE extname IN ('pgcrypto', 'uuid-ossp');

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('verification', 'evidence_object', 'audit_event');

-- Exit
\q
```

## Performance Optimization

### 1. PostgreSQL Configuration
```bash
# Edit postgresql.conf (location varies by OS)
# Windows: C:\Program Files\PostgreSQL\17\data\postgresql.conf
# Linux: /etc/postgresql/17/main/postgresql.conf
# macOS: /usr/local/var/postgresql@17/postgresql.conf

# Recommended settings for development
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200

# Restart PostgreSQL after changes
# Windows: Restart service from Services
# Linux: sudo systemctl restart postgresql
# macOS: brew services restart postgresql@17
```

### 2. Connection Pooling
```python
# app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Configure connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_size=20,              # Number of connections to maintain
    max_overflow=30,           # Additional connections when pool is full
    pool_pre_ping=True,        # Verify connections before use
    pool_recycle=300,          # Recycle connections after 5 minutes
    pool_timeout=30,           # Timeout for getting connection from pool
    echo=False                 # Set to True for SQL logging
)
```

### 3. Index Optimization
```sql
-- Analyze table statistics
ANALYZE;

-- Check query performance
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM verification 
WHERE tenant_id = 'some-tenant-id' 
AND status = 'completed';

-- Monitor slow queries
-- Enable in postgresql.conf:
-- log_min_duration_statement = 1000  -- Log queries taking >1 second
```

## Security Configuration

### 1. Network Security
```bash
# Edit pg_hba.conf (host-based authentication)
# Location: Same directory as postgresql.conf

# Allow local connections only (development)
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5

# For production, restrict to specific IPs
# host    faydaidcheck    fayda_app      192.168.1.0/24          md5
```

### 2. SSL Configuration
```bash
# Enable SSL in postgresql.conf
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'

# Generate self-signed certificate (development)
openssl req -new -x509 -days 365 -nodes -text -out server.crt -keyout server.key -subj "/CN=localhost"
```

### 3. User Permissions
```sql
-- Create read-only user for reporting
CREATE USER fayda_readonly WITH PASSWORD 'readonly-password';
GRANT CONNECT ON DATABASE faydaidcheck TO fayda_readonly;
GRANT USAGE ON SCHEMA public TO fayda_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO fayda_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO fayda_readonly;
```

## Backup and Recovery

### 1. Automated Backups
```bash
#!/bin/bash
# backup_script.sh

BACKUP_DIR="/path/to/backups"
DB_NAME="faydaidcheck"
DB_USER="fayda_app"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U $DB_USER -h localhost -d $DB_NAME \
  --format=custom \
  --compress=9 \
  --file="$BACKUP_DIR/faydaidcheck_$DATE.backup"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.backup" -mtime +7 -delete

echo "Backup completed: faydaidcheck_$DATE.backup"
```

### 2. Restore Procedures
```bash
# Restore from backup
pg_restore -U fayda_app -h localhost -d faydaidcheck \
  --clean \
  --if-exists \
  /path/to/backup/faydaidcheck_20250830_120000.backup

# Restore specific tables
pg_restore -U fayda_app -h localhost -d faydaidcheck \
  --table=users \
  --table=verification \
  /path/to/backup/faydaidcheck_20250830_120000.backup
```

### 3. Point-in-Time Recovery
```sql
-- Enable WAL archiving in postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /path/to/wal_archive/%f'

-- Create base backup
pg_basebackup -U fayda_app -h localhost -D /path/to/backup/base -Ft -z -P

-- Restore to specific point in time
pg_restore -U fayda_app -h localhost -d faydaidcheck \
  --recovery-target-time="2025-08-30 12:00:00" \
  /path/to/backup/base
```

## Monitoring and Maintenance

### 1. Database Monitoring
```sql
-- Check database size
SELECT 
    pg_size_pretty(pg_database_size('faydaidcheck')) as database_size;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check connection count
SELECT count(*) as active_connections 
FROM pg_stat_activity 
WHERE state = 'active';

-- Check slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### 2. Maintenance Tasks
```sql
-- Update table statistics
ANALYZE;

-- Vacuum tables (remove dead tuples)
VACUUM ANALYZE;

-- Full vacuum (reclaim disk space)
VACUUM FULL;

-- Reindex tables
REINDEX DATABASE faydaidcheck;
```

### 3. Health Checks
```python
# health_check.py
import psycopg2
from sqlalchemy import create_engine, text
import os

def check_database_health():
    """Perform comprehensive database health check"""
    
    # Test basic connectivity
    try:
        engine = create_engine(os.getenv("DATABASE_URL"))
        with engine.connect() as conn:
            # Check version
            result = conn.execute(text("SELECT version()"))
            print(f"✓ PostgreSQL version: {result.scalar()}")
            
            # Check extensions
            result = conn.execute(text("SELECT extname FROM pg_extension WHERE extname IN ('pgcrypto', 'uuid-ossp')"))
            extensions = [row[0] for row in result.fetchall()]
            print(f"✓ Required extensions: {extensions}")
            
            # Check RLS policies
            result = conn.execute(text("""
                SELECT tablename, policyname 
                FROM pg_policies 
                WHERE tablename IN ('verification', 'evidence_object', 'audit_event')
            """))
            policies = result.fetchall()
            print(f"✓ RLS policies: {len(policies)} found")
            
            # Check table counts
            result = conn.execute(text("SELECT COUNT(*) FROM tenant"))
            tenant_count = result.scalar()
            print(f"✓ Tenant count: {tenant_count}")
            
            return True
            
    except Exception as e:
        print(f"✗ Database health check failed: {e}")
        return False

if __name__ == "__main__":
    check_database_health()
```

## Troubleshooting

### Common Issues

#### 1. Connection Refused
```bash
# Check if PostgreSQL is running
# Windows
sc query postgresql-x64-17

# Linux
sudo systemctl status postgresql

# macOS
brew services list | grep postgresql
```

#### 2. Authentication Failed
```bash
# Reset postgres user password
sudo -u postgres psql
ALTER USER postgres PASSWORD 'new-password';
\q

# Check pg_hba.conf configuration
sudo cat /etc/postgresql/17/main/pg_hba.conf
```

#### 3. Permission Denied
```sql
-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE faydaidcheck TO fayda_app;
GRANT ALL ON SCHEMA public TO fayda_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fayda_app;
```

#### 4. Migration Errors
```bash
# Check migration status
alembic current

# Downgrade and upgrade
alembic downgrade base
alembic upgrade head

# Check for conflicts
alembic heads
```

### Performance Issues

#### 1. Slow Queries
```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

-- Check slow queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

#### 2. High Memory Usage
```sql
-- Check memory usage
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public';
```

## Production Checklist

### Pre-Production
- [ ] Install PostgreSQL 17
- [ ] Create dedicated database and user
- [ ] Configure connection pooling
- [ ] Set up SSL certificates
- [ ] Configure backup procedures
- [ ] Set up monitoring
- [ ] Test migration procedures
- [ ] Verify RLS policies
- [ ] Test PII encryption
- [ ] Performance testing

### Production Deployment
- [ ] Use dedicated database server
- [ ] Configure high availability (if needed)
- [ ] Set up automated backups
- [ ] Configure monitoring and alerting
- [ ] Document recovery procedures
- [ ] Set up log rotation
- [ ] Configure firewall rules
- [ ] Regular security updates

### Maintenance Schedule
- [ ] Daily: Check backup completion
- [ ] Weekly: Update table statistics
- [ ] Monthly: Review performance metrics
- [ ] Quarterly: Security audit
- [ ] Annually: Capacity planning

## Conclusion

PostgreSQL is now ready for the Fayda ID Checker application. The database is configured with proper security, performance optimizations, and backup procedures. The migration system is in place to handle schema changes safely.

**Next Steps**:
1. Run the health check script
2. Execute initial migrations
3. Test application connectivity
4. Verify RLS policies
5. Set up monitoring
