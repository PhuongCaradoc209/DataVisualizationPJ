import type * as React from "react";

import { cn } from "./cn";

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
}

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <span
      className={cn(
        "material-symbols-outlined select-none leading-none",
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
}
