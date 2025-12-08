"""
Client-side error logging endpoint for frontend error tracking
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.core.logging_config import logger
from app.api.v1.endpoints.auth import get_current_user
from app.models.user import User

router = APIRouter()


class ClientError(BaseModel):
    """Client error model"""
    message: str
    stack: Optional[str] = None
    componentStack: Optional[str] = None
    timestamp: str
    userAgent: str
    url: str


@router.post("/client")
async def log_client_error(
    error: ClientError,
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """Log client-side errors from frontend"""
    
    # Log the error with context
    logger.error(
        f"Client error: {error.message}",
        user_id=current_user.id,
        endpoint=error.url,
        request_id=getattr(request.state, 'request_id', None),
        client_error={
            "message": error.message,
            "stack": error.stack,
            "componentStack": error.componentStack,
            "userAgent": error.userAgent,
            "timestamp": error.timestamp
        }
    )
    
    return {"status": "logged", "request_id": getattr(request.state, 'request_id', None)}


@router.post("/client/anonymous")
async def log_anonymous_client_error(
    error: ClientError,
    request: Request
):
    """Log client-side errors from unauthenticated users"""
    
    # Log the error without user context
    logger.error(
        f"Anonymous client error: {error.message}",
        endpoint=error.url,
        request_id=getattr(request.state, 'request_id', None),
        client_error={
            "message": error.message,
            "stack": error.stack,
            "componentStack": error.componentStack,
            "userAgent": error.userAgent,
            "timestamp": error.timestamp
        }
    )
    
    return {"status": "logged", "request_id": getattr(request.state, 'request_id', None)}
