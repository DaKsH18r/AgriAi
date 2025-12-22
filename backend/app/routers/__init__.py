"""Router package initialization"""
from app.routers import (
    weather,
    chatbot,
    prices,
    yield_prediction,
    agent,
    notifications,
    admin,
    errors,
    alerts,
    profile
)

__all__ = [
    "weather",
    "chatbot",
    "prices",
    "yield_prediction",
    "agent",
    "notifications",
    "admin",
    "errors",
    "alerts",
    "profile"
]
