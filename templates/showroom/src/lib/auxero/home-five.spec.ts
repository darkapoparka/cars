import { describe, expect, it } from 'vitest';
import { vehicles } from '$lib/data/vehicles';
import {
	homeFiveBrandCardsForLocale,
	homeFiveHeaderData,
	homeFiveHeaderDataForLocale,
	homeFiveVehiclePills
} from './home-five';

describe('homeFiveVehiclePills', () => {
	it('keeps the Home 05 quick-search pills as shared typed route data', () => {
		expect(homeFiveVehiclePills).toEqual([
			{
				active: false,
				href: '/inventory?bodyType=SUV',
				icon: 'suv',
				kind: 'body',
				label: 'SUV',
				termGroup: 'bodyTypes'
			},
			{
				active: false,
				href: '/inventory?bodyType=Sedan',
				icon: 'sedan',
				kind: 'body',
				label: 'Sedan',
				termGroup: 'bodyTypes'
			},
			{
				active: false,
				href: '/inventory?bodyType=Cabriolet',
				icon: 'coupe',
				kind: 'body',
				label: 'Cabriolet',
				termGroup: 'bodyTypes'
			},
			{
				active: false,
				href: '/inventory?minPrice=50000',
				icon: 'luxury',
				kind: 'body',
				label: 'Luxury',
				termGroup: 'bodyTypes'
			},
			{
				active: false,
				href: '/inventory?transmission=Automatic',
				image: '/assets/icons/transmission.svg',
				kind: 'spec',
				label: 'Automatic',
				termGroup: 'transmissions'
			},
			{
				active: false,
				href: '/inventory?fuel=Petrol',
				image: '/assets/icons/gaspump.svg',
				kind: 'spec',
				label: 'Petrol',
				termGroup: 'fuels'
			},
			{
				active: false,
				href: '/inventory?minYear=2021',
				image: '/assets/icons/calendar.svg',
				kind: 'spec',
				label: '2021+'
			},
			{
				active: false,
				href: '/inventory?maxMileage=120000',
				image: '/assets/icons/mileage.svg',
				kind: 'spec',
				label: 'Under 120k',
				labels: { bg: 'до 120k' }
			},
			{
				active: false,
				href: '/inventory?brand=BMW',
				image: '/assets/images/brand/brand-1.webp',
				kind: 'brand',
				label: 'BMW'
			},
			{
				active: false,
				href: '/inventory?brand=Audi',
				image: '/assets/images/brand/brand-3.webp',
				kind: 'brand',
				label: 'Audi'
			},
			{
				active: false,
				href: '/inventory?brand=Mercedes-Benz',
				image: '/assets/images/brand/brand-2.webp',
				kind: 'brand',
				label: 'Mercedes'
			}
		]);
	});
});

describe('homeFiveBrandCardsForLocale', () => {
	it('keeps the Home 05 brand wall at the full 12-card coverage', () => {
		const cards = homeFiveBrandCardsForLocale('bg');

		expect(cards).toHaveLength(12);
		expect(cards.map((card) => card.name)).toEqual([
			'BMW',
			'Mercedes',
			'Audi',
			'Porsche',
			'Mazda',
			'Honda',
			'Toyota',
			'Volvo',
			'Ford',
			'Hyundai',
			'Tesla',
			'Всички марки'
		]);
		// Stocked brands surface live inventory counts so the cards never lie.
		expect(cards.find((card) => card.query === 'BMW')?.count).toBe('3 автомобила');
		expect(cards.find((card) => card.query === 'Mercedes-Benz')?.count).toBe('9 автомобила');
		expect(cards.find((card) => card.query === 'Audi')?.count).toBe('4 автомобила');
		expect(cards.find((card) => card.query === 'BMW')?.href).toBeUndefined();
		// Unstocked brands route to the import flow instead of an empty inventory.
		expect(cards.find((card) => card.query === 'Tesla')?.count).toBe('Внос по заявка');
		expect(cards.find((card) => card.query === 'Tesla')?.href).toBe('/import');
		// The closing tile links to the full inventory with the live total.
		const allTile = cards.at(-1);
		expect(allTile?.allTile).toBe(true);
		expect(allTile?.href).toBe('/inventory');
		expect(allTile?.count).toBe(`${vehicles.length} автомобила`);
	});
});

describe('homeFiveHeaderData', () => {
	it('keeps the white-header logo and cleaned-up homepage information architecture intact', () => {
		expect(homeFiveHeaderData.logo.src).toContain('eliq-auto-wordmark-clean');
		expect(homeFiveHeaderData.logo.mobileSrc).toContain('eliq-auto-wordmark-clean');
		expect(homeFiveHeaderData.navigation.map((item) => item.label)).toEqual([
			'Home',
			'Inventory',
			'Services',
			'About',
			'Contact'
		]);

		const inventory = homeFiveHeaderData.navigation.find((item) => item.label === 'Inventory');
		const services = homeFiveHeaderData.navigation.find((item) => item.label === 'Services');
		const about = homeFiveHeaderData.navigation.find((item) => item.label === 'About');

		expect(inventory?.megaMenu?.variant).toBe('inventory');
		if (!inventory?.megaMenu || inventory.megaMenu.variant !== 'inventory') {
			throw new Error('Expected inventory mega menu');
		}
		expect(inventory?.megaMenu?.sections.map((section) => section.title)).toEqual([
			'Browse Inventory',
			'Shop By Body Type',
			'Shop By Fuel Type',
			'Eliq Auto Support'
		]);
		expect(inventory?.megaMenu?.sections[0]?.links[0]).toEqual({
			href: '/inventory',
			label: 'All Vehicles'
		});
		expect(inventory?.megaMenu?.vehicles).toHaveLength(4);
		expect(inventory?.megaMenu?.vehicles[0]).toMatchObject({
			href: '/inventory/11779989521200947',
			image: '/assets/eliqauto/cars/11779989521200947/img-01.webp',
			label: 'Audi A5 S Line'
		});
		expect(inventory?.megaMenu?.footer.ctaHref).toBe('/inventory');
		expect(inventory?.megaMenu?.footer.title).toContain('vehicles in the ELIQ Auto stock feed');

		expect(services?.megaMenu?.variant).toBe('container');
		if (!services?.megaMenu || services.megaMenu.variant !== 'container') {
			throw new Error('Expected services dropdown menu');
		}
		expect(services?.megaMenu?.links).toEqual(
			expect.arrayContaining([
				{ href: '/services', label: 'Services Overview' },
				{ href: '/sell-your-car', label: 'Sell Your Car' },
				{ href: '/compare', label: 'Compare Vehicles' }
			])
		);

		expect(about?.megaMenu?.variant).toBe('container');
		if (!about?.megaMenu || about.megaMenu.variant !== 'container') {
			throw new Error('Expected about dropdown menu');
		}
		expect(about?.megaMenu?.links).toEqual(
			expect.arrayContaining([
				{ href: '/about', label: 'About Us' },
				{ href: '/agents', label: 'Meet Our Consultants' },
				{ href: '/blog', label: 'Eliq Auto Notes' }
			])
		);
	});

	it('marks the supplied public route active in the shared header data', () => {
		const inventoryHeader = homeFiveHeaderDataForLocale('bg', '/inventory');
		const activeLabels = inventoryHeader.navigation
			.filter((item) => item.active)
			.map((item) => item.label);

		expect(activeLabels).toEqual(['Автомобили']);
		expect(
			inventoryHeader.navigation.find((item) => item.href === '/inventory')?.megaMenu?.variant
		).toBe('inventory');
	});
});
