import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { figmaAssets } from "../../figma/figmaAssets";

const sidebarNav = [
  {
    label: "Dashboard",
    to: "/",
    icon: figmaAssets.navDashboard,
    end: true
  },
  {
    label: "Income",
    to: "/income",
    icon: figmaAssets.navWallet,
    subItems: [
      { label: "Add Income", to: "/income/add" },
    ]
  },
  {
    label: "Expenses",
    to: "/expenses",
    icon: figmaAssets.navCard,
    subItems: [
      { label: "Add Expense", to: "/expenses/add" },
    ]
  },
  {
    label: "Budgets",
    to: "/budgets",
    icon: figmaAssets.navChart,
    subItems: [
      { label: "Add Budget", to: "/budgets/add" },
    ]
  },
];

export function FiscalAppShell({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  // Toggle sub-menu
  const toggleSubMenu = (label) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavItem = ({ item, isMobile = false }) => {
    const isActive = pathname === item.to || (item.subItems && item.subItems.some(sub => pathname === sub.to));
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isMenuOpen = !!openMenus[item.label];

    return (
      <div className="w-full">
        <div
          onClick={() => navigate(item.to)}
          className={`group flex items-center justify-between rounded-lg px-3 py-1.5 cursor-pointer transition-all duration-200 ${isActive
            ? "bg-[#10b981] text-white shadow-[0px_4px_10px_rgba(16,185,129,0.15)]"
            : "text-[#475569] hover:bg-emerald-50 hover:text-[#10b981]"
            } ${isCollapsed && !isMobile ? "justify-center" : ""}`}
        >
          <div className={`flex items-center gap-2.5 ${isCollapsed && !isMobile ? "flex-col gap-1 text-center" : ""}`}>
            <div className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-white/20" : "bg-slate-100 group-hover:bg-white"}`}>
              <img src={item.icon} alt="" className={`w-4 h-4 object-contain ${isActive ? "brightness-0 invert" : ""}`} />
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="font-semibold tracking-tight text-[13px]">{item.label}</span>
            )}
          </div>
          {hasSubItems && (!isCollapsed || isMobile) && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleSubMenu(item.label);
              }}
              className={`p-1 rounded-md transition-colors ${isActive ? "hover:bg-white/20" : "hover:bg-emerald-100"}`}
            >
              <img
                src={figmaAssets.chevronDown}
                alt=""
                className={`w-3 h-3 transition-transform duration-200 ${isActive ? "brightness-0 invert" : ""} ${isMenuOpen ? "rotate-180" : ""}`}
              />
            </div>
          )}
        </div>

        {hasSubItems && isMenuOpen && (!isCollapsed || isMobile) && (
          <div className="mt-0.5 ml-10 flex flex-col gap-0.5 border-l border-emerald-100 pl-3">
            {item.subItems.map(sub => (
              <Link
                key={sub.to}
                to={sub.to}
                className={`py-1 text-[12px] font-medium transition-colors ${pathname === sub.to ? "text-[#10b981]" : "text-[#64748b] hover:text-[#10b981]"
                  }`}
              >
                {sub.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Mobile Header (Hamburger) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white px-6 py-4 border-b border-emerald-100 shadow-sm">
        <div className="flex items-center gap-2">
          <img src={figmaAssets.logoEmerald} alt="" className="w-8 h-8" />
          <span className="text-lg font-bold text-[#064e3b] tracking-tight">Emerald Ledger</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-lg bg-emerald-50 text-emerald-600"
        >
          <img src={figmaAssets.iconMenu} alt="" className="w-6 h-6" />
        </button>
      </div>

      {/* Slide-out Drawer (Mobile Overlay) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative w-full max-w-[300px] bg-white h-full shadow-2xl flex flex-col animate-slide-in">
            <div className="p-6 border-b border-emerald-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={figmaAssets.logoEmerald} alt="" className="w-8 h-8" />
                <span className="text-xl font-bold text-[#064e3b]">Emerald</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-emerald-50 rounded-lg">
                <img src={figmaAssets.iconClose} alt="" className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {sidebarNav.map(item => <NavItem key={item.label} item={item} isMobile />)}
            </nav>

            <div className="p-4 border-t border-emerald-50 flex flex-col gap-1">
              <Link
                to="/settings"
                className="flex items-center gap-2.5 px-3 py-1.5 text-[#475569] hover:bg-emerald-50 hover:text-emerald-600 rounded-lg font-semibold transition-colors shrink-0 text-[13px]"
              >
                <img src={figmaAssets.settings} alt="" className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              <button className="flex items-center gap-2.5 px-3 py-1.5 text-[#475569] hover:bg-emerald-50 hover:text-emerald-600 rounded-lg font-semibold transition-colors shrink-0 text-[13px]">
                <div className="relative">
                  <img src={figmaAssets.bell} alt="" className="w-4 h-4" />
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 border border-white rounded-full" />
                </div>
                <span>Notifications</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg font-semibold text-[13px]"
              >
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Sidebar (Desktop) */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 h-full z-40 flex-col bg-white border-r border-emerald-100 shadow-xl transition-all duration-300 ease-in-out ${isCollapsed ? "w-30" : "w-72"
          }`}
      >
        <div className={`p-4 mb-1 flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}>
          <img src={figmaAssets.logoEmerald} alt="Logo" className="w-8 h-8 drop-shadow-sm" />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-black text-[#064e3b] leading-tight tracking-tighter">EMERALD</span>
              <span className="text-[10px] font-bold text-[#10b981] letter tracking-[0.15em]">LEDGER</span>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-4 flex flex-col gap-2">
          {sidebarNav.map(item => <NavItem key={item.label} item={item} />)}
        </nav>

        <div className="p-4 border-t border-emerald-50 flex flex-col gap-1">
          <Link
            to="/settings"
            className={`flex items-center group transition-all duration-200 rounded-lg p-2 hover:bg-emerald-50 ${isCollapsed ? "justify-center" : "gap-3 px-3"}`}
            title="Settings"
          >
            <img src={figmaAssets.settings} alt="" className="w-5 h-5 object-contain text-[#475569] group-hover:text-emerald-600" />
            {!isCollapsed && <span className="font-semibold text-[13px] text-[#475569] group-hover:text-emerald-600">Settings</span>}
          </Link>

          <button
            className={`flex items-center group transition-all duration-200 rounded-lg p-2 hover:bg-emerald-50 ${isCollapsed ? "justify-center" : "gap-3 px-3"}`}
            title="Notifications"
          >
            <div className="relative">
              <img src={figmaAssets.bell} alt="" className="w-5 h-5 object-contain text-[#475569] group-hover:text-emerald-600" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full animate-pulse" />
            </div>
            {!isCollapsed && <span className="font-semibold text-[13px] text-[#475569] group-hover:text-emerald-600">Notifications</span>}
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`flex items-center group transition-all duration-200 rounded-lg p-2 hover:bg-emerald-50 ${isCollapsed ? "justify-center" : "gap-3 px-3"}`}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <img
              src={isCollapsed ? figmaAssets.iconExpand : figmaAssets.iconCollapse}
              alt=""
              className="w-5 h-5 object-contain text-[#475569] group-hover:text-emerald-600"
            />
            {!isCollapsed && <span className="font-semibold text-[13px] text-[#475569] group-hover:text-emerald-600">Collapse View</span>}
          </button>

          <div className={`mt-2 pt-2 border-t border-emerald-50 flex flex-col gap-1 ${isCollapsed ? "items-center" : ""}`}>
            <button
              onClick={handleLogout}
              className={`flex items-center p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ${isCollapsed ? "justify-center" : "gap-3 px-3 font-semibold text-[13px]"}`}
            >
              <span className={isCollapsed ? "text-xs font-bold" : ""}>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "blur-sm" : ""
          } pt-[72px] lg:pt-0`}
        style={{ paddingLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (isCollapsed ? '160px' : '288px') : '0' }}
      >
        <div className="p-4 sm:p-6 lg:p-12 max-w-[1600px] mx-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
