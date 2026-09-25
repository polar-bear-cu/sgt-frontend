import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  DEFAULT_TIME_IN_ADVANCED,
  updateMe,
  type Me,
  type UpdateMe,
} from "@/api/users";
import { BottomSheet } from "@/components/BottomSheet";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { useToast } from "@/hooks/useToast";

export type EditField = "displayName" | "currency" | "timeInAdvanced";

const saved: Record<EditField, string> = {
  displayName: "Name saved",
  currency: "Currency saved",
  timeInAdvanced: "Default reminder saved",
};

const titles: Record<EditField, string> = {
  displayName: "Edit name",
  currency: "Currency",
  timeInAdvanced: "Default reminder",
};

interface FormValues {
  displayName: string;
  currency: string;
  timeInAdvanced: number;
}

function EditForm({ field, me, onClose }: { field: EditField; me: Me; onClose: () => void }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      displayName: me.displayName,
      currency: me.currency ?? DEFAULT_CURRENCY,
      timeInAdvanced: me.timeInAdvanced ?? DEFAULT_TIME_IN_ADVANCED,
    },
  });
  const save = useMutation({
    mutationFn: updateMe,
    onSuccess: (data) => {
      queryClient.setQueryData<Me>(["me"], (old) => ({ ...old, ...data }));
      toast(saved[field]);
      onClose();
    },
  });

  function submit(values: FormValues) {
    save.mutate({
      displayName: me.displayName,
      pictureUrl: me.pictureUrl,
      [field]: field === "displayName" ? values.displayName.trim() : values[field],
    } as UpdateMe);
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      {field === "displayName" && (
        <Field id="displayName" label="Display name" required error={errors.displayName?.message}>
          <Input
            id="displayName"
            type="text"
            aria-invalid={errors.displayName ? true : undefined}
            {...register("displayName", {
              validate: (value) => value.trim() !== "" || "Name is required.",
            })}
          />
        </Field>
      )}

      {field === "currency" && (
        <Field id="currency" label="Currency" hint="THB is the only currency available for now.">
          <Select id="currency" {...register("currency")}>
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code === "THB" ? "THB (฿)" : code}
              </option>
            ))}
          </Select>
        </Field>
      )}

      {field === "timeInAdvanced" && (
        <Field
          id="timeInAdvanced"
          label="Default reminder"
          hint="Used as the starting value when you add a subscription."
          error={errors.timeInAdvanced?.message}
        >
          <div className="relative">
            <Input
              id="timeInAdvanced"
              type="number"
              inputMode="numeric"
              className="pr-16"
              aria-invalid={errors.timeInAdvanced ? true : undefined}
              {...register("timeInAdvanced", {
                valueAsNumber: true,
                validate: (value) =>
                  (Number.isInteger(value) && value >= 0) || "Enter 0 or more days.",
              })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[13px] font-semibold text-muted-foreground">
              days
            </span>
          </div>
        </Field>
      )}

      {save.isError && (
        <p role="alert" className="mb-3 text-xs text-danger">
          Couldn&apos;t save. Try again.
        </p>
      )}

      <div className="mt-2 flex gap-2.5">
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="secondary"
          size="lg"
          className="flex-1"
          disabled={save.isPending}
        >
          Save
        </Button>
      </div>
    </form>
  );
}

export function EditProfileSheet({
  field,
  open,
  me,
  onClose,
}: {
  field: EditField;
  open: boolean;
  me: Me;
  onClose: () => void;
}) {
  return (
    <BottomSheet
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      title={titles[field]}
    >
      <EditForm field={field} me={me} onClose={onClose} />
    </BottomSheet>
  );
}
