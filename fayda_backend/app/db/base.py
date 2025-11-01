"""Database model registry."""

from app.db.base_class import Base
from app.models.user import User
from app.models.payment import Payment
from app.models.tenant import Tenant
from app.models.verification import Verification
from app.models.subject_pii import SubjectPII
from app.models.evidence_object import EvidenceObject
from app.models.audit_event import AuditEvent

# Importing the models above ensures they are registered on the shared ``Base``
# metadata. ``Base`` itself is defined in :mod:`app.db.base_class` and must be
# used consistently across the application so that table creation with
# ``Base.metadata.create_all`` works as expected.
