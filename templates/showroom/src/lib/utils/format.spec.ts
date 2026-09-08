import { describe, expect, it } from 'vitest';
import { calculateMonthlyPayment, formatMileage, formatPrice } from './format';

describe('format helpers', () => {
	it('formats prices without cents', () => {
		expect(formatPrice(36500)).toBe('36 500 EUR');
	});

	it('formats mileage with grouped digits', () => {
		expect(formatMileage(140000)).toBe('140 000 km');
	});

	it('calculates monthly payment with down payment and APR', () => {
		expect(calculateMonthlyPayment(44900, 7.89, 72, 1560)).toBe(758);
	});

	it('handles zero interest loans', () => {
		expect(calculateMonthlyPayment(24000, 0, 48, 0)).toBe(500);
	});
});
