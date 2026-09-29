import { message, type MessageKey } from './messages';
import { routeParts, type Locale } from './core';
const routes = new Set([
	'',
	'inventory',
	'inventory/map',
	'services',
	'sell-your-car',
	'sell-your-car/request',
	'favorites',
	'about',
	'about/daynight-auto-plovdiv',
	'contact',
	'financing',
	'reviews',
	'calculator',
	'compare',
	'team',
	'blog',
	'faq',
	'terms'
]);
/** Static route metadata is authored copy. Dynamic listing/CMS facts stay caller-owned. */
export function localizedSeo(
	locale: Locale,
	pathname: string,
	input: { title: string; description: string },
	params?: URLSearchParams
) {
	const sourcePath = routeParts(pathname).path.replace(/^\/+|\/+$/g, '');
	const path = ['home1', 'home1-box'].includes(sourcePath) ? '' : sourcePath;
	if (!routes.has(path)) return input;
	const intent = params?.get('intent') ?? params?.get('topic');
	const route =
		path === 'contact' && intent === 'import'
			? 'contactImport'
			: path === 'contact' && intent === 'trade-in'
				? 'contactTradeIn'
				: path || 'home';
	const key = 'seo.' + route.replaceAll('/', '.');
	return {
		title: message(locale, (key + '.title') as MessageKey),
		description: message(locale, (key + '.description') as MessageKey)
	};
}
