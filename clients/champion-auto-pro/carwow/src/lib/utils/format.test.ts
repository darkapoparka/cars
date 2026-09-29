import { describe, expect, it } from 'vitest';
import { formatEuroPrice, formatEuroPriceLabel } from './format';

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
