import type { MetadataRoute } from 'next';

// Branch-only preview: do not advertise a canonical public site or its routes.
export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}
