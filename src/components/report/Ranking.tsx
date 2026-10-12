import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getBySubscription,
  MAX_MONTHS,
  type BySubscription,
  type SubscriptionSpending,
} from "@/api/reports";
import { Loadable } from "@/components/report/Loadable";
import { MonthPicker } from "@/components/report/MonthPicker";
import { Segmented } from "@/components/ui/controls";
import { baht, countMonths, currentMonth, monthRange, shiftMonth } from "@/lib/report";

type Range = "3" | "6" | "12" | "custom";

const RANGES: { value: Range; label: string }[] = [
  { value: "3", label: "3M" },
  { value: "6", label: "6M" },
  { value: "12", label: "12M" },
  { value: "custom", label: "Custom" },
];

function note(item: SubscriptionSpending): string {
  if (item.status === "inactive") return "inactive";
  if (item.type === "yearly") return "yearly";
  return `${item.count}×`;
}

function problemWith(from: string, to: string): string | null {
  const size = countMonths(from, to);
  if (size < 1) return "Start month must come before the end month";
  if (size > MAX_MONTHS) return `Pick at most ${MAX_MONTHS} months`;
  return null;
}

function Rows({ data }: { data: BySubscription }) {
  if (data.items.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No payments here</p>;
  }

  const top = data.items[0].total || 1;

  return (
    <ul className="rounded-card border border-sand bg-card px-4 py-1 shadow-card">
      {data.items.map((item, index) => (
        <li
          key={item.subscriptionId}
          className="flex items-center gap-2.5 border-b border-sand py-2.5 text-[13px] last:border-b-0"
        >
          <span className="w-[18px] font-display font-semibold text-ink-muted">{index + 1}</span>
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex justify-between font-semibold">
              <span className="truncate">
                {item.name}
                <span className="ml-1.5 text-[11px] font-medium text-ink-muted">{note(item)}</span>
              </span>
              <span>{baht(item.total)}</span>
            </div>
            <span className="block h-1.5 overflow-hidden rounded bg-sand">
              <span
                className="block h-full rounded bg-gold"
                style={{ width: `${(item.total / top) * 100}%` }}
              />
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Ranking() {
  const now = currentMonth();
  const [range, setRange] = useState<Range>("12");
  const [custom, setCustom] = useState({ from: shiftMonth(now, -11), to: now });

  const span = range === "custom" ? custom : { from: shiftMonth(now, 1 - Number(range)), to: now };
  const problem = problemWith(span.from, span.to);

  const query = useQuery({
    queryKey: ["reports", "subscriptions", span.from, span.to],
    queryFn: () => getBySubscription(span.from, span.to),
    enabled: !problem,
    placeholderData: keepPreviousData,
  });

  return (
    <section>
      <h2 className="mt-8 mb-3 font-display text-lg font-semibold">Spent per Subscription</h2>
      <Segmented label="Range" value={range} options={RANGES} onChange={setRange} />

      {range === "custom" ? (
        <div className="mt-3 flex items-center gap-2 text-[13px]">
          <MonthPicker
            label="From month"
            value={custom.from}
            max={now}
            onChange={(from) => setCustom({ ...custom, from })}
          />
          <span className="text-ink-muted">to</span>
          <MonthPicker
            label="To month"
            value={custom.to}
            max={now}
            onChange={(to) => setCustom({ ...custom, to })}
          />
        </div>
      ) : (
        <p className="mt-3 text-xs text-ink-muted">{monthRange(span.from, span.to)}</p>
      )}

      <div className="mt-3">
        {problem ? (
          <p className="py-6 text-center text-sm text-danger">{problem}</p>
        ) : (
          <Loadable query={query} height="h-56">
            {(data) => <Rows data={data} />}
          </Loadable>
        )}
      </div>
    </section>
  );
}
