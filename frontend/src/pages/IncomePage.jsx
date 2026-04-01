import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiscalAppShell } from "../components/fiscal/FiscalAppShell";
import { getIncome, getIncomeSources } from "../services/api";
import { getCurrentMonthRange, getLast30DaysRange } from "../utils/dateRanges";
import { getPreviousPeriodRange, percentChange } from "../utils/periodCompare";

const DEFAULT_USER_ID = 1;
const PAGE_SIZE = 6;

function sumIncome(rows) {
  return rows.reduce((s, r) => s + Number(r.amount || 0), 0);
}

function formatMoney(n) {
  return `$${Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDisplayDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function nextMonthFirstLabel() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  d.setDate(1);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function filterLast30Days(items) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  return items.filter((i) => new Date(i.date) >= cutoff);
}

const breakdownColors = ["bg-[#003526]", "bg-[#a6f2d1]", "bg-[#64748b]"];

export function IncomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [income, setIncome] = useState([]);
  const [incomeSources, setIncomeSources] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [inc, sources] = await Promise.all([
        getIncome(DEFAULT_USER_ID, {}),
        getIncomeSources(DEFAULT_USER_ID),
      ]);
      setIncome(inc);
      setIncomeSources(sources);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load income.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sourceMap = useMemo(
    () => Object.fromEntries(incomeSources.map((s) => [s.id, s.name])),
    [incomeSources]
  );

  const monthRange = useMemo(() => getCurrentMonthRange(), []);
  const prevMonthRange = useMemo(() => getPreviousPeriodRange("month", "", ""), []);

  const incomeThisMonth = useMemo(
    () =>
      income.filter((r) => r.date >= monthRange.start_date && r.date <= monthRange.end_date),
    [income, monthRange]
  );

  const totalMonthlyInflow = useMemo(() => sumIncome(incomeThisMonth), [incomeThisMonth]);

  const prevMonthIncome = useMemo(() => {
    if (!prevMonthRange) return [];
    return income.filter(
      (r) => r.date >= prevMonthRange.start_date && r.date <= prevMonthRange.end_date
    );
  }, [income, prevMonthRange]);

  const prevTotal = useMemo(() => sumIncome(prevMonthIncome), [prevMonthIncome]);
  const trendPct = percentChange(totalMonthlyInflow, prevTotal);

  const primarySource = useMemo(() => {
    const bySource = {};
    incomeThisMonth.forEach((r) => {
      const name = sourceMap[r.source_id] || "Unknown";
      bySource[name] = (bySource[name] || 0) + Number(r.amount || 0);
    });
    const entries = Object.entries(bySource);
    if (!entries.length) return "—";
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  }, [incomeThisMonth, sourceMap]);

  const breakdown = useMemo(() => {
    const last30 = filterLast30Days(income);
    const bySource = {};
    last30.forEach((r) => {
      const name = sourceMap[r.source_id] || "Other";
      bySource[name] = (bySource[name] || 0) + Number(r.amount || 0);
    });
    const total = Object.values(bySource).reduce((a, b) => a + b, 0);
    return Object.entries(bySource)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, amt]) => ({
        name,
        pct: total > 0 ? (amt / total) * 100 : 0,
        amount: amt,
      }));
  }, [income, sourceMap]);

  const sortedHistory = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = [...income].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (q) {
      rows = rows.filter((r) => {
        const src = (sourceMap[r.source_id] || "").toLowerCase();
        const desc = (r.description || "").toLowerCase();
        return src.includes(q) || desc.includes(q) || String(r.amount).includes(q);
      });
    }
    return rows;
  }, [income, search, sourceMap]);

  const totalPages = Math.max(1, Math.ceil(sortedHistory.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const pageRows = sortedHistory.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  function navToAddTransaction() {
    navigate("/income/add");
  }

  return (
    <FiscalAppShell
      headerMode="search"
      headerTone="income"
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search data..."
      avatarVariant="income"
      onAddTransaction={navToAddTransaction}
    >
      {loading && (
        <div className="mx-auto max-w-[1440px] px-8 py-16 text-sm text-[#404944]">Loading…</div>
      )}
      {error && (
        <div className="mx-auto max-w-[1440px] px-8 py-6">
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-8 py-12">
          
          <section className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[1.2px] text-[#404944]">
                Total Monthly Inflow
              </p>
              <div className="flex flex-wrap items-end gap-4">
                <p className="font-['Manrope',system-ui,sans-serif] text-5xl font-extrabold tracking-[-3px] text-[#003526] sm:text-6xl">
                  {formatMoney(totalMonthlyInflow)}
                </p>
                {trendPct !== null && !Number.isNaN(trendPct) && (
                  <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-[#004e39] px-3 py-1 text-sm font-semibold text-[#8bd6b6]">
                    <span aria-hidden>
                      {trendPct >= 0 ? "↑" : "↓"}
                    </span>
                    {trendPct >= 0 ? "+" : ""}
                    {trendPct.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="min-w-[200px] rounded-xl bg-[#f2f4f6] px-6 py-6 border border-slate-200/60">
                <p className="text-xs text-[#404944]">Primary Source</p>
                <p className="mt-1 font-['Manrope',system-ui,sans-serif] text-lg font-bold text-[#003526]">
                  {primarySource}
                </p>
              </div>
              <div className="min-w-[200px] rounded-xl bg-[#f2f4f6] px-6 py-6 border border-slate-200/60">
                <p className="text-xs text-[#404944]">Next Expected</p>
                <p className="mt-1 font-['Manrope',system-ui,sans-serif] text-lg font-bold text-[#003526]">
                  {nextMonthFirstLabel()}
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-[0px_12px_32px_0px_rgba(6,78,59,0.06)]">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-['Manrope',system-ui,sans-serif] text-lg font-bold text-[#003526]">
                    Inflow Breakdown
                  </h3>
                  <span className="text-xs font-medium text-[#64748b]">Last 30 Days</span>
                </div>
                <ul className="flex flex-col gap-6">
                  {breakdown.length === 0 ? (
                    <li className="text-sm text-[#404944]">No inflow in the last 30 days.</li>
                  ) : (
                    breakdown.map((row, i) => (
                      <li key={row.name}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="font-semibold text-[#191c1e]">{row.name}</span>
                          <span className="font-medium text-[#404944]">{row.pct.toFixed(0)}%</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#f2f4f6]">
                          <div
                            className={`h-full rounded-full ${breakdownColors[i % breakdownColors.length]}`}
                            style={{ width: `${Math.min(row.pct, 100)}%` }}
                          />
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-[0px_12px_32px_0px_rgba(6,78,59,0.06)] h-full flex flex-col">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-['Manrope',system-ui,sans-serif] text-2xl font-bold text-[#003526]">
                      Income History
                    </h2>
                    <p className="mt-1 text-sm text-[#64748b]">
                      Chronological record of all revenue events.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg bg-[#f2f4f6] px-4 py-2 text-xs font-semibold text-[#003526] hover:bg-[#e6e8ea] transition"
                    >
                      Filter
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-[#f2f4f6] px-4 py-2 text-xs font-semibold text-[#003526] hover:bg-[#e6e8ea] transition"
                    >
                      Export
                    </button>
                  </div>
                </div>

                <div className="hidden gap-4 border-b border-[#f2f4f6] pb-3 text-xs font-semibold uppercase tracking-wide text-[#94a3b8] sm:grid sm:grid-cols-12">
                  <span className="sm:col-span-4 pl-1">Source</span>
                  <span className="sm:col-span-3">Description</span>
                  <span className="sm:col-span-2">Date</span>
                  <span className="text-right sm:col-span-3 pr-1">Amount</span>
                </div>

                <ul className="flex-1 divide-y divide-[#f2f4f6]">
                  {pageRows.map((row) => {
                    const src = sourceMap[row.source_id] || "Unknown";
                    return (
                      <li
                        key={row.id}
                        className="grid gap-2 py-5 sm:grid-cols-12 sm:items-center transition hover:bg-slate-50/50 -mx-4 px-4 rounded-xl"
                      >
                        <div className="flex items-center gap-4 sm:col-span-4">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ecfdf5] text-sm font-bold text-[#003526]">
                            {src.slice(0, 1)}
                          </span>
                          <div>
                            <p className="font-bold text-[#191c1e]">{src}</p>
                            <p className="text-xs font-medium text-[#94a3b8]">Ledger deposit</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-[#404944] sm:col-span-3 truncate">
                          {row.description || "—"}
                        </p>
                        <p className="text-sm font-medium text-[#64748b] sm:col-span-2">
                          {formatDisplayDate(row.date)}
                        </p>
                        <p className="text-right font-bold text-[#003526] sm:col-span-3">
                          {formatMoney(row.amount)}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                {sortedHistory.length === 0 && (
                  <div className="flex-1 flex items-center justify-center py-12">
                     <p className="text-center text-sm font-medium text-[#64748b]">No income entries yet.</p>
                  </div>
                )}

                <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#f2f4f6] pt-6 sm:flex-row">
                  <p className="text-xs font-medium text-[#64748b]">
                    Showing {pageRows.length} of {sortedHistory.length} transactions
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={pageSafe <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e6e8ea] text-sm font-bold text-[#404944] transition hover:bg-slate-50 disabled:opacity-40"
                    >
                      ‹
                    </button>
                    <span className="text-sm font-semibold text-[#404944]">
                      Page {pageSafe} of {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={pageSafe >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e6e8ea] text-sm font-bold text-[#404944] transition hover:bg-slate-50 disabled:opacity-40"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </FiscalAppShell>
  );
}
