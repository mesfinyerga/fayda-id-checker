# app/mocks/mock_id_api.py

from fastapi import APIRouter, Depends, HTTPException
from app.auth.deps import require_role
import httpx

mock_id_router = APIRouter()

# ✅ Local test data
VALID_IDS = {
    "123456789": {
        "name": "Abebe Kebede",
        "dob": "1992-03-15",
        "photo": "https://randomuser.me/api/portraits/men/32.jpg"
    },
    "987654321": {
        "name": "Selam Tesfaye",
        "dob": "1995-06-21",
        "photo": "https://randomuser.me/api/portraits/women/45.jpg"
    }
}

@mock_id_router.get("/mock-id-check/{id_number}")
def mock_id_check(id_number: str, current_user=Depends(require_role("user"))):  # role = user
    try:
        # Simulate real Fayda API call (replace when going live)
        url = f"https://id.et/api/check/{id_number}"
        headers = {"Authorization": "Bearer fake-fayda-api-token"}
        response = httpx.get(url, headers=headers, timeout=5)

        if response.status_code == 200:
            data = response.json()
            return {
                "valid": True,
                "name": data.get("name"),
                "dob": data.get("dob"),
                "photo": data.get("photo_url"),
                "checked_by": current_user["email"]
            }
        else:
            return {
                "valid": False,
                "reason": "Not found in Fayda system",
                "checked_by": current_user["email"]
            }

    except Exception:
        # Fallback to local mock
        if id_number in VALID_IDS:
            data = VALID_IDS[id_number]
            return {
                "valid": True,
                "name": data["name"],
                "dob": data["dob"],
                "photo": data["photo"],
                "checked_by": current_user["email"]
            }

        return {
            "valid": False,
            "reason": "Invalid ID (mock fallback)",
            "checked_by": current_user["email"]
        }
