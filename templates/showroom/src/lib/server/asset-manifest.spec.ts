import { describe, expect, it } from 'vitest';
import { posts } from '$lib/data/blog';
import { vehicles } from '$lib/data/vehicles';
import { extractLocalAssetReferences, findMissingLocalAssetReferences } from './asset-manifest';
import { renderAuxeroTemplate } from './auxero-template';

const forbiddenLegacyScriptReferences = [
	'/assets/js/count-down.js',
	'/assets/js/countto.js',
	'/assets/js/app.js',
	'/assets/js/filterCar.js',
	'/assets/js/infobox.min.js',
	'/assets/js/jquery.min.js',
	'/assets/js/jquery.fancybox.js',
	'/assets/js/maps.js',
	'/assets/js/marker.js',
	'/assets/js/plugin.js',
	'/assets/js/shop.js',
	'/assets/js/swiper-bundle.min.js',
	'/assets/js/switcher.js'
];

const renderRepresentativeTemplate = (
	templateFile: string,
	options?: Parameters<typeof renderAuxeroTemplate>[1]
) => {
	const html = renderAuxeroTemplate(templateFile, options);

	if (!html) {
		throw new Error(`Representative asset page could not render ${templateFile}`);
	}

	return html;
};

const representativePages = [
	{ label: 'home', html: renderRepresentativeTemplate('home-05.html', { routePath: '' }) },
	{
		label: 'inventory',
		html: renderRepresentativeTemplate('listing-grid4-columns.html', { routePath: 'inventory' })
	},
	{
		label: 'inventory map',
		html: renderRepresentativeTemplate('listing-gridstyle-halfmap.html', {
			routePath: 'inventory',
			searchParams: new URLSearchParams('view=map')
		})
	},
	{
		label: 'vehicle detail',
		html: renderRepresentativeTemplate('listing-details-3.html', {
			routePath: `inventory/${vehicles[0].slug}`
		})
	},
	{
		label: 'compare',
		html: renderRepresentativeTemplate('compare.html', { routePath: 'compare' })
	},
	{
		label: 'services',
		html: renderRepresentativeTemplate('services-center.html', { routePath: 'services' })
	},
	{
		label: 'sell your car',
		html: renderRepresentativeTemplate('sell-your-car.html', { routePath: 'sell-your-car' })
	},
	{
		label: 'contact',
		html: renderRepresentativeTemplate('contact-us.html', { routePath: 'contact' })
	},
	{ label: 'about', html: renderRepresentativeTemplate('about-us.html', { routePath: 'about' }) },
	{
		label: 'agents',
		html: renderRepresentativeTemplate('sale-agents.html', { routePath: 'agents' })
	},
	{
		label: 'agent detail',
		html: renderRepresentativeTemplate('sale-agents-details.html', {
			routePath: 'agents/eliqauto-sales'
		})
	},
	{
		label: 'reviews',
		html: renderRepresentativeTemplate('clients-reviews.html', { routePath: 'reviews' })
	},
	{
		label: 'calculator',
		html: renderRepresentativeTemplate('calculator.html', { routePath: 'calculator' })
	},
	{ label: 'faqs', html: renderRepresentativeTemplate('faqs.html', { routePath: 'faqs' }) },
	{ label: 'terms', html: renderRepresentativeTemplate('terms.html', { routePath: 'terms' }) },
	{
		label: 'blog list',
		html: renderRepresentativeTemplate('blog-grid-style-1.html', { routePath: 'blog' })
	},
	{
		label: 'blog detail',
		html: renderRepresentativeTemplate('blog-details-1.html', {
			routePath: `blog/${posts[0].slug}`
		})
	}
];

describe('asset-manifest', () => {
	it('extracts only local static asset references from markup', () => {
		const references = extractLocalAssetReferences(`
			<img src="/assets/images/card/card-1.jpg?cache=1#hero" />
			<img srcset="/assets/a.webp 1x, https://cdn.example.com/b.webp 2x" />
			<div style="background-image: url('./assets/icons/Search.svg')"></div>
			<a href="/inventory">Inventory</a>
			<script src="https://example.com/app.js"></script>
		`);

		expect(references).toEqual([
			'/assets/a.webp',
			'/assets/icons/Search.svg',
			'/assets/images/card/card-1.jpg'
		]);
	});

	it('keeps representative rendered Auxero pages free of missing local assets', () => {
		const missing = findMissingLocalAssetReferences(representativePages);

		expect(missing).toEqual([]);
	});

	it('does not ship blocked or unused Auxero template scripts from rendered pages', () => {
		const scriptReferences = new Set(
			representativePages.flatMap(({ html }) =>
				extractLocalAssetReferences(html).filter((reference) => reference.startsWith('/assets/js/'))
			)
		);

		for (const reference of forbiddenLegacyScriptReferences) {
			expect(scriptReferences.has(reference), reference).toBe(false);
		}
	});
});
