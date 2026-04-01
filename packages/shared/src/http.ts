export async function apiGet<T = unknown>(url: string, init?: RequestInit) {
  const r = await fetch(url, { ...init, method: 'GET' });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return (await r.json()) as T;
}
