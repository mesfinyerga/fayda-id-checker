from sqlalchemy import Column, ForeignKey, LargeBinary
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class SubjectPII(Base):
    __tablename__ = "subject_pii"
    
    verification_id = Column(UUID(as_uuid=True), ForeignKey("verification.id", ondelete="CASCADE"), primary_key=True)
    full_name = Column(LargeBinary, nullable=False)
    dob = Column(LargeBinary, nullable=False)
    id_number = Column(LargeBinary, nullable=False)
    address = Column(LargeBinary, nullable=True)
    phone = Column(LargeBinary, nullable=True)
    
    # Relationships
    verification = relationship("Verification", back_populates="pii")
