"""Add price alerts table

Revision ID: 004_price_alerts
Revises: 003_update_price_data
Create Date: 2025-12-16 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision = '004_price_alerts'
down_revision = '003_update_price_data'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'price_alerts',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('crop', sa.String(50), nullable=False),
        sa.Column('city', sa.String(100), nullable=False),
        sa.Column('alert_type', sa.String(20), nullable=False),  # 'ABOVE', 'BELOW', 'CHANGE'
        sa.Column('threshold_price', sa.Float, nullable=True),  # For ABOVE/BELOW
        sa.Column('threshold_percentage', sa.Float, nullable=True),  # For CHANGE
        sa.Column('is_active', sa.Boolean, default=True, nullable=False),
        sa.Column('notification_method', sa.String(20), default='EMAIL', nullable=False),  # EMAIL, SMS, BOTH
        sa.Column('last_triggered_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )
    
    # Create indexes
    op.create_index('ix_price_alerts_user_id', 'price_alerts', ['user_id'])
    op.create_index('ix_price_alerts_crop', 'price_alerts', ['crop'])
    op.create_index('ix_price_alerts_is_active', 'price_alerts', ['is_active'])


def downgrade():
    op.drop_index('ix_price_alerts_is_active')
    op.drop_index('ix_price_alerts_crop')
    op.drop_index('ix_price_alerts_user_id')
    op.drop_table('price_alerts')
