from sqlalchemy import Column, Integer, String, Float, Date, DateTime
from sqlalchemy.sql import func
from app.database import Base

class PriceData(Base):
    __tablename__ = "price_data"
    
    id = Column(Integer, primary_key=True, index=True)
    crop = Column(String, index=True, nullable=False)
    mandi = Column(String, index=True, nullable=False)
    state = Column(String, index=True, nullable=False)
    date = Column(Date, index=True, nullable=False)
    modal_price = Column(Float, nullable=False)  # Most common price
    min_price = Column(Float)
    max_price = Column(Float)
    variety = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<PriceData(crop={self.crop}, mandi={self.mandi}, date={self.date}, price={self.modal_price})>"