
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from pydantic import BaseModel

from app.database import get_db
from app.services.agent_service import smart_agent
from app.services.scheduler_service import scheduler_service
from app.models.agent_analysis import AgentAnalysis

router = APIRouter()


class AnalysisRequest(BaseModel):
    crop: str
    city: Optional[str] = "Delhi"
    days: Optional[int] = 7  # Prediction period (7, 30, 90, 180 days)


@router.post("/analyze")
async def analyze_crop(request: AnalysisRequest):
    user_prefs = {
        'risk_tolerance': 'medium'  # Can be stored in user model later
    }
    
    analysis = smart_agent.analyze_crop(
        crop=request.crop,
        city=request.city,
        user_preferences=user_prefs,
        days_ahead=request.days
    )
    
    return analysis


@router.get("/status")
async def agent_status(db: Session = Depends(get_db)):
    # Get total analyses count
    total_analyses = db.query(func.count(AgentAnalysis.id)).scalar() or 0
    
    # Get last analysis time
    last_analysis = db.query(AgentAnalysis).order_by(AgentAnalysis.created_at.desc()).first()
    last_run = last_analysis.created_at.isoformat() if last_analysis else None
    
    # Get next scheduled run from APScheduler
    next_scheduled_run = None
    if scheduler_service.is_running:
        daily_monitoring_job = scheduler_service.scheduler.get_job('daily_monitoring')
        if daily_monitoring_job and daily_monitoring_job.next_run_time:
            next_scheduled_run = daily_monitoring_job.next_run_time.isoformat()
    
    return {
        "is_running": scheduler_service.is_running,
        "last_run": last_run,
        "next_scheduled_run": next_scheduled_run,
        "total_analyses": total_analyses
    }


@router.post("/trigger-monitoring")
async def trigger_monitoring():
    scheduler_service.run_now('daily_monitoring')
    
    return {
        "message": "Daily monitoring triggered successfully",
        "note": "Check console for alerts generated"
    }


@router.get("/health")
async def health_check():
    return {
        "agent": "healthy",
        "scheduler": "running" if scheduler_service.is_running else "stopped",
        "timestamp": "2025-10-30T00:00:00"
    }


@router.get("/history")
async def get_analysis_history(
    limit: int = 10,
    crop: Optional[str] = None,
    db: Session = Depends(get_db)
):
    limit = min(limit, 100)  # Cap at 100
    
    query = db.query(AgentAnalysis).order_by(AgentAnalysis.created_at.desc())
    
    if crop:
        query = query.filter(AgentAnalysis.crop == crop)
    
    analyses = query.limit(limit).all()
    
    return {
        "total": len(analyses),
        "analyses": [a.to_dict() for a in analyses]
    }
