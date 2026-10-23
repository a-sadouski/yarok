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
