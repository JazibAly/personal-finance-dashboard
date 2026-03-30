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
}) {
  return (
    <section className="panel">
      <h2>Filters</h2>
      <div className="filters-grid">
        <label>
          Period
          <select value={period} onChange={(e) => onPeriodChange(e.target.value)}>
            <option value="all">All time</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="year">This year</option>
            <option value="custom">Custom range</option>
          </select>
        </label>

        <label>
          Category
          <select
            value={selectedCategoryId}
            onChange={(e) => onSelectedCategoryIdChange(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        {period === "custom" && (
          <>
            <label>
              Start date
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => onCustomStartDateChange(e.target.value)}
              />
            </label>
            <label>
              End date
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => onCustomEndDateChange(e.target.value)}
              />
            </label>
          </>
        )}
      </div>
    </section>
  );
}
