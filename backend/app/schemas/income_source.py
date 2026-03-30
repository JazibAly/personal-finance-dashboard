from datetime import datetime

from sqlmodel import SQLModel


class IncomeSourceCreate(SQLModel):
    user_id: int
    name: str


class IncomeSourceRead(SQLModel):
    id: int
    user_id: int
    name: str
    created_at: datetime


class IncomeSourceUpdate(SQLModel):
    name: str | None = None
