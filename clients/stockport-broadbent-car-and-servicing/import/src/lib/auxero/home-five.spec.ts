import { describe, expect, it } from 'vitest';
import { vehicles } from '$lib/data/vehicles';
import { importCriteriaFromParams } from '$lib/data/import-criteria';
import { importEntryFromParams } from '$lib/domain/import-entry';
import { illustrativeMonthly } from '$lib/domain/finance';
import { inventoryCardsFromVehicles } from '$lib/domain/vehicle-card';
import { homeFiveTypeCardsForLocale, homeFiveVehicleCardFromVehicle } from './home-five';

for (const locale of ['bg', 'en'] as const) {
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
