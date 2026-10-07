import { error } from '@sveltejs/kit';
import pages from '../../../../karento/src/lib/server/pages.json';
import { composeSitePage, resolveSiteRoute } from '../../lib/server/site.mjs';

const bodies = import.meta.glob('../../../../karento/src/lib/server/pages/*.html', {
  query: '?raw', import: 'default', eager: true
}) as Record<string, string>;

export function load({ params }: { params: { path?: string } }) {
  const sourceKey = resolveSiteRoute(params.path || '');
  const found = Object.hasOwn(pages, sourceKey);
  const selectedKey = found ? sourceKey : '404';
  const page = composeSitePage(selectedKey, (pages as Record<string, unknown>)[selectedKey],
    bodies[`../../../../karento/src/lib/server/pages/${selectedKey}.html`],
    bodies['../../../../karento/src/lib/server/pages/index-2.html'],
    bodies['../../../../karento/src/lib/server/pages/index-3.html'],
    bodies['../../../../karento/src/lib/server/pages/index.html']);
  if (!found) error(404, { message: 'Page not found', templatePage: page });
  return { page };
}
