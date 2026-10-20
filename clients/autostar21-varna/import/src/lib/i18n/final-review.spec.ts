import { getMessages, localizeVehicleTermsInText } from './messages';
import { site } from '$lib/config/site';
import { optionLabel } from './options';
import { describe, it, expect } from 'vitest';
import { constraintMessage, validationMessages } from '$lib/i18n/validation';
import { formatNumber, formatMoney, listedPrice } from '$lib/i18n/formatting';
import {
	inventoryCopy,
	inventorySourceKeys,
	inventoryText
} from '$lib/content/inventory-localized';
import { vehicles } from '$lib/data/vehicles';
import { inventoryCardsFromVehicles } from '$lib/domain/vehicle-card';
import { filterVehicles } from '$lib/domain/vehicle-search';
import { homeFiveVehicleCardFromVehicle } from '$lib/auxero/home-five';
import { compareVehiclesFromVehicles } from '$lib/auxero/compare';
import { vehicleDetailFromVehicle } from '$lib/server/vehicle-detail';

describe('reviewed display and validation boundaries', () => {
	it('binds public message identity to the configured template in both languages', () => {
		for (const locale of ['bg', 'en'] as const) {
			const copy = getMessages(locale);
			expect(JSON.stringify(copy).replaceAll(site.identity.displayName, '')).not.toContain(
				'AutoStar'
			);
			expect(copy.hero.heading).toContain(site.identity.displayName);
			expect(copy.detail.financeTerms).toContain(site.identity.displayName);
		}
	});
	it('localizes an authored stock title across cards, detail, comparison and search without mutating stock', () => {
		const vehicle = {
			...vehicles[0],
			brand: 'BMW',
			model: '740',
			title: 'BMW 740 Завиващ заден мост'
		};
		const original = JSON.stringify(vehicle);
		for (const locale of ['bg', 'en'] as const) {
			const title = locale === 'en' ? 'BMW 740 Rear-wheel steering' : vehicle.title;
			expect(inventoryCardsFromVehicles([vehicle], locale)[0].title).toBe(title);
			expect(homeFiveVehicleCardFromVehicle(vehicle, 0, locale).title).toBe(title);
			expect(homeFiveVehicleCardFromVehicle(vehicle, 0, locale).trimLabel).toBe(
				locale === 'en' ? 'Rear-wheel steering' : 'Завиващ заден мост'
			);
			expect(vehicleDetailFromVehicle(vehicle, locale).title).toBe(title);
			expect(compareVehiclesFromVehicles([vehicle], locale)[0].title).toBe(title);
			expect(filterVehicles([vehicle], { query: title })).toEqual([vehicle]);
		}
		expect(inventoryText('en', 'BMW X5 Custom Edition')).toBe('BMW X5 Custom Edition');
		expect(JSON.stringify(vehicle)).toBe(original);
	});
	it('has complete authored constraint messages in both languages', () => {
		expect(Object.keys(validationMessages.en)).toEqual(Object.keys(validationMessages.bg));
		expect(constraintMessage({ valueMissing: true }, 'text', 'bg')).toBe('Попълни това поле.');
		expect(constraintMessage({ typeMismatch: true }, 'email', 'en')).toBe(
			'Enter a valid email address.'
		);
		expect(constraintMessage({ rangeUnderflow: true }, 'number', 'bg')).toBe(
			validationMessages.bg.range
		);
		expect(constraintMessage({ valid: true }, 'text', 'bg')).toBe('');
	});
	it('formats numeric stock using language and actual currency, without conversion', () => {
		const policy = { currency: 'AED', formatLocales: { en: 'en-GB', bg: 'bg-BG' } };
		expect(formatNumber(12345, 'en', policy)).toBe('12,345');
		expect(formatNumber(12345, 'bg', policy).replace(/\s/g, '')).toBe('12345');
		expect(formatMoney(12345, 'en', policy)).toContain('AED');
		expect(formatMoney(12345, 'en', policy)).toContain('12,345');
		expect(formatMoney(12345, 'en', policy)).not.toContain('€');
		expect(listedPrice(0, 'en', policy)).toBe('On request');
		expect(listedPrice(Number.NaN, 'bg', policy)).toBe('По запитване');
	});
	it('cleans display-only source artifacts while preserving the source lookup and vehicle facts', () => {
		for (const pair of Object.values(inventoryCopy)) {
			expect(pair.en).not.toMatch(/\$lib|\uFFFD|\?{3}/);
			expect(pair.bg).not.toMatch(/\$lib|\uFFFD|\?{3}/);
		}
		expect(inventorySourceKeys['Bluetooth $lib handsfree система']).toBeDefined();
		expect(inventoryText('bg', 'Bluetooth $lib handsfree система')).toBe(
			'Bluetooth / хендсфри система'
		);
		const original = JSON.stringify(vehicles);
		const card = inventoryCardsFromVehicles([vehicles[0]], 'en')[0];
		expect(card.description).toBe(inventoryText('en', vehicles[0].description));
		expect(card.priceLabel).toBe(listedPrice(vehicles[0].price, 'en'));
		expect(JSON.stringify(vehicles)).toBe(original);
	});
});

it('uses the clean Bulgarian catalog at native detail and filter display boundaries', () => {
	expect(localizeVehicleTermsInText('bg', '360 camera $lib Задна камера')).toBe(
		'360-градусова камера / задна камера'
	);
	expect(optionLabel('Apple CarPlay $lib Android Auto', 'bg')).toBe('Apple CarPlay / Android Auto');
});
