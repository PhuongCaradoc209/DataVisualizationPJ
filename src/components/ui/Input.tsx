import type * as React from "react";

import { cn } from "../common/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "h-10 w-full rounded-lg border-0 bg-slate-100 px-3 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100",
        "placeholder:text-slate-400",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
