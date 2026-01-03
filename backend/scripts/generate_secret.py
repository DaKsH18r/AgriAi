#!/usr/bin/env python3
"""
Generate Secure SECRET_KEY for Production
==========================================

This script generates a cryptographically secure random SECRET_KEY
suitable for production use with JWT token signing.

Usage:
    python scripts/generate_secret.py
    
Output:
    A 64-character URL-safe base64-encoded random string

Security:
    - Uses secrets module (cryptographically secure)
    - 64 bytes = 512 bits of entropy
    - URL-safe characters only (a-zA-Z0-9_-)
    Generate a cryptographically secure secret key.
    
    Args:
        length: Number of bytes for the key (default: 64)
        
    Returns:
        URL-safe base64-encoded secret key
    """
    return secrets.token_urlsafe(length)


def print_formatted_output(key: str):
    print("\n" + "=" * 80)
    print("🔐 CRYPTOGRAPHICALLY SECURE SECRET_KEY GENERATED")
    print("=" * 80)
    print(f"\nSECRET_KEY={key}")
    print("\n" + "-" * 80)
    print("📋 INSTRUCTIONS:")
    print("-" * 80)
    print("\n1. Copy the SECRET_KEY line above")
    print("2. Paste it into your .env file:")
    print("   - Development: backend/.env")
    print("   - Production: Set as environment variable in your deployment")
    print("\n3. NEVER commit this key to git!")
    print("4. Use DIFFERENT keys for each environment:")
    print("   - Development")
    print("   - Staging")
    print("   - Production")
    print("\n5. Rotate keys periodically (every 90 days recommended)")
    print("\n" + "-" * 80)
    print("⚠️  SECURITY WARNINGS:")
    print("-" * 80)
    print("• Store this key securely (password manager, secrets vault)")
    print("• Never share this key via email, chat, or unsecured channels")
    print("• Rotate immediately if compromised")
    print("• Use environment-specific keys (never reuse across environments)")
    print("=" * 80 + "\n")


def validate_key(key: str) -> bool:
    """
    Validate that the generated key meets security requirements.
    
    Args:
        key: The generated secret key
        
    Returns:
        True if valid, False otherwise
    """
    # Length check
    if len(key) < 32:
        print(f"❌ ERROR: Key too short ({len(key)} characters, needs >= 32)")
        return False
    
    # Character variety check
    unique_chars = len(set(key))
    if unique_chars < 20:
        print(f"❌ ERROR: Insufficient randomness ({unique_chars} unique chars, needs >= 20)")
        return False
    
    # Pattern check
    insecure_patterns = ["password", "secret", "key", "test", "example"]
    key_lower = key.lower()
    for pattern in insecure_patterns:
        if pattern in key_lower:
            print(f"❌ ERROR: Key contains insecure pattern: {pattern}")
            return False
    
    return True


def main():
    try:
        # Generate key
        key = generate_secret_key(64)
        
        # Validate
        if not validate_key(key):
            print("\n❌ Generated key failed validation. Regenerating...")
            key = generate_secret_key(64)
        
        # Output
        print_formatted_output(key)
        
        # Success message
        print("✅ Secret key generated successfully!")
        print("   Length:", len(key), "characters")
        print("   Unique characters:", len(set(key)))
        print("   Entropy: ~512 bits")
        print()
        
        return 0
        
    except Exception as e:
        print(f"\n❌ Error generating secret key: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
