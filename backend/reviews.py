from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import ReviewCreate, ReviewResponse, ReviewUpdate
from models import User, Review
from auth import get_current_active_user

# Initialize FastAPI router for authentication routes
router = APIRouter(prefix="/reviews", tags=["reviews"])


# Endpoint for getting all reviews (admin only)
@router.get("/", status_code=status.HTTP_200_OK)
def get_all_reviews(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required.")

    reviews = db.query(Review).all()
    if not reviews:
        return []

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

# Endpoint for creating review
@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
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

# Endpoint for updating review
@router.put("/{review_id}", response_model=ReviewResponse, status_code=status.HTTP_200_OK)
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

# Endpoint for deleting review
@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
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
    
# Endpoint for getting reviews by film_id
@router.get("/film/{film_id}", status_code=status.HTTP_200_OK)
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
            "stars": review.stars
        }
        result_list.append(review_dict)

    return result_list