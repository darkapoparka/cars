import { routeSeo } from '$lib/server/daynight-seo';
import { daynightSite } from '$lib/data/daynight-site';
import { buildFeaturedMobileVehicles } from '$lib/server/home-page-data';
import { getPublishedPublicInventory } from '$lib/server/repositories/public-inventory';
import type { PageServerLoad } from './$types';

export const prerender = false;
export const load: PageServerLoad = async ({ url }) => ({
	importExamples:
		url.searchParams.get('intent') === 'import'
			? buildFeaturedMobileVehicles(await getPublishedPublicInventory())
			: [],
	seo:
		url.searchParams.get('intent') === 'import'
			? {
					...routeSeo('contact'),
					title: `Внос на автомобил | ${daynightSite.shortName}`,
					description: `Изпратете обява или опишете желания автомобил за внос с ${daynightSite.shortName}.`
				}
			: routeSeo('contact')
});
