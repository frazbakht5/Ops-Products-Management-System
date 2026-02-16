import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { BaseApiResponse } from "../types/api";

/**
 * Extract a human-readable error message from an RTK Query error.
 * Falls back to `fallback` when the response doesn't contain a message.
 */
export function getErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred",
): string {
  if (isFetchBaseQueryError(error)) {
    const body = error.data as BaseApiResponse | undefined;
    return body?.message ?? fallback;
  }

  if (isErrorWithMessage(error)) {
    return error.message;
  }

  return fallback;
}

function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

function isErrorWithMessage(
  error: unknown,
): error is { message: string } {
  return (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
}
