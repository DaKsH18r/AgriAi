"""Configuration settings for the application."""
from pydantic_settings import BaseSettings
from typing import Optional, List


class Settings(BaseSettings):
    """Application settings."""
    
    # API Keys
    GEMINI_API_KEY: str
    OPENWEATHER_API_KEY: str
    DATA_GOV_IN_API_KEY: Optional[str] = None
    
    # Database
    DATABASE_URL: Optional[str] = None
    
    # Redis Cache
    REDIS_URL: str = "redis://redis:6379/0"
    CACHE_ENABLED: bool = True
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production-min-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Email Configuration (Choose one method)
    # Method 1: SendGrid (Recommended for production)
    SENDGRID_API_KEY: Optional[str] = None
    
    # Method 2: SMTP (Gmail, Outlook, etc.)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: Optional[str] = None
    SMTP_FROM_NAME: str = "AgriAI Platform"
    
    # Email settings
    EMAIL_ENABLED: bool = False  # Set to True when configured
    
    # OAuth - Google Login
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str = "http://localhost/auth/google/callback"  # Docker deployment
    
    # CORS - Allow multiple origins for development
    FRONTEND_URL: str = "http://localhost"  # Docker deployment
    
    @property
    def CORS_ORIGINS(self) -> List[str]:
        """Get list of allowed CORS origins."""
        return [
            "http://localhost",           # Docker frontend
            "http://localhost:80",        # Docker frontend explicit port
            "http://localhost:5173",      # Dev server
            "http://127.0.0.1:5173",      # Dev server alternate
        ]
    
    # Environment
    ENVIRONMENT: str = "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Validate SECRET_KEY in production
        if self.ENVIRONMENT == "production" and len(self.SECRET_KEY) < 32:
            raise ValueError(
                "SECRET_KEY must be at least 32 characters in production. "
                "Generate one with: python -c 'import secrets; print(secrets.token_urlsafe(64))'"
            )
        # Warn in development if using weak key
        if self.SECRET_KEY == "" or "your" in self.SECRET_KEY.lower() or len(self.SECRET_KEY) < 32:
            print("⚠️  WARNING: Using weak or default SECRET_KEY. Generate a secure one!")


settings = Settings()
