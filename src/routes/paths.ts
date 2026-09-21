export const PATHS = {
  LOGIN: "/login",
  AUTH_CALLBACK: "/auth/callback",
  DASHBOARD: "/dashboard",
  SUBSCRIPTIONS: "/subscriptions",
  PROFILE: "/profile",
  STATUS: "/status",
} as const;

export const PUBLIC_PATHS = [PATHS.LOGIN, PATHS.AUTH_CALLBACK] as readonly string[];
