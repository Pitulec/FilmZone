from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from schemas import (
    FilmCreate,
    FilmResponse,
    FilmUpdate,
    UserResponse,
    UserBase,
    UserCreate,
    ReviewCreate,
    ReviewResponse,
    ReviewUpdate,
)
from models import User, Film, Review
from auth import get_current_active_user, get_password_hash

# Initialize FastAPI routers
router = APIRouter(prefix="/films", tags=["films"])
users_router = APIRouter(prefix="/users", tags=["users"])
reviews_router = APIRouter(prefix="/reviews", tags=["reviews"])

# Endpoint for creating film
@router.post("/", response_model=FilmResponse, status_code=status.HTTP_201_CREATED)
def create_film(film: FilmCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Only Admin can create film")
    else:
        try:
            db_film = Film(**film.model_dump())
            db.add(db_film)
            db.commit()
            db.refresh(db_film)
            return db_film
        except Exception as e:
            db.rollback() 
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Database error: Could not create film due to data or constraint violation.")

# Endpoint for updating film
@router.put("/{film_id}", response_model=FilmResponse, status_code=status.HTTP_200_OK)
def update_film(film_id: int, film_data: FilmUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only Admin can update films.")

    db_film = db.query(Film).filter(Film.id == film_id).first()
    if db_film is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Film with ID {film_id} not found.")
    
    try:
        update_data = film_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_film, key, value)
        db.commit()
        db.refresh(db_film)
        return db_film
    except Exception:
        db.rollback() 
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Database error: Could not update film due to data or constraint violation."
        )
    
# Endpoint for deleting film
@router.delete("/{film_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_film(film_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only Admin can delete films.")

    db_film = db.query(Film).filter(Film.id == film_id).first()
    if db_film is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Film with ID {film_id} not found.")
    
    try:
        db.delete(db_film)
        db.commit()
        return
    except Exception:
        db.rollback() 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Database error: Could not delete film."
        )

# Endpoint for getting all films
@router.get("/", status_code=status.HTTP_200_OK)
def get_all_films(db: Session = Depends(get_db)):
    return db.query(Film).all()

# Endpoint for getting film by id
@router.get("/{film_id}", status_code=status.HTTP_200_OK)
def get_film_by_id(film_id: int, db: Session = Depends(get_db)):
    film = db.query(Film).filter(Film.id == film_id).first()
    if not film:
        raise HTTPException(status_code=404, detail="Film not found")
    return film


#################################################################
# Users endpoints (admin)
#################################################################


@users_router.get("/", response_model=List[UserResponse], status_code=status.HTTP_200_OK)
def list_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return db.query(User).all()


@users_router.get("/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@users_router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    existing = db.query(User).filter(User.username == user_in.username).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
    try:
        hashed = get_password_hash(user_in.password)
        new_user = User(username=user_in.username, hashed_password=hashed, role=user_in.role)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not create user")


@users_router.put("/{user_id}", response_model=UserResponse, status_code=status.HTTP_200_OK)
def update_user(user_id: int, user_in: UserBase, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.username = user_in.username
    user.role = user_in.role
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@users_router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    try:
        db.delete(user)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not delete user")


#################################################################
# Reviews endpoints
#################################################################


@reviews_router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(review: ReviewCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        db_review = Review(**review.model_dump())
        db_review.user_id = current_user.id
        db.add(db_review)
        db.commit()
        db.refresh(db_review)
        return db_review
    except Exception:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not create review.")


@reviews_router.put("/{review_id}", response_model=ReviewResponse, status_code=status.HTTP_200_OK)
def update_review(review_id: int, review_data: ReviewUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if db_review is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found.")
    if db_review.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only update your own reviews unless you are an admin.")

    try:
        update_data = review_data.model_dump(exclude_unset=True)
        if "user_id" in update_data:
            update_data.pop("user_id")
        for key, value in update_data.items():
            setattr(db_review, key, value)
        db.commit()
        db.refresh(db_review)
        return db_review
    except Exception:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not update review.")


@reviews_router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(review_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if db_review is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found.")
    if db_review.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only delete your own reviews unless you are an admin.")
    try:
        db.delete(db_review)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not delete review.")


@reviews_router.get("/film/{film_id}", status_code=status.HTTP_200_OK)
def get_reviews_by_film_id(film_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.film_id == film_id).all()
    if not reviews:
        raise HTTPException(status_code=404, detail="Reviews not found")

    user_ids = [r.user_id for r in reviews]
    users_data = db.query(User.id, User.username).filter(User.id.in_(user_ids)).all()
    username_map = {user.id: user.username for user in users_data}

    result_list = []
    for review in reviews:
        review_dict = {
            "id": review.id,
            "film_id": review.film_id,
            "user_id": review.user_id,
            "username": username_map.get(review.user_id, "Unknown User"),
            "title": review.title,
            "content": review.content,
            "stars": review.stars,
        }
        result_list.append(review_dict)

    return result_list


@reviews_router.get("/", status_code=status.HTTP_200_OK)
def list_reviews(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    reviews = db.query(Review).all()
    result_list = []
    if not reviews:
        return result_list
    user_ids = [r.user_id for r in reviews]
    users_data = db.query(User.id, User.username).filter(User.id.in_(user_ids)).all()
    username_map = {user.id: user.username for user in users_data}

    for review in reviews:
        review_dict = {
            "id": review.id,
            "film_id": review.film_id,
            "user_id": review.user_id,
            "username": username_map.get(review.user_id, "Unknown User"),
            "title": review.title,
            "content": review.content,
            "stars": review.stars,
        }
        result_list.append(review_dict)

    return result_list


@reviews_router.get("/{review_id}", status_code=status.HTTP_200_OK)
def get_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    user = db.query(User.id, User.username).filter(User.id == review.user_id).first()
    username = user.username if user else "Unknown User"
    return {
        "id": review.id,
        "film_id": review.film_id,
        "user_id": review.user_id,
        "username": username,
        "title": review.title,
        "content": review.content,
        "stars": review.stars,
    }