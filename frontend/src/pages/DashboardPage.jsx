import { useEffect, useMemo, useState } from "react";

import { ExpenseCharts } from "../charts/ExpenseCharts";
import { BudgetOverview } from "../components/BudgetOverview";
import { FiltersBar } from "../components/FiltersBar";
import { FormsPanel } from "../components/FormsPanel";
import { RecentActivity } from "../components/RecentActivity";
import { SummaryCards } from "../components/SummaryCards";
import {
  createCategory,
  createExpense,
  createIncome,
  createIncomeSource,
  deleteExpense,
  deleteIncome,
  deleteIncomeSource,
  getCategories,
  getExpenses,
  getIncome,
  getIncomeSources,
  updateExpense,
  updateIncome,
  updateIncomeSource,
} from "../services/api";

const DEFAULT_USER_ID = 1;
const PERIOD_ALL = "all";

function getPeriodRange(period, customStartDate, customEndDate) {
  const now = new Date();
  const toIso = (date) => date.toISOString().slice(0, 10);

  if (period === "custom") {
    return {
      start_date: customStartDate || undefined,
      end_date: customEndDate || undefined,
    };
  }

  if (period === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start_date: toIso(start), end_date: toIso(now) };
  }

  if (period === "year") {
    const start = new Date(now.getFullYear(), 0, 1);
    return { start_date: toIso(start), end_date: toIso(now) };
  }

  if (period === "week") {
    const dayOfWeek = now.getDay();
    const shift = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const start = new Date(now);
    start.setDate(now.getDate() + shift);
    return { start_date: toIso(start), end_date: toIso(now) };
  }

  return { start_date: undefined, end_date: undefined };
}

function buildBudgetOverview(categories, expenses, userId) {
  const spentByCategory = {};
  expenses.forEach((expense) => {
    spentByCategory[expense.category_id] =
      (spentByCategory[expense.category_id] || 0) + Number(expense.amount || 0);
  });

  return {
    user_id: userId,
    categories: categories.map((category) => {
      const spent = Number(spentByCategory[category.id] || 0);
      const budget = Number(category.monthly_budget || 0);
      const utilizationPercent = budget > 0 ? (spent / budget) * 100 : 0;
      const limitReached = budget > 0 && spent >= budget;
      const exceeded = budget > 0 && spent > budget;

      return {
        category_id: category.id,
        category_name: category.name,
        budget,
        spent,
        utilization_percent: Number(utilizationPercent.toFixed(2)),
        limit_reached: limitReached,
        exceeded,
        alert: exceeded ? "BUDGET_EXCEEDED" : limitReached ? "BUDGET_LIMIT_REACHED" : null,
      };
    }),
  };
}

export function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState(PERIOD_ALL);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [categories, setCategories] = useState([]);
  const [incomeSources, setIncomeSources] = useState([]);

  async function loadDashboard() {
    setLoading(true);
    setError("");
    try {
      const dateFilters = getPeriodRange(period, customStartDate, customEndDate);
      const expenseFilters = {
        ...dateFilters,
        category_id: selectedCategoryId || undefined,
      };
      const incomeFilters = { ...dateFilters };

      const [expensesData, incomeData, categoriesData, incomeSourcesData] = await Promise.all([
        getExpenses(DEFAULT_USER_ID, expenseFilters),
        getIncome(DEFAULT_USER_ID, incomeFilters),
        getCategories(DEFAULT_USER_ID),
        getIncomeSources(DEFAULT_USER_ID),
      ]);

      setExpenses(expensesData);
      setIncome(incomeData);
      setCategories(categoriesData);
      setIncomeSources(incomeSourcesData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, [period, customStartDate, customEndDate, selectedCategoryId]);

  const summary = useMemo(() => {
    const totalIncome = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const savings = totalIncome - totalExpenses;
    return {
      total_income: Number(totalIncome.toFixed(2)),
      total_expenses: Number(totalExpenses.toFixed(2)),
      savings: Number(savings.toFixed(2)),
      remaining_balance: Number(savings.toFixed(2)),
    };
  }, [income, expenses]);

  const budgetOverview = useMemo(
    () => buildBudgetOverview(categories, expenses, DEFAULT_USER_ID),
    [categories, expenses]
  );

  const hasData = useMemo(
    () => expenses.length > 0 || budgetOverview.categories.length > 0,
    [expenses.length, budgetOverview.categories.length]
  );

  return (
    <main className="container">
      <header className="page-header">
        <h1>Personal Finance Dashboard</h1>
        <p>Track income, expenses, budgets, and spending insights in one place.</p>
      </header>

      {loading && <p>Loading dashboard...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <SummaryCards summary={summary} />
          <FiltersBar
            period={period}
            onPeriodChange={setPeriod}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCustomStartDateChange={setCustomStartDate}
            onCustomEndDateChange={setCustomEndDate}
            selectedCategoryId={selectedCategoryId}
            onSelectedCategoryIdChange={setSelectedCategoryId}
            categories={categories}
          />
          <FormsPanel
            userId={DEFAULT_USER_ID}
            categories={categories}
            incomeSources={incomeSources}
            onCreateCategory={async (payload) => {
              await createCategory(payload);
              await loadDashboard();
            }}
            onCreateExpense={async (payload) => {
              await createExpense(payload);
              await loadDashboard();
            }}
            onCreateIncomeSource={async (payload) => {
              await createIncomeSource(payload);
              await loadDashboard();
            }}
            onCreateIncome={async (payload) => {
              await createIncome(payload);
              await loadDashboard();
            }}
            onUpdateIncomeSource={async (sourceId, payload) => {
              await updateIncomeSource(sourceId, payload);
              await loadDashboard();
            }}
            onDeleteIncomeSource={async (sourceId) => {
              await deleteIncomeSource(sourceId);
              await loadDashboard();
            }}
          />
          <BudgetOverview budgetOverview={budgetOverview} />
          <RecentActivity
            expenses={expenses}
            income={income}
            categories={categories}
            incomeSources={incomeSources}
            onDeleteExpense={async (expenseId) => {
              await deleteExpense(expenseId);
              await loadDashboard();
            }}
            onDeleteIncome={async (incomeId) => {
              await deleteIncome(incomeId);
              await loadDashboard();
            }}
            onUpdateExpense={async (expenseId, payload) => {
              await updateExpense(expenseId, payload);
              await loadDashboard();
            }}
            onUpdateIncome={async (incomeId, payload) => {
              await updateIncome(incomeId, payload);
              await loadDashboard();
            }}
          />

          {hasData ? (
            <ExpenseCharts expenses={expenses} categories={categories} />
          ) : (
            <section className="panel">
              <h2>Charts and Analytics</h2>
              <p>Add expense and category data to see charts.</p>
            </section>
          )}
        </>
      )}
    </main>
  );
}
