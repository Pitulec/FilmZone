from fastapi import FastAPI, HTTPException, status
from database import engine, Base, get_db
from models import User, Film, Review

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/", status_code=status.HTTP_200_OK)
def read_root():
    return {"message": "API is running"}