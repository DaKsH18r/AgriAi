"""Make specific user admin and clean up other users."""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.models.user import User


def setup_admin(admin_email: str):
    """Make user admin and remove all other users."""
    db = SessionLocal()
    try:
        # Get the admin user
        admin_user = db.query(User).filter(User.email == admin_email).first()
        
        if not admin_user:
            print(f"✗ User not found: {admin_email}")
            return False
        
        # Make admin
        admin_user.is_superuser = True
        admin_user.is_active = True
        db.commit()
        print(f"✓ Made {admin_email} a superuser")
        
        # Delete all other users
        other_users = db.query(User).filter(User.email != admin_email).all()
        deleted_count = 0
        for user in other_users:
            print(f"  Deleting: {user.email}")
            db.delete(user)
            deleted_count += 1
        
        db.commit()
        print(f"✓ Deleted {deleted_count} other users")
        
        return True
    
    except Exception as e:
        print(f"✗ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("Setting up admin user...")
    print("-" * 50)
    
    ADMIN_EMAIL = "dakshsgt69@gmail.com"
    
    try:
        setup_admin(ADMIN_EMAIL)
        print("-" * 50)
        print(f"✓ {ADMIN_EMAIL} is now the only admin user")
    except Exception as e:
        print(f"✗ Failed: {e}")
        sys.exit(1)
