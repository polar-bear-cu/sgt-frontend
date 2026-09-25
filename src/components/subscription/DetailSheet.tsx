import { useEffect, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Pause, Play, Trash2, X } from "lucide-react";
import {
  CATEGORIES,
  deleteSubscription,
  getSubscription,
  setSubscriptionStatus,
  updateSubscription,
  type Subscription,
} from "@/api/subscriptions";
import { BottomSheet } from "@/components/BottomSheet";
import { ConfirmView } from "@/components/subscription/ConfirmView";
import { AppTile, StatusBadge } from "@/components/subscription/parts";
import { SubscriptionForm } from "@/components/subscription/SubscriptionForm";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { useToast } from "@/hooks/useToast";
import { daysUntil, fromDateInput, longDate, money, toDateInput } from "@/lib/format";
import { toFormValues, toInput, type FormValues } from "@/lib/subscription-form";

type View = "detail" | "edit" | "save" | "cancel" | "delete" | "reactivate";

function nextBillingFrom(item: Subscription): string {
  const date = new Date(item.nextBillingDate);
  while (daysUntil(date.toISOString()) < 0) {
    if (item.type === "yearly") date.setFullYear(date.getFullYear() + 1);
    else date.setMonth(date.getMonth() + 1);
  }
  return toDateInput(date.toISOString());
}

function ReactivateView({
  item,
  pending,
  failed,
  onBack,
  onConfirm,
}: {
  item: Subscription;
  pending: boolean;
  failed: boolean;
  onBack: () => void;
  onConfirm: (date: string) => void;
}) {
  const [date, setDate] = useState(() => nextBillingFrom(item));
  const today = toDateInput(new Date().toISOString());
  const valid = date !== "" && date >= today;

  return (
    <form
      className="text-center"
      onSubmit={(event) => {
        event.preventDefault();
        if (valid) onConfirm(date);
      }}
    >
      <div className="mx-auto mb-3.5 flex size-12 items-center justify-center rounded-full bg-gold/20 text-gold-dark">
        <Play className="size-6" />
      </div>
      <h3 className="mb-2.5 font-display text-[21px] font-semibold">Reactivate {item.name}?</h3>
      <p className="mb-4 text-[13px] leading-normal text-muted-foreground">
        We&apos;ll start tracking it again and send reminders before the next billing date.
      </p>
      <div className="mb-5 text-left">
        <Field
          id="reactivateDate"
          label="Next billing date"
          required
          error={date !== "" && !valid ? "Pick today or a later date." : undefined}
        >
          <Input
            id="reactivateDate"
            type="date"
            min={today}
            value={date}
            aria-invalid={!valid ? true : undefined}
            onChange={(event) => setDate(event.target.value)}
          />
        </Field>
      </div>
      {failed && (
        <p role="alert" className="mb-3 text-xs text-danger">
          Something went wrong. Try again.
        </p>
      )}
      <div className="flex gap-2.5 md:justify-center">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1 md:w-[170px] md:flex-none"
          onClick={onBack}
          disabled={pending}
        >
          Go back
        </Button>
        <Button
          type="submit"
          size="lg"
          className="flex-1 md:w-[170px] md:flex-none"
          disabled={pending || !valid}
        >
          Confirm Reactivate
        </Button>
      </div>
    </form>
  );
}

function Row({ label, value, last }: { label: string; value: ReactNode; last?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 py-3 text-sm ${last ? "" : "border-b border-border"}`}
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}

function Details({
  item,
  onClose,
  onEdit,
  onCancel,
  onDelete,
  onReactivate,
}: {
  item: Subscription;
  onClose: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onReactivate: () => void;
}) {
  const category = CATEGORIES.find((entry) => entry.value === item.category)?.label;
  const daysLeft = item.ftEndDate ? Math.max(0, daysUntil(item.ftEndDate)) : 0;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <AppTile name={item.name} className="size-11 rounded-2xl" />
          <div className="min-w-0">
            <div className="truncate text-[19px] font-bold">{item.name}</div>
            <StatusBadge status={item.status} />
          </div>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex size-[30px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-border"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <Row
        label="Cost"
        value={`${money(item.cost)}฿ / ${item.type === "yearly" ? "Year" : "Month"}`}
      />
      <Row label="Category" value={category} />
      <Row label="Next billing date" value={longDate(item.nextBillingDate)} />
      <Row label="Tracking since" value={longDate(item.createdAt)} last />

      {item.ftEndDate && (
        <>
          <p className="mt-5 mb-2 text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
            Trial Info
          </p>
          <div className="rounded-2xl bg-accent px-3.5 py-1">
            <Row label="Trial ends" value={longDate(item.ftEndDate)} />
            <Row
              label="Days remaining"
              value={`${daysLeft} ${daysLeft === 1 ? "day" : "days"}`}
              last
            />
            <p className="pt-1 pb-2.5 text-xs leading-normal text-muted-foreground">
              Cost and next billing date above already reflect what you&apos;ll pay once the trial
              ends — expected based on your trial dates, not confirmed as actually charged by the
              provider.
            </p>
          </div>
        </>
      )}

      {item.status === "inactive" ? (
        <Button type="button" size="lg" className="mt-4 w-full" onClick={onReactivate}>
          <Play className="size-4" />
          Reactivate
        </Button>
      ) : (
        <div className="mt-4 flex gap-2.5">
          <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onEdit}>
            Edit
          </Button>
          <Button type="button" size="lg" className="flex-1" onClick={onCancel}>
            Cancel Sub
          </Button>
        </div>
      )}
      <button
        type="button"
        onClick={onDelete}
        className="mx-auto mt-3.5 flex cursor-pointer items-center gap-1.5 py-2 text-sm font-semibold text-danger"
      >
        <Trash2 className="size-[15px]" />
        Delete Subscription
      </button>
    </>
  );
}

export function DetailSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [view, setView] = useState<View>("detail");
  const [draft, setDraft] = useState<FormValues | null>(null);

  const query = useQuery({
    queryKey: ["subscriptions", "detail", id],
    queryFn: () => getSubscription(id),
  });
  const item = query.data;

  useEffect(() => {
    if (query.isError) onClose();
  }, [query.isError, onClose]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["subscriptions"] });

  const save = useMutation({
    mutationFn: (values: FormValues) =>
      updateSubscription(id, {
        ...toInput(values),
        ftEndDate: item?.ftEndDate ?? null,
        status: item?.status,
      }),
    onSuccess: () => {
      void refresh();
      toast("Subscription saved");
      setDraft(null);
      setView("detail");
    },
  });

  const cancel = useMutation({
    mutationFn: () => setSubscriptionStatus(id, "inactive"),
    onSuccess: () => {
      void refresh();
      toast("Subscription cancelled");
      onClose();
    },
  });

  const reactivate = useMutation({
    mutationFn: ({ current, date }: { current: Subscription; date: string }) =>
      updateSubscription(id, {
        name: current.name,
        cost: current.cost,
        type: current.type,
        category: current.category,
        nextBillingDate: fromDateInput(date),
        reminderTimeInAdvanced: current.reminderTimeInAdvanced,
        ftEndDate: current.ftEndDate,
        status: current.ftEndDate && daysUntil(current.ftEndDate) > 0 ? "free_trial" : "active",
      }),
    onSuccess: () => {
      void refresh();
      toast("Subscription reactivated");
      setView("detail");
    },
  });

  const remove = useMutation({
    mutationFn: () => deleteSubscription(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["subscriptions", "detail", id] });
      void refresh();
      toast("Subscription deleted");
      onClose();
    },
  });

  const size = view === "detail" ? "detail" : view === "edit" ? "form" : "confirm";

  return (
    <BottomSheet
      open
      onOpenChange={(next) => !next && onClose()}
      title={view === "edit" ? "Edit Subscription" : undefined}
      label={item?.name ?? "Subscription"}
      size={size}
    >
      {!item ? (
        <div className="flex animate-pulse flex-col gap-3 py-2" aria-busy="true">
          <div className="h-11 w-40 rounded-2xl bg-muted" />
          <div className="h-4 rounded-full bg-muted" />
          <div className="h-4 rounded-full bg-muted" />
          <div className="h-4 rounded-full bg-muted" />
        </div>
      ) : view === "detail" ? (
        <Details
          item={item}
          onClose={onClose}
          onEdit={() => setView("edit")}
          onCancel={() => setView("cancel")}
          onDelete={() => setView("delete")}
          onReactivate={() => setView("reactivate")}
        />
      ) : view === "edit" ? (
        <SubscriptionForm
          mode="edit"
          defaults={draft ?? toFormValues(item)}
          onSubmit={(values) => {
            setDraft(values);
            setView("save");
          }}
          onCancel={() => {
            setDraft(null);
            setView("detail");
          }}
        />
      ) : view === "save" && draft ? (
        <ConfirmView
          icon={<Check className="size-6" />}
          iconClass="bg-gold/20 text-gold-dark"
          title="Save changes?"
          confirmLabel="Confirm Save"
          confirmVariant="secondary"
          pending={save.isPending}
          failed={save.isError}
          onBack={() => setView("edit")}
          onConfirm={() => save.mutate(draft)}
        >
          Your changes to {item.name} will be saved and applied right away, including any updated
          reminder schedule.
        </ConfirmView>
      ) : view === "reactivate" ? (
        <ReactivateView
          item={item}
          pending={reactivate.isPending}
          failed={reactivate.isError}
          onBack={() => setView("detail")}
          onConfirm={(date) => reactivate.mutate({ current: item, date })}
        />
      ) : view === "cancel" ? (
        <ConfirmView
          icon={<Pause className="size-6" />}
          iconClass="bg-trial text-trial-text"
          title="Cancel this subscription?"
          confirmLabel="Confirm Cancel"
          confirmVariant="default"
          pending={cancel.isPending}
          failed={cancel.isError}
          onBack={() => setView("detail")}
          onConfirm={() => cancel.mutate()}
        >
          This marks {item.name} as <b>inactive</b> and stops future reminders. Its history stays in
          your reports. This does <b>not</b> cancel the subscription with {item.name} itself —
          you&apos;ll still need to do that with the provider.
        </ConfirmView>
      ) : (
        <ConfirmView
          icon={<Trash2 className="size-6" />}
          iconClass="bg-danger/12 text-danger"
          title="Delete this subscription?"
          confirmLabel="Confirm Delete"
          confirmVariant="destructive"
          pending={remove.isPending}
          failed={remove.isError}
          onBack={() => setView("detail")}
          onConfirm={() => remove.mutate()}
        >
          This <b>permanently</b> removes {item.name} and all its history from your reports. This
          cannot be undone.
        </ConfirmView>
      )}
    </BottomSheet>
  );
}
