import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import {
  groupExpensesByMonthFixedVariable,
  lastNMonthKeys,
  spendingByWeekOfMonth,
} from "../../utils/expenseAggregates";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Filler
);

const COLORS = {
  forest: "#003526",
  mint: "#a6f2d1",
  peach: "#ffdbca",
};

function categoryTotals(expenses, categoriesById) {
  const totals = {};
  expenses.forEach((e) => {
    const name = categoriesById[e.category_id] ?? categoriesById[String(e.category_id)] ?? "Other";
    totals[name] = (totals[name] || 0) + Number(e.amount || 0);
  });
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
}

export function FiscalMonthlyStackedChart({ expenses, categories }) {
  const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const byMonth = groupExpensesByMonthFixedVariable(expenses, categoriesById);
  const monthKeys = lastNMonthKeys(6);
  const fixedData = monthKeys.map((m) => byMonth[m.key]?.fixed ?? 0);
  const variableData = monthKeys.map((m) => byMonth[m.key]?.variable ?? 0);

  const data = {
    labels: monthKeys.map((m) => m.label),
    datasets: [
      {
        label: "Fixed",
        data: fixedData,
        backgroundColor: COLORS.forest,
        borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 8, bottomRight: 8 },
        borderSkipped: false,
        stack: "stack0",
      },
      {
        label: "Variable",
        data: variableData,
        backgroundColor: COLORS.mint,
        borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: false,
        stack: "stack0",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: $${Number(ctx.raw || 0).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: "#404944", font: { size: 12, weight: "600" } },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: { color: "rgba(148, 163, 184, 0.2)" },
        ticks: {
          color: "#64748b",
          callback: (v) => `$${v}`,
        },
      },
    },
    interaction: { mode: "index", intersect: false },
  };

  return (
    <article className="rounded-xl bg-white p-8 shadow-[0px_12px_32px_0px_rgba(6,78,59,0.04)] xl:col-span-2">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-['Manrope',system-ui,sans-serif] text-xl font-bold leading-7 text-[#003526]">
            Monthly Expenses Trend
          </h2>
          <p className="mt-1 text-sm text-[#404944]">Comparative analysis across the last 6 months</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#404944]">
            <span className="size-3 rounded-full bg-[#003526]" aria-hidden />
            Fixed
          </span>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#404944]">
            <span className="size-3 rounded-full bg-[#a6f2d1]" aria-hidden />
            Variable
          </span>
        </div>
      </div>
      <div className="mt-8 h-64">
        <Bar data={data} options={options} />
      </div>
    </article>
  );
}

export function FiscalCategoryDonut({ expenses, categories }) {
  const categoriesById = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const top = categoryTotals(expenses, categoriesById);
  const labels = top.map(([name]) => name);
  const values = top.map(([, v]) => v);
  const total = values.reduce((a, b) => a + b, 0);
  const palette = [COLORS.forest, COLORS.mint, COLORS.peach];

  const data = {
    labels,
    datasets: [
      {
        data: values.length ? values : [1],
        backgroundColor: values.length ? labels.map((_, i) => palette[i % palette.length]) : ["#e2e8f0"],
        borderWidth: 0,
      },
    ],
  };

  const centerLabel =
    total > 0
      ? `$${(total / 1000).toFixed(1)}k`
      : "$0";

  return (
    <article className="relative flex min-h-[492px] flex-col rounded-xl bg-white p-8 shadow-[0px_12px_32px_0px_rgba(6,78,59,0.04)]">
      <h2 className="font-['Manrope',system-ui,sans-serif] text-xl font-bold leading-7 text-[#003526]">
        Spending by Category
      </h2>
      <p className="mt-1 text-sm text-[#404944]">Major allocations for the selected period</p>

      <div className="relative mx-auto mt-8 flex h-[220px] w-[220px] items-center justify-center">
        <Doughnut
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: "72%",
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const v = ctx.raw || 0;
                    return `${ctx.label}: $${Number(v).toFixed(2)}`;
                  },
                },
              },
            },
          }}
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-2xl font-semibold text-[#003526]">{centerLabel}</p>
          <p className="text-[10px] font-semibold uppercase tracking-[-0.5px] text-[#404944]">Total Burn</p>
        </div>
      </div>

      <ul className="mt-8 flex flex-col gap-3">
        {top.length === 0 ? (
          <li className="text-sm text-[#404944]">No expense data for this period.</li>
        ) : (
          top.map(([name, v], i) => (
            <li key={name} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2 font-medium text-[#191c1e]">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: palette[i % palette.length] }}
                  aria-hidden
                />
                {name}
              </span>
              <span className="font-semibold text-[#191c1e]">${Number(v).toFixed(0)}</span>
            </li>
          ))
        )}
      </ul>
    </article>
  );
}

export function FiscalDailyTrendLine({ expenses }) {
  const byWeek = spendingByWeekOfMonth(expenses);
  const max = Math.max(...byWeek, 1);
  const peakIdx = byWeek.indexOf(max) + 1;

  const data = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Spending",
        data: byWeek,
        borderColor: COLORS.forest,
        backgroundColor: "rgba(0, 53, 38, 0.08)",
        fill: true,
        tension: 0.45,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${Number(ctx.raw || 0).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#404944", font: { size: 10, weight: "600" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148, 163, 184, 0.2)" },
        ticks: {
          color: "#64748b",
          callback: (v) => `$${v}`,
        },
      },
    },
  };

  return (
    <article className="flex flex-col gap-10 rounded-xl bg-[#f2f4f6] p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-['Manrope',system-ui,sans-serif] text-xl font-bold leading-7 text-[#003526]">
          Daily Spending Trend
        </h2>
        <span className="rounded-lg bg-white/50 px-3 py-1 text-xs font-semibold text-[#003526]">Live Data</span>
      </div>
      <div className="relative h-44">
        <Line data={data} options={options} />
        {max > 0 && (
          <p className="mt-2 text-center text-xs font-semibold text-[#003526]">
            Peak (Week {peakIdx}): ${max.toFixed(0)}
          </p>
        )}
      </div>
    </article>
  );
}
