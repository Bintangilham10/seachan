import { cn } from "@/lib/utils";
import type { RoomStatus } from "@/lib/types";

const statusClass: Record<RoomStatus, string> = {
  lobby: "bg-amber-100 text-amber-900 ring-1 ring-amber-200",
  running: "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200",
  finished: "bg-slate-200 text-slate-800 ring-1 ring-slate-300"
};

export function StatusBadge({ status }: { status: RoomStatus }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.15em] shadow-sm",
        statusClass[status]
      )}
    >
      {status}
    </span>
  );
}
