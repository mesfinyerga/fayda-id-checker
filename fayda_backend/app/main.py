from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.api.routes import api_router
from app.mocks.mock_id_api import mock_id_router
from app.api.endpoints.user import router as user_router

# Ensure SQLAlchemy models are imported for Alembic (do NOT remove)
import app.db.base
from app.db.init_db import init as init_db

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

app = FastAPI()

@app.on_event("startup")
def startup_event():
    # Ensure database tables exist
    init_db()
    os.makedirs(os.path.join(BASE_DIR, "static"), exist_ok=True)

# --- CORS setup ---
# Read allowed origins from environment variable, or use sensible defaults
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "https://fayda-id-checker.vercel.app,http://localhost:5173"
)
allowed_origins = [origin.strip() for origin in allowed_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve user uploaded files
app.mount(
    "/static",
    StaticFiles(directory=os.path.join(BASE_DIR, "static")),
    name="static",
)

# --- Routers ---
app.include_router(api_router)
app.include_router(mock_id_router, prefix="/id")
app.include_router(user_router)
