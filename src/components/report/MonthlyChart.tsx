import { cn } from "cn";
import type { Monthly } from "@/api/reports";
import { baht, compact, monthRange, monthShort } from "@/lib/report";

export function MonthlyChart({ data }: { data: Monthly }) {
  const { months } = data;
  const top = Math.max(...months.map((item) => item.total), 1);
  const last = months.length - 1;

  return (
    <div>
      <div className="mb-1.5">
        <span className="font-display text-4xl font-semibold">{baht(data.averagePerMonth)}</span>
        <span className="ml-1 text-sm font-semibold text-ink-muted">/Month</span>
        <p className="text-[13px] text-ink-muted">Average spent, past {months.length} months</p>
      </div>

      <h2 className="mt-6 mb-3 font-display text-lg font-semibold">Spending per Month</h2>
      <div
        className="flex h-[130px] items-end gap-1 md:h-[180px] md:gap-1.5"
        role="img"
        aria-label="Spending per month"
      >
        {months.map((item, index) => (
          <div key={item.month} className="flex h-full flex-1 flex-col items-center justify-end">
            <span className="mb-1 text-[8.5px] font-bold whitespace-nowrap text-ink-muted md:text-[10px]">
              {compact(item.total)}
            </span>
            <div
              className={cn("w-full rounded-t-[4px]", index === last ? "bg-maroon" : "bg-gold")}
              style={{ height: `${Math.max(3, (item.total / top) * 100)}%` }}
            />
            <span
              className={cn(
                "mt-1 text-[9px] font-semibold text-ink-muted md:text-[11px]",
                index === last && "font-bold text-maroon",
              )}
            >
              {monthShort(item.month)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex gap-4 text-[11px] text-ink-muted">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-[3px] bg-gold" />
          Full month
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-[3px] bg-maroon" />
          This month so far
        </span>
      </div>

      <div className="mt-2.5 flex items-baseline justify-between">
        <b className="font-display text-[22px]">{baht(data.total)}</b>
        <span className="text-xs text-ink-muted">
          Total, {monthRange(months[0].month, months[last].month)}
        </span>
      </div>
    </div>
  );
}
