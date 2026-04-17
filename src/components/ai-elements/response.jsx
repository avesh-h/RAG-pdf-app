"use client";

import { cn } from "@/lib/utils";

export function Response({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
