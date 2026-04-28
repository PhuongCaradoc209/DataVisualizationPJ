import { useLocation } from "react-router-dom";

import { Icon } from "../common/Icon";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export interface HeaderProps {
  onMenuClick?: () => void;
}

function getTitleFromPath(pathname: string): string {
  if (pathname === "/" || pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/reports")) return "Reports";
  if (pathname.startsWith("/analysis")) return "Analysis";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Dashboard";
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const title = getTitleFromPath(location.pathname);

  return (
    <header className="sticky top-0 z-10 h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex h-full max-w-350 items-center justify-between gap-6 px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            <Icon name="menu" className="text-lg" />
          </Button>

          <div className="flex items-center gap-2">
            <Icon name="rocket_launch" className="text-primary" />
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-lg">
              {title}
            </h1>
          </div>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-md">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Search datasets, reports..."
              className="pl-10"
              aria-label="Search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" aria-label="Notifications">
            <Icon name="notifications" className="text-lg text-slate-500" />
          </Button>
          <Button variant="ghost" size="sm" aria-label="Account">
            <Icon name="account_circle" className="text-lg text-slate-500" />
          </Button>
        </div>
      </div>
    </header>
  );
}
