from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime
import uuid

class Tenant(Base):
    __tablename__ = "tenant"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    status = Column(String, nullable=False, default="active")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    users = relationship("User", back_populates="tenant")
    verifications = relationship("Verification", back_populates="tenant")
    evidence_objects = relationship("EvidenceObject", back_populates="tenant")
    audit_events = relationship("AuditEvent", back_populates="tenant")
