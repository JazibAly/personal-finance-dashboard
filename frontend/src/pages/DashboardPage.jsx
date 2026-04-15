import { useEffect, useMemo, useState } from "react";

import { FiltersBar } from "../components/FiltersBar";
import { FormsPanel } from "../components/FormsPanel";
import { RecentActivity } from "../components/RecentActivity";
import { FiscalAppShell } from "../components/fiscal/FiscalAppShell";
import { FiscalBudgetLimits } from "../components/fiscal/FiscalBudgetLimits";
import {
  FiscalCategoryDonut,
  FiscalDailyTrendLine,
  FiscalMonthlyStackedChart,
} from "../components/fiscal/FiscalAnalyticsCharts";
import { FiscalSummaryCards } from "../components/fiscal/FiscalSummaryCards";
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
import { getPreviousPeriodRange, percentChange } from "../utils/periodCompare";

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

function sumAmounts(rows) {
  return rows.reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function formatDateLabel(period, customStartDate, customEndDate) {
  const now = new Date();
  if (period === "all") return "All time";
  if (period === "month") {
    return now.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }
  if (period === "year") {
    return String(now.getFullYear());
  }
  if (period === "week") {
    const dayOfWeek = now.getDay();
    const shift = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const start = new Date(now);
    start.setDate(now.getDate() + shift);
    return `Week of ${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }
  if (period === "custom" && customStartDate && customEndDate) {
    return `${customStartDate} → ${customEndDate}`;
  }
  if (period === "custom") return "Custom range";
  return "";
}

function scrollToTransactions() {
  document.getElementById("transaction-forms")?.scrollIntoView({ behavior: "smooth" });
}

function LoadingDashboard() {
  return (
    <div className="mx-auto max-w-[1440px] px-8 py-12" aria-busy="true" aria-label="Loading dashboard">
      <div className="grid gap-6">
        <div className="h-10 w-2/3 animate-pulse rounded-lg bg-[#e8ebe9]" />
        <div className="h-6 w-1/2 animate-pulse rounded-lg bg-[#e8ebe9]" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-white shadow-sm" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="h-96 animate-pulse rounded-xl bg-white xl:col-span-2" />
          <div className="h-96 animate-pulse rounded-xl bg-white" />
        </div>
      </div>
    </div>
  );
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
  const [prevIncomeTotal, setPrevIncomeTotal] = useState(null);
  const [prevExpenseTotal, setPrevExpenseTotal] = useState(null);

  async function loadDashboard() {
    setLoading(true);
    setError("");
    setPrevIncomeTotal(null);
    setPrevExpenseTotal(null);
    try {
      const dateFilters = getPeriodRange(period, customStartDate, customEndDate);
      const expenseFilters = {
        ...dateFilters,
        category_id: selectedCategoryId || undefined,
      };
      const incomeFilters = { ...dateFilters };

      const prevRange = getPreviousPeriodRange(period, customStartDate, customEndDate);
      const prevExpenseFilters = prevRange
        ? {
            ...prevRange,
            category_id: selectedCategoryId || undefined,
          }
        : null;

      const requests = [
        getExpenses(DEFAULT_USER_ID, expenseFilters),
        getIncome(DEFAULT_USER_ID, incomeFilters),
        getCategories(DEFAULT_USER_ID),
        getIncomeSources(DEFAULT_USER_ID),
      ];

      if (prevRange) {
        requests.push(getIncome(DEFAULT_USER_ID, prevRange));
        requests.push(getExpenses(DEFAULT_USER_ID, prevExpenseFilters));
      }

      const results = await Promise.all(requests);

      const [expensesData, incomeData, categoriesData, incomeSourcesData] = results;
      setExpenses(expensesData);
      setIncome(incomeData);
      setCategories(categoriesData);
      setIncomeSources(incomeSourcesData);

      if (prevRange) {
        const prevIncomeData = results[4];
        const prevExpenseData = results[5];
        setPrevIncomeTotal(sumAmounts(prevIncomeData));
        setPrevExpenseTotal(sumAmounts(prevExpenseData));
      }
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

  const incomeTrendPct = useMemo(() => {
    if (prevIncomeTotal === null || period === "all") return null;
    return percentChange(summary.total_income, prevIncomeTotal);
  }, [summary.total_income, prevIncomeTotal, period]);

  const expenseTrendPct = useMemo(() => {
    if (prevExpenseTotal === null || period === "all") return null;
    return percentChange(summary.total_expenses, prevExpenseTotal);
  }, [summary.total_expenses, prevExpenseTotal, period]);

  const savingsRatePercent = useMemo(() => {
    if (summary.total_income <= 0) return null;
    return (summary.savings / summary.total_income) * 100;
  }, [summary.savings, summary.total_income]);

  const dateLabel = formatDateLabel(period, customStartDate, customEndDate);

  return (
    <FiscalAppShell
      headerMode="date"
      dateLabel={dateLabel}
      avatarVariant="default"
      onAddTransaction={scrollToTransactions}
    >
      {loading && <LoadingDashboard />}
      {error && (
        <div className="mx-auto max-w-[1440px] px-8 py-6">
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 sm:gap-12 sm:px-8 py-8 sm:py-12">
          <header className="flex flex-col gap-2">
            <h1 className="font-['Manrope',system-ui,sans-serif] text-4xl font-extrabold leading-10 tracking-[-0.9px] text-[#003526]">
              Intelligence Overview
            </h1>
            <p className="max-w-2xl text-base font-medium leading-6 text-[#404944]">
              Your financial health is curated and optimized for the current quarter.
            </p>
          </header>

          <FiscalSummaryCards
            totalIncome={summary.total_income}
            totalExpenses={summary.total_expenses}
            savings={summary.savings}
            savingsRatePercent={savingsRatePercent}
            incomeTrendPct={incomeTrendPct}
            expenseTrendPct={expenseTrendPct}
          />

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
            className="border-[#e8ebe9] shadow-[0px_12px_32px_0px_rgba(6,78,59,0.04)]"
          />

          <div className="grid gap-8 xl:grid-cols-3">
            <FiscalMonthlyStackedChart expenses={expenses} categories={categories} />
            <FiscalCategoryDonut expenses={expenses} categories={categories} />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <FiscalDailyTrendLine expenses={expenses} />
            <FiscalBudgetLimits budgetOverview={budgetOverview} />
          </div>

          
        </div>
      )}
    </FiscalAppShell>
  );
}
