from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas import FilmCreate, FilmResponse, FilmUpdate
from models import User, Film
from auth import get_current_active_user

router = APIRouter(prefix="/films", tags=["films"])

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

@router.get("/", status_code=status.HTTP_200_OK)
def get_all_films(db: Session = Depends(get_db)):
    return db.query(Film).all()

@router.get("/{film_id}", status_code=status.HTTP_200_OK)
def get_film_by_id(film_id: int, db: Session = Depends(get_db)):
    film = db.query(Film).filter(Film.id == film_id).first()
    if not film:
        raise HTTPException(status_code=404, detail="Film not found")
    return film