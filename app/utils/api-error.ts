export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error !== 'object' || error === null || !('data' in error)) {
    return fallback;
  }

  const data = error.data;
  if (typeof data !== 'object' || data === null || !('statusMessage' in data)) {
    return fallback;
  }

  return typeof data.statusMessage === 'string' && data.statusMessage.trim() ? data.statusMessage : fallback;
}
export function getApiErrorStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) {
    return undefined;
  }
  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode;
  }
  if ('status' in error && typeof error.status === 'number') {
    return error.status;
  }
  return undefined;
}
