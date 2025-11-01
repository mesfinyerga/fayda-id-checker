#!/usr/bin/env python3
"""
Simple test script to verify backend functionality
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_backend():
    print("Testing backend connectivity...")
    
    # Test 1: Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/docs")
        print(f"✅ Server is running (status: {response.status_code})")
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running. Please start the backend with: uvicorn app.main:app --reload")
        return False
    
    # Test 2: Test registration endpoint
    print("\nTesting registration endpoint...")
    test_user = {
        "email": "test@example.com",
        "full_name": "Test User",
        "password": "testpass123",
        "plan_type": "basic",
        "status": "unpaid",
        "role": "user"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/register/", json=test_user)
        print(f"Registration response: {response.status_code}")
        if response.status_code == 200:
            print("✅ Registration successful")
            print(f"Response: {response.json()}")
        else:
            print(f"❌ Registration failed: {response.text}")
    except Exception as e:
        print(f"❌ Registration error: {e}")
    
    # Test 3: Test login endpoint
    print("\nTesting login endpoint...")
    login_data = {
        "username": "test@example.com",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", data=login_data)
        print(f"Login response: {response.status_code}")
        if response.status_code == 200:
            print("✅ Login successful")
            token = response.json().get("access_token")
            print(f"Token received: {token[:20]}..." if token else "No token")
        else:
            print(f"❌ Login failed: {response.text}")
    except Exception as e:
        print(f"❌ Login error: {e}")
    
    print("\nBackend test completed!")

if __name__ == "__main__":
    test_backend()
