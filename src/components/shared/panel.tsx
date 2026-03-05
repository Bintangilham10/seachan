import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
  className?: string;
}

export function Panel({ className, children }: PropsWithChildren<PanelProps>) {
  return (
    <section
      className={cn(
        "rounded-[1.4rem] border border-white/70 bg-white/82 p-4 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.65)] backdrop-blur-sm sm:rounded-[1.75rem] sm:p-6",
        className
      )}
    >
      {children}
    </section>
  );
}
