import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { deleteNotification, type AppNotification } from "@/api/notifications";
import { useToast } from "@/hooks/useToast";

export function NotificationCard({ item }: { item: AppNotification }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const remove = useMutation({
    mutationFn: () => deleteNotification(item.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast("Notification deleted");
    },
    onError: () => toast("Couldn't delete notification. Try again."),
  });

  return (
    <li className="flex items-start gap-3 rounded-card border border-sand/70 bg-card px-3.5 py-3 shadow-card">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {!item.read_status && (
            <span className="size-2 shrink-0 rounded-full bg-maroon">
              <span className="sr-only">Unread</span>
            </span>
          )}
          <p className="truncate font-display text-[19px] leading-tight font-semibold">
            {item.title}
          </p>
        </div>
        <p className="mt-1 text-xs text-ink-muted">{item.content}</p>
      </div>
      <button
        type="button"
        aria-label={`Delete notification: ${item.title}`}
        title="Delete"
        onClick={() => remove.mutate()}
        disabled={remove.isPending}
        className="flex size-[30px] shrink-0 cursor-pointer items-center justify-center text-foreground transition disabled:pointer-events-none disabled:opacity-40"
      >
        <X className="size-3.5" />
      </button>
    </li>
  );
}
