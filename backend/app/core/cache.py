"""
Production-grade Redis caching with connection pooling, fallback, and monitoring
"""
import json
import redis
from redis.connection import ConnectionPool
from typing import Optional, Any, Callable
from functools import wraps
import hashlib
from datetime import timedelta
from app.core.config import settings
from app.core.logging_config import logger


class CacheManager:
    """
    Production-grade Redis cache manager with:
    - Connection pooling for performance
    - Automatic fallback if Redis unavailable
    - JSON serialization for complex objects
    - Cache key namespacing
    - Monitoring and metrics
    """
    
    def __init__(self):
        self._pool: Optional[ConnectionPool] = None
        self._client: Optional[redis.Redis] = None
        self._available = False
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Redis connection with connection pooling"""
        try:
            redis_url = getattr(settings, 'REDIS_URL', 'redis://redis:6379/0')
            
            # Create connection pool (reuses connections)
            self._pool = ConnectionPool.from_url(
                redis_url,
                max_connections=20,
                socket_connect_timeout=2,
                socket_timeout=2,
                retry_on_timeout=True,
                health_check_interval=30,
                decode_responses=False  # We'll handle JSON ourselves
            )
            
            # Create client from pool
            self._client = redis.Redis(connection_pool=self._pool)
            
            # Test connection
            self._client.ping()
            self._available = True
            
            logger.info("✅ Redis cache initialized successfully", endpoint="cache")
            
        except Exception as e:
            self._available = False
            logger.warning(
                f"⚠️ Redis unavailable - caching disabled (fallback mode): {str(e)}",
                exc_info=e,
                endpoint="cache"
            )
    
    def is_available(self) -> bool:
        """Check if Redis is available"""
        return self._available and self._client is not None
    
    def _make_key(self, namespace: str, key: str) -> str:
        """Create namespaced cache key"""
        return f"agri_ai:{namespace}:{key}"
    
    def get(self, namespace: str, key: str) -> Optional[Any]:
        """
        Get value from cache
        
        Args:
            namespace: Category (weather, prices, etc.)
            key: Specific identifier
            
        Returns:
            Cached value or None
        """
        if not self.is_available():
            return None
        
        try:
            cache_key = self._make_key(namespace, key)
            value = self._client.get(cache_key)
            
            if value is None:
                return None
            
            # Deserialize JSON
            result = json.loads(value.decode('utf-8'))
            
            logger.info(
                f"Cache HIT: {namespace}:{key}",
                endpoint="cache",
                cache_key=cache_key
            )
            
            return result
            
        except Exception as e:
            logger.error(
                f"Cache GET error: {namespace}:{key}",
                exc_info=e,
                endpoint="cache"
            )
            return None
    
    def set(
        self,
        namespace: str,
        key: str,
        value: Any,
        ttl: int = 3600
    ) -> bool:
        """
        Set value in cache with TTL
        
        Args:
            namespace: Category (weather, prices, etc.)
            key: Specific identifier
            value: Data to cache (must be JSON serializable)
            ttl: Time to live in seconds (default 1 hour)
            
        Returns:
            True if successful, False otherwise
        """
        if not self.is_available():
            return False
        
        try:
            cache_key = self._make_key(namespace, key)
            
            # Serialize to JSON
            serialized = json.dumps(value, default=str)
            
            # Set with expiration
            self._client.setex(
                cache_key,
                timedelta(seconds=ttl),
                serialized
            )
            
            logger.info(
                f"Cache SET: {namespace}:{key} (TTL: {ttl}s)",
                endpoint="cache",
                cache_key=cache_key,
                ttl=ttl
            )
            
            return True
            
        except Exception as e:
            logger.error(
                f"Cache SET error: {namespace}:{key}",
                exc_info=e,
                endpoint="cache"
            )
            return False
    
    def delete(self, namespace: str, key: str) -> bool:
        """Delete key from cache"""
        if not self.is_available():
            return False
        
        try:
            cache_key = self._make_key(namespace, key)
            self._client.delete(cache_key)
            
            logger.info(
                f"Cache DELETE: {namespace}:{key}",
                endpoint="cache",
                cache_key=cache_key
            )
            
            return True
            
        except Exception as e:
            logger.error(
                f"Cache DELETE error: {namespace}:{key}",
                exc_info=e,
                endpoint="cache"
            )
            return False
    
    def invalidate_pattern(self, namespace: str, pattern: str = "*") -> int:
        """
        Invalidate all keys matching pattern in namespace
        
        Args:
            namespace: Category
            pattern: Glob pattern (default: all keys)
            
        Returns:
            Number of keys deleted
        """
        if not self.is_available():
            return 0
        
        try:
            search_pattern = self._make_key(namespace, pattern)
            keys = self._client.keys(search_pattern)
            
            if keys:
                deleted = self._client.delete(*keys)
                logger.info(
                    f"Cache INVALIDATE: {namespace}:{pattern} ({deleted} keys)",
                    endpoint="cache",
                    deleted_count=deleted
                )
                return deleted
            
            return 0
            
        except Exception as e:
            logger.error(
                f"Cache INVALIDATE error: {namespace}:{pattern}",
                exc_info=e,
                endpoint="cache"
            )
            return 0
    
    def get_stats(self) -> dict:
        """Get cache statistics for monitoring"""
        if not self.is_available():
            return {
                "available": False,
                "status": "disabled"
            }
        
        try:
            info = self._client.info("stats")
            memory = self._client.info("memory")
            
            return {
                "available": True,
                "status": "healthy",
                "total_keys": self._client.dbsize(),
                "hits": info.get("keyspace_hits", 0),
                "misses": info.get("keyspace_misses", 0),
                "hit_rate": self._calculate_hit_rate(info),
                "memory_used_mb": round(memory.get("used_memory", 0) / 1024 / 1024, 2),
                "memory_peak_mb": round(memory.get("used_memory_peak", 0) / 1024 / 1024, 2),
            }
            
        except Exception as e:
            logger.error("Failed to get cache stats", exc_info=e, endpoint="cache")
            return {
                "available": True,
                "status": "error",
                "error": str(e)
            }
    
    def _calculate_hit_rate(self, stats: dict) -> float:
        """Calculate cache hit rate percentage"""
        hits = stats.get("keyspace_hits", 0)
        misses = stats.get("keyspace_misses", 0)
        total = hits + misses
        
        if total == 0:
            return 0.0
        
        return round((hits / total) * 100, 2)
    
    def health_check(self) -> bool:
        """Check if cache is healthy"""
        if not self.is_available():
            return False
        
        try:
            self._client.ping()
            return True
        except:
            return False
    
    def close(self):
        """Close Redis connection"""
        if self._pool:
            self._pool.disconnect()
            logger.info("Redis connection closed", endpoint="cache")


def cache_result(
    namespace: str,
    ttl: int = 3600,
    key_builder: Optional[Callable] = None
):
    """
    Decorator to cache function results
    
    Usage:
        @cache_result("weather", ttl=3600)
        async def get_weather(city: str):
            return await fetch_weather_api(city)
    
    Args:
        namespace: Cache namespace
        ttl: Time to live in seconds
        key_builder: Custom function to build cache key from args
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Build cache key
            if key_builder:
                cache_key = key_builder(*args, **kwargs)
            else:
                # Default: hash function args
                key_parts = [str(arg) for arg in args]
                key_parts.extend([f"{k}={v}" for k, v in sorted(kwargs.items())])
                key_str = ":".join(key_parts)
                cache_key = hashlib.md5(key_str.encode()).hexdigest()
            
            # Try to get from cache
            cached = cache_manager.get(namespace, cache_key)
            if cached is not None:
                return cached
            
            # Execute function
            result = await func(*args, **kwargs)
            
            # Cache result
            cache_manager.set(namespace, cache_key, result, ttl)
            
            return result
        
        return wrapper
    return decorator


# Global cache instance
cache_manager = CacheManager()
