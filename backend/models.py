from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, UniqueConstraint, func
from sqlalchemy.orm import relationship, column_property
from database import Base

# Users
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    
    reviews = relationship("Review", back_populates="author", cascade="all, delete-orphan")

# Films
class Film(Base):
    __tablename__ = "films"

    id = Column(Integer, primary_key=True, index=True)
    poster_url = Column(String, nullable=False)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    creator = Column(String, nullable=False)
    year = Column(Integer, nullable=False)

    reviews = relationship("Review", back_populates="film", cascade="all, delete-orphan")

# Reviews
class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    film_id = Column(Integer, ForeignKey("films.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False) 
    title = Column(String, index=True, nullable=False)
    content = Column(String, nullable=True)
    stars = Column(Integer, nullable=False)

    film = relationship("Film", back_populates="reviews")
    author = relationship("User", back_populates="reviews") 
    
    __table_args__ = (UniqueConstraint('film_id', 'user_id', name='unique_review_per_user_for_film'),)