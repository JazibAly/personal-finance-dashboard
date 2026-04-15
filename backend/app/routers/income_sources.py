from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.database import get_session
from app.models.entities import IncomeSource, User
from app.schemas.income_source import IncomeSourceCreate, IncomeSourceRead, IncomeSourceUpdate
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/income-sources", tags=["income-sources"])


@router.post("", response_model=IncomeSourceRead)
def create_income_source(
    payload: IncomeSourceCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> IncomeSource:
    income_source = IncomeSource(**payload.model_dump(), user_id=current_user.id)
    session.add(income_source)
    session.commit()
    session.refresh(income_source)
    return income_source


@router.get("", response_model=list[IncomeSourceRead])
def get_income_sources(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> list[IncomeSource]:
    statement = select(IncomeSource).where(IncomeSource.user_id == current_user.id)
    return list(session.exec(statement).all())


@router.put("/{source_id}", response_model=IncomeSourceRead)
def update_income_source(
    source_id: int,
    payload: IncomeSourceUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> IncomeSource:
    source = session.get(IncomeSource, source_id)
    if not source or source.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Income source not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(source, key, value)

    session.add(source)
    session.commit()
    session.refresh(source)
    return source


@router.delete("/{source_id}")
def delete_income_source(
    source_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> dict[str, str]:
    source = session.get(IncomeSource, source_id)
    if not source or source.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Income source not found")

    session.delete(source)
    session.commit()
    return {"message": "Income source deleted"}
