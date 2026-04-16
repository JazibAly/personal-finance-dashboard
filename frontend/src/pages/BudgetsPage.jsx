import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiscalAppShell } from "../components/fiscal/FiscalAppShell";
import { getBudgetOverview } from "../services/api";

const DEFAULT_USER_ID = 1;

function formatMoney(n) {
  return `Rs. ${Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function BudgetsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [overview, setOverview] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    getBudgetOverview(DEFAULT_USER_ID)
      .then(setOverview)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load budget data"))
      .finally(() => setLoading(false));
  }, []);

  function navToAddBudget() {
    navigate("/budgets/add");
  }

  const dateLabel = new Date().toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <FiscalAppShell
      headerMode="date"
      dateLabel={dateLabel}
      headerTone="default"
      onAddTransaction={navToAddBudget}
      avatarVariant="default"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 sm:gap-10 sm:px-8 py-8 sm:py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-['Manrope',system-ui,sans-serif] text-4xl font-extrabold tracking-[-2px] text-[#003526] lg:text-5xl">
              Category & Budget
            </h1>
            <p className="mt-4 max-w-lg text-lg text-[#404944]">
              Curate your spending architecture. High-precision limits for a balanced financial life.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/categories/add"
              className="inline-flex items-center justify-center rounded-full bg-white border border-slate-200 px-6 py-3 text-sm font-bold text-[#003526] shadow-sm transition hover:bg-slate-50"
            >
              + Create Category
            </Link>
          </div>
        </div>

        {loading && (
          <div className="py-12 text-sm text-[#404944]">Loading budget telemetry...</div>
        )}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && overview && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {overview.categories.map((cat) => {
              const isDanger = cat.exceeded || cat.alert === "BUDGET_EXCEEDED";
              const isWarning = (cat.limit_reached && !cat.exceeded) || cat.alert === "BUDGET_LIMIT_REACHED";
              const safePct = Math.min(Math.max(cat.utilization_percent, 0), 100);

              let barBg = "bg-[#a6f2d1]";
              let iconBg = "bg-[#ecfdf5]";
              let iconColor = "text-[#003526]";
              let progressColor = "bg-[#003526]";
              let labelColor = "text-[#64748b]";
              let labelMsg = `${safePct.toFixed(0)}% utilized`;

              if (isDanger) {
                barBg = "bg-red-100";
                iconBg = "bg-red-50";
                iconColor = "text-red-700";
                progressColor = "bg-red-600";
                labelMsg = "Budget Exceeded!";
                labelColor = "text-red-700 font-bold";
              } else if (isWarning) {
                barBg = "bg-amber-100";
                iconBg = "bg-amber-50";
                iconColor = "text-amber-700";
                progressColor = "bg-amber-500";
                labelMsg = "Limit Reached.";
                labelColor = "text-amber-600 font-bold";
              } else if (cat.budget === 0) {
                 barBg = "bg-slate-100";
                 iconBg = "bg-slate-50";
                 iconColor = "text-slate-500";
                 progressColor = "bg-slate-300";
                 labelMsg = "No limit set.";
                 labelColor = "text-slate-500 font-medium";
              }

              return (
                <div
                  key={cat.category_id}
                  className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-[0px_8px_24px_0px_rgba(6,78,59,0.04)] transition hover:shadow-[0px_12px_32px_0px_rgba(6,78,59,0.08)] relative"
                >
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} text-base font-bold uppercase ${iconColor}`}>
                        {cat.category_name.slice(0, 1)}
                      </span>
                      <h3 className="font-['Manrope',system-ui,sans-serif] text-base font-bold text-[#191c1e] line-clamp-2 leading-tight">
                        {cat.category_name}
                      </h3>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === cat.category_id ? null : cat.category_id)}
                      className="p-1 -mr-2 text-slate-400 hover:text-slate-600 transition"
                      aria-label="Options"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="12" cy="19" r="2" />
                      </svg>
                    </button>

                    {openDropdown === cat.category_id && (
                      <div className="absolute right-4 top-14 z-20 min-w-[140px] rounded-lg bg-white p-1 text-left shadow-lg ring-1 ring-black/5 flex flex-col">
                         <Link 
                           to={`/budgets/add?categoryId=${cat.category_id}`}
                           className="rounded-md px-4 py-2 text-sm font-semibold text-[#191c1e] hover:bg-slate-50"
                         >
                           Edit limit
                         </Link>
                         <button
                           type="button"
                           onClick={() => setOpenDropdown(null)}
                           className="rounded-md px-4 py-2 text-sm font-medium text-slate-500 text-left hover:bg-slate-50"
                         >
                           Close
                         </button>
                      </div>
                    )}
                  </div>

                  <div className="mb-4 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-1">
                        Spent
                      </p>
                      <p className={`font-['Manrope',system-ui,sans-serif] text-3xl font-extrabold tracking-[-1.5px] ${isDanger ? 'text-red-700' : 'text-[#003526]'}`}>
                        {formatMoney(cat.spent)}
                      </p>
                    </div>
                    {cat.budget > 0 && (
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] mb-1">
                          Limit
                        </p>
                        <p className="font-['Manrope',system-ui,sans-serif] text-sm font-bold tracking-[-0.5px] text-[#64748b]">
                          {formatMoney(cat.budget)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100/60">
                    <div className="mb-2.5 flex justify-between text-[11px] uppercase tracking-wide">
                      <span className={labelColor}>{labelMsg}</span>
                      {cat.budget > 0 && !isDanger && (
                        <span className="font-bold text-[#64748b]">
                          {formatMoney(cat.budget - cat.spent)} left
                        </span>
                      )}
                    </div>
                    <div className={`h-2.5 w-full overflow-hidden rounded-full ${barBg}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${progressColor}`}
                        style={{ width: `${safePct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </FiscalAppShell>
  );
}
