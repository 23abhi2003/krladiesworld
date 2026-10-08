export const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'
).replace(/\/$/, '');

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body && typeof init.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(url, { ...init, headers });
}
