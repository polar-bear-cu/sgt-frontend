import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover } from "radix-ui";
import { cn } from "cn";
import { monthShort } from "@/lib/report";

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function keyOf(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function MonthPicker({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: string;
  max: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(Number(value.slice(0, 4)));
  const maxYear = Number(max.slice(0, 4));

  function toggle(next: boolean) {
    if (next) setYear(Number(value.slice(0, 4)));
    setOpen(next);
  }

  return (
    <Popover.Root open={open} onOpenChange={toggle}>
      <Popover.Trigger
        aria-label={label}
        className="flex cursor-pointer items-center gap-1.5 rounded-full border border-sand bg-card px-3.5 py-1.5 text-[13px] font-semibold"
      >
        {monthShort(value)} {value.slice(0, 4)}
        <ChevronDown className="size-3.5 text-ink-muted" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 w-64 rounded-card border border-sand bg-card p-3 shadow-card"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous year"
              onClick={() => setYear(year - 1)}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-accent"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-sm font-bold">{year}</span>
            <button
              type="button"
              aria-label="Next year"
              disabled={year >= maxYear}
              onClick={() => setYear(year + 1)}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-accent disabled:cursor-default disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {NUMBERS.map((month) => {
              const key = keyOf(year, month);
              return (
                <button
                  key={key}
                  type="button"
                  disabled={key > max}
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  className={cn(
                    "cursor-pointer rounded-full py-2 text-[13px] font-semibold transition disabled:cursor-default disabled:opacity-30",
                    key === value ? "bg-maroon text-white" : "hover:bg-accent",
                  )}
                >
                  {monthShort(key)}
                </button>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
