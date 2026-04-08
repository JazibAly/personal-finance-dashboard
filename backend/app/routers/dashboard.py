from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.database import get_session
from app.models.entities import User
from app.schemas.budget import BudgetOverview
from app.schemas.dashboard import DashboardSummary
from app.services.budget_service import get_budget_overview
from app.services.dashboard_service import get_dashboard_summary
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def dashboard_summary(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> DashboardSummary:
    return get_dashboard_summary(session=session, user_id=current_user.id)


@router.get("/budget-overview", response_model=BudgetOverview)
def dashboard_budget_overview(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> BudgetOverview:
    return get_budget_overview(session=session, user_id=current_user.id)
