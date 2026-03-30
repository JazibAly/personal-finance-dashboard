from sqlmodel import Session, select

from app.models.entities import Expense, Income
from app.schemas.dashboard import DashboardSummary


def get_dashboard_summary(session: Session, user_id: int) -> DashboardSummary:
    incomes = list(session.exec(select(Income).where(Income.user_id == user_id)).all())
    expenses = list(session.exec(select(Expense).where(Expense.user_id == user_id)).all())

    total_income = float(sum(item.amount for item in incomes))
    total_expenses = float(sum(item.amount for item in expenses))
    savings = total_income - total_expenses

    return DashboardSummary(
        total_income=total_income,
        total_expenses=total_expenses,
        savings=savings,
        remaining_balance=savings,
    )
