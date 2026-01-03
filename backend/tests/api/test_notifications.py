"""
Tests for notification endpoints.

Tests cover:
- Getting user notifications
- Marking notifications as read
- Deleting notifications
- Notification filtering
"""

import pytest
from fastapi import status
from fastapi.testclient import TestClient


class TestGetNotifications:
    
    @pytest.mark.api
    def test_get_notifications_success(self, client: TestClient, auth_headers, sample_notification):
        response = client.get(
            "/api/notifications/",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert data[0]["title"] == "Test Notification"
    
    @pytest.mark.api
    def test_get_notifications_unauthenticated(self, client: TestClient):
        response = client.get("/api/notifications/")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    @pytest.mark.api
    def test_get_unread_notifications_only(self, client: TestClient, auth_headers, sample_notification):
        response = client.get(
            "/api/notifications/",
            params={"unread_only": True},
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        for notification in data:
            assert notification["is_read"] == False


class TestMarkNotificationsRead:
    
    @pytest.mark.api
    def test_mark_notification_read(self, client: TestClient, auth_headers, sample_notification):
        response = client.post(
            "/api/notifications/mark-read",
            headers=auth_headers,
            json={"notification_ids": [sample_notification.id]}
        )
        
        assert response.status_code == status.HTTP_200_OK
        assert "marked" in response.json()["message"].lower()
    
    @pytest.mark.api
    def test_mark_all_read(self, client: TestClient, auth_headers, sample_notification):
        response = client.post(
            "/api/notifications/mark-all-read",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK


class TestUnreadCount:
    
    @pytest.mark.api
    def test_get_unread_count(self, client: TestClient, auth_headers, sample_notification):
        response = client.get(
            "/api/notifications/unread-count",
            headers=auth_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "unread_count" in data
        assert isinstance(data["unread_count"], int)
        assert data["unread_count"] >= 0
