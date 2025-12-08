"""
Admin API endpoints - Protected with admin role
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Optional, List
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.models.agent_analysis import AgentAnalysis
from app.models.prediction_history import PredictionHistory
from app.api.v1.endpoints.auth import get_current_user
from app.core.cache import cache_manager

router = APIRouter()


# Pydantic models
class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    is_active: bool
    is_superuser: bool
    created_at: datetime
    location: Optional[str]
    favorite_crops: Optional[List[str]]

    class Config:
        from_attributes = True


class PlatformStats(BaseModel):
    total_users: int
    active_users: int
    total_analyses: int
    analyses_today: int
    total_predictions: int


class SystemLog(BaseModel):
    id: int
    timestamp: datetime
    level: str
    action: str
    user_email: Optional[str]


def verify_admin(current_user: User = Depends(get_current_user)):
    """Verify user has admin privileges"""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403,
            detail="Admin privileges required"
        )
    return current_user


@router.get("/stats", response_model=PlatformStats)
async def get_platform_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(verify_admin)
):
    """Get platform statistics - admin only"""
    
    # Total users
    total_users = db.query(func.count(User.id)).scalar()
    
    # Active users (logged in last 30 days)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    active_users = db.query(func.count(User.id)).filter(
        User.is_active == True
    ).scalar()
    
    # Total agent analyses
    total_analyses = db.query(func.count(AgentAnalysis.id)).scalar()
    
    # Analyses today
    today = datetime.now().date()
    analyses_today = db.query(func.count(AgentAnalysis.id)).filter(
        func.date(AgentAnalysis.created_at) == today
    ).scalar()
    
    # Total predictions
    total_predictions = db.query(func.count(PredictionHistory.id)).scalar()
    
    return PlatformStats(
        total_users=total_users or 0,
        active_users=active_users or 0,
        total_analyses=total_analyses or 0,
        analyses_today=analyses_today or 0,
        total_predictions=total_predictions or 0
    )


@router.get("/users", response_model=List[UserResponse])
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(verify_admin)
):
    """Get list of users with pagination - admin only"""
    
    query = db.query(User)
    
    # Search filter
    if search:
        query = query.filter(
            (User.email.ilike(f"%{search}%")) |
            (User.full_name.ilike(f"%{search}%"))
        )
    
    # Get total count
    total = query.count()
    
    # Paginate
    users = query.order_by(desc(User.created_at)).offset(skip).limit(limit).all()
    
    return users


@router.put("/users/{user_id}/status")
async def update_user_status(
    user_id: int,
    is_active: bool,
    db: Session = Depends(get_db),
    admin: User = Depends(verify_admin)
):
    """Activate or deactivate a user - admin only"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from deactivating themselves
    if user.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot deactivate your own account"
        )
    
    user.is_active = is_active
    db.commit()
    
    return {
        "message": f"User {'activated' if is_active else 'deactivated'} successfully",
        "user_id": user_id,
        "is_active": is_active
    }


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(verify_admin)
):
    """Delete a user - admin only"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from deleting themselves
    if user.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete your own account"
        )
    
    db.delete(user)
    db.commit()
    
    return {
        "message": "User deleted successfully",
        "user_id": user_id
    }


@router.get("/logs")
async def get_system_logs(
    limit: int = Query(50, ge=1, le=500),
    level: Optional[str] = Query(None, regex="^(info|warning|error)$"),
    db: Session = Depends(get_db),
    admin: User = Depends(verify_admin)
):
    """Get recent system activity logs - admin only"""
    
    # For now, return recent analyses as activity logs
    # In production, you'd have a dedicated logs table
    
    query = db.query(
        AgentAnalysis.id,
        AgentAnalysis.created_at.label('timestamp'),
        AgentAnalysis.crop,
        AgentAnalysis.city,
        User.email
    ).join(User, AgentAnalysis.user_id == User.id, isouter=True)
    
    logs = query.order_by(desc(AgentAnalysis.created_at)).limit(limit).all()
    
    return [
        {
            "id": log.id,
            "timestamp": log.timestamp.isoformat(),
            "level": "info",
            "action": f"Crop analysis: {log.crop} in {log.city}",
            "user": log.email or "System"
        }
        for log in logs
    ]


@router.get("/health")
async def admin_health_check(admin: User = Depends(verify_admin)):
    """Health check for admin panel - verifies admin access"""
    return {
        "status": "healthy",
        "admin_access": True,
        "admin_user": admin.email
    }


@router.get("/cache/stats")
async def get_cache_stats(admin: User = Depends(verify_admin)):
    """Get Redis cache statistics"""
    stats = cache_manager.get_stats()
    return {
        "cache": stats,
        "timestamp": datetime.now().isoformat()
    }


@router.post("/cache/clear/{namespace}")
async def clear_cache_namespace(
    namespace: str,
    pattern: str = "*",
    admin: User = Depends(verify_admin)
):
    """Clear cache for a specific namespace (weather, prices, etc.)"""
    deleted = cache_manager.invalidate_pattern(namespace, pattern)
    return {
        "success": True,
        "namespace": namespace,
        "pattern": pattern,
        "keys_deleted": deleted
    }


@router.post("/cache/clear-all")
async def clear_all_cache(admin: User = Depends(verify_admin)):
    """Clear entire cache (use with caution)"""
    total_deleted = 0
    namespaces = ["weather:current", "weather:forecast", "prices:prediction"]
    
    for namespace in namespaces:
        deleted = cache_manager.invalidate_pattern(namespace.split(":")[0], "*")
        total_deleted += deleted
    
    return {
        "success": True,
        "total_keys_deleted": total_deleted,
        "namespaces_cleared": namespaces
    }

