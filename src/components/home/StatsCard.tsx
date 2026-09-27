import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "cn";
import type { Subscription, Summary } from "@/api/subscriptions";
import { daysUntil, longDate, money } from "@/lib/format";

const VISIBLE_ROWS = 2;

function dotColor(days: number): string {
  if (days <= 1) return "bg-danger";
  if (days <= 3) return "bg-warn";
  return "bg-transparent";
}

function Upcoming({ items }: { items: Subscription[] | undefined }) {
  const [open, setOpen] = useState(false);

  if (!items) return <p className="my-1 mb-2 text-[13px] text-ink-muted">Loading…</p>;
  if (items.length === 0) {
    return <p className="my-1 mb-2 text-[13px] text-ink-muted">No upcoming payments</p>;
  }

  const shown = open ? items : items.slice(0, VISIBLE_ROWS);
  const extra = items.length - VISIBLE_ROWS;

  return (
    <>
      <ul>
        {shown.map((item) => (
          <li
            key={item.id}
            className="flex h-10 items-center gap-2.5 border-b border-sand text-[13px] whitespace-nowrap"
          >
            <span className="flex min-w-0 flex-1 items-center gap-2 font-semibold">
              <span
                className={cn(
                  "size-[9px] shrink-0 rounded-full",
                  dotColor(daysUntil(item.nextBillingDate)),
                )}
              />
              <span className="truncate">{item.name}</span>
            </span>
            <span>{longDate(item.nextBillingDate)}</span>
            <span className="font-semibold">{money(item.cost)}฿</span>
          </li>
        ))}
      </ul>
      {extra > 0 && (
        <div className="mt-1.5 flex items-center justify-end gap-2.5">
          {!open && <span className="text-[13px] text-ink-muted">+{extra}</span>}
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? "Show fewer upcoming payments" : "Show more upcoming payments"}
            onClick={() => setOpen(!open)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-maroon text-white"
          >
            <ChevronDown className={cn("size-3.5 transition", open && "rotate-180")} />
          </button>
        </div>
      )}
    </>
  );
}

export function StatsCard({
  summary,
  upcoming,
}: {
  summary: Summary | undefined;
  upcoming: Subscription[] | undefined;
}) {
  const number =
    "font-display text-[34px] leading-none font-semibold tracking-tight md:text-[42px]";

  return (
    <div className="relative z-1 -mt-[18px] rounded-card border-[1.5px] border-maroon bg-cream px-[18px] pt-4 pb-3 shadow-card md:sticky md:top-6 md:mt-0">
      <div className="mb-2 flex items-baseline gap-7">
        <div>
          <span className={number}>{summary ? summary.count : "–"}</span>
          <div className="mt-0.5 text-xs text-ink-muted">
            Subscriptions
            <br />
            Tracked
          </div>
        </div>
        <div>
          <span className={number}>{summary ? money(summary.monthlyCost, true) : "–"}</span>
          <span className="mt-0.5 block text-xs text-ink-muted md:ml-1 md:inline md:text-[13px]">
            ฿/Month
          </span>
        </div>
      </div>
      <hr className="my-2 border-sand" />
      <div className="mb-2 text-xs font-semibold text-ink-muted">Upcoming Payments</div>
      <Upcoming items={upcoming} />
    </div>
  );
}
