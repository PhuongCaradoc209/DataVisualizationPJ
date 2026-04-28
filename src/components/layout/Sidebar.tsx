import { NavLink, useLocation } from "react-router-dom";

import { cn } from "../common/cn";
import { Icon } from "../common/Icon";
import { Button } from "../ui/Button";

export interface SidebarProps {
  onNavigate?: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const navItems: Array<NavItem> = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/reports", label: "Reports", icon: "description" },
  { to: "/analysis", label: "Analysis", icon: "analytics" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

export function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white">
            <Icon name="dashboard" className="text-lg" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight text-slate-900 dark:text-slate-100">
              Data Analyst
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              Global View
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              onClick={onNavigate}
              className={({ isActive }) =>
                // '/' is an alias of the Dashboard page.
                // Keep the Dashboard nav item active in both cases.
                // This avoids duplicated nav items while preserving required routes.
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ||
                    (item.to === "/dashboard" && location.pathname === "/")
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                )
              }
            >
              <Icon name={item.icon} className="text-lg" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <Button variant="primary" className="w-full justify-center">
          <Icon name="download" className="text-lg" />
          Export
        </Button>
        <div className="text-xs text-slate-500 dark:text-slate-400">&nbsp;</div>
      </div>
    </aside>
  );
}
