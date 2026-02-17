import { getUserFriendlyError } from "./errorHandler.js";

export function formatError(err, fallbackMessage = "Something went wrong") {
  return getUserFriendlyError(err, fallbackMessage);
}

