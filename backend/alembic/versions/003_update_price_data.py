"""update price_data schema

Revision ID: 003_update_price_data
Revises: 002_add_superuser
Create Date: 2025-12-09 11:55:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '003_update_price_data'
down_revision = '002_add_superuser'
branch_labels = None
depends_on = None


def upgrade():
    # Rename columns to match the model
    op.alter_column('price_data', 'commodity', new_column_name='crop')
    op.alter_column('price_data', 'market', new_column_name='mandi')
    op.alter_column('price_data', 'arrival_date', new_column_name='date')
    
    # Drop district column as it's not in the model
    op.drop_column('price_data', 'district')
    
    # Add variety column
    op.add_column('price_data', sa.Column('variety', sa.String(), nullable=True))
    
    # Add updated_at column
    op.add_column('price_data', sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()))
    
    # Update created_at to have timezone
    op.alter_column('price_data', 'created_at',
                    type_=sa.DateTime(timezone=True),
                    server_default=sa.func.now())
    
    # Make columns non-nullable as per model
    op.alter_column('price_data', 'crop', nullable=False)
    op.alter_column('price_data', 'mandi', nullable=False)
    op.alter_column('price_data', 'state', nullable=False)
    op.alter_column('price_data', 'date', nullable=False)
    op.alter_column('price_data', 'modal_price', nullable=False)
    
    # Create indexes
    op.create_index(op.f('ix_price_data_crop'), 'price_data', ['crop'], unique=False)
    op.create_index(op.f('ix_price_data_mandi'), 'price_data', ['mandi'], unique=False)
    op.create_index(op.f('ix_price_data_state'), 'price_data', ['state'], unique=False)
    op.create_index(op.f('ix_price_data_date'), 'price_data', ['date'], unique=False)


def downgrade():
    # Drop indexes
    op.drop_index(op.f('ix_price_data_date'), table_name='price_data')
    op.drop_index(op.f('ix_price_data_state'), table_name='price_data')
    op.drop_index(op.f('ix_price_data_mandi'), table_name='price_data')
    op.drop_index(op.f('ix_price_data_crop'), table_name='price_data')
    
    # Revert column changes
    op.alter_column('price_data', 'crop', nullable=True)
    op.alter_column('price_data', 'mandi', nullable=True)
    op.alter_column('price_data', 'state', nullable=True)
    op.alter_column('price_data', 'date', nullable=True)
    op.alter_column('price_data', 'modal_price', nullable=True)
    
    op.drop_column('price_data', 'updated_at')
    op.drop_column('price_data', 'variety')
    op.add_column('price_data', sa.Column('district', sa.String(), nullable=True))
    
    op.alter_column('price_data', 'date', new_column_name='arrival_date')
    op.alter_column('price_data', 'mandi', new_column_name='market')
    op.alter_column('price_data', 'crop', new_column_name='commodity')
