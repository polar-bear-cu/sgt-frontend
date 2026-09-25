import { Axios, unwrap } from "./client";

export interface Me {
  id: string;
  email: string;
  displayName: string;
  pictureUrl: string;
  currency?: string;
  timeInAdvanced?: number;
}

export const CURRENCIES = ["THB"];
export const DEFAULT_CURRENCY = "THB";
export const DEFAULT_TIME_IN_ADVANCED = 3;

export type UpdateMe = Partial<
  Pick<Me, "displayName" | "pictureUrl" | "currency" | "timeInAdvanced">
>;

export function getMe(): Promise<Me> {
  return unwrap(Axios.get<Me>("/users/me"));
}

export function deleteMe(): Promise<void> {
  return unwrap(Axios.delete<void>("/users/me"));
}

export function updateMe(patch: UpdateMe): Promise<Me> {
  return unwrap(Axios.patch<Me>("/users/me", patch));
}
