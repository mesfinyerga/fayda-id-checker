from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime
import uuid

class Verification(Base):
    __tablename__ = "verification"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenant.id"), nullable=False, index=True)
    subject_id = Column(String, nullable=False, index=True)
    status = Column(String, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Relationships
    tenant = relationship("Tenant", back_populates="verifications")
    pii = relationship("SubjectPII", back_populates="verification", uselist=False, cascade="all, delete-orphan")
    evidence = relationship("EvidenceObject", back_populates="verification", cascade="all, delete-orphan")
