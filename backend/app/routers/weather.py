from fastapi import APIRouter, HTTPException, Query, Request
from app.services.weather_service import WeatherService
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.logging_config import logger

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/current")
@limiter.limit("100/hour")
@limiter.limit("100/hour")
async def get_current_weather(
    request: Request,
    city: str = Query(..., description="City name"),
    country: str = Query("IN", description="Country code")
):
    """Get current weather for a city"""
    weather_data = WeatherService.get_current_weather(city, country)
    
    if "error" in weather_data:
        raise HTTPException(status_code=400, detail=weather_data["error"])
    
    return weather_data

@router.get("/forecast")
@limiter.limit("200/hour")
async def get_weather_forecast(
    request: Request,
    city: str = Query(..., description="City name"),
    country: str = Query("IN", description="Country code"),
    days: int = Query(5, description="Number of days", ge=1, le=5)
):
    """Get weather forecast for a city"""
    forecast_data = WeatherService.get_forecast(city, country, days)
    
    if "error" in forecast_data:
        raise HTTPException(status_code=400, detail=forecast_data["error"])
    
    return forecast_data

@router.get("/alerts")
@limiter.limit("200/hour")
async def get_weather_alerts(request: Request, city: str = Query(..., description="City name")):
    """Get weather alerts and risk warnings"""
    weather_data = WeatherService.get_current_weather(city)
    
    if "error" in weather_data:
        raise HTTPException(status_code=400, detail=weather_data["error"])
    
    alerts = []
    temp = weather_data["temperature"]
    humidity = weather_data["humidity"]
    wind = weather_data["wind_speed"]
    
    # Temperature alerts
    if temp > 40:
        alerts.append({
            "type": "extreme_heat",
            "severity": "high",
            "message": "Extreme heat warning! Increase irrigation and provide shade for crops. Risk of heat stress."
        })
    elif temp > 35:
        alerts.append({
            "type": "heat_advisory",
            "severity": "medium",
            "message": "High temperature alert. Monitor soil moisture and consider evening irrigation."
        })
    elif temp < 5:
        alerts.append({
            "type": "frost_warning",
            "severity": "high",
            "message": "Frost warning! Protect sensitive crops. Risk of severe damage to plants."
        })
    elif temp < 10:
        alerts.append({
            "type": "cold_advisory",
            "severity": "medium",
            "message": "Cold weather advisory. Delay planting of warm-season crops."
        })
    
    # Humidity alerts
    if humidity > 85:
        alerts.append({
            "type": "high_humidity",
            "severity": "medium",
            "message": "High humidity detected. Increased risk of fungal diseases. Monitor crops closely."
        })
    elif humidity < 30:
        alerts.append({
            "type": "low_humidity",
            "severity": "medium",
            "message": "Low humidity. Plants may need additional watering. Monitor for drought stress."
        })
    
    # Wind alerts
    if wind > 10:
        alerts.append({
            "type": "high_wind",
            "severity": "medium",
            "message": "Strong winds detected. Secure loose equipment and check for crop damage."
        })
    
    # Optimal conditions
    if 20 <= temp <= 30 and 40 <= humidity <= 70 and wind < 8:
        alerts.append({
            "type": "optimal_conditions",
            "severity": "low",
            "message": "Perfect farming conditions! Good time for planting, spraying, and field operations."
        })
    
    return {
        "city": weather_data["city"],
        "alerts": alerts,
        "current_conditions": weather_data
    }