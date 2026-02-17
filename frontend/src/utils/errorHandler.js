export function logError(error, context, metadata = {}) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  console.error(`[${context}]`, errorMessage, {
    ...metadata,
    stack: errorStack,
    timestamp: new Date().toISOString(),
  });
}

export function getUserFriendlyError(error, fallbackMessage = "Something went wrong") {
  if (!error) return fallbackMessage;

  if (typeof error === "string") return error;

  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    if (import.meta.env.PROD) {
      return fallbackMessage;
    }
    return error.message;
  }

  return fallbackMessage;
}

export function handleError(error, context, fallbackMessage = "Something went wrong") {
  logError(error, context);
  return getUserFriendlyError(error, fallbackMessage);
}
