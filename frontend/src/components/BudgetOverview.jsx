function getAlertText(category) {
  if (category.exceeded) return "Budget exceeded";
  if (category.limit_reached) return "Budget limit reached";
  return "Within budget";
}

export function BudgetOverview({ budgetOverview }) {
  return (
    <section className="panel">
      <h2>Budget Monitoring</h2>
      <div className="budget-list">
        {budgetOverview.categories.map((category) => {
          const width = `${Math.min(category.utilization_percent, 100)}%`;
          return (
            <div key={category.category_id} className="budget-item">
              <div className="budget-item-header">
                <strong>{category.category_name}</strong>
                <span>
                  ${category.spent.toFixed(2)} / ${category.budget.toFixed(2)}
                </span>
              </div>
              <div className="progress-track">
                <div
                  className={`progress-fill ${
                    category.exceeded ? "danger" : category.limit_reached ? "warn" : ""
                  }`}
                  style={{ width }}
                />
              </div>
              <small>{getAlertText(category)}</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}
