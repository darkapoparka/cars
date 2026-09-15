import { describe, expect, it } from 'vitest';
import {
	calculateFinance,
	financeDefaults,
	parseFinanceNumber,
	readFinanceInputs
} from './finance-estimate';

describe('illustrative finance calculation', () => {
	it('amortizes a zero-rate balance and finances fees once', () => {
		const result = calculateFinance({
			price: '20000',
			deposit: '2000',
			tradeIn: '3000',
			annualRate: '0',
			feePercent: '3',
			months: '12'
		});
		expect(result.valid).toBe(true);
		if (!result.valid) return;
		expect(result.monthly).toBe(1300);
		expect(result.fees).toBe(600);
		expect(result.interest).toBe(0);
		expect(result.total).toBe(20600);
	});
	it('matches a known amortization result and reconciles totals', () => {
		const result = calculateFinance({
			price: '10000',
			deposit: '0',
			tradeIn: '0',
			annualRate: '6',
			feePercent: '0',
			months: '12'
		});
		expect(result.valid).toBe(true);
		if (!result.valid) return;
		expect(result.monthly).toBeCloseTo(860.6643, 4);
		expect(result.interest + result.principal).toBeCloseTo(result.monthly * 12, 8);
	});
	it.each(['', '-1', 'no', 'Infinity', '20oops', '1.2.3'])(
		'rejects invalid price %s rather than returning a stale amount',
		(price) => {
			expect(calculateFinance({ ...financeDefaults, price }).valid).toBe(false);
		}
	);
	it('rejects excessive upfront value and invalid terms', () => {
		expect(calculateFinance({ ...financeDefaults, deposit: '50000' }).valid).toBe(false);
		expect(calculateFinance({ ...financeDefaults, months: '0' }).valid).toBe(false);
		expect(calculateFinance({ ...financeDefaults, months: '1.5' }).valid).toBe(false);
	});
	it('accepts localized field values and legacy vehicle handoff', () => {
		expect(parseFinanceNumber('46 300 €')).toBe(46300);
		expect(parseFinanceNumber('1,20%')).toBe(1.2);
		const input = readFinanceInputs(
			new URLSearchParams(
				'FinancingCalculatorCarPrice=20000&FinancingCalculatorLoanTerm=60+месеца&FinancingCalculatorDownPayment=1000'
			)
		);
		expect(input.price).toBe('20000');
		expect(input.months).toBe('60');
		expect(input.deposit).toBe('1000');
	});
});
