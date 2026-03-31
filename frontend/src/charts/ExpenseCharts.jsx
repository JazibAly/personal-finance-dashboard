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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 10,
        font: { size: 11, family: "'Plus Jakarta Sans', 'Inter', sans-serif" },
        color: "#64748b",
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "#64748b", font: { size: 11 } },
      grid: { color: "rgba(148, 163, 184, 0.2)" },
    },
    y: {
      ticks: { color: "#64748b", font: { size: 11 } },
      grid: { color: "rgba(148, 163, 184, 0.2)" },
    },
  },
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 10,
        font: { size: 11, family: "'Plus Jakarta Sans', 'Inter', sans-serif" },
        color: "#64748b",
      },
    },
  },
};

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

const palette = ["#2563eb", "#059669", "#7c3aed", "#ea580c", "#e11d48", "#0ea5e9", "#ca8a04"];

export function ExpenseCharts({ expenses, categories }) {
  const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const byCategory = groupByCategory(expenses, categoriesById);
  const byMonth = groupByMonth(expenses);
  const byDay = groupByDay(expenses);

  const categoryLabels = Object.keys(byCategory);
  const pieData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Expense by category",
        data: Object.values(byCategory),
        backgroundColor: categoryLabels.map((_, i) => palette[i % palette.length]),
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: Object.keys(byMonth),
    datasets: [
      {
        label: "Monthly expenses",
        data: Object.values(byMonth),
        backgroundColor: "#93c5fd",
        borderRadius: 8,
      },
    ],
  };

  const lineData = {
    labels: Object.keys(byDay),
    datasets: [
      {
        label: "Daily spending trend",
        data: Object.values(byDay),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  return (
    <section className="grid gap-4 xl:grid-cols-1" aria-label="Charts and analytics">
      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <h2 className="text-base font-semibold text-ink">Expense distribution</h2>
        <p className="mt-1 text-xs text-ink-muted">Share of spending by category.</p>
        <div className="mt-4 h-64">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </article>
      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <h2 className="text-base font-semibold text-ink">Monthly expenses</h2>
        <p className="mt-1 text-xs text-ink-muted">Totals grouped by calendar month.</p>
        <div className="mt-4 h-64">
          <Bar data={barData} options={chartOptions} />
        </div>
      </article>
      <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <h2 className="text-base font-semibold text-ink">Daily spending trend</h2>
        <p className="mt-1 text-xs text-ink-muted">Expense amounts by day in the filtered range.</p>
        <div className="mt-4 h-64">
          <Line data={lineData} options={chartOptions} />
        </div>
      </article>
    </section>
  );
}
