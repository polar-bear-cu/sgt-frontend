import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { deleteMe } from "@/api/users";
import { BottomSheet, SheetTitle } from "@/components/BottomSheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function DeleteAccountSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: deleteMe,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });

  function close() {
    if (remove.isPending) return;
    remove.reset();
    onClose();
  }

  return (
    <BottomSheet open={open} onOpenChange={(next) => !next && close()}>
      <div className="pt-1 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-danger/12 text-danger">
          <Trash2 className="size-6" />
        </div>
        <SheetTitle className="mb-2.5 font-display text-[21px] font-semibold">
          Delete your account?
        </SheetTitle>
        <p className="mb-5.5 text-[13px] leading-normal text-muted-foreground">
          This <b>permanently</b> deletes your account and all your subscriptions and history. This
          cannot be undone. Signing in again later starts a new, empty account.
        </p>
        {remove.isError && (
          <p role="alert" className="mb-3 text-xs text-danger">
            Couldn&apos;t delete your account. Try again.
          </p>
        )}
        <div className="flex gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={close}
            disabled={remove.isPending}
          >
            Go back
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="lg"
            className="flex-1"
            onClick={() => remove.mutate()}
            disabled={remove.isPending}
          >
            Delete account
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
