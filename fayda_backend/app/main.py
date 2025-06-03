from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import api_router
from app.mocks.mock_id_api import mock_id_router
from app.api.endpoints.user import router as user_router

# Ensure SQLAlchemy models are imported for Alembic (do NOT remove)
import app.db.base

app = FastAPI()

# --- CORS setup ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # <-- Your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
app.include_router(api_router)
app.include_router(mock_id_router, prefix="/id")
app.include_router(user_router)
