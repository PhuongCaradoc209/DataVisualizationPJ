import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";

import { cn } from "../common/cn";
import { Button } from "../ui/Button";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function MainLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  return (
    <div className="flex h-dvh bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div
        className={cn(
          "fixed inset-0 z-20 md:hidden",
          isMobileNavOpen ? "block" : "hidden",
        )}
      >
        <div
          className="absolute inset-0 bg-slate-900/40"
          onClick={closeMobileNav}
          aria-hidden="true"
        />
        <div className="absolute left-0 top-0 h-full">
          <Sidebar onNavigate={closeMobileNav} />
        </div>
        <div className="absolute right-3 top-3">
          <Button variant="secondary" size="sm" onClick={closeMobileNav}>
            Close
          </Button>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setIsMobileNavOpen(true)} />
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-350 p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
