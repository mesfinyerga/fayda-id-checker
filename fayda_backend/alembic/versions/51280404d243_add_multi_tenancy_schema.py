"""add_multi_tenancy_schema

Revision ID: 51280404d243
Revises: dcc77d2711c6
Create Date: 2025-08-30 05:33:42.801091

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '51280404d243'
down_revision: Union[str, None] = 'dcc77d2711c6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Enable PostgreSQL extensions
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")
    op.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
    
    # Create tenant table
    op.create_table('tenant',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('status', sa.String(), nullable=False, server_default='active'),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tenant_id'), 'tenant', ['id'], unique=False)
    op.create_index(op.f('ix_tenant_name'), 'tenant', ['name'], unique=True)
    
    # Create verification table
    op.create_table('verification',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('subject_id', sa.String(), nullable=False),
        sa.Column('status', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenant.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_verification_id'), 'verification', ['id'], unique=False)
    op.create_index(op.f('ix_verification_tenant_id'), 'verification', ['tenant_id'], unique=False)
    op.create_index(op.f('ix_verification_subject_id'), 'verification', ['subject_id'], unique=False)
    op.create_index(op.f('ix_verification_status'), 'verification', ['status'], unique=False)
    op.create_index('ix_verification_tenant_status', 'verification', ['tenant_id', 'status'], unique=False)
    
    # Create subject_pii table
    op.create_table('subject_pii',
        sa.Column('verification_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('full_name', sa.LargeBinary(), nullable=False),
        sa.Column('dob', sa.LargeBinary(), nullable=False),
        sa.Column('id_number', sa.LargeBinary(), nullable=False),
        sa.Column('address', sa.LargeBinary(), nullable=True),
        sa.Column('phone', sa.LargeBinary(), nullable=True),
        sa.ForeignKeyConstraint(['verification_id'], ['verification.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('verification_id')
    )
    
    # Create evidence_object table
    op.create_table('evidence_object',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, server_default=sa.text('gen_random_uuid()')),
        sa.Column('verification_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('object_key', sa.String(), nullable=False),
        sa.Column('media_type', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenant.id'], ),
        sa.ForeignKeyConstraint(['verification_id'], ['verification.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_evidence_object_id'), 'evidence_object', ['id'], unique=False)
    op.create_index(op.f('ix_evidence_object_verification_id'), 'evidence_object', ['verification_id'], unique=False)
    op.create_index(op.f('ix_evidence_object_tenant_id'), 'evidence_object', ['tenant_id'], unique=False)
    op.create_index('ix_evidence_object_tenant_created', 'evidence_object', ['tenant_id', 'created_at'], unique=False)
    
    # Create audit_event table
    op.create_table('audit_event',
        sa.Column('id', sa.BigInteger(), nullable=False),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('actor_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('action', sa.String(), nullable=False),
        sa.Column('target_type', sa.String(), nullable=False),
        sa.Column('target_id', sa.String(), nullable=False),
        sa.Column('ip', postgresql.INET(), nullable=True),
        sa.Column('user_agent', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenant.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_audit_event_id'), 'audit_event', ['id'], unique=False)
    op.create_index(op.f('ix_audit_event_tenant_id'), 'audit_event', ['tenant_id'], unique=False)
    op.create_index(op.f('ix_audit_event_actor_id'), 'audit_event', ['actor_id'], unique=False)
    op.create_index('ix_audit_event_tenant_created', 'audit_event', ['tenant_id', 'created_at'], unique=False)
    
    # Add tenant_id to existing users table
    op.add_column('users', sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index(op.f('ix_users_tenant_id'), 'users', ['tenant_id'], unique=False)
    op.create_index('ix_users_tenant_email', 'users', ['tenant_id', 'email'], unique=False)
    
    # Add tenant_id to existing payments table
    op.add_column('payments', sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index(op.f('ix_payments_tenant_id'), 'payments', ['tenant_id'], unique=False)
    op.create_index('ix_payments_tenant_created', 'payments', ['tenant_id', 'created_at'], unique=False)
    
    # Create default tenant and migrate existing data
    op.execute("""
        INSERT INTO tenant (id, name, status, created_at) 
        VALUES (gen_random_uuid(), 'default', 'active', now())
        ON CONFLICT (name) DO NOTHING
    """)
    
    # Get default tenant ID
    result = op.execute("SELECT id FROM tenant WHERE name = 'default'")
    default_tenant_id = result.fetchone()[0]
    
    # Update existing users with default tenant
    op.execute(f"UPDATE users SET tenant_id = '{default_tenant_id}' WHERE tenant_id IS NULL")
    
    # Update existing payments with default tenant
    op.execute(f"UPDATE payments SET tenant_id = '{default_tenant_id}' WHERE tenant_id IS NULL")
    
    # Make tenant_id NOT NULL after data migration
    op.alter_column('users', 'tenant_id', nullable=False)
    op.alter_column('payments', 'tenant_id', nullable=False)
    
    # Add foreign key constraints
    op.create_foreign_key(None, 'users', 'tenant', ['tenant_id'], ['id'])
    op.create_foreign_key(None, 'payments', 'tenant', ['tenant_id'], ['id'])
    
    # Enable Row Level Security on multi-tenant tables
    op.execute("ALTER TABLE verification ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE evidence_object ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE audit_event ENABLE ROW LEVEL SECURITY")
    
    # Create RLS policies
    op.execute("""
        CREATE POLICY verification_tenant_policy ON verification
        FOR ALL USING (tenant_id::text = current_setting('app.current_tenant', true))
    """)
    
    op.execute("""
        CREATE POLICY evidence_object_tenant_policy ON evidence_object
        FOR ALL USING (tenant_id::text = current_setting('app.current_tenant', true))
    """)
    
    op.execute("""
        CREATE POLICY audit_event_tenant_policy ON audit_event
        FOR ALL USING (tenant_id::text = current_setting('app.current_tenant', true))
    """)


def downgrade() -> None:
    """Downgrade schema."""
    # Drop RLS policies
    op.execute("DROP POLICY IF EXISTS verification_tenant_policy ON verification")
    op.execute("DROP POLICY IF EXISTS evidence_object_tenant_policy ON evidence_object")
    op.execute("DROP POLICY IF EXISTS audit_event_tenant_policy ON audit_event")
    
    # Disable RLS
    op.execute("ALTER TABLE verification DISABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE evidence_object DISABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE audit_event DISABLE ROW LEVEL SECURITY")
    
    # Drop foreign key constraints
    op.drop_constraint(None, 'payments', type_='foreignkey')
    op.drop_constraint(None, 'users', type_='foreignkey')
    
    # Drop tenant_id columns from existing tables
    op.drop_index('ix_payments_tenant_created', table_name='payments')
    op.drop_index(op.f('ix_payments_tenant_id'), table_name='payments')
    op.drop_column('payments', 'tenant_id')
    
    op.drop_index('ix_users_tenant_email', table_name='users')
    op.drop_index(op.f('ix_users_tenant_id'), table_name='users')
    op.drop_column('users', 'tenant_id')
    
    # Drop new tables
    op.drop_index('ix_audit_event_tenant_created', table_name='audit_event')
    op.drop_index(op.f('ix_audit_event_actor_id'), table_name='audit_event')
    op.drop_index(op.f('ix_audit_event_tenant_id'), table_name='audit_event')
    op.drop_index(op.f('ix_audit_event_id'), table_name='audit_event')
    op.drop_table('audit_event')
    
    op.drop_index('ix_evidence_object_tenant_created', table_name='evidence_object')
    op.drop_index(op.f('ix_evidence_object_tenant_id'), table_name='evidence_object')
    op.drop_index(op.f('ix_evidence_object_verification_id'), table_name='evidence_object')
    op.drop_index(op.f('ix_evidence_object_id'), table_name='evidence_object')
    op.drop_table('evidence_object')
    
    op.drop_table('subject_pii')
    
    op.drop_index('ix_verification_tenant_status', table_name='verification')
    op.drop_index(op.f('ix_verification_status'), table_name='verification')
    op.drop_index(op.f('ix_verification_subject_id'), table_name='verification')
    op.drop_index(op.f('ix_verification_tenant_id'), table_name='verification')
    op.drop_index(op.f('ix_verification_id'), table_name='verification')
    op.drop_table('verification')
    
    op.drop_index(op.f('ix_tenant_name'), table_name='tenant')
    op.drop_index(op.f('ix_tenant_id'), table_name='tenant')
    op.drop_table('tenant')
