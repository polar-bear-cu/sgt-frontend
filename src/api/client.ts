import axios, { type AxiosResponse } from "axios";

export interface APIError {
  status: number;
  message: string;
}

function toAPIError(error: unknown): APIError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const body = error.response?.data as { error?: string; message?: string } | undefined;
    const message =
      body?.error ??
      body?.message ??
      (status === 0 ? "network error" : error.message) ??
      "request failed";
    return { status, message };
  }
  return { status: 0, message: String(error) };
}

export type APIResult<T> = { success: boolean; data: T | null; error: APIError | null };

export async function request<T>(call: Promise<AxiosResponse<T>>): Promise<APIResult<T>> {
  try {
    const response = await call;
    return { success: true, data: response.data, error: null };
  } catch (error) {
    return { success: false, data: null, error: toAPIError(error) };
  }
}

export const Axios = axios.create({
  baseURL: "/api/v1",
});
