const periods = [
  { value: "all", label: "All time" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
  { value: "custom", label: "Custom" },
];

export function FiltersBar({
  period,
  onPeriodChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
  selectedCategoryId,
  onSelectedCategoryIdChange,
  categories,
  className = "",
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-card ${className}`}
      aria-label="Filters"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-ink">Date range</h2>
          <p className="mt-1 text-xs text-ink-muted">Filter metrics and lists by period.</p>
          <div
            className="mt-3 flex flex-wrap gap-2"
            role="group"
            aria-label="Period"
          >
            {periods.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => onPeriodChange(p.value)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  period === p.value
                    ? "bg-brand text-white shadow-sm"
                    : "bg-slate-100 text-ink-muted hover:bg-slate-200/80 hover:text-ink"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end lg:w-auto">
          <label className="grid w-full gap-1.5 text-sm font-medium text-ink sm:min-w-[200px]">
            Category
            <select
              value={selectedCategoryId}
              onChange={(e) => onSelectedCategoryIdChange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-ink shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {period === "custom" && (
        <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium text-ink">
            Start date
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => onCustomStartDateChange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-ink">
            End date
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => onCustomEndDateChange(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
        </div>
      )}
    </section>
  );
}
