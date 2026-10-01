import type { Locale } from '$lib/locale/core';
import type { Vehicle } from '$lib/types/vehicle';

export const homeHeroModes = {
	buy: { title: { bg: 'Купи автомобил', en: 'Buy a car' }, action: '/inventory' },
	finance: { title: { bg: 'Автомобил на лизинг', en: 'Finance a car' }, action: '/financing' },
	sell: { title: { bg: 'Продай автомобил', en: 'Sell your car' }, action: '/sell-your-car' },
	import: { title: { bg: 'Внеси автомобил', en: 'Import a car' }, action: '/import' }
} as const;

/** Public discovery links share the inventory's URL contract and actual stock values. */
export function homeDiscoveryLinks(vehicles: readonly Vehicle[], locale: Locale) {
	const english = locale === 'en';
	const links = [
		{ label: english ? 'All cars' : 'Всички автомобили', href: '/inventory' },
		{
			label: english ? 'SUVs' : 'SUV',
			href: '/inventory?body=SUV',
			available: vehicles.some((v) => v.bodyType === 'SUV')
		},
		{
			label: english ? 'Under €20,000' : 'До 20 000 €',
			href: '/inventory?maxPrice=20000',
			available: vehicles.some((v) => v.price <= 20000)
		},
		{ label: english ? 'Finance' : 'Лизинг', href: '/financing' },
		{ label: english ? 'Import a car' : 'Внос по заявка', href: '/import' }
	];
	return links
		.filter((link) => link.available !== false)
		.map(({ label, href }) => ({ label, href }));
}
