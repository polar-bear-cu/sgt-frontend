export const PATHS = {
  LOGIN: "/login",
  AUTH_CALLBACK: "/auth/callback",
  HOME: "/home",
  REPORT: "/report",
  NOTIFICATIONS: "/notifications",
  PROFILE: "/profile",
  STATUS: "/status",
  ADMIN: "/admin",
  PRIVACY: "/privacy",
  TERMS: "/terms",
} as const;

export const PUBLIC_PATHS = [
  PATHS.LOGIN,
  PATHS.AUTH_CALLBACK,
  PATHS.PRIVACY,
  PATHS.TERMS,
] as readonly string[];
