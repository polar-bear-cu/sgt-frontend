import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { clearNotifications } from "@/api/notifications";
import { BottomSheet, SheetTitle } from "@/components/BottomSheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

export function ClearNotificationsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const clear = useMutation({
    mutationFn: clearNotifications,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast("Notifications cleared");
      clear.reset();
      onClose();
    },
  });

  function close() {
    if (clear.isPending) return;
    clear.reset();
    onClose();
  }

  return (
    <BottomSheet open={open} onOpenChange={(next) => !next && close()}>
      <div className="pt-1 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-danger/12 text-danger">
          <Trash2 className="size-6" />
        </div>
        <SheetTitle className="mb-2.5 font-display text-[21px] font-semibold">
          Clear all notifications?
        </SheetTitle>
        <p className="mb-5.5 text-[13px] leading-normal text-muted-foreground">
          This removes every notification from this list. Your subscriptions and reminder emails are
          not affected.
        </p>
        {clear.isError && (
          <p role="alert" className="mb-3 text-xs text-danger">
            Couldn&apos;t clear notifications. Try again.
          </p>
        )}
        <div className="flex gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={close}
            disabled={clear.isPending}
          >
            Go back
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="lg"
            className="flex-1"
            onClick={() => clear.mutate()}
            disabled={clear.isPending}
          >
            Clear all
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
