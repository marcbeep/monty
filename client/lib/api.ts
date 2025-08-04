import { toast } from "sonner";
import {
  AppError,
  NetworkError,
  TimeoutError,
  ParseError,
  isAppError,
  getErrorMessage,
  getErrorSeverity,
} from "./errors";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:3001";
    }

    if (hostname === "monty.marc.tt" || hostname.includes("marc.tt")) {
      return "https://api.monty.marc.tt";
    }
  }

  return "https://api.monty.marc.tt";
};

export const API_CONFIG = {
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  retries: 3,
} as const;

const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("monty_access_token");
};

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  const token = getStoredToken();

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        if (errorData?.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Use default error message
      }

      throw new AppError(errorMessage, response.status);
    }

    const result: ApiResponse<T> = await response.json();

    if (!result.success) {
      throw new AppError(result.error || "API request failed", 400);
    }

    return result.data as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw TimeoutError("Request timed out");
    }

    if (error instanceof TypeError) {
      throw NetworkError("Network connection failed");
    }

    if (isAppError(error)) {
      throw error;
    }

    throw ParseError("Failed to parse response");
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiCall<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiCall<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiCall<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiCall<T>(endpoint, { ...options, method: "DELETE" }),
};

export function handleApiError(
  error: unknown,
  showToast: boolean = true
): void {
  const message = getErrorMessage(error);
  const severity = getErrorSeverity(error);

  if (showToast) {
    switch (severity) {
      case "low":
        toast.info(message);
        break;
      case "medium":
        toast.warning(message);
        break;
      case "high":
      case "critical":
        toast.error(message);
        break;
    }
  }

  console.error("API Error:", error);
}

export async function mockApiCall<T>(
  data: T,
  delay: number = 1000
): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return data;
}
