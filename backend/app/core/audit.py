"""Audit logging utility for tracking admin actions"""
import json
from typing import Optional
from fastapi import Request
from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog
from app.models.user import User


def log_admin_action(
    db: Session,
    admin: User,
    action: str,
    resource_type: str,
    resource_id: Optional[str] = None,
    details: Optional[dict] = None,
    request: Optional[Request] = None,
    status: str = "success"
):
    """
    Log an admin action to the audit trail.
    
    Args:
        db: Database session
        admin: Admin user who performed the action
        action: Action performed (e.g., 'USER_DELETED', 'CACHE_CLEARED')
        resource_type: Type of resource affected (e.g., 'user', 'cache')
        resource_id: ID of the affected resource
        details: Additional details as dictionary
        request: FastAPI request object for IP and user agent
        status: 'success' or 'failed'
    """
    try:
        ip_address = None
        user_agent = None
        
        if request:
            # Get real IP from X-Forwarded-For or X-Real-IP headers (for proxy/load balancer)
            ip_address = (
                request.headers.get("X-Forwarded-For", "").split(",")[0].strip() or
                request.headers.get("X-Real-IP") or
                request.client.host if request.client else None
            )
            user_agent = request.headers.get("User-Agent")
        
        audit_entry = AuditLog(
            admin_id=admin.id,
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else None,
            details=json.dumps(details) if details else None,
            ip_address=ip_address,
            user_agent=user_agent[:255] if user_agent else None,  # Truncate if too long
            status=status
        )
        
        db.add(audit_entry)
        db.commit()
        
    except Exception as e:
        # Don't fail the request if audit logging fails
        print(f"Failed to log audit entry: {e}")
        db.rollback()
