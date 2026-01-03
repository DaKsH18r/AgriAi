import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash


def create_superuser(email: str, password: str, full_name: str = "Admin User"):
    db = SessionLocal()
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            if existing_user.is_superuser:
                print(f"✓ Superuser already exists: {email}")
                return existing_user
            else:
                # Upgrade existing user to superuser
                existing_user.is_superuser = True
                db.commit()
                print(f"✓ Upgraded existing user to superuser: {email}")
                return existing_user
        
        # Create new superuser
        superuser = User(
            email=email,
            full_name=full_name,
            hashed_password=get_password_hash(password),
            is_active=True,
            is_superuser=True
        )
        db.add(superuser)
        db.commit()
        db.refresh(superuser)
        print(f"✓ Created new superuser: {email}")
        return superuser
    
    except Exception as e:
        print(f"✗ Error creating superuser: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("Creating superuser account...")
    print("-" * 50)
    
    # Default superuser credentials (change in production!)
    EMAIL = "admin@agriplatform.com"
    PASSWORD = "Admin@123456"
    FULL_NAME = "Platform Administrator"
    
    try:
        superuser = create_superuser(EMAIL, PASSWORD, FULL_NAME)
        print("-" * 50)
        print("Superuser credentials:")
        print(f"  Email: {EMAIL}")
        print(f"  Password: {PASSWORD}")
        print("-" * 50)
        print("⚠ WARNING: Change the password after first login!")
    except Exception as e:
        print(f"Failed to create superuser: {e}")
        sys.exit(1)
