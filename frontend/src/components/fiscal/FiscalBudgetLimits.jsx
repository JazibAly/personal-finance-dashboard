function formatMoney(n) {
  return `$${Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function FiscalBudgetLimits({ budgetOverview }) {
  const cards = budgetOverview.categories ?? [];

  return (
    <article className="flex flex-col gap-8 rounded-xl bg-white p-8 shadow-[0px_12px_32px_0px_rgba(6,78,59,0.04)]">
      <h2 className="font-['Manrope',system-ui,sans-serif] text-xl font-bold leading-7 text-[#003526]">
        Active Budget Limits
      </h2>

      {cards.length === 0 ? (
        <p className="text-sm text-[#404944]">Add categories with budgets to see limits.</p>
      ) : (
        <ul className="flex flex-col gap-8">
          {cards.map((c) => {
            const pct = Math.min(c.utilization_percent ?? 0, 100);
            const remaining = Math.max(0, Number(c.budget) - Number(c.spent));
            const exceeded = c.exceeded;
            const limitReached = c.limit_reached;

            return (
              <li key={c.category_id} className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-[#191c1e]">{c.category_name}</span>
                    {limitReached && (
                      <span className="rounded-full bg-[#ffdad6] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[-0.5px] text-[#ba1a1a]">
                        Limit Reached
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      exceeded ? "text-[#ba1a1a]" : "text-[#404944]"
                    }`}
                  >
                    {exceeded ? "100% used" : `${pct.toFixed(0)}% used`}
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[#f2f4f6]">
                  <div
                    className={`h-full rounded-full transition-all ${
                      exceeded ? "bg-[#ba1a1a]" : "bg-[#003526]"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-medium text-[#404944]">
                  <span>Spent: {formatMoney(c.spent)}</span>
                  {exceeded ? (
                    <span className="font-semibold text-[#ba1a1a]">$0.00 Left</span>
                  ) : (
                    <span className="text-[#511f00]">Remaining: {formatMoney(remaining)}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
