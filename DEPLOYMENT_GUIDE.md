# 🚀 Deployment Guide

Complete guide for deploying Fayda ID Checker to production.

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Production Environment Setup](#production-environment-setup)
3. [Database Deployment](#database-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Docker Deployment](#docker-deployment)
7. [Cloud Platform Guides](#cloud-platform-guides)
8. [Post-Deployment Verification](#post-deployment-verification)

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass (`pytest`)
- [ ] Database migrations tested (`alembic upgrade head`)
- [ ] Environment variables configured for production
- [ ] Secrets generated (JWT, encryption keys)
- [ ] SSL certificates ready
- [ ] Database backups configured
- [ ] Monitoring setup ready
- [ ] Logging configured
- [ ] CORS origins updated for production domain

---

## 🔧 Production Environment Setup

### 1. Generate Production Secrets

```powershell
# Generate JWT Secret Key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Generate PII Encryption Key
python scripts/generate_encryption_key.py
```

### 2. Production `.env` File

Create `fayda_backend/.env.production`:

```env
# Database (Production PostgreSQL)
DATABASE_URL=postgresql+psycopg://username:password@prod-db-host:5432/faydaidcheck_prod

# JWT Configuration
JWT_SECRET_KEY=<generated-secret-key>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Application
APP_ENV=prod

# PII Encryption
PII_ENCRYPTION_KEY=<generated-encryption-key>

# Evidence Storage (MinIO/S3)
MINIO_ENDPOINT=s3.amazonaws.com
MINIO_ACCESS_KEY=<aws-access-key>
MINIO_SECRET_KEY=<aws-secret-key>
MINIO_SECURE=true
MINIO_BUCKET_NAME=fayda-evidence-prod

# CORS (Production domains only)
ALLOWED_ORIGINS=https://app.fayda.com,https://www.fayda.com

# Backup Configuration
BACKUP_RETENTION_DAYS=90
BACKUP_SCHEDULE=daily
```

### 3. Frontend Production `.env`

Create `fayda_frontend/.env.production`:

```env
VITE_API_URL=https://api.fayda.com
```

---

## 🗄️ Database Deployment

### Option 1: Managed Database (Recommended)

#### AWS RDS PostgreSQL

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier fayda-production \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 18.0 \
  --master-username postgres \
  --master-user-password <secure-password> \
  --allocated-storage 100 \
  --storage-type gp3
```

#### Database Connection String

```env
DATABASE_URL=postgresql+psycopg://username:password@prod-db.rds.amazonaws.com:5432/faydaidcheck_prod?sslmode=require
```

### Option 2: Self-Hosted PostgreSQL

```powershell
# On production server
# Install PostgreSQL 18
# Create database
createdb -U postgres faydaidcheck_prod

# Enable required extensions
psql -U postgres -d faydaidcheck_prod -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
psql -U postgres -d faydaidcheck_prod -c "CREATE EXTENSION IF NOT EXISTS uuid-ossp;"
```

### 3. Run Migrations

```powershell
cd fayda_backend

# Set production DATABASE_URL
$env:DATABASE_URL="postgresql+psycopg://..."

# Run migrations
alembic upgrade head

# Verify migration
alembic current
```

### 4. Enable Database Backups

```powershell
# Configure automated backups
python scripts/backup_db.py backup

# Set up cron/scheduled task for daily backups
```

---

## 🖥️ Backend Deployment

### Option 1: Direct Server Deployment

#### Prerequisites

```bash
# Install Python 3.10+
sudo apt-get update
sudo apt-get install python3.10 python3-pip python3-venv

# Install PostgreSQL client
sudo apt-get install postgresql-client-18
```

#### Deployment Steps

```bash
# 1. Clone repository
git clone https://github.com/your-repo/fayda-id-checker.git
cd fayda-id-checker/fayda_backend

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp env.example .env
# Edit .env with production values

# 5. Run migrations
alembic upgrade head

# 6. Install systemd service (optional)
sudo cp deploy/fayda-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable fayda-backend
sudo systemctl start fayda-backend
```

#### systemd Service File

Create `deploy/fayda-backend.service`:

```ini
[Unit]
Description=Fayda ID Checker Backend
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/fayda-id-checker/fayda_backend
Environment="PATH=/var/www/fayda-id-checker/fayda_backend/venv/bin"
ExecStart=/var/www/fayda-id-checker/fayda_backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Option 2: Gunicorn (Recommended for Production)

```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

### Option 3: Docker Deployment

See [Docker Deployment](#docker-deployment) section below.

---

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended for React)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd fayda_frontend
vercel --prod

# Set environment variables in Vercel dashboard
# VITE_API_URL=https://api.fayda.com
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://fayda-frontend-bucket

# Configure CloudFront distribution
```

### Option 4: Nginx Static Hosting

```bash
# Build
cd fayda_frontend
npm run build

# Copy to server
scp -r dist/* user@server:/var/www/fayda-frontend/

# Configure Nginx
```

Nginx Configuration (`/etc/nginx/sites-available/fayda-frontend`):

```nginx
server {
    listen 80;
    server_name app.fayda.com;
    
    root /var/www/fayda-frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🐳 Docker Deployment

### 1. Create Dockerfile (Backend)

Create `fayda_backend/Dockerfile`:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Create Dockerfile (Frontend)

Create `fayda_frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:18
    environment:
      POSTGRES_DB: faydaidcheck_prod
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"

  backend:
    build:
      context: ./fayda_backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql+psycopg://postgres:${DB_PASSWORD}@postgres:5432/faydaidcheck_prod
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
      PII_ENCRYPTION_KEY: ${PII_ENCRYPTION_KEY}
    ports:
      - "8000:8000"
    depends_on:
      - postgres

  frontend:
    build:
      context: ./fayda_frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 4. Deploy with Docker

```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## ☁️ Cloud Platform Guides

### AWS Deployment

#### 1. Backend on EC2 + RDS

```bash
# Launch EC2 instance
# Install dependencies
sudo apt-get update
sudo apt-get install python3.10 python3-pip nginx

# Clone and setup
git clone ...
cd fayda_backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure with RDS endpoint
# DATABASE_URL=postgresql+psycopg://user:pass@rds-endpoint:5432/db
```

#### 2. Frontend on S3 + CloudFront

```bash
# Build
cd fayda_frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://fayda-frontend-bucket --delete

# Create CloudFront distribution
# Configure custom domain
```

### Google Cloud Platform

```bash
# Deploy Backend with Cloud Run
gcloud run deploy fayda-backend \
  --source ./fayda_backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Deploy Frontend with Cloud Storage
gsutil -m cp -r dist/* gs://fayda-frontend-bucket/
```

### Azure Deployment

```bash
# Deploy Backend with App Service
az webapp up --name fayda-backend --runtime "PYTHON:3.10"

# Deploy Frontend with Static Web Apps
az staticwebapp deploy --name fayda-frontend --source-location dist
```

---

## ✅ Post-Deployment Verification

### 1. Backend Health Check

```bash
# Test API endpoint
curl https://api.fayda.com/health

# Check API docs
open https://api.fayda.com/docs

# Test authentication
curl -X POST https://api.fayda.com/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=test123"
```

### 2. Frontend Check

```bash
# Open frontend
open https://app.fayda.com

# Test registration/login
# Verify API calls in browser console
```

### 3. Database Verification

```bash
# Connect to database
psql $DATABASE_URL

# Check tables
\dt

# Verify data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM verification;
```

### 4. Security Checks

```bash
# Verify HTTPS
curl -I https://api.fayda.com

# Check CORS headers
curl -H "Origin: https://app.fayda.com" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS https://api.fayda.com

# Verify JWT works
# Test with Postman or curl
```

---

## 🔒 Security Checklist

- [ ] All secrets in environment variables (never in code)
- [ ] HTTPS enabled (SSL certificates)
- [ ] CORS configured for production domains only
- [ ] Database connections use SSL
- [ ] JWT secret is strong and unique
- [ ] PII encryption key is secure
- [ ] Rate limiting enabled
- [ ] Firewall configured (only necessary ports open)
- [ ] Database backups automated
- [ ] Logging configured (no sensitive data in logs)
- [ ] Monitoring and alerting set up

---

## 📊 Monitoring & Logging

### Backend Logging

```python
# Configure structured logging
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Monitoring Tools

- **Application**: New Relic, Datadog, Sentry
- **Infrastructure**: AWS CloudWatch, Google Cloud Monitoring
- **Database**: pgAdmin, CloudWatch RDS metrics

---

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify database is accessible
   - Check firewall rules

2. **CORS Errors**
   - Verify ALLOWED_ORIGINS includes frontend domain
   - Check HTTPS/HTTP mismatch

3. **Migration Errors**
   - Ensure pgcrypto extension enabled
   - Check database permissions
   - Verify Alembic version

4. **Frontend API Errors**
   - Verify VITE_API_URL is correct
   - Check browser console for errors
   - Verify backend is running

---

## 📚 Additional Resources

- [Backend README](./fayda_backend/README.md)
- [Frontend README](./fayda_frontend/README.md)
- [PostgreSQL Setup](./fayda_backend/SETUP_POSTGRES.md)
- [Critical Features Setup](./fayda_backend/CRITICAL_FEATURES_SETUP.md)

---

## 🎉 Deployment Complete!

Once deployed, your application should be:
- ✅ Accessible at production URLs
- ✅ Securely connected to production database
- ✅ Serving encrypted PII data
- ✅ Ready for users

**Need help?** Check the troubleshooting section or review the logs.

