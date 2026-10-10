import { describe, expect, it } from 'vitest';
import { vehicles } from '$lib/data/vehicles';
import { importCriteriaFromParams } from '$lib/data/import-criteria';
import { importEntryFromParams } from '$lib/domain/import-entry';
import { illustrativeMonthly } from '$lib/domain/finance';
import { inventoryCardsFromVehicles } from '$lib/domain/vehicle-card';
import { homeBrowseCountLabel } from '$lib/content/home-discovery';
import {
	homeFiveBrandCardsForLocale,
	homeFiveTypeCardsForLocale,
	homeFiveVehicleCardFromVehicle
} from './home-five';

const browseInventory = [
	{ ...vehicles[0], slug: 'bmw-sedan', brand: 'BMW', bodyType: 'Sedan', fuel: 'Бензин' },
	{ ...vehicles[0], slug: 'bmw-suv', brand: ' bmw ', bodyType: 'SUV', fuel: 'Бензин' },
	{ ...vehicles[0], slug: 'cms-tesla', brand: 'Tesla', bodyType: 'Sedan', fuel: 'Електрически' },
	{ ...vehicles[0], slug: 'cms-honda', brand: 'Honda', bodyType: 'Hatchback', fuel: 'Бензин' }
];

for (const locale of ['bg', 'en'] as const) {
	describe(`${locale} Home browse inventory`, () => {
		it('counts the supplied stock, including newly published makes and normalized filters', () => {
			const cards = homeFiveBrandCardsForLocale(locale, browseInventory);
			expect(cards.find((card) => card.query === 'BMW')?.stockCount).toBe(2);
			expect(cards.find((card) => card.query === 'Tesla')?.stockCount).toBe(1);
			expect(cards.find((card) => card.query === 'Honda')?.href).toBeUndefined();
			expect(cards.find((card) => card.allTile)?.stockCount).toBe(4);
			expect(cards.find((card) => card.query === 'Audi')?.href).toContain('/import?');
		});
		it('updates type counts and destinations when an import category enters stock', () => {
			const cards = homeFiveTypeCardsForLocale(locale, browseInventory);
			const electric = cards.find((card) => card.bodyType === 'Electric')!;
			const electricUrl = new URL(electric.href, 'https://example.test');
			expect(electric.stockCount).toBe(1);
			expect(electricUrl.pathname).toBe('/inventory');
			expect(electricUrl.searchParams.get('fuel')).toBe('Електрически');
			expect(electricUrl.searchParams.has('bodyType')).toBe(false);
			expect(cards.find((card) => card.bodyType === 'Sedan')?.stockCount).toBe(2);
			expect(cards.find((card) => card.bodyType === 'Hatchback')?.href).toContain('/inventory?');
			expect(cards.find((card) => card.allTile)?.stockCount).toBe(4);
		});
		it('does not retain stale stock or inventory destinations after stock is removed', () => {
			homeFiveTypeCardsForLocale(locale, browseInventory);
			homeFiveBrandCardsForLocale(locale, browseInventory);
			const types = homeFiveTypeCardsForLocale(locale, []);
			const brands = homeFiveBrandCardsForLocale(locale, []);
			expect(types.find((card) => card.bodyType === 'SUV')?.href).toContain('/import?');
			expect(types.every((card) => card.stockCount === 0)).toBe(true);
			expect(brands.find((card) => card.query === 'BMW')?.href).toContain('/import?');
			expect(brands.find((card) => card.allTile)?.count).toContain('0');
			expect(homeBrowseCountLabel(locale, 0)).toBe(locale === 'bg' ? 'По заявка' : 'On request');
			expect(homeBrowseCountLabel(locale, 0, true)).toBe(locale === 'bg' ? '0 коли' : '0 cars');
			expect(homeBrowseCountLabel(locale, 1)).toBe(locale === 'bg' ? '1 кола' : '1 car');
		});
	});
	describe(`${locale} Home sourcing handoffs`, () => {
		it.each(['Pickup Truck', 'Hatchback', 'Crossover'])(
			'keeps the chosen %s body type in the request',
			(bodyType) => {
				const card = homeFiveTypeCardsForLocale(locale).find((item) => item.bodyType === bodyType);
				const url = new URL(card!.href, 'https://example.test');
				expect(url.pathname).toBe('/import');
				expect(importEntryFromParams(url.searchParams).intent).toBe('source');
				expect(importCriteriaFromParams(url.searchParams).bodyType).toBe(bodyType);
			}
		);
		it('carries Electric as a fuel preference rather than an invalid body type', () => {
			const card = homeFiveTypeCardsForLocale(locale).find((item) => item.bodyType === 'Electric');
			const url = new URL(card!.href, 'https://example.test');
			const criteria = importCriteriaFromParams(url.searchParams);
			expect(importEntryFromParams(url.searchParams).intent).toBe('source');
			expect(criteria.fuel).toBe('Електрически');
			expect(criteria.bodyType).toBe('');
		});
	});
	describe(`${locale} optional card financing`, () => {
		it('hides disabled estimates consistently on Home and Inventory', () => {
			const vehicle = {
				...vehicles[0],
				monthly: illustrativeMonthly(vehicles[0].price, {
					annualRate: 0,
					months: 72,
					downPaymentPercent: 0,
					showEstimates: false
				})
			};
			expect(homeFiveVehicleCardFromVehicle(vehicle, 0, locale).monthlyLabel).toBe('');
			expect(inventoryCardsFromVehicles([vehicle], locale)[0].monthlyLabel).toBe('');
		});
		it('retains enabled positive estimates on both card presentations', () => {
			const vehicle = { ...vehicles[0], monthly: 500 };
			expect(homeFiveVehicleCardFromVehicle(vehicle, 0, locale).monthlyLabel).toContain('500');
			expect(inventoryCardsFromVehicles([vehicle], locale)[0].monthlyLabel).toContain('500');
		});
	});
}
