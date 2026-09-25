import { Axios, unwrap } from "./client";

export type SubscriptionType = "monthly" | "yearly";
export type SubscriptionStatus = "active" | "free_trial" | "inactive";
export type SubscriptionCategory = "streaming" | "music" | "productivity" | "technology";
export type SortField = "name" | "category" | "status" | "type" | "cost" | "nextBillingDate";
export type SortDirection = "asc" | "desc";

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  type: SubscriptionType;
  category: SubscriptionCategory;
  nextBillingDate: string;
  reminderTimeInAdvanced: number;
  ftEndDate: string | null;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionInput = Omit<Subscription, "id" | "createdAt" | "updatedAt" | "status"> & {
  status?: SubscriptionStatus;
};

export interface Summary {
  count: number;
  monthlyCost: number;
}

export interface ListParams {
  name?: string;
  category?: SubscriptionCategory;
  status?: SubscriptionStatus;
  type?: SubscriptionType;
  sortBy?: SortField;
  order?: SortDirection;
  page?: number;
  limit?: number;
}

export interface Page<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const PAGE_SIZE = 10;

export const STATUSES: { value: SubscriptionStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "free_trial", label: "Trial" },
  { value: "inactive", label: "Inactive" },
];

export const TYPES: { value: SubscriptionType; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export const CATEGORIES: { value: SubscriptionCategory; label: string }[] = [
  { value: "streaming", label: "Streaming" },
  { value: "music", label: "Music" },
  { value: "productivity", label: "Productivity" },
  { value: "technology", label: "Technology" },
];

export const SORT_FIELDS: { value: SortField; label: string }[] = [
  { value: "nextBillingDate", label: "Next billing date" },
  { value: "name", label: "Name" },
  { value: "cost", label: "Cost" },
  { value: "category", label: "Category" },
  { value: "status", label: "Status" },
  { value: "type", label: "Type" },
];

export function getSummary(): Promise<Summary> {
  return unwrap(Axios.get<Summary>("/subscriptions/summary"));
}

export function listSubscriptions(params: ListParams): Promise<Page<Subscription>> {
  return unwrap(Axios.get<Page<Subscription>>("/subscriptions", { params }));
}

export function getSubscription(id: string): Promise<Subscription> {
  return unwrap(Axios.get<Subscription>(`/subscriptions/${id}`));
}

export function createSubscription(input: SubscriptionInput): Promise<Subscription> {
  return unwrap(Axios.post<Subscription>("/subscriptions", input));
}

export function updateSubscription(id: string, input: SubscriptionInput): Promise<Subscription> {
  return unwrap(Axios.put<Subscription>(`/subscriptions/${id}`, input));
}

export function setSubscriptionStatus(
  id: string,
  status: SubscriptionStatus,
): Promise<Subscription> {
  return unwrap(Axios.patch<Subscription>(`/subscriptions/${id}`, { status }));
}

export function deleteSubscription(id: string): Promise<void> {
  return unwrap(Axios.delete<void>(`/subscriptions/${id}`));
}
