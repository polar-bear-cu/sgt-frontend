import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Trash2 } from "lucide-react";
import { deleteUser, setRole, type Me } from "@/api/users";
import { BottomSheet } from "@/components/BottomSheet";
import { ConfirmView } from "@/components/subscription/ConfirmView";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";
import { shortDate } from "@/lib/format";

export function UserSheet({ target, onClose }: { target: Me | null; onClose: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [confirming, setConfirming] = useState<"admin" | "delete" | null>(null);

  const done = (message: string) => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    toast(message);
    close();
  };
  const role = useMutation({
    mutationFn: () => setRole(target?.id ?? "", "admin"),
    onSuccess: () => done("User is now an admin"),
  });
  const remove = useMutation({
    mutationFn: () => deleteUser(target?.id ?? ""),
    onSuccess: () => done("User deleted"),
  });

  const busy = role.isPending || remove.isPending;
  const isSelf = target?.id === user?.id;
  const locked = isSelf || target?.role === "admin";
  const name = target?.displayName || target?.email;

  function back() {
    role.reset();
    remove.reset();
    setConfirming(null);
  }

  function close() {
    if (busy) return;
    back();
    onClose();
  }

  return (
    <BottomSheet
      open={target !== null}
      onOpenChange={(next) => !next && close()}
      title={confirming ? undefined : "Manage user"}
      label="Manage user"
      size={confirming ? "confirm" : "default"}
    >
      {target && confirming === "admin" ? (
        <ConfirmView
          icon={<ShieldCheck className="size-6" />}
          iconClass="bg-gold/20 text-gold-dark"
          title="Make this user an admin?"
          confirmLabel="Make Admin"
          confirmVariant="secondary"
          pending={role.isPending}
          failed={role.isError}
          onBack={back}
          onConfirm={() => role.mutate()}
        >
          {name} will be able to view every user, promote users and delete users. Admins can&apos;t
          be demoted, so this <b>cannot be undone</b>.
        </ConfirmView>
      ) : target && confirming === "delete" ? (
        <ConfirmView
          icon={<Trash2 className="size-6" />}
          iconClass="bg-danger/12 text-danger"
          title="Delete this user?"
          confirmLabel="Delete user"
          confirmVariant="destructive"
          pending={remove.isPending}
          failed={remove.isError}
          onBack={back}
          onConfirm={() => remove.mutate()}
        >
          This <b>permanently</b> deletes {name}&apos;s account and all their subscriptions and
          history. This cannot be undone.
        </ConfirmView>
      ) : (
        target && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-semibold">{target.displayName || "No name"}</p>
              <p className="truncate text-[13px] text-muted-foreground">{target.email}</p>
              {target.createdAt && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Joined {shortDate(target.createdAt)} · Last login {shortDate(target.lastLoginAt)}
                </p>
              )}
            </div>

            <div>
              <p className="mb-2 text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
                Role
              </p>
              <p className="font-semibold">{target.role === "admin" ? "Admin" : "User"}</p>
            </div>

            {!locked && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => setConfirming("admin")}
                >
                  Make Admin
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="lg"
                  onClick={() => setConfirming("delete")}
                >
                  Delete user
                </Button>
              </>
            )}
          </div>
        )
      )}
    </BottomSheet>
  );
}
