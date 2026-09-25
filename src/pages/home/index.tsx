import { useDeferredValue, useState } from "react";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import logo from "@/assets/logo.png";
import {
  getSummary,
  listSubscriptions,
  PAGE_SIZE,
  type ListParams,
  type Subscription,
} from "@/api/subscriptions";
import { EmptyState } from "@/components/home/EmptyState";
import { StatsCard } from "@/components/home/StatsCard";
import { SubscriptionCard } from "@/components/home/SubscriptionCard";
import { Toolbar } from "@/components/home/Toolbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/hooks/useModal";
import { daysUntil } from "@/lib/format";

const UPCOMING_DAYS = 7;

function isUpcoming(item: Subscription): boolean {
  const days = daysUntil(item.nextBillingDate);
  return item.status !== "inactive" && days >= 0 && days <= UPCOMING_DAYS;
}

export default function HomePage() {
  const { user } = useAuth();
  const { openDetail } = useModal();
  const [query, setQuery] = useState<ListParams>({ sortBy: "nextBillingDate", order: "asc" });
  const search = useDeferredValue(query.name);
  const params = { ...query, name: search };

  const summary = useQuery({ queryKey: ["subscriptions", "summary"], queryFn: getSummary });

  const upcoming = useQuery({
    queryKey: ["subscriptions", "upcoming"],
    queryFn: () => listSubscriptions({ sortBy: "nextBillingDate", order: "asc", limit: 100 }),
    select: (page) => page.items.filter(isUpcoming),
  });

  const list = useInfiniteQuery({
    queryKey: ["subscriptions", "list", params],
    queryFn: ({ pageParam }) => listSubscriptions({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
    placeholderData: keepPreviousData,
  });

  const items = list.data?.pages.flatMap((page) => page.items) ?? [];
  const filtering = Boolean(search || query.status || query.type || query.category);
  const empty = list.isSuccess && items.length === 0 && !filtering;
  const firstName = (user?.name ?? "").trim().split(" ")[0];

  return (
    <div>
      <header className="-mx-5 -mt-6 flex items-center justify-between bg-maroon px-5 pt-[18px] pb-[26px] md:mx-0 md:mt-0 md:mb-6 md:rounded-sheet md:px-7 md:py-[22px]">
        <img src={logo} alt="Sub Glu Tee" className="size-10 object-contain md:size-11" />
        <span className="text-[13px] text-[#f2e9df] md:text-[15px]">
          {firstName ? `Welcome, ${firstName}` : "Welcome back"}
        </span>
      </header>

      <div className="md:grid md:grid-cols-[380px_1fr] md:items-start md:gap-7">
        <StatsCard summary={summary.data} upcoming={upcoming.data} />

        <section>
          {!empty && (
            <Toolbar
              query={query}
              onChange={(patch) => setQuery((prev) => ({ ...prev, ...patch }))}
            />
          )}

          {list.isPending && (
            <div className="flex flex-col gap-3" aria-busy="true">
              {[0, 1, 2].map((key) => (
                <div key={key} className="h-22 animate-pulse rounded-card bg-muted" />
              ))}
            </div>
          )}

          {list.isError && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                Couldn&apos;t load your subscriptions.
              </p>
              <Button variant="outline" size="sm" onClick={() => void list.refetch()}>
                Try again
              </Button>
            </div>
          )}

          {empty && <EmptyState />}

          {list.isSuccess && items.length === 0 && filtering && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No matching subscriptions
            </p>
          )}

          {items.length > 0 && (
            <>
              <ul className="flex flex-col gap-3">
                {items.map((item) => (
                  <SubscriptionCard key={item.id} item={item} onOpen={() => openDetail(item.id)} />
                ))}
              </ul>
              {list.hasNextPage && (
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  disabled={list.isFetchingNextPage}
                  onClick={() => void list.fetchNextPage()}
                >
                  {list.isFetchingNextPage ? "Loading…" : `Load more (${PAGE_SIZE})`}
                </Button>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
