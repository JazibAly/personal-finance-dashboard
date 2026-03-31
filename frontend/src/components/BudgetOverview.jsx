function getAlertText(category) {
  if (category.exceeded) return "Budget exceeded";
  if (category.limit_reached) return "Budget limit reached";
  return "Within budget";
}

function alertTone(category) {
  if (category.exceeded) return "text-red-600";
  if (category.limit_reached) return "text-amber-600";
  return "text-emerald-600";
}

export function BudgetOverview({ budgetOverview }) {
  return (
    <section
      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"
      aria-label="Budget monitoring"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink">Budget monitoring</h2>
          <p className="mt-1 text-xs text-ink-muted">Spending vs monthly budget by category.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        {budgetOverview.categories.length === 0 ? (
          <p className="text-sm text-ink-muted">Add categories to see budget progress.</p>
        ) : (
          budgetOverview.categories.map((category) => {
            const width = `${Math.min(category.utilization_percent, 100)}%`;
            return (
              <div key={category.category_id} className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="font-semibold text-ink">{category.category_name}</strong>
                  <span className="text-sm font-medium tabular-nums text-ink-muted">
                    ${category.spent.toFixed(2)} / ${category.budget.toFixed(2)}
                  </span>
                </div>
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                  <div
                    className={`h-full rounded-full transition-all ${
                      category.exceeded
                        ? "bg-red-500"
                        : category.limit_reached
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                    style={{ width }}
                  />
                </div>
                <p className={`mt-2 text-xs font-medium ${alertTone(category)}`}>
                  {getAlertText(category)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
