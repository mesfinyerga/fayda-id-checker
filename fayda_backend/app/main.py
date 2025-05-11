from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import api_router
from app.mocks.mock_id_api import mock_id_router  # ✅ Add this line

app = FastAPI()

# ✅ CORS setup for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React app origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include main API routes
app.include_router(api_router)

# ✅ Include Fayda ID mock route
app.include_router(mock_id_router, prefix="/id")  # This enables /id/mock-id-check/{id_number}
