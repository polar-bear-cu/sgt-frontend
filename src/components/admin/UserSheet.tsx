import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser, isDenied, ROLES, setRole, type Me, type Role } from "@/api/users";
import { BottomSheet } from "@/components/BottomSheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";

export function UserSheet({ target, onClose }: { target: Me | null; onClose: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);

  const done = (message: string) => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    toast(message);
    close();
  };
  const role = useMutation({
    mutationFn: (next: Role) => setRole(target?.id ?? "", next),
    onSuccess: (_, next) => done(`Role set to ${next}`),
  });
  const remove = useMutation({
    mutationFn: () => deleteUser(target?.id ?? ""),
    onSuccess: () => done("User deleted"),
  });

  const busy = role.isPending || remove.isPending;
  const error = role.error ?? remove.error;
  const isSelf = target?.id === user?.id;

  function close() {
    if (busy) return;
    role.reset();
    remove.reset();
    setConfirming(false);
    onClose();
  }

  return (
    <BottomSheet
      open={target !== null}
      onOpenChange={(next) => !next && close()}
      title="Manage user"
    >
      {target && (
        <div className="flex flex-col gap-5">
          <div>
            <p className="font-semibold">{target.displayName || "No name"}</p>
            <p className="truncate text-[13px] text-muted-foreground">{target.email}</p>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
              Role
            </p>
            <div className="flex gap-2.5">
              {ROLES.map((next) => (
                <Button
                  key={next}
                  type="button"
                  variant="outline"
                  className="flex-1 capitalize"
                  disabled={busy}
                  onClick={() => role.mutate(next)}
                >
                  Make {next}
                </Button>
              ))}
            </div>
          </div>

          {error && (
            <p role="alert" className="text-xs text-danger">
              {isDenied(error)
                ? "Unauthorized: you need admin access."
                : "Something went wrong. Try again."}
            </p>
          )}

          {!isSelf && (
            <Button
              type="button"
              variant="destructive"
              size="lg"
              disabled={busy}
              onClick={() => (confirming ? remove.mutate() : setConfirming(true))}
            >
              {confirming ? "Tap again to delete" : "Delete user"}
            </Button>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
