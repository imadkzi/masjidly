// Miscellaneous formatting helpers shared across the app
import { getUserFriendlyError } from "./errorHandler.js";

/**
 * Normalize an error into a user-friendly message.
 * @deprecated Use errorHandler.getUserFriendlyError or errorHandler.handleError instead
 * This function is kept for backward compatibility.
 */
export function formatError(err, fallbackMessage = "Something went wrong") {
  return getUserFriendlyError(err, fallbackMessage);
}

