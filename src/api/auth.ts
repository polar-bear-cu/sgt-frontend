import { Axios, request, type APIResult } from "./client";

export interface TokenResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export function refresh(): Promise<APIResult<TokenResponse>> {
  return request(Axios.post<TokenResponse>("/auth/refresh"));
}

export function logout(): Promise<APIResult<void>> {
  return request(Axios.post<void>("/auth/logout"));
}
