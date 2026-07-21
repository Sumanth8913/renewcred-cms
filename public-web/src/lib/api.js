const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// Small fetch wrapper used in Server Components. `no-store` keeps content
// fresh on every request since this is admin-managed content, not static
// build-time data — publishing a change should show up immediately.
async function apiGet(path, { revalidate } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    cache: revalidate ? undefined : 'no-store',
    next: revalidate ? { revalidate } : undefined,
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function getCategories() {
  return (await apiGet('/categories')) || [];
}

export async function getPageBySlug(slug) {
  return apiGet(`/pages/public/slug/${slug}`);
}

export async function submitForm(formType, payload) {
  const res = await fetch(`${API_BASE_URL}/forms/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formType, payload }),
  });
  return res.json();
}

export { API_BASE_URL };
