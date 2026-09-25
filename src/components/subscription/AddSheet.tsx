import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSubscription, listSubscriptions } from "@/api/subscriptions";
import { DEFAULT_TIME_IN_ADVANCED, getMe } from "@/api/users";
import { BottomSheet } from "@/components/BottomSheet";
import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";
import { useToast } from "@/hooks/useToast";
import { emptyFormValues, toInput } from "@/lib/subscription-form";

export function AddSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const me = useQuery({ queryKey: ["me"], queryFn: getMe, enabled: open });
  const names = useQuery({
    queryKey: ["subscriptions", "names"],
    queryFn: () => listSubscriptions({ limit: 100 }),
    select: (page) => page.items.map((item) => item.name),
    enabled: open,
  });
  const add = useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast("Subscription added");
      onClose();
    },
  });

  const reminder = Math.max(1, me.data?.timeInAdvanced ?? DEFAULT_TIME_IN_ADVANCED);

  return (
    <BottomSheet
      open={open}
      onOpenChange={(next) => !next && onClose()}
      title="Add Subscription"
      size="form"
    >
      <SubscriptionForm
        key={reminder}
        mode="add"
        defaults={emptyFormValues(reminder)}
        existingNames={names.data}
        pending={add.isPending}
        failed={add.isError}
        onSubmit={(values) => add.mutate(toInput(values))}
        onCancel={onClose}
      />
    </BottomSheet>
  );
}
