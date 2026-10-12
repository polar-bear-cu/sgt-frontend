import { Axios, unwrap } from "./client";
import type { SubscriptionCategory, SubscriptionStatus, SubscriptionType } from "./subscriptions";

export interface MonthTotal {
  month: string;
  total: number;
}

export interface Monthly {
  months: MonthTotal[];
  total: number;
  averagePerMonth: number;
}

export interface SubscriptionSpending {
  subscriptionId: string;
  name: string;
  category: SubscriptionCategory;
  type: SubscriptionType;
  status: SubscriptionStatus;
  count: number;
  total: number;
}

export interface BySubscription {
  from: string;
  to: string;
  total: number;
  items: SubscriptionSpending[];
}

export interface CategoryTotal {
  category: SubscriptionCategory;
  total: number;
}

export interface Charge {
  subscriptionId: string;
  name: string;
  category: SubscriptionCategory;
  type: SubscriptionType;
  amount: number;
  chargedAt: string;
}

export interface MonthCharges {
  month: string;
  total: number;
  count: number;
  categories: CategoryTotal[];
  items: Charge[];
}

export const MAX_MONTHS = 24;

export function getMonthly(months: number): Promise<Monthly> {
  return unwrap(Axios.get<Monthly>("/reports/monthly", { params: { months } }));
}

export function getBySubscription(from: string, to: string): Promise<BySubscription> {
  return unwrap(Axios.get<BySubscription>("/reports/subscriptions", { params: { from, to } }));
}

export function getCharges(month: string): Promise<MonthCharges> {
  return unwrap(Axios.get<MonthCharges>("/reports/charges", { params: { month } }));
}

export async function downloadCharges(month: string): Promise<void> {
  const file = await unwrap(
    Axios.get<Blob>("/reports/export", {
      params: { from: month, to: month },
      responseType: "blob",
    }),
  );
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sgt-charges-${month}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
