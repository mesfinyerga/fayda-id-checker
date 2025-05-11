from app.db.session import engine
from app.models import user

def init():
    print("🛠 Creating tables...")
    user.Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully.")

if __name__ == "__main__":
    init()
