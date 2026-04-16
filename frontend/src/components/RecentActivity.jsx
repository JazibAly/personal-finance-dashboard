function toRecentItems(expenses, income, categories, incomeSources) {
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const sourceMap = Object.fromEntries(incomeSources.map((s) => [s.id, s.name]));

  const expenseItems = expenses.map((item) => ({
    id: `expense-${item.id}`,
    recordId: item.id,
    type: "Expense",
    title: item.description || categoryMap[item.category_id] || "Expense",
    amount: Number(item.amount || 0),
    date: item.date,
    meta: categoryMap[item.category_id] || "Uncategorized",
    raw: item,
  }));

  const incomeItems = income.map((item) => ({
    id: `income-${item.id}`,
    recordId: item.id,
    type: "Income",
    title: item.description || sourceMap[item.source_id] || "Income",
    amount: Number(item.amount || 0),
    date: item.date,
    meta: sourceMap[item.source_id] || "Unknown source",
    raw: item,
  }));

  return [...expenseItems, ...incomeItems]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);
}

export function RecentActivity({
  expenses,
  income,
  categories,
  incomeSources,
  onDeleteExpense,
  onDeleteIncome,
  onUpdateExpense,
  onUpdateIncome,
}) {
  const items = toRecentItems(expenses, income, categories, incomeSources);

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card" aria-label="Recent activity">
      <div>
        <h2 className="text-base font-semibold text-ink">Recent activity</h2>
        <p className="mt-1 text-xs text-ink-muted">Latest income and expense entries.</p>
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">No recent income or expenses yet.</p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  {item.type} · {item.meta} · {item.date}
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    item.type === "Income" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {item.type === "Income" ? "+" : "-"}Rs. {item.amount.toFixed(2)}
                </span>
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-sm transition hover:bg-slate-50"
                  onClick={async () => {
                    const nextAmount = window.prompt(
                      `Update ${item.type.toLowerCase()} amount`,
                      String(item.amount)
                    );
                    if (nextAmount === null || nextAmount.trim() === "") return;

                    if (item.type === "Income") {
                      await onUpdateIncome(item.recordId, { amount: Number(nextAmount) });
                    } else {
                      await onUpdateExpense(item.recordId, { amount: Number(nextAmount) });
                    }
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                  onClick={async () => {
                    const ok = window.confirm(
                      `Delete this ${item.type.toLowerCase()} entry (${item.title})?`
                    );
                    if (!ok) return;

                    if (item.type === "Income") {
                      await onDeleteIncome(item.recordId);
                    } else {
                      await onDeleteExpense(item.recordId);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
