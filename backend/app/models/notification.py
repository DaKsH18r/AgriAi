"""
Notification model for user alerts
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Notification(Base):
    """User notification model"""
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Notification details
    type = Column(String(50), nullable=False)  # 'price_alert', 'weather_warning', 'agent_recommendation'
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    
    # Status
    is_read = Column(Boolean, default=False, nullable=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    read_at = Column(DateTime(timezone=True), nullable=True)
    
    # Priority level
    priority = Column(String(20), default="normal")  # 'low', 'normal', 'high', 'urgent'
    
    # Related data (JSON string for flexibility)
    extra_data = Column(Text, nullable=True)  # Store crop name, price, etc. (renamed from metadata to avoid SQLAlchemy conflict)
    
    # Relationship
    user = relationship("User", back_populates="notifications")
