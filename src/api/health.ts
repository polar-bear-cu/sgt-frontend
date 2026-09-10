import { Axios, request, type APIResult } from "./client";

export const HEALTH_SERVICES = ["auth", "users", "subscriptions", "reports"] as const;
export type HealthService = (typeof HEALTH_SERVICES)[number];

export interface HealthResponse {
  status: string;
  serviceName: string;
  timestamp: string;
}

export function checkHealth(service: HealthService): Promise<APIResult<HealthResponse>> {
  return request(Axios.get<HealthResponse>(`/health/${service}`, { baseURL: "/" }));
}
