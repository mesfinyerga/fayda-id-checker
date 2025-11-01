from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import datetime
import uuid

class EvidenceObject(Base):
    __tablename__ = "evidence_object"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    verification_id = Column(UUID(as_uuid=True), ForeignKey("verification.id", ondelete="CASCADE"), nullable=False, index=True)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenant.id"), nullable=False, index=True)
    object_key = Column(String, nullable=False)
    media_type = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    verification = relationship("Verification", back_populates="evidence")
    tenant = relationship("Tenant", back_populates="evidence_objects")
