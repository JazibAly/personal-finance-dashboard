from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.database import get_session
from app.models.entities import Expense, User
from app.schemas.expense import ExpenseCreate, ExpenseRead, ExpenseUpdate
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.post("", response_model=ExpenseRead)
def create_expense(
    payload: ExpenseCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Expense:
    expense = Expense(**payload.model_dump(), user_id=current_user.id)
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense


@router.get("", response_model=list[ExpenseRead])
def get_expenses(
    category_id: Optional[int] = Query(default=None),
    start_date: Optional[date] = Query(default=None),
    end_date: Optional[date] = Query(default=None),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> list[Expense]:
    statement = select(Expense).where(Expense.user_id == current_user.id)

    if category_id is not None:
        statement = statement.where(Expense.category_id == category_id)
    if start_date:
        statement = statement.where(Expense.date >= start_date)
    if end_date:
        statement = statement.where(Expense.date <= end_date)

    return list(session.exec(statement).all())


@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> dict[str, str]:
    expense = session.get(Expense, expense_id)
    if not expense or expense.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Expense not found")

    session.delete(expense)
    session.commit()
    return {"message": "Expense deleted"}


@router.put("/{expense_id}", response_model=ExpenseRead)
def update_expense(
    expense_id: int,
    payload: ExpenseUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Expense:
    expense = session.get(Expense, expense_id)
    if not expense or expense.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Expense not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(expense, key, value)

    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense
