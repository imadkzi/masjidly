/**
 * Centralized error handling utilities
 */

/**
 * Logs an error to the console (and could be extended to log to a service)
 * @param {Error|string} error - The error to log
 * @param {string} context - Context where the error occurred
 * @param {object} [metadata] - Additional metadata
 */
export function logError(error, context, metadata = {}) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error(`[${context}]`, errorMessage, {
    ...metadata,
    stack: errorStack,
    timestamp: new Date().toISOString(),
  });

  // In production, you could send this to an error tracking service:
  // if (import.meta.env.PROD) {
  //   errorTrackingService.log(error, context, metadata);
  // }
}

/**
 * Creates a user-friendly error message from an error object
 * @param {Error|string} error - The error to format
 * @param {string} fallbackMessage - Fallback message if error can't be parsed
 * @returns {string} User-friendly error message
 */
export function getUserFriendlyError(error, fallbackMessage = "Something went wrong") {
  if (!error) return fallbackMessage;

  if (typeof error === "string") return error;

  // Axios-style error with response
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    // Don't expose technical error messages to users in production
    if (import.meta.env.PROD) {
      return fallbackMessage;
    }
    return error.message;
  }

  return fallbackMessage;
}

/**
 * Handles an error with logging and returns a user-friendly message
 * @param {Error|string} error - The error to handle
 * @param {string} context - Context where the error occurred
 * @param {string} fallbackMessage - Fallback message for users
 * @returns {string} User-friendly error message
 */
export function handleError(error, context, fallbackMessage = "Something went wrong") {
  logError(error, context);
  return getUserFriendlyError(error, fallbackMessage);
}
