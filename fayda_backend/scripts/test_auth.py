"""
Test registration and login endpoints to verify authentication is working.
"""
import requests
import sys
import json

BASE_URL = "http://localhost:8000"

def test_registration_and_login():
    """Test user registration and login."""
    print("=" * 60)
    print("🔍 Testing Authentication: Registration & Login")
    print("=" * 60)
    print()
    
    # Test data
    test_email = "test@example.com"
    test_password = "testpassword123"
    test_name = "Test User"
    
    # Step 1: Test Registration
    print("📝 Step 1: Testing User Registration")
    print("-" * 60)
    try:
        register_data = {
            "email": test_email,
            "password": test_password,
            "full_name": test_name,
            "role": "user"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/v1/register/",
            json=register_data,
            timeout=5
        )
        # Try without /api/v1 if that fails
        if response.status_code == 404:
            response = requests.post(
                f"{BASE_URL}/register/",
                json=register_data,
                timeout=5
            )
        
        if response.status_code in [200, 201]:
            print(f"   ✅ Registration successful!")
            print(f"   📧 Email: {test_email}")
            print(f"   👤 Name: {test_name}")
            registration_success = True
        elif response.status_code == 400:
            error_detail = response.json().get("detail", "Unknown error")
            if "already registered" in str(error_detail).lower():
                print(f"   ℹ️  User already exists (this is okay)")
                registration_success = True
            else:
                print(f"   ⚠️  Registration failed: {error_detail}")
                registration_success = False
        else:
            print(f"   ❌ Registration failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            registration_success = False
            
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Cannot connect to backend at {BASE_URL}")
        print(f"   💡 Make sure backend is running: uvicorn app.main:app --reload")
        return False
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        registration_success = False
    
    print()
    
    # Step 2: Test Login
    print("🔐 Step 2: Testing User Login")
    print("-" * 60)
    try:
        login_data = {
            "username": test_email,
            "password": test_password
        }
        
        # Try OAuth2 form data format (as per auth.py)
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            data=login_data,  # Use 'data' for form-encoded
            timeout=5
        )
        # Try without /api/v1 if that fails
        if response.status_code == 404:
            response = requests.post(
                f"{BASE_URL}/auth/login",
                data=login_data,
                timeout=5
            )
        
        if response.status_code == 200:
            result = response.json()
            token = result.get("access_token")
            if token:
                print(f"   ✅ Login successful!")
                print(f"   🎫 Token received: {token[:50]}...")
                print()
                
                # Step 3: Test Protected Endpoint
                print("🔒 Step 3: Testing Protected Endpoint")
                print("-" * 60)
                headers = {"Authorization": f"Bearer {token}"}
                
                # Try to get user profile or another protected endpoint
                try:
                    profile_response = requests.get(
                        f"{BASE_URL}/api/v1/users/me",
                        headers=headers,
                        timeout=5
                    )
                    if profile_response.status_code == 200:
                        print(f"   ✅ Protected endpoint accessible with token")
                        user_data = profile_response.json()
                        print(f"   👤 User: {user_data.get('email', 'N/A')}")
                    else:
                        print(f"   ⚠️  Profile endpoint status: {profile_response.status_code}")
                except:
                    print(f"   ℹ️  Profile endpoint may not be available")
                
                print()
                print("=" * 60)
                print("✅ Authentication System: WORKING")
                print("=" * 60)
                print()
                print("📋 Summary:")
                print(f"   ✅ Registration: {'Working' if registration_success else 'See above'}")
                print(f"   ✅ Login: Working")
                print(f"   ✅ Token Generation: Working")
                print()
                return True
            else:
                print(f"   ⚠️  Login response missing token")
                print(f"   Response: {result}")
                return False
        elif response.status_code == 401:
            print(f"   ❌ Login failed: Invalid credentials")
            print(f"   Response: {response.text}")
            return False
        else:
            print(f"   ❌ Login failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_registration_and_login()
    sys.exit(0 if success else 1)

