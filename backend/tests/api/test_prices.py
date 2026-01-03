
import pytest
from fastapi import status
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock


class TestPriceEndpoints:
    
    @patch('app.routers.prices.price_service')
    def test_get_current_price_success(self, mock_service, client: TestClient, auth_headers):
        mock_service.get_current_price.return_value = {
            "crop": "wheat",
            "price": 2500.00,
            "unit": "quintal",
            "market": "Delhi",
            "date": "2024-01-01"
        }
        
        response = client.get("/api/prices/current/wheat", headers=auth_headers)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["crop"] == "wheat"
        assert data["price"] == 2500.00
    
    @patch('app.routers.prices.price_service')
    def test_get_historical_prices_success(self, mock_service, client: TestClient, auth_headers):
        mock_service.get_historical_prices.return_value = [
            {"date": "2024-01-01", "price": 2500},
            {"date": "2024-01-02", "price": 2550}
        ]
        
        response = client.get(
            "/api/prices/history/wheat?days=30",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 2
    
    @patch('app.routers.prices.price_service')
    def test_get_price_trends(self, mock_service, client: TestClient, auth_headers):
        mock_service.analyze_trends.return_value = {
            "trend": "increasing",
            "change_percent": 5.2,
            "prediction": "bullish"
        }
        
        response = client.get(
            "/api/prices/trends/wheat",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "trend" in data
