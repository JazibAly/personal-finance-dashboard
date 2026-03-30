from datetime import date, datetime
from typing import Optional

from sqlmodel import SQLModel


class ExpenseCreate(SQLModel):
    user_id: int
    category_id: int
    amount: float
    description: Optional[str] = None
    date: date
    payment_method: Optional[str] = None


class ExpenseRead(SQLModel):
    id: int
    user_id: int
    category_id: int
    amount: float
    description: Optional[str]
    date: date
    payment_method: Optional[str]
    created_at: datetime


class ExpenseUpdate(SQLModel):
    category_id: Optional[int] = None
    amount: Optional[float] = None
    description: Optional[str] = None
    date: Optional[date] = None
    payment_method: Optional[str] = None
