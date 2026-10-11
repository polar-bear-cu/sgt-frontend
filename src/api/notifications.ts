import { Axios, unwrap } from "./client";

export interface AppNotification {
  id: string;
  subscriptionId: string;
  title: string;
  content: string;
  readStatus: boolean;
  createdAt: string;
}

interface NotificationList {
  items: AppNotification[];
}

export async function listNotifications(): Promise<AppNotification[]> {
  const { items } = await unwrap(Axios.get<NotificationList>("/notifications"));
  return items;
}

export function clearNotifications(): Promise<void> {
  return unwrap(Axios.delete<void>("/notifications"));
}
