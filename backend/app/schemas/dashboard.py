from sqlmodel import SQLModel


class DashboardSummary(SQLModel):
    total_income: float
    total_expenses: float
    savings: float
    remaining_balance: float
