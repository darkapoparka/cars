import { describe, expect, it } from 'vitest';
import { estimateFinance } from './finance';

describe('shared finance estimates', () => {
	it('calculates interest-free instalments consistently with card teasers', () => {
		expect(estimateFinance({ price: 36000, downPayment: 0, annualRate: 0, months: 72 })).toEqual({
			financed: 36000,
			monthly: 500,
			total: 36000,
			interest: 0
		});
	});
	it('calculates amortization without rounding intermediate values', () => {
		const result = estimateFinance({ price: 25000, downPayment: 5000, annualRate: 6, months: 60 });
		expect(result?.monthly).toBeCloseTo(386.65603, 4);
		expect(result?.total).toBeCloseTo(28199.3618, 3);
	});
	it('handles a fully paid vehicle and rejects invalid or nonfinite bounds', () => {
		expect(
			estimateFinance({ price: 20000, downPayment: 20000, annualRate: 8, months: 48 })?.monthly
		).toBe(0);
		for (const input of [
			{ price: -1 },
			{ price: NaN },
			{ downPayment: 21000 },
			{ annualRate: -1 },
			{ months: 0 },
			{ months: 1.5 }
		]) {
			expect(
				estimateFinance({ price: 20000, downPayment: 0, annualRate: 0, months: 72, ...input })
			).toBeNull();
		}
	});
});
