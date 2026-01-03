import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, Any
import requests
from app.core.config import settings

logger = logging.getLogger(__name__)


class WeatherImpactService:
    
    def __init__(self):
        # Using Open-Meteo API (free, no API key required)
        self.base_url = "https://api.open-meteo.com/v1"
        
        # City coordinates for major Indian cities
        self.city_coordinates = {
            "delhi": {"lat": 28.6139, "lon": 77.2090},
            "mumbai": {"lat": 19.0760, "lon": 72.8777},
            "bangalore": {"lat": 12.9716, "lon": 77.5946},
            "kolkata": {"lat": 22.5726, "lon": 88.3639},
            "chennai": {"lat": 13.0827, "lon": 80.2707},
            "hyderabad": {"lat": 17.3850, "lon": 78.4867},
            "pune": {"lat": 18.5204, "lon": 73.8567},
        }
        
        # Crop sensitivity to weather parameters
        self.crop_weather_sensitivity = {
            "wheat": {
                "optimal_temp_min": 15,
                "optimal_temp_max": 25,
                "rain_tolerance": "medium",
                "drought_sensitive": False,
            },
            "rice": {
                "optimal_temp_min": 20,
                "optimal_temp_max": 35,
                "rain_tolerance": "high",
                "drought_sensitive": True,
            },
            "tomato": {
                "optimal_temp_min": 18,
                "optimal_temp_max": 27,
                "rain_tolerance": "low",
                "drought_sensitive": True,
            },
            "potato": {
                "optimal_temp_min": 15,
                "optimal_temp_max": 20,
                "rain_tolerance": "medium",
                "drought_sensitive": False,
            },
            "onion": {
                "optimal_temp_min": 13,
                "optimal_temp_max": 24,
                "rain_tolerance": "low",
                "drought_sensitive": True,
            },
            "maize": {
                "optimal_temp_min": 18,
                "optimal_temp_max": 32,
                "rain_tolerance": "medium",
                "drought_sensitive": True,
            },
            "cotton": {
                "optimal_temp_min": 21,
                "optimal_temp_max": 30,
                "rain_tolerance": "medium",
                "drought_sensitive": True,
            },
            "sugarcane": {
                "optimal_temp_min": 20,
                "optimal_temp_max": 35,
                "rain_tolerance": "high",
                "drought_sensitive": True,
            },
        }
    
    async def get_weather_forecast(self, city: str, days: int = 7) -> Dict[str, Any]:
        try:
            coords = self.city_coordinates.get(city.lower())
            if not coords:
                logger.warning(f"Coordinates not found for city: {city}")
                return self._get_default_weather()
            
            # Call Open-Meteo API
            params = {
                "latitude": coords["lat"],
                "longitude": coords["lon"],
                "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max",
                "timezone": "Asia/Kolkata",
                "forecast_days": min(days, 16)  # API supports max 16 days
            }
            
            response = requests.get(f"{self.base_url}/forecast", params=params, timeout=5)
            response.raise_for_status()
            
            data = response.json()
            
            return {
                "city": city,
                "forecast_days": days,
                "daily": data.get("daily", {}),
                "source": "open-meteo",
                "fetched_at": datetime.now(timezone.utc).isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error fetching weather for {city}: {e}")
            return self._get_default_weather()
    
    def _get_default_weather(self) -> Dict[str, Any]:
        return {
            "city": "unknown",
            "forecast_days": 7,
            "daily": {
                "temperature_2m_max": [28] * 7,
                "temperature_2m_min": [18] * 7,
                "precipitation_sum": [0] * 7,
            },
            "source": "default",
            "fetched_at": datetime.now(timezone.utc).isoformat()
        }
    
    async def analyze_weather_impact(
        self, 
        crop: str, 
        city: str, 
        days: int = 7
    ) -> Dict[str, Any]:
        try:
            # Get weather forecast
            weather = await self.get_weather_forecast(city, days)
            
            # Get crop sensitivity
            sensitivity = self.crop_weather_sensitivity.get(crop.lower())
            if not sensitivity:
                return {
                    "impact": "UNKNOWN",
                    "severity": "low",
                    "message": f"Weather sensitivity not configured for {crop}",
                    "recommendations": []
                }
            
            # Analyze temperature impact
            daily = weather.get("daily", {})
            temps_max = daily.get("temperature_2m_max", [])
            temps_min = daily.get("temperature_2m_min", [])
            precipitation = daily.get("precipitation_sum", [])
            
            if not temps_max:
                return self._get_neutral_impact()
            
            avg_temp_max = sum(temps_max) / len(temps_max)
            avg_temp_min = sum(temps_min) / len(temps_min)
            total_rain = sum(precipitation)
            
            # Calculate impact
            impact_analysis = self._calculate_impact(
                crop=crop,
                sensitivity=sensitivity,
                avg_temp_max=avg_temp_max,
                avg_temp_min=avg_temp_min,
                total_rain=total_rain,
                days=days
            )
            
            return {
                "crop": crop,
                "city": city,
                "forecast_days": days,
                "impact": impact_analysis["impact"],
                "severity": impact_analysis["severity"],
                "confidence": impact_analysis["confidence"],
                "message": impact_analysis["message"],
                "recommendations": impact_analysis["recommendations"],
                "weather_summary": {
                    "avg_temp_max": round(avg_temp_max, 1),
                    "avg_temp_min": round(avg_temp_min, 1),
                    "total_precipitation_mm": round(total_rain, 1),
                },
                "analyzed_at": datetime.now(timezone.utc).isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error analyzing weather impact: {e}")
            return self._get_neutral_impact()
    
    def _calculate_impact(
        self,
        crop: str,
        sensitivity: Dict,
        avg_temp_max: float,
        avg_temp_min: float,
        total_rain: float,
        days: int
    ) -> Dict[str, Any]:
        
        recommendations = []
        impact_factors = []
        
        # Temperature analysis
        opt_min = sensitivity["optimal_temp_min"]
        opt_max = sensitivity["optimal_temp_max"]
        
        temp_impact = "NEUTRAL"
        if avg_temp_max > opt_max + 5:
            temp_impact = "NEGATIVE"
            impact_factors.append("High temperature stress")
            recommendations.append("Consider irrigation to cool crops")
        elif avg_temp_max > opt_max:
            temp_impact = "MODERATE_NEGATIVE"
            impact_factors.append("Above optimal temperature")
        elif avg_temp_min < opt_min - 5:
            temp_impact = "NEGATIVE"
            impact_factors.append("Low temperature stress")
            recommendations.append("Protect crops from frost")
        elif avg_temp_min < opt_min:
            temp_impact = "MODERATE_NEGATIVE"
            impact_factors.append("Below optimal temperature")
        else:
            temp_impact = "POSITIVE"
            impact_factors.append("Optimal temperature range")
        
        # Rainfall analysis
        rain_per_day = total_rain / days
        rain_impact = "NEUTRAL"
        
        if sensitivity["rain_tolerance"] == "low":
            if rain_per_day > 10:
                rain_impact = "NEGATIVE"
                impact_factors.append("Excessive rainfall (low tolerance)")
                recommendations.append("Ensure proper drainage")
        elif sensitivity["rain_tolerance"] == "medium":
            if rain_per_day > 20:
                rain_impact = "MODERATE_NEGATIVE"
                impact_factors.append("High rainfall")
        else:  # high tolerance
            if rain_per_day < 2 and sensitivity["drought_sensitive"]:
                rain_impact = "MODERATE_NEGATIVE"
                impact_factors.append("Low rainfall (drought sensitive)")
                recommendations.append("Increase irrigation frequency")
        
        # Overall impact
        if temp_impact == "NEGATIVE" or rain_impact == "NEGATIVE":
            overall_impact = "NEGATIVE"
            severity = "high"
            confidence = 0.75
        elif temp_impact == "MODERATE_NEGATIVE" or rain_impact == "MODERATE_NEGATIVE":
            overall_impact = "MODERATE"
            severity = "medium"
            confidence = 0.65
        elif temp_impact == "POSITIVE":
            overall_impact = "POSITIVE"
            severity = "low"
            confidence = 0.80
        else:
            overall_impact = "NEUTRAL"
            severity = "low"
            confidence = 0.70
        
        # Generate message
        message = f"{crop.upper()}: " + " | ".join(impact_factors)
        
        if not recommendations:
            recommendations.append("Continue normal crop management practices")
        
        return {
            "impact": overall_impact,
            "severity": severity,
            "confidence": confidence,
            "message": message,
            "recommendations": recommendations
        }
    
    def _get_neutral_impact(self) -> Dict[str, Any]:
        return {
            "impact": "NEUTRAL",
            "severity": "low",
            "confidence": 0.50,
            "message": "Normal weather conditions expected",
            "recommendations": ["Monitor weather conditions regularly"],
            "weather_summary": {},
            "analyzed_at": datetime.now(timezone.utc).isoformat()
        }


# Singleton instance
weather_impact_service = WeatherImpactService()
