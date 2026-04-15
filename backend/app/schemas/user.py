from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel

class UserCreate(SQLModel):
    email: str
    password: str

class UserResponse(SQLModel):
    id: int
    email: str
    created_at: datetime

class Token(SQLModel):
    access_token: str
    token_type: str

class TokenData(SQLModel):
    id: Optional[str] = None

class UserSettings(SQLModel):
    preferences: Optional[str] = None

class UserUpdate(SQLModel):
    email: Optional[str] = None
    password: Optional[str] = None
    preferences: Optional[str] = None
