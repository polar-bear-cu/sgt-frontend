import { Axios, unwrap } from "./client";

export interface AppNotification {
  id: string;
  user_id: string;
  subscription_id: string;
  title: string;
  content: string;
  status: boolean;
  read_status: boolean;
  created_at: string;
  sent_at: string | null;
}

export interface ClearResult {
  deleted_count: number;
}

export function listNotifications(): Promise<AppNotification[]> {
  return unwrap(Axios.get<AppNotification[]>("/notifications"));
}

export function deleteNotification(id: string): Promise<void> {
  return unwrap(Axios.delete<void>(`/notifications/${encodeURIComponent(id)}`));
}

export function clearNotifications(): Promise<ClearResult> {
  return unwrap(Axios.delete<ClearResult>("/notifications"));
}
