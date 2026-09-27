import type {
  Subscription,
  SubscriptionCategory,
  SubscriptionInput,
  SubscriptionType,
} from "@/api/subscriptions";
import { fromDateInput, toDateInput } from "@/lib/format";

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
