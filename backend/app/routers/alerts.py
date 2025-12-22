"""Price Alerts API Router"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from datetime import datetime

from app.database import get_db
from app.models.price_alert import PriceAlert
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from pydantic import BaseModel, Field


router = APIRouter()  # Remove prefix - it's added in main.py


# Schemas
class PriceAlertCreate(BaseModel):
    crop: str = Field(..., description="Crop name (wheat, rice, etc.)")
    city: str = Field(..., description="City name")
    alert_type: str = Field(..., description="ABOVE, BELOW, or CHANGE")
    threshold_price: float | None = Field(None, description="Price threshold for ABOVE/BELOW")
    threshold_percentage: float | None = Field(None, description="Percentage change for CHANGE alerts")
    notification_method: str = Field(default="EMAIL", description="EMAIL, SMS, or BOTH")


class PriceAlertUpdate(BaseModel):
    is_active: bool | None = None
    threshold_price: float | None = None
    threshold_percentage: float | None = None
    notification_method: str | None = None


class PriceAlertResponse(BaseModel):
    id: UUID
    crop: str
    city: str
    alert_type: str
    threshold_price: float | None
    threshold_percentage: float | None
    is_active: bool
    notification_method: str
    last_triggered_at: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }


@router.post("/", response_model=PriceAlertResponse, status_code=status.HTTP_201_CREATED)
async def create_alert(
    alert: PriceAlertCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new price alert"""
    # Validate alert type
    if alert.alert_type not in ['ABOVE', 'BELOW', 'CHANGE']:
        raise HTTPException(status_code=400, detail="Invalid alert_type. Must be ABOVE, BELOW, or CHANGE")
    
    # Validate thresholds
    if alert.alert_type in ['ABOVE', 'BELOW'] and alert.threshold_price is None:
        raise HTTPException(status_code=400, detail="threshold_price required for ABOVE/BELOW alerts")
    
    if alert.alert_type == 'CHANGE' and alert.threshold_percentage is None:
        raise HTTPException(status_code=400, detail="threshold_percentage required for CHANGE alerts")
    
    # Create alert
    db_alert = PriceAlert(
        user_id=current_user.id,
        crop=alert.crop.lower(),
        city=alert.city,
        alert_type=alert.alert_type,
        threshold_price=alert.threshold_price,
        threshold_percentage=alert.threshold_percentage,
        notification_method=alert.notification_method
    )
    
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    
    return db_alert


@router.get("/", response_model=List[PriceAlertResponse])
async def get_user_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all alerts for current user"""
    alerts = db.query(PriceAlert).filter(
        PriceAlert.user_id == current_user.id
    ).order_by(PriceAlert.created_at.desc()).all()
    
    return alerts


@router.get("/{alert_id}", response_model=PriceAlertResponse)
async def get_alert(
    alert_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific alert by ID"""
    alert = db.query(PriceAlert).filter(
        PriceAlert.id == alert_id,
        PriceAlert.user_id == current_user.id
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return alert


@router.patch("/{alert_id}", response_model=PriceAlertResponse)
async def update_alert(
    alert_id: UUID,
    alert_update: PriceAlertUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an existing alert"""
    alert = db.query(PriceAlert).filter(
        PriceAlert.id == alert_id,
        PriceAlert.user_id == current_user.id
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    # Update fields
    update_data = alert_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(alert, field, value)
    
    db.commit()
    db.refresh(alert)
    
    return alert


@router.delete("/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_alert(
    alert_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a price alert"""
    alert = db.query(PriceAlert).filter(
        PriceAlert.id == alert_id,
        PriceAlert.user_id == current_user.id
    ).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    db.delete(alert)
    db.commit()
    
    return None
