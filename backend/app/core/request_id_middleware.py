"""
Request ID middleware for distributed tracing.

Adds a unique request ID to each incoming request and includes it in:
- Response headers (X-Request-ID)
- Log messages (via context variable)
- Error responses

This enables tracing requests across distributed systems and makes
debugging production issues much easier.

Usage:
    # In main.py
    from app.core.request_id_middleware import RequestIDMiddleware
    app.add_middleware(RequestIDMiddleware)
    
    # In any module
    from app.core.request_id_middleware import get_request_id
    logger.info("Processing request", extra={"request_id": get_request_id()})
"""

import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from contextvars import ContextVar
from typing import Optional


# Context variable to store request ID across async calls
request_id_context: ContextVar[str] = ContextVar("request_id", default=None)


class RequestIDMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add unique request ID to each request.
    
    Features:
    - Generates UUID for each request
    - Accepts existing X-Request-ID header (for distributed tracing)
    - Adds X-Request-ID to response headers
    - Stores ID in context for logging
    """
    
    async def dispatch(self, request: Request, call_next):
        # Get request ID from header or generate new one
        request_id = request.headers.get("X-Request-ID")
        
        if not request_id:
            request_id = str(uuid.uuid4())
        
        # Store in context variable for access throughout request lifecycle
        request_id_context.set(request_id)
        
        # Add to request state for easy access
        request.state.request_id = request_id
        
        # Process the request
        response: Response = await call_next(request)
        
        # Add request ID to response headers
        response.headers["X-Request-ID"] = request_id
        
        return response


def get_request_id() -> Optional[str]:
    """
    Get the current request ID from context.
    
    Returns:
        str: Current request ID or None if not in request context
    
    Example:
        request_id = get_request_id()
        logger.info("Processing data", extra={"request_id": request_id})
    """
    return request_id_context.get()
