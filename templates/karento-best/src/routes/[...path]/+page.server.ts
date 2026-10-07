import { error } from '@sveltejs/kit';
import pages from '../../../../karento/src/lib/server/pages.json';
import { composeSitePage, resolveSiteRoute } from '../../lib/server/site.mjs';

const bodies = import.meta.glob('../../../../karento/src/lib/server/pages/*.html', {
  query: '?raw', import: 'default', eager: true
}) as Record<string, string>;

export function load({ params }: { params: { path?: string } }) {
  const sourceKey = resolveSiteRoute(params.path || '');
  const page = (pages as Record<string, unknown>)[sourceKey];
  if (!page) error(404, 'Page not found');
  return { page: composeSitePage(sourceKey, page,
    bodies[`../../../../karento/src/lib/server/pages/${sourceKey}.html`],
    bodies['../../../../karento/src/lib/server/pages/index-2.html'],
    bodies['../../../../karento/src/lib/server/pages/index-3.html']) };
}
