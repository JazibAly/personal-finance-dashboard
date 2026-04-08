from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select

from app.database import get_session
from app.models.entities import Category, User
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("", response_model=CategoryRead)
def create_category(
    payload: CategoryCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Category:
    category = Category(**payload.model_dump(), user_id=current_user.id)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


@router.get("", response_model=list[CategoryRead])
def get_categories(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> list[Category]:
    statement = select(Category).where(Category.user_id == current_user.id)
    return list(session.exec(statement).all())


@router.put("/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Category:
    category = session.get(Category, category_id)
    if not category or category.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Category not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)

    session.add(category)
    session.commit()
    session.refresh(category)
    return category


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> dict[str, str]:
    category = session.get(Category, category_id)
    if not category or category.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Category not found")

    session.delete(category)
    session.commit()
    return {"message": "Category deleted"}
