"""Add user accounts

Revision ID: 005_user_accounts
Revises: 004_price_alerts
Create Date: 2025-12-16 11:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision = '005_user_accounts'
down_revision = '004_price_alerts'
branch_labels = None
depends_on = None


def upgrade():
    # Modify users table to use UUID
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    
    # Add new columns to users table
    op.add_column('users', sa.Column('user_type', sa.String(20), server_default='FARMER', nullable=False))
    op.add_column('users', sa.Column('farm_size', sa.Float, nullable=True))
    op.add_column('users', sa.Column('farm_location_lat', sa.Float, nullable=True))
    op.add_column('users', sa.Column('farm_location_lon', sa.Float, nullable=True))
    op.add_column('users', sa.Column('language_preference', sa.String(5), server_default='en', nullable=False))
    op.add_column('users', sa.Column('sms_enabled', sa.Boolean, server_default='false', nullable=False))
    op.add_column('users', sa.Column('whatsapp_enabled', sa.Boolean, server_default='false', nullable=False))
    
    # Create user_crops table for many-to-many relationship
    op.create_table(
        'user_crops',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('crop', sa.String(50), nullable=False),
        sa.Column('quantity_kg', sa.Float, nullable=True),
        sa.Column('harvest_date', sa.Date, nullable=True),
        sa.Column('is_active', sa.Boolean, default=True, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    
    op.create_index('ix_user_crops_user_id', 'user_crops', ['user_id'])
    op.create_index('ix_user_crops_crop', 'user_crops', ['crop'])


def downgrade():
    op.drop_index('ix_user_crops_crop')
    op.drop_index('ix_user_crops_user_id')
    op.drop_table('user_crops')
    
    op.drop_column('users', 'whatsapp_enabled')
    op.drop_column('users', 'sms_enabled')
    op.drop_column('users', 'language_preference')
    op.drop_column('users', 'farm_location_lon')
    op.drop_column('users', 'farm_location_lat')
    op.drop_column('users', 'farm_size')
    op.drop_column('users', 'user_type')
