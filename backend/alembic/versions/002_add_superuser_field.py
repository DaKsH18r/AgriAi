"""add superuser field

Revision ID: 002
Revises: 001
Create Date: 2025-11-23

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002_add_superuser'
down_revision = '001_initial_schema'
branch_labels = None
depends_on = None


def upgrade():
    # Add is_superuser column to users table
    op.add_column('users', sa.Column('is_superuser', sa.Boolean(), nullable=True))
    
    # Set default value to False for existing users
    op.execute("UPDATE users SET is_superuser = FALSE WHERE is_superuser IS NULL")
    
    # Make the column non-nullable
    op.alter_column('users', 'is_superuser', nullable=False, server_default=sa.false())


def downgrade():
    # Remove is_superuser column
    op.drop_column('users', 'is_superuser')
