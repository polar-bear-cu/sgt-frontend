import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Trash2 } from "lucide-react";
import { listNotifications } from "@/api/notifications";
import { ClearNotificationsSheet } from "@/components/notifications/ClearNotificationsSheet";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const [clearing, setClearing] = useState(false);
  const list = useQuery({ queryKey: ["notifications"], queryFn: listNotifications });
  const items = list.data ?? [];

  return (
    <div>
      <header className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Notification</h1>
        <button
          type="button"
          aria-label="Clear all notifications"
          title="Clear all"
          onClick={() => setClearing(true)}
          disabled={items.length === 0}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-danger/12 text-danger transition active:scale-90 disabled:pointer-events-none disabled:opacity-40"
        >
          <Trash2 className="size-4" />
        </button>
      </header>

      {list.isPending && (
        <div className="flex flex-col gap-3" aria-busy="true">
          {[0, 1, 2].map((key) => (
            <div key={key} className="h-17 animate-pulse rounded-card bg-muted" />
          ))}
        </div>
      )}

      {list.isError && (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-sm text-muted-foreground">Couldn&apos;t load your notifications.</p>
          <Button variant="outline" size="sm" onClick={() => void list.refetch()}>
            Try again
          </Button>
        </div>
      )}

      {list.isSuccess && items.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center text-sm md:py-24">
          <Bell className="mb-3.5 size-11 text-sand" strokeWidth={1.5} />
          <p>You&apos;re all caught up. No notifications</p>
        </div>
      )}

      {items.length > 0 && (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <NotificationCard key={item.id} item={item} />
          ))}
        </ul>
      )}

      <ClearNotificationsSheet open={clearing} onClose={() => setClearing(false)} />
    </div>
  );
}
