import { listPublicVehicles } from '$lib/server/public-vehicles';
import { json } from '@sveltejs/kit';
import { getInventoryState } from '$lib/server/inventory-state';
import { inventoryDesktopDataFromState } from '$lib/server/inventory-options';
import { inventoryCardsFromVehicles } from '$lib/domain/vehicle-card';
import { inventoryText } from '$lib/content/inventory-localized';
import type { RequestHandler } from './$types';

const preferredFeatures = [
	'4x4',
	'LED фарове',
	'Безключово палене',
	'360 camera $lib Задна камера',
	'Apple CarPlay $lib Android Auto',
	'Head up display',
	'Адаптивно въздушно окачване',
	'Автоматично затваряне на багажника'
];
const featureRank = (feature: string) => {
	const index = preferredFeatures.indexOf(feature);
	return index === -1 ? preferredFeatures.length : index;
};

export const GET: RequestHandler = ({ url, locals }) => {
	const state = getInventoryState('listing-grid4-columns.html', { searchParams: url.searchParams });
	const locale = locals.localeState.locale;
	const desktop = inventoryDesktopDataFromState(state, locale);
	return json(
		{
			count: state.selected.length,
			...(url.searchParams.get('preview') === '1'
				? { cards: inventoryCardsFromVehicles(state.selected.slice(0, 4), locale) }
				: {}),
			filters: desktop.filters,
			features: [...new Set(listPublicVehicles().flatMap((vehicle) => vehicle.features))]
				.sort((a, b) => featureRank(a) - featureRank(b) || a.localeCompare(b, 'bg'))
				.map((value) => ({
					value,
					label: inventoryText(locale, value).replaceAll('$lib', '/').replaceAll('IN/', 'IN / ')
				})),
			models: desktop.filters.find((filter) => filter.name === 'model')?.options ?? []
		},
		{ headers: { 'Cache-Control': 'no-store' } }
	);
};
