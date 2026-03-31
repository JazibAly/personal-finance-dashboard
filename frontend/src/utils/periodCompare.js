/** @param {string} period */
export function getPreviousPeriodRange(period, customStartDate, customEndDate) {
  const now = new Date();
  const toIso = (d) => d.toISOString().slice(0, 10);

  if (period === "month") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    return { start_date: toIso(start), end_date: toIso(end) };
  }

  if (period === "week") {
    const dayOfWeek = now.getDay();
    const shift = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() + shift);
    const prevWeekStart = new Date(thisWeekStart);
    prevWeekStart.setDate(thisWeekStart.getDate() - 7);
    const prevWeekEnd = new Date(thisWeekStart);
    prevWeekEnd.setDate(thisWeekStart.getDate() - 1);
    return { start_date: toIso(prevWeekStart), end_date: toIso(prevWeekEnd) };
  }

  if (period === "year") {
    const start = new Date(now.getFullYear() - 1, 0, 1);
    const end = new Date(now.getFullYear() - 1, 11, 31);
    return { start_date: toIso(start), end_date: toIso(end) };
  }

  if (period === "custom" && customStartDate && customEndDate) {
    const start = new Date(customStartDate);
    const end = new Date(customEndDate);
    const len = Math.max(1, (end - start) / 86400000 + 1);
    const prevEnd = new Date(start);
    prevEnd.setDate(start.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevEnd.getDate() - len + 1);
    return { start_date: toIso(prevStart), end_date: toIso(prevEnd) };
  }

  return null;
}

export function percentChange(current, previous) {
  if (previous === 0 || previous === undefined || previous === null) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}
