# ✅ Registration & Login Guide

## 🎉 Great News: Authentication is Working!

Both **registration** and **login** are fully functional and connected to your PostgreSQL 18 database.

## 📋 Available Endpoints

### Registration
- **URL:** `POST http://localhost:8000/api/v1/register/`
- **Status:** ✅ Working

### Login
- **URL:** `POST http://localhost:8000/api/v1/auth/login`
- **Status:** ✅ Working

## 🚀 How to Register & Login

### Method 1: Via Frontend (Recommended)

1. **Start Backend:**
   ```powershell
   cd fayda_backend
   uvicorn app.main:app --reload
   ```

2. **Start Frontend:**
   ```powershell
   cd fayda_frontend
   npm run dev
   ```

3. **Open Browser:**
   - Go to: `http://localhost:5173`
   - Click **"Register"** or go to `/register`
   - Fill in the form:
     - Full Name
     - Email
     - Password
     - (Optional) Phone, Company, etc.
   - Click **Register**
   - After registration, you'll be redirected to login
   - Login with your email and password

### Method 2: Via API (Using curl or Postman)

#### Register a New User:
```bash
curl -X POST "http://localhost:8000/api/v1/register/" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword123",
    "full_name": "Your Name",
    "role": "user"
  }'
```

#### Login:
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=yourpassword123"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Method 3: Via API Docs (Swagger UI)

1. Open: `http://localhost:8000/docs`
2. Find **POST /api/v1/register/**
   - Click "Try it out"
   - Fill in the request body
   - Click "Execute"
3. Find **POST /api/v1/auth/login**
   - Click "Try it out"
   - Fill in username and password
   - Click "Execute"
   - Copy the `access_token` from response

## 🔐 Using the Token

After login, you'll receive a JWT token. Use it in subsequent requests:

```bash
curl -X GET "http://localhost:8000/api/v1/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## ✅ Test Results

I've tested the authentication system and confirmed:

✅ **Registration:** Working
- New users can be created
- Passwords are hashed securely
- Users are assigned to default tenant
- Email validation prevents duplicates

✅ **Login:** Working
- Email/password authentication works
- JWT tokens are generated correctly
- Tokens include user role and email

✅ **Database:** Connected
- Users are stored in PostgreSQL 18
- All authentication data is persisted
- Multi-tenant support is enabled

## 📝 Frontend Routes

Based on your `App.jsx`, these routes are available:

- `/` - Home page
- `/login` - Login form
- `/register` - Registration form
- `/dashboard` - Admin dashboard (requires admin role)
- `/user` - User dashboard (requires user/client role)
- `/payment` - Payment page (requires authentication)
- `/profile` - User profile (requires authentication)

## 🎯 Quick Start

1. **Start both servers** (see Method 1 above)
2. **Go to:** `http://localhost:5173/register`
3. **Create an account**
4. **Login** at `http://localhost:5173/login`
5. **Access protected pages** like `/dashboard` or `/user`

## 🔍 Testing

You can test authentication with:

```powershell
cd fayda_backend
python scripts/test_auth.py
```

This will:
- Test user registration
- Test user login
- Verify JWT token generation
- Test protected endpoints

## 💡 Notes

- **Default Tenant:** New users are automatically assigned to the "default" tenant
- **Roles:** Available roles: `admin`, `user`, `client`
- **Password:** Stored as bcrypt hash (secure)
- **Token Expiry:** 60 minutes (configurable in `.env`)

## 🎉 You're Ready!

Registration and login are fully functional. You can now:
- ✅ Register new users
- ✅ Login with credentials
- ✅ Access protected routes
- ✅ Manage user sessions with JWT tokens

Everything is connected to your PostgreSQL 18 database and ready to use!

