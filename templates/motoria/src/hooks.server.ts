import type { Handle } from '@sveltejs/kit';
import { getPage } from '$lib/server/pages';
import { json } from '@sveltejs/kit';
import { inventoryResult } from '$lib/server/inventory';
import widgetTabs from '$lib/data/widget-tabs.json';

export const handle: Handle = async ({ event, resolve }) => {
 if (/\/wp-admin\/admin-ajax\.php\/?$/.test(event.url.pathname)) {
  const form = event.request.method === 'POST' ? await event.request.formData() : event.url.searchParams;
  const action = form.get('action');
  if (action === 'grid_tabs_widget') {
   const tab = form.get('tab_type');
   return json({html: tab === 'popular' ? widgetTabs.popular : widgetTabs.recent});
  }
  if (action === 'ccb_calc_views') return json({ success: true });
  return json({ success: false, status: 'warning', errors: {}, response: 'Connect a backend to use this service.' });
 }
 if (/\/wp-json\/contact-form-7\//.test(event.url.pathname)) {
  return json(event.url.pathname.includes('/schema') ? { locale: 'en_US', rules: [] } : {});
 }
 if (event.request.method === 'POST' && event.url.pathname.includes('/inventory')) return json(inventoryResult(event.url));
 const page = getPage(event.url.pathname);
 return resolve(event, {
  transformPageChunk: ({ html }) => html.replace('data-reference-body', page?.bodyAttributes ?? '')
 });
};
