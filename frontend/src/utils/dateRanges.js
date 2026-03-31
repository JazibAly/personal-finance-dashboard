export function toIsoDate(d) {
  return d.toISOString().slice(0, 10);
}

/** Expenses list filter: all | month | week7 | quarter */
export function getExpensesListFilterRange(mode) {
  const now = new Date();
  if (mode === "all") return {};
  if (mode === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start_date: toIsoDate(start), end_date: toIsoDate(now) };
  }
  if (mode === "week7") {
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    return { start_date: toIsoDate(start), end_date: toIsoDate(now) };
  }
  if (mode === "quarter") {
    const q = Math.floor(now.getMonth() / 3);
    const start = new Date(now.getFullYear(), q * 3, 1);
    return { start_date: toIsoDate(start), end_date: toIsoDate(now) };
  }
  return {};
}

/** Current calendar month range */
export function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return { start_date: toIsoDate(start), end_date: toIsoDate(now) };
}

/** Last 30 days including today */
export function getLast30DaysRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  return { start_date: toIsoDate(start), end_date: toIsoDate(end) };
}
