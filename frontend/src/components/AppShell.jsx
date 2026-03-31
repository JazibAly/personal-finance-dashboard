const navItems = [
  { id: "dashboard", label: "Dashboard", active: true },
  { id: "budget", label: "Budget", active: false, disabled: true },
  { id: "reports", label: "Reports", active: false, disabled: true },
  { id: "settings", label: "Settings", active: false, disabled: true },
];

function LogoMark() {
  return (
    <div
      className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-sm"
      aria-hidden
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 3v18M7 8h10M7 12h6M7 16h4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function AppShell({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <div className="flex items-center gap-3 border-b border-slate-200/80 bg-white px-4 py-3 md:hidden">
        <LogoMark />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">Personal Finance</p>
          <p className="truncate text-xs text-ink-muted">Dashboard</p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <aside
        className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-200/80 bg-white shadow-sidebar md:flex"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
          <LogoMark />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">Personal Finance</p>
            <p className="truncate text-xs text-ink-muted">Dashboard</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                item.active
                  ? "bg-brand-soft text-brand"
                  : item.disabled
                    ? "cursor-not-allowed text-slate-300"
                    : "text-ink-muted hover:bg-slate-50 hover:text-ink"
              }`}
            >
              <span>{item.label}</span>
              {item.disabled && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Soon
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <p className="text-xs leading-relaxed text-ink-muted">
            Track income, expenses, and budgets in one place.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{title}</h1>
              {subtitle ? (
                <p className="mt-1 max-w-2xl text-sm text-ink-muted">{subtitle}</p>
              ) : null}
            </div>
            <div className="mt-2 flex items-center gap-2 sm:mt-0">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-ink-muted">
                Overview
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
      </div>
    </div>
  );
}
