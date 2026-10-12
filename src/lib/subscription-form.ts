import type {
  Subscription,
  SubscriptionCategory,
  SubscriptionInput,
  SubscriptionType,
} from "@/api/subscriptions";
import { daysUntil, fromDateInput, toDateInput } from "@/lib/format";

const REMINDER_HOUR = 9;

export interface FormValues {
  name: string;
  cost: number;
  type: SubscriptionType;
  category: SubscriptionCategory;
  nextBillingDate: string;
  reminder: number;
  trial: boolean;
  trialEnd: string;
}

export function emptyFormValues(reminder: number): FormValues {
  return {
    name: "",
    cost: NaN,
    type: "monthly",
    category: "streaming",
    nextBillingDate: "",
    reminder,
    trial: false,
    trialEnd: "",
  };
}

export function toFormValues(item: Subscription): FormValues {
  return {
    name: item.name,
    cost: item.cost,
    type: item.type,
    category: item.category,
    nextBillingDate: toDateInput(item.nextBillingDate),
    reminder: item.reminderTimeInAdvanced,
    trial: item.ftEndDate !== null,
    trialEnd: item.ftEndDate ? toDateInput(item.ftEndDate) : "",
  };
}

export function reminderHint(date: string, reminder: number): string | undefined {
  if (date === "" || !Number.isInteger(reminder) || reminder < 1) return undefined;
  const days = daysUntil(fromDateInput(date));
  if (days < 0 || days > reminder) return undefined;
  if (days === 0 && new Date().getHours() >= REMINDER_HOUR) {
    return "This date is today, so it's too late for a reminder email.";
  }
  return `This date is already within your reminder window, so we'll email you at the next ${REMINDER_HOUR}:00 AM check.`;
}

export function toInput(values: FormValues): SubscriptionInput {
  return {
    name: values.name.trim(),
    cost: values.cost,
    type: values.type,
    category: values.category,
    nextBillingDate: fromDateInput(values.nextBillingDate),
    reminderTimeInAdvanced: values.reminder,
    ftEndDate: values.trial ? fromDateInput(values.trialEnd) : null,
    status: values.trial ? "free_trial" : "active",
  };
}
