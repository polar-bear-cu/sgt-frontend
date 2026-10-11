import type { AppNotification } from "@/api/notifications";

export function NotificationCard({ item }: { item: AppNotification }) {
  return (
    <li className="rounded-card border border-sand/70 bg-card px-3.5 py-3 shadow-card">
      <p className="truncate font-display text-[19px] leading-tight font-semibold">{item.title}</p>
      <p className="mt-1 text-xs text-ink-muted">{item.content}</p>
    </li>
  );
}
