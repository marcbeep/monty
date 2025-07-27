// API utilities - consistent with server response format

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

// Response format matching server standards
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// API configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 10000,
  retries: 3,
} as const;

// Enhanced fetch wrapper with error handling
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseURL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
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
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error || `HTTP ${response.status}: ${response.statusText}`;
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

// Convenience methods
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

// Error handling for UI components
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

  // Log for debugging
  console.error("API Error:", {
    message,
    severity,
    error: isAppError(error)
      ? {
          code: error.code,
          statusCode: error.statusCode,
        }
      : error,
  });
}

// Mock API call wrapper that follows the same pattern as real API calls
export async function mockApiCall<T>(
  data: T,
  delay: number = 1000,
  shouldFail: boolean = false,
  errorMessage?: string
): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (shouldFail) {
    throw new AppError(errorMessage || "Mock API call failed", 400);
  }

  return data;
}

// Retry wrapper for failed requests
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = API_CONFIG.retries,
  backoff: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) break;
      if (
        isAppError(error) &&
        error.statusCode >= 400 &&
        error.statusCode < 500
      ) {
        // Don't retry client errors
        break;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, backoff * Math.pow(2, attempt))
      );
    }
  }

  throw lastError;
}
