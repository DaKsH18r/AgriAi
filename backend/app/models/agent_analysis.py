"""
Model for storing AI agent analysis history
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, Text
from datetime import datetime
from app.database import Base


class AgentAnalysis(Base):
    __tablename__ = "agent_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    crop = Column(String, nullable=False, index=True)
    city = Column(String, nullable=False)
    
    # Prices
    current_price = Column(Float, nullable=False)
    predicted_price = Column(Float, nullable=True)
    
    # Decision
    action = Column(String, nullable=False)  # SELL_NOW, WAIT, HOLD
    confidence = Column(Float, nullable=False)
    reason = Column(Text)
    best_action_date = Column(String, nullable=True)
    expected_price = Column(Float, nullable=True)
    risk_level = Column(String, nullable=False)
    
    # Market signals (stored as JSON)
    market_signals = Column(JSON)
    
    # LLM insights
    llm_insights = Column(Text, nullable=True)
    
    # Metadata
    analysis_duration = Column(Float)  # seconds
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    def to_dict(self):
        """Convert to dictionary for API response"""
        return {
            "id": self.id,
            "crop": self.crop,
            "city": self.city,
            "current_price": self.current_price,
            "predicted_price": self.predicted_price,
            "decision": {
                "action": self.action,
                "confidence": self.confidence,
                "reason": self.reason,
                "best_action_date": self.best_action_date,
                "expected_price": self.expected_price,
                "risk_level": self.risk_level
            },
            "market_signals": self.market_signals,
            "llm_insights": self.llm_insights,
            "timestamp": self.created_at.isoformat()
        }
