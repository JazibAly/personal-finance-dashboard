import { IconPiggy, IconTrendDown, IconTrendUp, IconWallet } from "./icons";

const cardConfig = [
  {
    title: "Total Income",
    key: "total_income",
    icon: IconTrendUp,
    accent: "text-accent-income",
    bg: "bg-emerald-50",
  },
  {
    title: "Total Expenses",
    key: "total_expenses",
    icon: IconTrendDown,
    accent: "text-accent-expense",
    bg: "bg-red-50",
  },
  {
    title: "Savings",
    key: "savings",
    icon: IconPiggy,
    accent: "text-accent-savings",
    bg: "bg-violet-50",
  },
  {
    title: "Remaining Balance",
    key: "remaining_balance",
    icon: IconWallet,
    accent: "text-brand",
    bg: "bg-brand-soft",
  },
];

export function SummaryCards({ summary }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Financial summary">
      {cardConfig.map((card) => {
        const Icon = card.icon;
        const value = Number(summary[card.key] ?? 0);
        return (
          <article
            key={card.key}
            className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink-muted">{card.title}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                  ${value.toFixed(2)}
                </p>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.bg} ${card.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
