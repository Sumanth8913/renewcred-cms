import { API_BASE_URL } from '../lib/api';

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const staticRoutes = ['', '/standards', '/buyer', '/supplier', '/contact'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  let categoryRoutes = [];
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
    const json = await res.json();
    categoryRoutes = (json.data || []).map((c) => ({
      url: `${siteUrl}/standards/${c.slug}`,
      lastModified: new Date(),
    }));
  } catch {
    // Sitemap generation is best-effort — a backend hiccup shouldn't 500 the route.
  }

  return [...staticRoutes, ...categoryRoutes];
}
