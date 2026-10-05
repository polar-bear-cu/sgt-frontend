import { Code, ConnectError, createClient } from "@connectrpc/connect";
import { UserService, type User } from "@/gen/user/v1/user_pb";
import { grpcTransport } from "./client";

export interface Me {
  id: string;
  email: string;
  displayName: string;
  pictureUrl: string;
  role: string;
  createdAt: string;
  lastLoginAt: string;
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
    role: user.role,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    timeInAdvanced: user.timeInAdvanced || undefined,
  };
}

export async function getMe(id: string): Promise<Me> {
  const { user } = await users.getUser({ id });
  return toMe(user);
}

export async function deleteUser(id: string): Promise<void> {
  await users.deleteUser({ id });
}

export const ADMIN_PAGE_SIZE = 20;
export const ROLES = ["user", "admin"] as const;
export type Role = (typeof ROLES)[number];

export async function listUsers(offset: number): Promise<Me[]> {
  const { users: list } = await users.listUsers({ limit: ADMIN_PAGE_SIZE, offset });
  return list.map(toMe);
}

export async function setRole(id: string, role: Role): Promise<Me> {
  const { user } = await users.updateRole({ id, role });
  return toMe(user);
}

export function isDenied(error: unknown): boolean {
  const { code } = ConnectError.from(error);
  return code === Code.PermissionDenied || code === Code.Unauthenticated;
}

export async function updateMe(id: string, patch: UpdateMe): Promise<Me> {
  const { user } = await users.updateProfile({
    id,
    displayName: patch.displayName,
    pictureUrl: patch.pictureUrl,
  });
  return toMe(user);
}
