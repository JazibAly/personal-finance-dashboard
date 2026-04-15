from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel


class CategoryCreate(SQLModel):
    name: str
    monthly_budget: float = 0
    color: str = "#8884d8"


class CategoryUpdate(SQLModel):
    name: Optional[str] = None
    monthly_budget: Optional[float] = None
    color: Optional[str] = None


class CategoryRead(SQLModel):
    id: int
    user_id: int
    name: str
    monthly_budget: float
    color: str
    created_at: datetime
