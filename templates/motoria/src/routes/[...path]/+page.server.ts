import { error } from '@sveltejs/kit';
import { getPage } from '$lib/server/pages';
import { inventoryPage } from '$lib/server/inventory';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
 const page = getPage(url.pathname);
 if (!page) error(404, 'This page is outside the captured template.');
 const style = url.searchParams.get('style') ?? '7';
 const pricingStyle = /^[1-9]$/.test(style) ? style : '7';
 return {
  ...page,
  body: page.route.startsWith('/inventory/') && url.searchParams.size > 0 ? inventoryPage(url, page.body) : page.body,
  head: page.head + (page.name === 'pricing' && style !== 'all'
   ? `<style>[data-pricing-style]:not([data-pricing-style="${pricingStyle}"]){display:none!important}</style>`
   : '')
 };
};
