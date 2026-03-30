from sqlmodel import Session, select

from app.models.entities import Category, Expense
from app.schemas.budget import BudgetCategoryStatus, BudgetOverview


def get_budget_overview(session: Session, user_id: int) -> BudgetOverview:
    categories = list(session.exec(select(Category).where(Category.user_id == user_id)).all())
    expenses = list(session.exec(select(Expense).where(Expense.user_id == user_id)).all())

    spent_by_category: dict[int, float] = {}
    for expense in expenses:
        spent_by_category[expense.category_id] = spent_by_category.get(expense.category_id, 0.0) + float(
            expense.amount
        )

    statuses: list[BudgetCategoryStatus] = []
    for category in categories:
        budget = float(category.monthly_budget or 0)
        spent = float(spent_by_category.get(category.id or -1, 0.0))

        if budget <= 0:
            utilization = 0.0
            limit_reached = False
            exceeded = False
            alert = None
        else:
            utilization = (spent / budget) * 100
            limit_reached = spent >= budget
            exceeded = spent > budget
            if exceeded:
                alert = "BUDGET_EXCEEDED"
            elif limit_reached:
                alert = "BUDGET_LIMIT_REACHED"
            else:
                alert = None

        statuses.append(
            BudgetCategoryStatus(
                category_id=category.id or 0,
                category_name=category.name,
                budget=budget,
                spent=spent,
                utilization_percent=round(utilization, 2),
                limit_reached=limit_reached,
                exceeded=exceeded,
                alert=alert,
            )
        )

    return BudgetOverview(user_id=user_id, categories=statuses)
