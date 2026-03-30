from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.database import get_session
from app.models.entities import Income
from app.schemas.income import IncomeCreate, IncomeRead, IncomeUpdate

router = APIRouter(prefix="/income", tags=["income"])


@router.post("", response_model=IncomeRead)
def create_income(payload: IncomeCreate, session: Session = Depends(get_session)) -> Income:
    income = Income.model_validate(payload)
    session.add(income)
    session.commit()
    session.refresh(income)
    return income


@router.get("", response_model=list[IncomeRead])
def get_income(
    user_id: int = Query(...),
    start_date: Optional[date] = Query(default=None),
    end_date: Optional[date] = Query(default=None),
    session: Session = Depends(get_session),
) -> list[Income]:
    statement = select(Income).where(Income.user_id == user_id)

    if start_date:
        statement = statement.where(Income.date >= start_date)
    if end_date:
        statement = statement.where(Income.date <= end_date)

    return list(session.exec(statement).all())


@router.put("/{income_id}", response_model=IncomeRead)
def update_income(
    income_id: int, payload: IncomeUpdate, session: Session = Depends(get_session)
) -> Income:
    income = session.get(Income, income_id)
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(income, key, value)

    session.add(income)
    session.commit()
    session.refresh(income)
    return income


@router.delete("/{income_id}")
def delete_income(income_id: int, session: Session = Depends(get_session)) -> dict[str, str]:
    income = session.get(Income, income_id)
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")

    session.delete(income)
    session.commit()
    return {"message": "Income deleted"}
