import type { ReactNode } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export function Loadable<T>({
  query,
  height = "h-40",
  children,
}: {
  query: UseQueryResult<T>;
  height?: string;
  children: (data: T) => ReactNode;
}) {
  if (query.isPending) {
    return <div className={`${height} animate-pulse rounded-card bg-muted`} aria-busy="true" />;
  }

  if (query.isError || query.data === undefined) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <p className="text-sm text-muted-foreground">Couldn&apos;t load this part of the report.</p>
        <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div
      aria-busy={query.isPlaceholderData}
      className={query.isPlaceholderData ? "opacity-50 transition-opacity" : "transition-opacity"}
    >
      {children(query.data)}
    </div>
  );
}
