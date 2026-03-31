import { figmaAssets } from "../../figma/figmaAssets";

function formatMoney(n) {
  return `$${Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatPercentChange(pct, inverseExpense) {
  if (pct === null || pct === undefined || Number.isNaN(pct)) {
    return { text: "—", className: "text-[#404944]" };
  }
  const rounded = pct.toFixed(1);
  const positive = pct >= 0;
  if (inverseExpense) {
    return {
      text: `${positive ? "+" : ""}${rounded}% vs last month`,
      className: "text-[#511f00]",
    };
  }
  return {
    text: `${positive ? "+" : ""}${rounded}% vs last month`,
    className: positive ? "text-[#004e39]" : "text-[#511f00]",
  };
}

const TARGET_SAVINGS_RATE = 50;

export function FiscalSummaryCards({
  totalIncome,
  totalExpenses,
  savings,
  savingsRatePercent,
  incomeTrendPct,
  expenseTrendPct,
}) {
  const incomeTrend = formatPercentChange(incomeTrendPct, false);
  const expenseTrend = formatPercentChange(expenseTrendPct, true);

  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {/* Total Income */}
      <article className="flex flex-col justify-between rounded-xl bg-white p-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[1.2px] text-[#404944]">Total Income</p>
          <p className="mt-2 font-['Manrope',system-ui,sans-serif] text-[30px] font-bold leading-9 text-[#003526]">
            {formatMoney(totalIncome)}
          </p>
        </div>
        <div className="mt-6 flex items-center gap-2 pt-2">
          <img src={figmaAssets.trendUp} alt="" className="h-3 w-6 object-contain" />
          <span className={`text-sm font-semibold ${incomeTrend.className}`}>{incomeTrend.text}</span>
        </div>
      </article>

      {/* Total Expenses */}
      <article className="flex flex-col justify-between rounded-xl bg-white p-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[1.2px] text-[#404944]">Total Expenses</p>
          <p className="mt-2 font-['Manrope',system-ui,sans-serif] text-[30px] font-bold leading-9 text-[#511f00]">
            {formatMoney(totalExpenses)}
          </p>
        </div>
        <div className="mt-6 flex items-center gap-2 pt-2">
          <img src={figmaAssets.trendDown} alt="" className="h-3 w-6 object-contain" />
          <span className={`text-sm font-semibold ${expenseTrend.className}`}>{expenseTrend.text}</span>
        </div>
      </article>

      {/* Savings Rate — dark card */}
      <article className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-[#004e39] p-8">
        <div
          className="pointer-events-none absolute -bottom-4 -right-4 size-24 rounded-full bg-[rgba(27,107,81,0.2)] blur-xl"
          aria-hidden
        />
        <div>
          <p className="text-xs font-medium uppercase tracking-[1.2px] text-[#76c0a1]">Savings Rate</p>
          <p className="mt-2 font-['Manrope',system-ui,sans-serif] text-[30px] font-bold leading-9 text-white">
            {savingsRatePercent !== null && savingsRatePercent !== undefined
              ? `${savingsRatePercent.toFixed(1)}%`
              : "—"}
          </p>
        </div>
        <div className="mt-6 flex items-center gap-2 pt-2">
          <img src={figmaAssets.spark} alt="" className="h-5 w-6 object-contain" />
          <span className="text-sm font-semibold text-[#a6f2d1]">Target: {TARGET_SAVINGS_RATE}%</span>
        </div>
      </article>

      {/* Balance */}
      <article className="flex flex-col justify-between rounded-xl bg-[#f2f4f6] p-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[1.2px] text-[#404944]">Balance</p>
          <p className="mt-2 font-['Manrope',system-ui,sans-serif] text-[30px] font-bold leading-9 text-[#003526]">
            {formatMoney(savings)}
          </p>
        </div>
        <div className="mt-6 flex items-center gap-2 pt-2">
          <img src={figmaAssets.bank} alt="" className="h-5 w-6 object-contain" />
          <span className="text-sm font-semibold text-[#404944]">Ready to invest</span>
        </div>
      </article>
    </div>
  );
}
