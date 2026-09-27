import { createClient } from "@connectrpc/connect";
import { UserService, type User } from "@/gen/user/v1/user_pb";
import { grpcTransport } from "./client";

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

const users = createClient(UserService, grpcTransport);

function toMe(user: User | undefined): Me {
  if (!user) throw new Error("user missing from response");
  return {
    id: user.id,
    email: user.email,
    displayName: user.name,
    pictureUrl: user.pictureUrl,
  };
}

export async function getMe(id: string): Promise<Me> {
  const { user } = await users.getUser({ id });
  return toMe(user);
}

export async function deleteMe(id: string): Promise<void> {
  await users.deleteUser({ id });
}

export async function updateMe(id: string, patch: UpdateMe): Promise<Me> {
  const { user } = await users.updateProfile({
    id,
    displayName: patch.displayName,
    pictureUrl: patch.pictureUrl,
  });
  return toMe(user);
}
