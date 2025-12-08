from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
import os
from dotenv import load_dotenv
from app.core.logging_config import logger

load_dotenv()

# Get database URL from environment or use SQLite fallback
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite:///./agri_ai.db"  # SQLite fallback for easy development
)

# Production-grade connection pooling configuration
is_sqlite = "sqlite" in DATABASE_URL

if is_sqlite:
    # SQLite configuration
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False  # Set to True for SQL debugging
    )
else:
    # PostgreSQL/MySQL production configuration with connection pooling
    engine = create_engine(
        DATABASE_URL,
        poolclass=QueuePool,
        pool_size=20,              # Number of connections to maintain
        max_overflow=10,           # Additional connections if pool exhausted
        pool_timeout=30,           # Timeout waiting for connection (seconds)
        pool_recycle=3600,         # Recycle connections after 1 hour
        pool_pre_ping=True,        # Verify connections before using
        echo=False
    )
    
    # Set PostgreSQL-specific parameters
    @event.listens_for(engine, "connect")
    def set_postgres_params(dbapi_conn, connection_record):
        cursor = dbapi_conn.cursor()
        cursor.execute("SET statement_timeout = 30000")  # 30 second query timeout
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for database sessions - automatically handles cleanup"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    from app.models import user, price_data, prediction_history, agent_analysis, notification
    
    # Import all models to ensure they're registered
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")