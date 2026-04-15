import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { figmaAssets } from "../../figma/figmaAssets";

const topNav = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/income/add", label: "Income", end: false },
  { to: "/expenses/add", label: "Expenses", end: false },
  { to: "/budgets/add", label: "Budgets", end: false },
];

const sidebarNav = [
  { to: "/", end: true, icon: figmaAssets.navDashboard, label: "Dashboard" },
  { to: "/income", end: false, icon: figmaAssets.navWallet, label: "Income" },
  { to: "/expenses", end: false, icon: figmaAssets.navCard, label: "Expenses" },
  { to: "/budgets", end: false, icon: figmaAssets.navChart, label: "Budgets" },
];

const sidebarFooter = [
  { id: "settings", to: "/settings", icon: figmaAssets.navSettings, label: "Settings" },
  { id: "help", to: "#", icon: figmaAssets.navHelp, label: "Help" },
];

function navActive(pathname, to, end) {
  if (end) return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

function avatarSrc(variant) {
  // if (variant === "income") return figmaAssets.userProfileAvatarIncome;
  // if (variant === "expenses") return figmaAssets.userProfileAvatarIncome;
  return figmaAssets.userProfileAvatar;
}

/**
 * @param {"date" | "search"} headerMode
 * @param {"default" | "income" | "expenses"} headerTone
 */
export function FiscalAppShell({
  children,
  headerMode = "date",
  headerTone = "default",
  dateLabel,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search data...",
  onAddTransaction,
  avatarVariant = "default",
}) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const headerBg =
    headerTone === "income"
      ? "bg-[rgba(236,253,245,0.5)]"
      : "bg-[rgba(247,249,251,0.7)]";

  return (
    <div className="relative min-h-screen bg-[#f7f9fb]">
      <aside
        className="fixed left-0 top-0 z-20 flex h-full w-20 flex-col items-center justify-between border-r border-[rgba(191,201,195,0.15)] bg-[#f2f4f6] py-8"
        aria-label="Primary navigation"
      >
        {/* <Link to="/" className="flex flex-col items-center px-2">
          <span className="text-[24px] font-semibold leading-8 tracking-[-1.2px] text-[#022c22]">
            SW
          </span>
        </Link> */}
        <nav className="flex flex-1 flex-col items-center gap-8 pt-6" aria-label="App sections">
          {sidebarNav.map((item) => {
            const active = navActive(pathname, item.to, item.end);
            return (
              <Link
                key={`${item.to}-${item.label}`}
                to={item.to}
                title={item.label}
                className={`flex w-full items-center justify-center rounded-lg p-3 transition ${active
                  ? "bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                  : "opacity-50 hover:opacity-80"
                  }`}
              >
                <img src={item.icon} alt="" className="h-[18px] w-[18px] object-contain" />
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col items-center gap-4">
          {sidebarFooter.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              title={item.label}
              className="rounded-lg p-3 opacity-60 transition hover:opacity-100"
            >
              <img src={item.icon} alt="" className="h-5 w-5 object-contain" />
            </Link>
          ))}
        </div>
      </aside>

      <div className="flex min-h-screen flex-col pl-20">
        <header
          className={`sticky top-0 z-30 w-full border-b border-transparent ${headerBg} shadow-[0px_12px_32px_0px_rgba(6,78,59,0.06)] backdrop-blur-[12px]`}
        >
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-8 py-4">
            <div className="flex min-w-0 flex-wrap items-center gap-6 lg:gap-12">
              <Link
                to="/"
                className="shrink-0 text-[20px] font-bold leading-7 tracking-[-1px] text-[#022c22]"
              >
                SpendWise
              </Link>
              <nav className="hidden items-center gap-6 md:flex" aria-label="Top navigation">
                {topNav.map((item) => {
                  const active = navActive(pathname, item.to, item.end);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`relative pb-1.5 text-base font-semibold tracking-[-0.4px] ${active
                        ? "border-b-2 border-[#064e3b] text-[#064e3b]"
                        : "text-[#64748b] hover:text-[#022c22]"
                        }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              {/* {headerMode === "search" ? (
                <label className="flex min-w-[200px] max-w-md flex-1 items-center gap-2 rounded-full bg-[#f2f4f6] px-4 py-2">
                  <img
                    src={figmaAssets.searchIcon}
                    alt=""
                    className="h-[18px] w-[26px] shrink-0 object-contain opacity-70"
                  />
                  <input
                    type="search"
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#191c1e] outline-none placeholder:text-[#6b7280]"
                  />
                </label>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-[#f2f4f6] px-4 py-2 text-sm font-medium text-[#191c1e]"
                >
                  <img
                    src={figmaAssets.calendarIcon}
                    alt=""
                    className="h-3 w-3 object-contain"
                  />
                  {dateLabel}
                  <img
                    src={figmaAssets.chevronDown}
                    alt=""
                    className="h-1 w-2 object-contain opacity-70"
                  />
                </button>
              )} */}

              {/* <button
                type="button"
                onClick={onAddTransaction}
                className="rounded-full bg-[#003526] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#004e39]"
              >
                Add Transaction
              </button> */}
              <div className="flex items-center gap-2 border-l border-slate-200/80 pl-3">
                <button
                  type="button"
                  className="rounded-full p-2 text-[#404944] hover:bg-white/80"
                  aria-label="Notifications"
                >
                  <img src={figmaAssets.bell} alt="" className="h-5 w-4 object-contain" />
                </button>
                <Link
                  to="/settings"
                  className="rounded-full p-2 text-[#404944] hover:bg-white/80"
                  aria-label="Settings"
                >
                  <img src={figmaAssets.settings} alt="" className="h-5 w-5 object-contain" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full p-2 text-[#404944] hover:bg-white/80"
                  aria-label="Log Out"
                >
                  <span className="text-sm font-semibold text-red-600">Logout</span>
                </button>
                <div className="pl-1">
                  <div className="size-10 overflow-hidden rounded-full border-2 border-[#a6f2d1]">
                    <img
                      src={avatarSrc(avatarVariant)}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="relative z-10 flex-1">{children}</div>
      </div>
    </div>
  );
}
