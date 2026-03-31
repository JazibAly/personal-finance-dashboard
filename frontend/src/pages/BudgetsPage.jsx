import { FiscalAppShell } from "../components/fiscal/FiscalAppShell";

export function BudgetsPage() {
  const dateLabel = new Date().toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <FiscalAppShell
      headerMode="date"
      dateLabel={dateLabel}
      avatarVariant="default"
      onAddTransaction={() => {}}
    >
      <div className="mx-auto max-w-[1440px] px-8 py-16">
        <h1 className="font-['Manrope',system-ui,sans-serif] text-4xl font-extrabold text-[#003526]">
          Budgets
        </h1>
        <p className="mt-4 max-w-xl text-[#404944]">
          Detailed budget planning and alerts will connect here. Use the dashboard for current budget
          progress against categories.
        </p>
      </div>
    </FiscalAppShell>
  );
}
