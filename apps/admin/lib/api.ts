export const services = {
  auth: process.env.NEXT_PUBLIC_AUTH_API || 'http://localhost:3001',
  users: process.env.NEXT_PUBLIC_USER_API || 'http://localhost:3002',
  requests: process.env.NEXT_PUBLIC_REQUEST_API || 'http://localhost:3003',
  suppliers: process.env.NEXT_PUBLIC_SUPPLIER_API || 'http://localhost:3004',
  projects: process.env.NEXT_PUBLIC_PROJECT_API || 'http://localhost:3006'
};

export function tokenHeaders() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('hengpu_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json', ...tokenHeaders() } });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}
