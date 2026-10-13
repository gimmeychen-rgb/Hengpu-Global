export const services = {
  auth: process.env.NEXT_PUBLIC_AUTH_API || 'http://localhost:3001',
  users: process.env.NEXT_PUBLIC_USER_API || 'http://localhost:3002',
  requests: process.env.NEXT_PUBLIC_REQUEST_API || 'http://localhost:3003',
  suppliers: process.env.NEXT_PUBLIC_SUPPLIER_API || 'http://localhost:3004',
  matching: process.env.NEXT_PUBLIC_MATCHING_API || 'http://localhost:3005',
  projects: process.env.NEXT_PUBLIC_PROJECT_API || 'http://localhost:3006'
};

export function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('hengpu_token') || '';
}

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }
  return response.json();
}
