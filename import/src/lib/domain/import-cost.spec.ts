import { describe, expect, it } from 'vitest';
import { estimateImportCost } from './import-cost';
import { illustrativeMonthly } from './finance';

describe('shared indicative calculations', () => {
	it('does not invent taxes when none were entered', () => {
		expect(
			estimateImportCost({ price: 25000, transport: 500, prep: 200, dutyRate: 0, vatRate: 0 })
		).toEqual({ duty: 0, vat: 0, total: 25700 });
	});
	it('applies the explicitly documented illustration consistently', () => {
		expect(
			estimateImportCost({ price: 10000, transport: 1000, prep: 500, dutyRate: 10, vatRate: 20 })
		).toEqual({ duty: 1000, vat: 2400, total: 14900 });
	});
	it('rejects invalid and negative entries instead of displaying NaN', () => {
		for (const price of [-1, NaN, Infinity])
			expect(
				estimateImportCost({ price, transport: 0, prep: 0, dutyRate: 0, vatRate: 0 })
			).toBeNull();
		expect(
			estimateImportCost({ price: 100, transport: 0, prep: 0, dutyRate: 101, vatRate: 0 })
		).toBeNull();
	});
	it('uses one finance policy for feed and CMS cards', () => {
		expect(
			illustrativeMonthly(36000, {
				annualRate: 0,
				months: 72,
				downPaymentPercent: 0,
				showEstimates: true
			})
		).toBe(500);
		expect(
			illustrativeMonthly(36000, {
				annualRate: 0,
				months: 72,
				downPaymentPercent: 20,
				showEstimates: true
			})
		).toBe(400);
		expect(
			illustrativeMonthly(36000, {
				annualRate: 0,
				months: 72,
				downPaymentPercent: 0,
				showEstimates: false
			})
		).toBe(0);
	});
});
