from datetime import date, datetime
from typing import Optional

from sqlmodel import SQLModel


class IncomeCreate(SQLModel):
    source_id: int
    amount: float
    date: date
    description: Optional[str] = None


class IncomeRead(SQLModel):
    id: int
    user_id: int
    source_id: int
    amount: float
    date: date
    description: Optional[str]
    created_at: datetime


class IncomeUpdate(SQLModel):
    source_id: Optional[int] = None
    amount: Optional[float] = None
    date: Optional[date] = None
    description: Optional[str] = None
