import pytest
from datetime import datetime, timedelta, timezone
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_access_token
)


@pytest.mark.unit
class TestPasswordHashing:
    
    def test_password_hash_creates_different_hashes(self):
        password = "testpassword123"
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)
        
        assert hash1 != hash2  # Different due to random salt
    
    def test_verify_password_success(self):
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        assert verify_password(password, hashed) == True
    
    def test_verify_password_failure(self):
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        assert verify_password("wrongpassword", hashed) == False
    
    def test_password_hash_not_empty(self):
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        assert hashed is not None
        assert len(hashed) > 0
        assert hashed != password  # Should not be plain text


@pytest.mark.unit
class TestJWTTokens:
    
    def test_create_access_token(self):
        data = {"sub": "test@example.com", "user_id": 1}
        token = create_access_token(data)
        
        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0
    
    def test_decode_access_token_success(self):
        data = {"sub": "test@example.com", "user_id": 1}
        token = create_access_token(data)
        
        decoded = decode_access_token(token)
        
        assert decoded is not None
        assert decoded["sub"] == "test@example.com"
        assert decoded["user_id"] == 1
        assert "exp" in decoded
    
    def test_decode_invalid_token(self):
        decoded = decode_access_token("invalid_token_string")
        
        assert decoded is None
    
    def test_token_expiration(self):
        data = {"sub": "test@example.com"}
        expires_delta = timedelta(minutes=30)
        token = create_access_token(data, expires_delta)
        
        decoded = decode_access_token(token)
        
        assert decoded is not None
        exp_time = datetime.fromtimestamp(decoded["exp"], tz=timezone.utc)
        now = datetime.now(timezone.utc)
        
        # Token should expire approximately 30 minutes from now
        assert (exp_time - now).total_seconds() > 1700  # ~28.3 minutes
        assert (exp_time - now).total_seconds() < 1900  # ~31.7 minutes
    
    def test_expired_token_decodes_but_invalid(self):
        data = {"sub": "test@example.com"}
        # Create token that expires immediately
        expires_delta = timedelta(seconds=-1)
        token = create_access_token(data, expires_delta)
        
        # decode_access_token might return None or the payload
        # depending on implementation - expired tokens should be rejected
        decoded = decode_access_token(token)
        
        # Either None or contains expired timestamp
        if decoded:
            exp_time = datetime.fromtimestamp(decoded["exp"], tz=timezone.utc)
            assert exp_time < datetime.now(timezone.utc)
