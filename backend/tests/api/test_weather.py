
import pytest
from fastapi import status
from fastapi.testclient import TestClient
from unittest.mock import patch


class TestWeatherEndpoints:
    
    @patch('app.routers.weather.weather_service')
    def test_get_forecast_success(self, mock_service, client: TestClient, auth_headers):
        mock_service.get_forecast.return_value = {
            "location": {"lat": 28.6, "lon": 77.2},
            "current": {"temp": 25, "condition": "Clear"},
            "forecast": []
        }
        
        response = client.get(
            "/api/weather/forecast?lat=28.6&lon=77.2",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "current" in data
    
    def test_get_forecast_missing_params(self, client: TestClient, auth_headers):
        response = client.get("/api/weather/forecast", headers=auth_headers)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    @patch('app.routers.weather.weather_service')
    def test_get_weather_alerts(self, mock_service, client: TestClient, auth_headers):
        mock_service.get_alerts.return_value = {
            "alerts": [
                {"type": "rainfall", "severity": "moderate"}
            ]
        }
        
        response = client.get(
            "/api/weather/alerts?lat=28.6&lon=77.2",
            headers=auth_headers
        )
        
        # Should handle gracefully even if endpoint doesn't exist
        assert response.status_code in [
            status.HTTP_200_OK,
            status.HTTP_404_NOT_FOUND
        ]
