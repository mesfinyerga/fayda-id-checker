"""
Evidence schemas for request/response validation.
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID


class EvidenceObjectOut(BaseModel):
    """Evidence object response schema"""
    id: UUID
    verification_id: UUID
    tenant_id: UUID
    object_key: str
    media_type: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class EvidenceUploadResponse(BaseModel):
    """Evidence upload response schema"""
    id: str
    verification_id: str
    object_key: str
    media_type: Optional[str]
    file_size: int
    filename: str
    created_at: str


class PresignedURLResponse(BaseModel):
    """Presigned URL response schema"""
    evidence_id: str
    url: str
    expires_in: int
    media_type: str

