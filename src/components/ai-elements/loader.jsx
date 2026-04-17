"use client";

import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center justify-center p-4", className)}
      {...props}
    >
      <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
