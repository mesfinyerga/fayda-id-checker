# Fayda ID Checker Backend

A FastAPI-based backend for ID verification with multi-tenant PostgreSQL support.

## Features

- **Multi-tenant Architecture**: Row-level security with tenant isolation
- **PostgreSQL**: Production-ready database with UUID primary keys
- **JWT Authentication**: Secure token-based authentication
- **ID Verification**: Encrypted PII storage and evidence management
- **Audit Logging**: Comprehensive audit trail for compliance
- **Payment Processing**: Integrated payment tracking

## Quick Start

### Prerequisites

- Python 3.10+
- PostgreSQL 14+
- Docker (optional)

### 1. Database Setup

You have PostgreSQL 17 with pgAdmin 4 and database "faydaidcheck" already set up.

#### Option A: Use Your Existing PostgreSQL (Recommended)
Your current setup:
- **Database**: faydaidcheck
- **Host**: localhost:5432
- **Username**: postgres (or your custom username)

#### Option B: Docker (Alternative)
```bash
docker run --name fayda-pg \
  -e POSTGRES_USER=fayda \
  -e POSTGRES_PASSWORD=fayda \
  -e POSTGRES_DB=fayda \
  -p 5432:5432 \
  -d postgres:16
```

### 2. Environment Configuration

Copy the example environment file:
```bash
cp env.example .env
```

Update `.env` with your configuration:
```env
# For your existing PostgreSQL setup:
DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/faydaidcheck

# Or for Docker setup:
# DATABASE_URL=postgresql+psycopg://fayda:fayda@localhost:5432/fayda

JWT_SECRET_KEY=your-secure-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
APP_ENV=dev
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Database Migration

```bash
# Create and apply migrations
alembic upgrade head

# Migrate existing SQLite data (if applicable)
python scripts/migrate_sqlite_to_pg.py

# Seed development data
python scripts/seed_dev.py
```

### 5. Run the Application

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Database Schema

### Multi-Tenant Tables

- **tenant**: Tenant management
- **verification**: ID verification records
- **subject_pii**: Encrypted personal data (BYTEA)
- **evidence_object**: Verification evidence storage
- **audit_event**: Comprehensive audit logging

### Legacy Tables (with tenant_id)

- **users**: User accounts with tenant association
- **payments**: Payment records with tenant association

### Row Level Security (RLS)

RLS is enabled on multi-tenant tables:
- `verification`
- `evidence_object` 
- `audit_event`

Policies use `current_setting('app.current_tenant')` for tenant isolation.

## Development

### Default Users

After running the seed script:

- **Admin**: `admin@fayda.com` / `admin123`
- **User**: `user@fayda.com` / `user123`

**For detailed admin creation guide, see:** [HOW_TO_CREATE_ADMIN_USER.md](./HOW_TO_CREATE_ADMIN_USER.md)

### Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app
```

### Database Operations

```bash
# Create new migration
alembic revision -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1

# Check migration status
alembic current
```

## Production Deployment

### Environment Variables

```env
DATABASE_URL=postgresql+psycopg://user:pass@host:5432/db
JWT_SECRET_KEY=production-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
APP_ENV=prod
```

### Security Considerations

1. **JWT Secret**: Use a strong, randomly generated secret
2. **Database**: Enable SSL connections in production
3. **RLS**: Ensure tenant context is properly set
4. **Encryption**: Implement field-level encryption for PII
5. **Audit**: Monitor audit logs for security events

## Architecture

### Multi-Tenancy

- **Tenant Isolation**: Each tenant's data is isolated via RLS
- **Tenant Context**: Set via `app.current_tenant` session variable
- **Default Tenant**: Legacy data migrated to "default" tenant

### Data Flow

1. **Authentication**: JWT token contains user info
2. **Tenant Resolution**: Extract tenant from user record
3. **Context Setting**: Set tenant context for RLS
4. **Data Access**: RLS policies enforce tenant isolation

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running and accessible
2. **Migration Errors**: Check database permissions and extensions
3. **RLS Issues**: Verify tenant context is set correctly
4. **UUID Errors**: Ensure `pgcrypto` extension is enabled

### Logs

Check application logs for detailed error information:
```bash
uvicorn app.main:app --log-level debug
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
