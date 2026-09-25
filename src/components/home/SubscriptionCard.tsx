import { cn } from "cn";
import type { Subscription } from "@/api/subscriptions";
import { AppTile, StatusBadge } from "@/components/subscription/parts";
import { daysSince, money, shortDate } from "@/lib/format";

export function SubscriptionCard({ item, onOpen }: { item: Subscription; onOpen: () => void }) {
  const inactive = item.status === "inactive";

  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="flex h-22 w-full cursor-pointer items-center justify-between gap-2 rounded-card border border-sand/70 bg-card px-3.5 text-left shadow-card transition active:scale-[0.98]"
      >
        <span className="flex min-w-0 flex-1 items-center gap-2.5">
          <AppTile name={item.name} className={cn("size-10", inactive && "opacity-55 grayscale")} />
          <span className="min-w-0">
            <span
              className={cn(
                "block truncate font-display text-[19px] leading-tight font-semibold",
                inactive && "text-ink-muted",
              )}
            >
              {item.name}
            </span>
            <span className="mt-[3px] flex gap-1 text-xs text-ink-muted">
              {inactive ? (
                <span className="truncate">No upcoming charge</span>
              ) : (
                <>
                  <span className="min-w-0 truncate">Next charge</span>
                  <span className="shrink-0">·</span>
                  <b className="shrink-0 text-[13px] font-bold text-ink">
                    {shortDate(item.nextBillingDate)}
                  </b>
                </>
              )}
            </span>
            <span className="mt-0.5 block truncate text-[11px] text-ink-muted/80">
              Since {shortDate(item.createdAt)} · {daysSince(item.createdAt)}d
            </span>
          </span>
        </span>
        <span className="shrink-0 text-right whitespace-nowrap">
          <span className={cn("block text-base font-bold", inactive && "text-ink-muted")}>
            {money(item.cost)}฿
            <span className="text-[11px] font-normal text-ink-muted">
              /{item.type === "yearly" ? "Year" : "Month"}
            </span>
          </span>
          <StatusBadge status={item.status} className="mt-1.5" />
        </span>
      </button>
    </li>
  );
}
