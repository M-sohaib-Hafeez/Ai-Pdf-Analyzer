/**
 * Utility for fetching API routes.
 */
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  return fetch(url, {
    ...options,
    headers
  });
}
