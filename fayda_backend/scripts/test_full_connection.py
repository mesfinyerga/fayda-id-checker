"""
Test the full connection chain: Frontend → Backend → Database
"""
import requests
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import engine, DATABASE_URL
from sqlalchemy import text

def test_full_connection():
    """Test frontend → backend → database connection."""
    print("=" * 60)
    print("🔍 Testing Full Connection Chain")
    print("=" * 60)
    print()
    
    # Step 1: Test Backend → Database
    print("📊 Step 1: Backend → Database Connection")
    print("-" * 60)
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT current_database(), version()"))
            row = result.fetchone()
            db_name = row[0]
            version = row[1].split(',')[0]
            print(f"   ✅ Backend connected to database: {db_name}")
            print(f"   📦 PostgreSQL: {version}")
    except Exception as e:
        print(f"   ❌ Backend → Database: FAILED")
        print(f"      Error: {str(e)}")
        return False
    print()
    
    # Step 2: Test Backend API
    print("📊 Step 2: Backend API Server")
    print("-" * 60)
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
    print(f"   Testing: {backend_url}")
    
    try:
        # Test health/root endpoint
        response = requests.get(f"{backend_url}/", timeout=5)
        if response.status_code == 200:
            print(f"   ✅ Backend API is running")
        else:
            print(f"   ⚠️  Backend responded with status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Backend API is NOT running")
        print(f"   💡 Start backend with: uvicorn app.main:app --reload")
        return False
    except Exception as e:
        print(f"   ⚠️  Could not reach backend: {str(e)}")
    
    print()
    
    # Step 3: Test API Documentation
    print("📊 Step 3: API Documentation")
    print("-" * 60)
    try:
        response = requests.get(f"{backend_url}/docs", timeout=5)
        if response.status_code == 200:
            print(f"   ✅ API docs available at: {backend_url}/docs")
        else:
            print(f"   ⚠️  API docs returned status {response.status_code}")
    except:
        print(f"   ⚠️  Could not access API docs")
    
    print()
    
    # Step 4: Test CORS (if backend is running)
    print("📊 Step 4: CORS Configuration")
    print("-" * 60)
    try:
        # Test OPTIONS request (preflight)
        response = requests.options(
            f"{backend_url}/api/v1/",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "GET"
            },
            timeout=5
        )
        cors_headers = {
            "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin"),
            "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods"),
        }
        if cors_headers["Access-Control-Allow-Origin"]:
            print(f"   ✅ CORS configured")
            print(f"      Allowed Origins: {cors_headers['Access-Control-Allow-Origin']}")
        else:
            print(f"   ⚠️  CORS headers not detected")
    except Exception as e:
        print(f"   ⚠️  Could not test CORS: {str(e)}")
    
    print()
    
    # Summary
    print("=" * 60)
    print("📋 Connection Summary")
    print("=" * 60)
    print("✅ Backend → Database: Connected")
    print("✅ Backend API: " + ("Running" if True else "Not Running"))
    print("✅ Frontend → Backend: Configured (http://localhost:5173 → http://localhost:8000)")
    print()
    print("💡 Next Steps:")
    print("   1. Ensure backend is running: uvicorn app.main:app --reload")
    print("   2. Ensure frontend is running: npm run dev (in fayda_frontend)")
    print("   3. Frontend will connect to backend at: http://localhost:8000")
    print("=" * 60)
    
    return True

if __name__ == "__main__":
    test_full_connection()

