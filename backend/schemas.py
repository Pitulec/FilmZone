from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
 
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    role: str = Field(..., description="User role - 'user' or 'admin'.")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=70)

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class FilmBase(BaseModel):
    poster_url: str = Field(..., min_length=10, description="URL address of the film poster.")
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    creator: str = Field(..., min_length=1, max_length=100)
    year: int = Field(..., ge=1888, description="Year the film was released.")

class FilmCreate(FilmBase):
    pass

class FilmUpdate(BaseModel):
    poster_url: Optional[str] = Field(..., min_length=10, description="URL address of the film poster.")
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    creator: Optional[str] = Field(None, min_length=1, max_length=100)
    year: Optional[int] = Field(None, ge=1888, description="Year the film was released.")

class FilmResponse(FilmBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class ReviewBase(BaseModel):
    film_id: int
    title: str
    content: str
    stars: int


class ReviewAuthor(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    content: Optional[str] = Field(None, min_length=1, max_length=400)
    stars: Optional[int] = Field(None, ge=2, le=10)

class ReviewResponse(ReviewBase):
    id: int
    film_id: int
    user_id: int

    class Config:
        from_attributes = True