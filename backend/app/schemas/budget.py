from sqlmodel import SQLModel


class BudgetCategoryStatus(SQLModel):
    category_id: int
    category_name: str
    budget: float
    spent: float
    utilization_percent: float
    limit_reached: bool
    exceeded: bool
    alert: str | None = None


class BudgetOverview(SQLModel):
    user_id: int
    categories: list[BudgetCategoryStatus]
