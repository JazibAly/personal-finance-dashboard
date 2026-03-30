from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import create_db_and_tables
from app import models  # noqa: F401
from app.routers import categories, dashboard, expenses, income, income_sources

app = FastAPI(title="Personal Finance Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    create_db_and_tables()


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(categories.router)
app.include_router(income_sources.router)
app.include_router(income.router)
app.include_router(expenses.router)
app.include_router(dashboard.router)
