from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import UserResponse
from auth import get_current_active_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[UserResponse], status_code=status.HTTP_200_OK)
def list_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required.")

    users = db.query(User.id, User.username, User.role).all()
    # Convert SQLAlchemy row objects to dicts matching UserResponse
    return [{"id": u.id, "username": u.username, "role": u.role} for u in users]


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required.")

    if current_user.id == user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot delete your own account.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    try:
        db.delete(user)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not delete user.")
