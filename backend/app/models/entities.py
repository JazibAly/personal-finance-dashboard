from datetime import date, datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    password_hash: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    preferences: str = Field(default="{}", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class IncomeSource(SQLModel, table=True):
    __tablename__ = "income_sources"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class Income(SQLModel, table=True):
    __tablename__ = "income"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    source_id: int = Field(foreign_key="income_sources.id", index=True)
    amount: float
    date: date
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class Category(SQLModel, table=True):
    __tablename__ = "categories"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    name: str
    monthly_budget: float = 0
    color: str = "#8884d8"
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class Expense(SQLModel, table=True):
    __tablename__ = "expenses"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    category_id: int = Field(foreign_key="categories.id", index=True)
    amount: float
    description: Optional[str] = None
    date: date
    payment_method: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
