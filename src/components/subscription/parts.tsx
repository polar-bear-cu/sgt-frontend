import { cn } from "cn";
import type { SubscriptionStatus } from "@/api/subscriptions";

const TILE_COLORS = ["#1DB954", "#111111", "#113CCF", "#E50914", "#7a2020", "#6b4fbb", "#0e7c86"];

function tileColor(name: string): string {
  let total = 0;
  for (const letter of name) total += letter.charCodeAt(0);
  return TILE_COLORS[total % TILE_COLORS.length];
}

export function AppTile({ name, className }: { name: string; className?: string }) {
  return (
    <span
      style={{ background: tileColor(name) }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white shadow-[inset_0_1px_1px_rgb(255_255_255/0.5)]",
        className,
      )}
    >
      {(name[0] ?? "?").toUpperCase()}
    </span>
  );
}

const BADGES: Record<SubscriptionStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success text-success-text" },
  free_trial: { label: "Trial", className: "bg-trial text-trial-text" },
  inactive: { label: "Inactive", className: "bg-inactive text-inactive-text" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: SubscriptionStatus;
  className?: string;
}) {
  const badge = BADGES[status];
  return (
    <span
      className={cn(
        "inline-block min-w-17 rounded-full px-2.5 py-1 text-center text-[11px] font-bold whitespace-nowrap shadow-[inset_0_1px_0_rgb(255_255_255/0.5)]",
        badge.className,
        className,
      )}
    >
      {badge.label}
    </span>
  );
}
