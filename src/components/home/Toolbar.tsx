import { useState } from "react";
import { ArrowDownUp, ListFilter } from "lucide-react";
import { cn } from "cn";
import {
  CATEGORIES,
  SORT_FIELDS,
  STATUSES,
  TYPES,
  type ListParams,
  type SortField,
} from "@/api/subscriptions";

const buttonClass =
  "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-sand bg-card text-maroon shadow-card transition active:scale-90";

function Select<T extends string>({
  label,
  value,
  options,
  blank,
  onChange,
}: {
  label: string;
  value: T | undefined;
  options: { value: T; label: string }[];
  blank?: string;
  onChange: (value: T | undefined) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold text-ink-muted">
      {label}
      <select
        value={value ?? ""}
        onChange={(event) => onChange((event.target.value || undefined) as T | undefined)}
        className="rounded-xl border border-sand bg-card px-3 py-2 text-[13px] font-normal text-ink"
      >
        {blank && <option value="">{blank}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toolbar({
  query,
  onChange,
}: {
  query: ListParams;
  onChange: (patch: Partial<ListParams>) => void;
}) {
  const [panel, setPanel] = useState<"filter" | "sort" | null>(null);
  const filtering = Boolean(query.status || query.type || query.category);
  const sorting = query.sortBy !== "nextBillingDate" || query.order !== "asc";
  const toggle = (name: "filter" | "sort") => setPanel(panel === name ? null : name);
  const lit = "border-maroon bg-maroon text-white";

  return (
    <div className="mt-5 mb-3.5 md:mt-0 md:mb-4">
      <div className="flex gap-2">
        <input
          type="search"
          aria-label="Find your subscription"
          placeholder="Find Your Subscription"
          value={query.name ?? ""}
          onChange={(event) => onChange({ name: event.target.value })}
          className="min-w-0 flex-1 rounded-2xl border border-sand bg-card px-3.5 py-[11px] text-[13px] shadow-card outline-none focus:border-maroon focus:ring-[3px] focus:ring-maroon/12"
        />
        <button
          type="button"
          aria-label="Filter"
          aria-expanded={panel === "filter"}
          onClick={() => toggle("filter")}
          className={cn(buttonClass, (panel === "filter" || filtering) && lit)}
        >
          <ListFilter className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Sort"
          aria-expanded={panel === "sort"}
          onClick={() => toggle("sort")}
          className={cn(buttonClass, (panel === "sort" || sorting) && lit)}
        >
          <ArrowDownUp className="size-4" />
        </button>
      </div>

      {panel === "filter" && (
        <div className="mt-3 grid grid-cols-3 items-end gap-2.5 rounded-card border border-sand bg-card p-3.5 shadow-card max-sm:grid-cols-1">
          <Select
            label="Status"
            blank="All"
            value={query.status}
            options={STATUSES}
            onChange={(status) => onChange({ status })}
          />
          <Select
            label="Type"
            blank="All"
            value={query.type}
            options={TYPES}
            onChange={(type) => onChange({ type })}
          />
          <Select
            label="Category"
            blank="All"
            value={query.category}
            options={CATEGORIES}
            onChange={(category) => onChange({ category })}
          />
          {filtering && (
            <button
              type="button"
              onClick={() => onChange({ status: undefined, type: undefined, category: undefined })}
              className="cursor-pointer text-left text-xs font-semibold text-maroon underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {panel === "sort" && (
        <div className="mt-3 flex items-end gap-2.5 rounded-card border border-sand bg-card p-3.5 shadow-card">
          <div className="min-w-0 flex-1">
            <Select<SortField>
              label="Sort by"
              value={query.sortBy}
              options={SORT_FIELDS}
              onChange={(sortBy) => onChange({ sortBy: sortBy ?? "nextBillingDate" })}
            />
          </div>
          <button
            type="button"
            onClick={() => onChange({ order: query.order === "asc" ? "desc" : "asc" })}
            className="cursor-pointer rounded-xl border border-sand bg-card px-3 py-2 text-[13px] font-semibold text-maroon"
          >
            {query.order === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
      )}
    </div>
  );
}
