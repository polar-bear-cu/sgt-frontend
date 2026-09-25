import type { ReactNode } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { CATEGORIES, TYPES } from "@/api/subscriptions";
import { Button } from "@/components/ui/button";
import { Segmented, Toggle } from "@/components/ui/controls";
import { Field, Input, Select } from "@/components/ui/field";
import { money } from "@/lib/format";
import type { FormValues } from "@/lib/subscription-form";

const MAX_COST = 99999999.99;

function WithSuffix({ suffix, children }: { suffix: string; children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[13px] font-semibold text-muted-foreground">
        {suffix}
      </span>
    </div>
  );
}

export function SubscriptionForm({
  mode,
  defaults,
  existingNames,
  pending,
  failed,
  onSubmit,
  onCancel,
}: {
  mode: "add" | "edit";
  defaults: FormValues;
  existingNames?: string[];
  pending?: boolean;
  failed?: boolean;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: defaults });
  const typedName = useWatch({ control, name: "name" }).trim();
  const trial = useWatch({ control, name: "trial" });
  const name = typedName.toLowerCase();
  const duplicate = name !== "" && existingNames?.some((item) => item.toLowerCase() === name);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="md:grid md:grid-cols-2 md:gap-x-4"
    >
      <div className="md:col-span-2">
        <Field id="name" label="Service name" required error={errors.name?.message}>
          <Input
            id="name"
            type="text"
            maxLength={50}
            autoComplete="off"
            aria-invalid={errors.name ? true : undefined}
            {...register("name", {
              validate: (value) => value.trim() !== "" || "Service name is required.",
            })}
          />
          {duplicate && (
            <p className="mt-2 rounded-xl bg-trial/40 px-3 py-2 text-xs text-trial-text">
              A subscription named &quot;{typedName}&quot; already exists — you can still add this
              one.
            </p>
          )}
        </Field>
      </div>

      <Field id="cost" label="Cost" required error={errors.cost?.message}>
        <WithSuffix suffix="THB">
          <Input
            id="cost"
            type="number"
            inputMode="decimal"
            step="0.01"
            max={MAX_COST}
            placeholder="0"
            className="pr-16"
            aria-invalid={errors.cost ? true : undefined}
            {...register("cost", {
              valueAsNumber: true,
              validate: (value) =>
                Number.isNaN(value)
                  ? "Cost is required."
                  : value < 0
                    ? "Cost cannot be negative."
                    : value > MAX_COST
                      ? `Cost cannot be more than ${money(MAX_COST, true)}.`
                      : true,
            })}
          />
        </WithSuffix>
      </Field>

      <Field id="type" label="Billing frequency" required>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Segmented
              label="Billing frequency"
              value={field.value}
              options={TYPES}
              onChange={field.onChange}
            />
          )}
        />
      </Field>

      <Field
        id="nextBillingDate"
        label="Next billing date"
        required
        error={errors.nextBillingDate?.message}
        hint={
          mode === "edit"
            ? "Changing this date will recalculate your reminder schedule."
            : undefined
        }
      >
        <Input
          id="nextBillingDate"
          type="date"
          aria-invalid={errors.nextBillingDate ? true : undefined}
          {...register("nextBillingDate", { required: "Next billing date is required." })}
        />
      </Field>

      <Field id="category" label="Category" required>
        <Select id="category" {...register("category")}>
          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field id="reminder" label="Reminder lead time" error={errors.reminder?.message}>
        <WithSuffix suffix="days before">
          <Input
            id="reminder"
            type="number"
            inputMode="numeric"
            className="pr-28"
            aria-invalid={errors.reminder ? true : undefined}
            {...register("reminder", {
              valueAsNumber: true,
              validate: (value) =>
                (Number.isInteger(value) && value >= 1) || "Enter 1 or more days.",
            })}
          />
        </WithSuffix>
      </Field>

      {mode === "add" && (
        <div className="mb-4 md:pt-7">
          <Controller
            control={control}
            name="trial"
            render={({ field }) => (
              <Toggle label="Free Trial" checked={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      )}

      {mode === "add" && trial && (
        <div className="mb-4 rounded-2xl bg-accent p-3.5 md:col-span-2 [&>div]:mb-0">
          <Field
            id="trialEnd"
            label="Trial end date"
            required
            error={errors.trialEnd?.message}
            hint="Cost, billing frequency and next billing date above are what you'll pay once the trial ends — you won't be charged before then."
          >
            <Input
              id="trialEnd"
              type="date"
              aria-invalid={errors.trialEnd ? true : undefined}
              {...register("trialEnd", {
                validate: (value, all) =>
                  !all.trial || value !== "" || "Trial end date is required.",
              })}
            />
          </Field>
        </div>
      )}

      <div className="md:col-span-2">
        {failed && (
          <p role="alert" className="mb-3 text-xs text-danger">
            Couldn&apos;t save. Try again.
          </p>
        )}
        <div className="mt-2 flex gap-2.5">
          <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="secondary" size="lg" className="flex-1" disabled={pending}>
            Confirm
          </Button>
        </div>
      </div>
    </form>
  );
}
