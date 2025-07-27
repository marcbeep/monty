// React hook for consistent error handling across components

import { useCallback } from "react";
import { handleApiError } from "@/lib/api";
import {
  isAppError,
  getErrorMessage,
  getErrorSeverity,
  type ErrorSeverity,
} from "@/lib/errors";

export interface UseErrorHandlerOptions {
  showToast?: boolean;
  onError?: (error: unknown, severity: ErrorSeverity) => void;
  fallbackMessage?: string;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const {
    showToast = true,
    onError,
    fallbackMessage = "An unexpected error occurred",
  } = options;

  const handleError = useCallback(
    (error: unknown) => {
      const message = getErrorMessage(error) || fallbackMessage;
      const severity = getErrorSeverity(error);

      // Use the centralized API error handler
      handleApiError(error, showToast);

      // Call custom error handler if provided
      if (onError) {
        onError(error, severity);
      }

      return {
        message,
        severity,
        isAppError: isAppError(error),
      };
    },
    [showToast, onError, fallbackMessage]
  );

  return {
    handleError,
    isAppError,
    getErrorMessage,
    getErrorSeverity,
  };
}
