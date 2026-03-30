import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

function groupByCategory(expenses, categoriesById) {
  const totals = {};
  expenses.forEach((expense) => {
    const categoryName = categoriesById[expense.category_id] || "Unknown";
    totals[categoryName] = (totals[categoryName] || 0) + Number(expense.amount || 0);
  });
  return totals;
}

function groupByMonth(expenses) {
  const totals = {};
  expenses.forEach((expense) => {
    const month = String(expense.date).slice(0, 7);
    totals[month] = (totals[month] || 0) + Number(expense.amount || 0);
  });
  return totals;
}

function groupByDay(expenses) {
  const totals = {};
  expenses.forEach((expense) => {
    const day = String(expense.date);
    totals[day] = (totals[day] || 0) + Number(expense.amount || 0);
  });
  return totals;
}

export function ExpenseCharts({ expenses, categories }) {
  const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const byCategory = groupByCategory(expenses, categoriesById);
  const byMonth = groupByMonth(expenses);
  const byDay = groupByDay(expenses);

  const pieData = {
    labels: Object.keys(byCategory),
    datasets: [
      {
        label: "Expense by Category",
        data: Object.values(byCategory),
      },
    ],
  };

  const barData = {
    labels: Object.keys(byMonth),
    datasets: [
      {
        label: "Monthly Expenses",
        data: Object.values(byMonth),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  const lineData = {
    labels: Object.keys(byDay),
    datasets: [
      {
        label: "Daily Spending Trend",
        data: Object.values(byDay),
        borderColor: "#6366f1",
        backgroundColor: "#a5b4fc",
      },
    ],
  };

  return (
    <section className="charts-grid">
      <article className="panel">
        <h2>Expense Distribution</h2>
        <Pie data={pieData} />
      </article>
      <article className="panel">
        <h2>Monthly Expenses</h2>
        <Bar data={barData} />
      </article>
      <article className="panel">
        <h2>Daily Spending Trend</h2>
        <Line data={lineData} />
      </article>
    </section>
  );
}
