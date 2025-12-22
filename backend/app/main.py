from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.routers import weather, chatbot, prices, yield_prediction, agent, notifications, admin, errors, alerts, profile
from app.api.v1.endpoints import auth
from app.services.scheduler_service import scheduler_service
from app.database import init_db
from app.core.config import settings
from app.core.env_validator import validate_environment
from app.core.security_middleware import (
    SecurityHeadersMiddleware,
    InputValidationMiddleware,
    RequestSizeLimitMiddleware
)
from app.core.logging_config import logger
from app.core.error_tracking import ErrorTrackingMiddleware
from app.core.cache import cache_manager

# Validate environment variables before anything else
validate_environment()

# Load environment variables from .env file
load_dotenv()

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Agriculture AI Platform API - Autonomous Agent")

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Error tracking middleware (add first to catch all errors)
app.add_middleware(ErrorTrackingMiddleware)

# Security Middlewares (add first for maximum protection)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(InputValidationMiddleware)
app.add_middleware(RequestSizeLimitMiddleware)

# IMPORTANT: SessionMiddleware must be added BEFORE CORSMiddleware for OAuth to work
app.add_middleware(
    SessionMiddleware, 
    secret_key=settings.SECRET_KEY,  # Use same secret as JWT
    session_cookie="oauth_session",
    max_age=600,  # OAuth session expires in 10 minutes
    same_site="lax",
    https_only=settings.ENVIRONMENT == "production"  # Enable HTTPS in production
)

# CORS - Allow multiple origins for development
CORS_ORIGINS = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,  # Allow all dev ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["Chatbot"])
app.include_router(prices.router, prefix="/api/prices", tags=["Prices"])
app.include_router(yield_prediction.router, prefix="/api/yield", tags=["Yield Prediction"])
app.include_router(agent.router, prefix="/api/agent", tags=["AI Agent"])  # New autonomous agent
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])  # Notification system
app.include_router(alerts.router, prefix="/api/alerts", tags=["Price Alerts"])  # NEW: Price alerts
app.include_router(profile.router, prefix="/api/profile", tags=["User Profile"])  # NEW: User profiles
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])  # Admin panel
app.include_router(errors.router, prefix="/api/errors", tags=["Error Tracking"])  # Client error logging


@app.on_event("startup")
async def startup_event():
    """Start the autonomous agent scheduler on application startup"""
    logger.info("🚀 Starting Agriculture AI Platform with Autonomous Agent...")
    
    try:
        # Initialize database tables
        init_db()
        logger.info("✅ Database initialized successfully")
        
        # Start scheduler
        scheduler_service.start()
        logger.info("✅ Autonomous monitoring active! Agent running 24/7")
    except Exception as e:
        logger.error("❌ Failed to start application", exc_info=e)
        raise


@app.on_event("shutdown")
async def shutdown_event():
    """Stop the scheduler on application shutdown"""
    try:
        scheduler_service.stop()
        logger.info("👋 Agent stopped gracefully")
        
        # Close cache connection
        cache_manager.close()
        logger.info("Cache connection closed")
    except Exception as e:
        logger.error("Error during shutdown", exc_info=e)

@app.get("/")
def read_root():
    return {
        "message": "Agriculture AI Platform - Autonomous Agent Active",
        "agent_status": "running" if scheduler_service.is_running else "stopped",
        "features": ["Weather", "Chatbot", "Prices", "Yield Prediction", "AI Agent"]
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "agent_running": scheduler_service.is_running
    }