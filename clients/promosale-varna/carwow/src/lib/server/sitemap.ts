import { cars, type Car } from '$lib/data/daynight-vehicles';
import { getPublishedPublicInventory } from '$lib/server/repositories/public-inventory';
import { PUBLIC_SITEMAP_ROUTES } from '$lib/server/public-routes';

type SitemapVehicle = Pick<Car, 'slug'>;

function xmlEscape(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

function normalizeOrigin(origin: string) {
	return origin.replace(/\/+$/g, '');
}

export function buildSitemapLocations(origin: string, vehicles: SitemapVehicle[]) {
	const base = normalizeOrigin(origin);

	return [
		...PUBLIC_SITEMAP_ROUTES.map((route) => `${base}/${route.path}`),
		...vehicles.map((vehicle) => `${base}/inventory/${vehicle.slug}`)
	];
}

export function renderSitemapXml(locations: string[]) {
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locations.map((loc) => `\t<url><loc>${xmlEscape(loc)}</loc></url>`).join('\n')}
</urlset>`;
}

export async function getSitemapVehicles() {
	return getPublishedPublicInventory({
		// Static inventory is only the explicit unconfigured-local fallback. When
		// When the database is configured, published vehicle rows remain the SEO source.
		staticFallback: cars
	});
}
