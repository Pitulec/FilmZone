from fastapi import FastAPI, HTTPException, status
from database import engine, Base, get_db, SessionLocal
from models import User
from auth import get_password_hash
from config import settings
import auth
import films
import reviews

Base.metadata.create_all(bind=engine)

def create_default_admin():
    db = SessionLocal()
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        hashed_pw = get_password_hash("admin")
        new_admin = User(username="admin", hashed_password=hashed_pw, role="admin")
        db.add(new_admin)
        db.commit()
        print(">>> Utworzono domyślnego użytkownika admin/admin (role=admin)")
    else:
        print(">>> Domyślny admin już istnieje")
    db.close()

create_default_admin()

app = FastAPI()
app.include_router(auth.router)
app.include_router(films.router)
app.include_router(reviews.router)

@app.get("/", status_code=status.HTTP_200_OK)
def read_root():
    return {"message": "API is running"}
