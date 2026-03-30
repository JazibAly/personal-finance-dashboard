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
    <section className="panel">
      <h2>Recent Activity</h2>
      {items.length === 0 ? (
        <p>No recent income or expenses yet.</p>
      ) : (
        <div className="activity-list">
          {items.map((item) => (
            <article key={item.id} className="activity-item">
              <div>
                <strong>{item.title}</strong>
                <p>
                  {item.type} • {item.meta} • {item.date}
                </p>
              </div>
              <div className="activity-actions">
                <span className={item.type === "Income" ? "money-positive" : "money-negative"}>
                  {item.type === "Income" ? "+" : "-"}${item.amount.toFixed(2)}
                </span>
                <button
                  type="button"
                  className="button-secondary"
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
                  className="button-danger"
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
