import { error } from '@sveltejs/kit';
import pages from '../../lib/server/pages.json';
const bodies = import.meta.glob('../../lib/server/pages/*.html', {
  query: '?raw', import: 'default', eager: true
}) as Record<string, string>;

export function load({ params }: { params: { path?: string } }) {
  const key = params.path || 'index-2';
  const normalized = key.replace(/\.html$/, '');
  const page = (pages as Record<string, unknown>)[normalized];
  if (!page) error(404, 'Page not found');
  return { page: { ...page as object, body: bodies[`../../lib/server/pages/${normalized}.html`] } };
}
