import { describe, expect, it } from 'vitest';
import {
	compactMobileDistance,
	compactMobileTransmission,
	formatEuroPrice,
	formatEuroPriceLabel
} from './format';

describe('Bulgarian public car prices', () => {
	it.each([
		[26699, '26 699 €'],
		[28478.45, '28 478,45 €'],
		[9999.5, '9 999,50 €'],
		[143699, '143 699 €']
	])('formats %s without dropping cents', (amount, expected) => {
		expect(formatEuroPrice(amount)).toBe(expected);
	});
	it.each([
		['28 478.45 €', '28 478,45 €'],
		['28\u00a0478,45 €', '28 478,45 €'],
		['26699 €', '26 699 €'],
		['По запитване', 'По запитване'],
		['', '']
	])('normalizes the displayed amount %s and preserves non-price labels', (label, expected) => {
		expect(formatEuroPriceLabel(label)).toBe(expected);
	});
});

describe('compact mobile vehicle specifications', () => {
	it.each([
		['170 000 км', '170k км'],
		['170,000 km', '170k km'],
		['170,123 km', '≈170.1k km'],
		['999 km', '999 km'],
		['Mileage pending', 'Mileage pending']
	])('keeps %s readable in a narrow chip', (distance, expected) => {
		expect(compactMobileDistance(distance)).toBe(expected);
	});
	it('shortens only the automatic gearbox label', () => {
		expect(compactMobileTransmission('Automatic')).toBe('Auto');
		expect(compactMobileTransmission('Автоматик')).toBe('Авто');
		expect(compactMobileTransmission('Manual')).toBe('Manual');
	});
});
