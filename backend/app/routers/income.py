from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.database import get_session
from app.models.entities import Income, User
from app.schemas.income import IncomeCreate, IncomeRead, IncomeUpdate
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/income", tags=["income"])


@router.post("", response_model=IncomeRead)
def create_income(
    payload: IncomeCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Income:
    income = Income(**payload.model_dump(), user_id=current_user.id)
    session.add(income)
    session.commit()
    session.refresh(income)
    return income


@router.get("", response_model=list[IncomeRead])
def get_income(
    start_date: Optional[date] = Query(default=None),
    end_date: Optional[date] = Query(default=None),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> list[Income]:
    statement = select(Income).where(Income.user_id == current_user.id)

    if start_date:
        statement = statement.where(Income.date >= start_date)
    if end_date:
        statement = statement.where(Income.date <= end_date)

    return list(session.exec(statement).all())


@router.put("/{income_id}", response_model=IncomeRead)
def update_income(
    income_id: int,
    payload: IncomeUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Income:
    income = session.get(Income, income_id)
    if not income or income.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Income not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(income, key, value)

    session.add(income)
    session.commit()
    session.refresh(income)
    return income


@router.delete("/{income_id}")
def delete_income(
    income_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> dict[str, str]:
    income = session.get(Income, income_id)
    if not income or income.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Income not found")

    session.delete(income)
    session.commit()
    return {"message": "Income deleted"}
