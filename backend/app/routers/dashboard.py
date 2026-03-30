from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from app.database import get_session
from app.schemas.budget import BudgetOverview
from app.schemas.dashboard import DashboardSummary
from app.services.budget_service import get_budget_overview
from app.services.dashboard_service import get_dashboard_summary

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def dashboard_summary(
    user_id: int = Query(...), session: Session = Depends(get_session)
) -> DashboardSummary:
    return get_dashboard_summary(session=session, user_id=user_id)


@router.get("/budget-overview", response_model=BudgetOverview)
def dashboard_budget_overview(
    user_id: int = Query(...), session: Session = Depends(get_session)
) -> BudgetOverview:
    return get_budget_overview(session=session, user_id=user_id)
