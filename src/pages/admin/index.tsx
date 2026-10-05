import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronRight, ShieldX } from "lucide-react";
import { Link } from "react-router-dom";
import { ADMIN_PAGE_SIZE, isDenied, listUsers, type Me } from "@/api/users";
import { UserSheet } from "@/components/admin/UserSheet";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/routes/paths";

function Avatar({ name, pictureUrl }: { name: string; pictureUrl: string }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-maroon font-semibold text-white">
      {pictureUrl && !broken ? (
        <img
          src={pictureUrl}
          alt=""
          referrerPolicy="no-referrer"
          className="size-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        (name.trim()[0] ?? "?").toUpperCase()
      )}
    </div>
  );
}

function Unauthorized() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <ShieldX className="mb-3.5 size-11 text-danger" strokeWidth={1.5} />
      <p className="font-semibold">Unauthorized</p>
      <p className="mt-2 text-[13px] text-muted-foreground">
        Your account doesn&apos;t have admin access.
      </p>
      <Button asChild variant="outline" className="mt-5">
        <Link to={PATHS.HOME}>Back to home</Link>
      </Button>
    </div>
  );
}

export default function AdminPage() {
  const [selected, setSelected] = useState<Me | null>(null);

  const list = useInfiniteQuery({
    queryKey: ["admin", "users"],
    queryFn: ({ pageParam }) => listUsers(pageParam),
    initialPageParam: 0,
    getNextPageParam: (last, all) =>
      last.length === ADMIN_PAGE_SIZE ? all.length * ADMIN_PAGE_SIZE : undefined,
    retry: (count, error) => !isDenied(error) && count < 3,
  });

  const items = list.data?.pages.flat() ?? [];

  return (
    <div>
      <h1 className="mb-5 font-display text-3xl font-semibold tracking-tight">Admin</h1>

      {list.isPending && (
        <div className="flex flex-col gap-3" aria-busy="true">
          {[0, 1, 2].map((key) => (
            <div key={key} className="h-16 animate-pulse rounded-card bg-muted" />
          ))}
        </div>
      )}

      {list.isError && isDenied(list.error) && <Unauthorized />}

      {list.isError && !isDenied(list.error) && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-sm text-muted-foreground">Couldn&apos;t load users.</p>
          <Button variant="outline" size="sm" onClick={() => void list.refetch()}>
            Try again
          </Button>
        </div>
      )}

      {list.isSuccess && (
        <>
          <p className="mb-2.5 text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
            Users
          </p>
          {items.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">No users</p>
          )}
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-card bg-card p-3 text-left"
                >
                  <Avatar name={item.displayName || item.email} pictureUrl={item.pictureUrl} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">
                      {item.displayName || "No name"}
                    </span>
                    <span className="block truncate text-[13px] text-muted-foreground">
                      {item.email}
                    </span>
                  </span>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
          {list.hasNextPage && (
            <Button
              variant="outline"
              className="mt-4 w-full"
              disabled={list.isFetchingNextPage}
              onClick={() => void list.fetchNextPage()}
            >
              {list.isFetchingNextPage ? "Loading…" : "Load more"}
            </Button>
          )}
        </>
      )}

      <UserSheet target={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
