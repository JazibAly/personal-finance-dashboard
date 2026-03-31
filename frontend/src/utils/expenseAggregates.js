/** Heuristic: "fixed" vs "variable" spend for stacked bars (Figma Fixed / Variable). */
export function isFixedCategoryName(name) {
  if (!name) return false;
  return /rent|utility|utilities|housing|mortgage|insurance|loan|subscription|subscriptions|fixed|lease|hoa/i.test(
    String(name)
  );
}

/** @param {Array<{ amount: unknown, category_id: unknown, date: string }>} expenses */
/** @param {Record<number, string>} categoryNames */
export function groupExpensesByMonthFixedVariable(expenses, categoryNames) {
  const byMonth = {};

  expenses.forEach((e) => {
    const month = String(e.date).slice(0, 7);
    if (!byMonth[month]) byMonth[month] = { fixed: 0, variable: 0 };
    const amt = Number(e.amount || 0);
    const cat = categoryNames[Number(e.category_id)] || "";
    if (isFixedCategoryName(cat)) byMonth[month].fixed += amt;
    else byMonth[month].variable += amt;
  });

  return byMonth;
}

/** Last N calendar months as labels (YYYY-MM) + short names */
export function lastNMonthKeys(n) {
  const months = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const short = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    months.push({ key, label: short });
  }
  return months;
}

/** Aggregate spending by week-of-month (1–4) for filtered expenses */
export function spendingByWeekOfMonth(expenses) {
  const totals = { 1: 0, 2: 0, 3: 0, 4: 0 };
  expenses.forEach((e) => {
    const d = new Date(e.date);
    if (Number.isNaN(d.getTime())) return;
    const day = d.getDate();
    const w = Math.min(4, Math.ceil(day / 7));
    totals[w] += Number(e.amount || 0);
  });
  return [totals[1], totals[2], totals[3], totals[4]];
}
