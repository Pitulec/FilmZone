from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
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
    admin = db.query(User).filter(User.username == "adminadmin").first()
    if not admin:
        hashed_pw = get_password_hash("adminadmin")
        new_admin = User(username="adminadmin", hashed_password=hashed_pw, role="admin")
        db.add(new_admin)
        db.commit()
        print(">>> Created default admin user adminadmin/adminadmin (role=admin)")
    else:
        print(">>> Default admin user already exists")
    db.close()

create_default_admin()

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(films.router)
app.include_router(reviews.router)

@app.get("/", status_code=status.HTTP_200_OK)
def read_root():
    return {"message": "API is running"}
