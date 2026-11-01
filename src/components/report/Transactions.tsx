import { useState, type ReactNode } from "react";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { downloadCharges, getCharges, type MonthCharges } from "@/api/reports";
import { Loadable } from "@/components/report/Loadable";
import { Button } from "@/components/ui/button";
import { categoryColor } from "@/lib/category";
import { useToast } from "@/hooks/useToast";
import { baht, currentMonth, dayParts, monthLong, shiftMonth, titleCase } from "@/lib/report";

function Month({ data, action }: { data: MonthCharges; action: ReactNode }) {
  if (data.count === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No payments this month</p>;
  }

  return (
    <>
      <div className="mb-3 flex justify-center">{action}</div>

      <div className="mb-3 rounded-card border border-sand bg-card p-4 shadow-card">
        <div className="flex h-3.5 gap-0.5 overflow-hidden rounded-lg">
          {data.categories.map((item) => (
            <span
              key={item.category}
              className="block h-full"
              style={{
                background: categoryColor(item.category),
                width: `${(item.total / data.total) * 100}%`,
              }}
            />
          ))}
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-x-3.5 gap-y-2 text-[13px]">
          {data.categories.map((item) => (
            <li key={item.category} className="flex items-center gap-2">
              <span
                style={{ background: categoryColor(item.category) }}
                className="size-2.5 shrink-0 rounded-[3px]"
              />
              {titleCase(item.category)}
              <span className="ml-auto font-semibold">{baht(item.total)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-card border border-sand bg-card px-4 py-1 shadow-card">
        {data.items.map((item, index) => {
          const { day, weekday } = dayParts(item.chargedAt);
          return (
            <div
              key={`${item.subscriptionId}-${index}`}
              className="grid grid-cols-[44px_1fr_auto] items-center gap-2.5 border-b border-dashed border-sand py-2.5 text-[13px]"
            >
              <span className="font-display leading-[1.1] font-semibold">
                {day}
                <small className="block font-sans text-[10px] font-semibold text-ink-muted">
                  {weekday}
                </small>
              </span>
              <span>
                <b className="block text-sm">{item.name}</b>
                <span className="text-[11px] text-ink-muted">
                  {titleCase(item.category)} · {item.type}
                </span>
              </span>
              <span className="font-bold tabular-nums">{baht(item.amount)}</span>
            </div>
          );
        })}
        <div className="flex justify-between pt-3 pb-2.5 font-bold">
          <span className="text-xs tracking-[.06em] text-ink-muted uppercase">
            Total · {data.count} {data.count === 1 ? "payment" : "payments"}
          </span>
          <span>{baht(data.total)}</span>
        </div>
      </div>
    </>
  );
}

export function Transactions() {
  const toast = useToast();
  const now = currentMonth();
  const [month, setMonth] = useState(now);

  const query = useQuery({
    queryKey: ["reports", "charges", month],
    queryFn: () => getCharges(month),
    placeholderData: keepPreviousData,
  });

  const download = useMutation({
    mutationFn: () => downloadCharges(month),
    onError: () => toast("Couldn't export the CSV"),
  });

  return (
    <section>
      <h2 className="mt-8 mb-3 font-display text-lg font-semibold md:mt-0">Transactions</h2>

      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setMonth(shiftMonth(month, -1))}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-accent"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-[15px] font-bold">{monthLong(month)}</span>
        <button
          type="button"
          aria-label="Next month"
          disabled={month >= now}
          onClick={() => setMonth(shiftMonth(month, 1))}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-accent disabled:cursor-default disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <Loadable query={query} height="h-64">
        {(data) => (
          <Month
            data={data}
            action={
              <Button
                variant="secondary"
                size="sm"
                className="h-9 rounded-full px-4 text-xs"
                disabled={download.isPending}
                onClick={() => download.mutate()}
              >
                <Download className="size-3.5" />
                {download.isPending
                  ? "Exporting…"
                  : `Export ${monthLong(month).replace(/(\w{3})\w*/, "$1")} · CSV`}
              </Button>
            }
          />
        )}
      </Loadable>
    </section>
  );
}
