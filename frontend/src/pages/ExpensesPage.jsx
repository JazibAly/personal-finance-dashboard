import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiscalAppShell } from "../components/fiscal/FiscalAppShell";
import { figmaAssets } from "../figma/figmaAssets";
import { getCategories, getExpenses } from "../services/api";
import { getCurrentMonthRange } from "../utils/dateRanges";
import { getPreviousPeriodRange, percentChange } from "../utils/periodCompare";

const DEFAULT_USER_ID = 1;

function sumExp(rows) {
  return rows.reduce((s, r) => s + Number(r.amount || 0), 0);
}

function formatMoney(n) {
  return `Rs. ${Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDisplayDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** @param {string} name */
function categoryTagClass(name) {
  const n = (name || "").toLowerCase();
  if (/food|dining|lifestyle|luxury/.test(n)) return "bg-orange-100 text-orange-900";
  if (/rent|estate|housing/.test(n)) return "bg-slate-200 text-slate-800";
  if (/transit|fuel|car|chauffeur/.test(n)) return "bg-slate-200 text-slate-800";
  if (/professional|subscription|bloomberg/.test(n)) return "bg-emerald-100 text-emerald-900";
  return "bg-slate-100 text-slate-800";
}

export function ExpensesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [listFilter, setListFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [cats, ex] = await Promise.all([
        getCategories(DEFAULT_USER_ID),
        getExpenses(DEFAULT_USER_ID, {}),
      ]);
      setCategories(cats);
      setExpenses(ex);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load expenses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const catMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  );

  const monthRange = useMemo(() => getCurrentMonthRange(), []);
  const prevMonthRange = useMemo(() => getPreviousPeriodRange("month", "", ""), []);

  const expensesThisMonth = useMemo(
    () =>
      expenses.filter(
        (r) => r.date >= monthRange.start_date && r.date <= monthRange.end_date
      ),
    [expenses, monthRange]
  );

  const totalMonthly = useMemo(() => sumExp(expensesThisMonth), [expensesThisMonth]);

  const prevMonthExpenses = useMemo(() => {
    if (!prevMonthRange) return [];
    return expenses.filter(
      (r) => r.date >= prevMonthRange.start_date && r.date <= prevMonthRange.end_date
    );
  }, [expenses, prevMonthRange]);

  const prevTotal = useMemo(() => sumExp(prevMonthExpenses), [prevMonthExpenses]);
  const expenseTrend = percentChange(totalMonthly, prevTotal);
  const trendGood = expenseTrend !== null && expenseTrend <= 0;

  const filteredList = useMemo(() => {
    const now = new Date();
    const toIso = (d) => d.toISOString().slice(0, 10);
    let rows = [...expenses];

    if (listFilter === "month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      rows = rows.filter((r) => r.date >= toIso(start) && r.date <= toIso(now));
    } else if (listFilter === "week7") {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      rows = rows.filter((r) => r.date >= toIso(start) && r.date <= toIso(now));
    } else if (listFilter === "quarter") {
      const q = Math.floor(now.getMonth() / 3);
      const start = new Date(now.getFullYear(), q * 3, 1);
      rows = rows.filter((r) => r.date >= toIso(start) && r.date <= toIso(now));
    }

    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter((r) => {
        const cat = (catMap[r.category_id]?.name || "").toLowerCase();
        const desc = (r.description || "").toLowerCase();
        const pm = (r.payment_method || "").toLowerCase();
        return desc.includes(q) || cat.includes(q) || pm.includes(q);
      });
    }

    return rows.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, listFilter, search, catMap]);

  const filterPills = [
    { id: "all", label: "All Time" },
    { id: "month", label: "This Month" },
    { id: "week7", label: "Last 7 Days" },
    { id: "quarter", label: "Quarterly" },
  ];

  return (
    <FiscalAppShell
      headerMode="date"
      headerTone="default"
      dateLabel={new Date().toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })}
      avatarVariant="expenses"
      onAddTransaction={() => navigate("/expenses/add")}
    >
      {loading && (
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-16 text-sm text-[#404944]">Loading…</div>
      )}
      {error && (
        <div className="mx-auto max-w-[1440px] px-8 py-6">
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 py-8 sm:py-12">
          <section className="mb-12 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="space-y-4 lg:col-span-7">
              <h1 className="font-['Manrope',system-ui,sans-serif] text-5xl font-extrabold leading-none tracking-[-3.6px] text-[#003526] sm:text-6xl sm:leading-[4.5rem] lg:text-[72px] lg:leading-[72px]">
                Expenses
              </h1>
              <p className="max-w-lg text-base font-medium leading-relaxed text-[#404944]">
                Curated intelligence of your monthly commitments and lifestyle investments. Balance
                elegance with fiscal discipline.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-xl bg-white p-8 shadow-[0px_12px_32px_0px_rgba(6,78,59,0.06)] lg:col-span-5 border border-slate-100">
              <div className="absolute -right-16 -top-16 size-32 rounded-full bg-[rgba(166,242,209,0.2)]" />
              <p className="text-right text-sm font-semibold uppercase tracking-[1.4px] text-[#404944]">
                Total Monthly Summary
              </p>
              <div className="relative mt-2 flex items-baseline justify-end gap-2 text-right">
                <span className="font-['Manrope',system-ui,sans-serif] text-4xl font-extrabold text-[#003526] sm:text-5xl">
                  {formatMoney(totalMonthly)}
                </span>
                <span className="text-lg font-semibold text-[#00513b]">PKR</span>
              </div>
              {expenseTrend !== null && !Number.isNaN(expenseTrend) && (
                <div className="mt-2 flex items-center justify-end gap-2 text-sm font-semibold">
                  <span className={trendGood ? "text-emerald-700" : "text-amber-700"}>
                    {expenseTrend >= 0 ? "↑" : "↓"} {Math.abs(expenseTrend).toFixed(1)}% vs last month
                  </span>
                </div>
              )}
            </div>
          </section>

          <div className="mx-auto w-full max-w-5xl">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-3">
                  {filterPills.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setListFilter(p.id)}
                      className={`rounded-full px-6 py-2.5 text-xs font-bold transition shadow-sm ${
                        listFilter === p.id
                          ? "bg-[#003526] text-white"
                          : "bg-white text-[#404944] hover:bg-[#e6e8ea] border border-slate-200"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 shadow-sm px-5 py-3">
                  <img
                    src={figmaAssets.searchIconExpenses}
                    alt=""
                    className="size-[18px] object-contain opacity-70"
                  />
                  <input
                    type="search"
                    placeholder="Search entries…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-48 border-0 bg-transparent text-sm font-medium text-[#191c1e] outline-none placeholder:text-[#94a3b8] sm:w-64"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-5">
                <div className="hidden px-8 text-xs font-bold uppercase tracking-wide text-[#94a3b8] sm:grid sm:grid-cols-12">
                  <span className="sm:col-span-5">Description &amp; date</span>
                  <span className="sm:col-span-2">Category</span>
                  <span className="sm:col-span-3 lg:pl-4">Method</span>
                  <span className="text-right sm:col-span-2">Amount</span>
                </div>

                <ul className="flex flex-col gap-4">
                  {filteredList.map((row) => {
                    const cat = catMap[row.category_id];
                    const catName = cat?.name || "—";
                    return (
                      <li
                        key={row.id}
                        className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
                      >
                        <div className="grid gap-4 sm:grid-cols-12 sm:items-center">
                          <div className="sm:col-span-5">
                            <p className="font-bold text-[#191c1e]">
                              {row.description || catName}
                            </p>
                            <p className="mt-1.5 text-sm font-medium text-[#94a3b8]">
                              {formatDisplayDate(row.date)}
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <span
                              className={`inline-block rounded-md px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider ${categoryTagClass(catName)}`}
                            >
                              {catName.slice(0, 15)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5 text-sm font-semibold text-[#404944] sm:col-span-3 lg:pl-4">
                            <span
                              className={`size-2.5 rounded-full ${
                                /amex|card/i.test(row.payment_method || "")
                                  ? "bg-slate-400"
                                  : "bg-emerald-500"
                              }`}
                              aria-hidden
                            />
                            {row.payment_method || "—"}
                          </div>
                          <p className="text-right text-lg font-bold text-[#003526] sm:col-span-2">
                            {formatMoney(row.amount)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {filteredList.length === 0 && (
                  <div className="py-16 text-center">
                    <p className="text-sm font-medium text-[#64748b]">No expenses match this view.</p>
                  </div>
                )}

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    className="rounded-full border-2 border-slate-200 px-8 py-3 text-sm font-bold uppercase tracking-wide text-[#64748b] transition hover:bg-slate-50 hover:text-[#003526]"
                  >
                    Discover older entries
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/expenses/add")}
            className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#003526] text-2xl font-light text-white shadow-[0_8px_20px_-6px_rgba(0,53,38,0.5)] transition hover:bg-[#004e39] hover:-translate-y-1"
            aria-label="Add expense"
          >
            +
          </button>
        </div>
      )}
    </FiscalAppShell>
  );
}
