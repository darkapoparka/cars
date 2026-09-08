/** Illustrative EUR calculation only; defaults are sample inputs, not offered terms. */
export const financeDefaults = {
	price: '46300',
	deposit: '400',
	tradeIn: '0',
	annualRate: '1.2',
	feePercent: '3',
	months: '36'
};

export type FinanceInputs = typeof financeDefaults;

export function parseFinanceNumber(value: string): number {
	const clean = value
		.trim()
		.replace(/\s/g, '')
		.replace(/(?:EUR|$|%)/gi, '')
		.replace(',', '.');
	return /^\d+(?:\.\d+)?$/.test(clean) ? Number(clean) : NaN;
}

/** Accept both current field names and existing detail-page GET links. */
export function readFinanceInputs(params: URLSearchParams): FinanceInputs {
	const legacy: Record<keyof FinanceInputs, string> = {
		price: 'FinancingCalculatorCarPrice',
		deposit: 'FinancingCalculatorDownPayment',
		annualRate: 'FinancingCalculatorInterestRate',
		months: 'FinancingCalculatorLoanTerm',
		tradeIn: 'tradeIn',
		feePercent: 'feePercent'
	};
	return Object.fromEntries(
		Object.entries(financeDefaults).map(([key, fallback]) => {
			const field = key as keyof FinanceInputs;
			let value = params.get(field) ?? params.get(legacy[field]) ?? fallback;
			if (field === 'months') value = value.replace(/\s*months?\s*$/, '');
			return [key, value];
		})
	) as FinanceInputs;
}

/** Equal monthly payments; fees are a percentage of price and financed upfront. */
export function calculateFinance(inputs: FinanceInputs) {
	const values = Object.fromEntries(
		Object.entries(inputs).map(([key, value]) => [key, parseFinanceNumber(value)])
	) as Record<keyof FinanceInputs, number>;
	const { price, deposit, tradeIn, annualRate, feePercent, months } = values;
	if (Object.values(values).some((value) => !Number.isFinite(value)))
		return {
			valid: false as const,
			error: 'Enter valid nonnegative numbers in all fields.'
		};
	if (price <= 0 || price > 10000000)
		return { valid: false as const, error: 'Enter a price between 0 and 10 000 000 USD.' };
	if (!Number.isInteger(months) || months < 1 || months > 120)
		return { valid: false as const, error: 'The term must be a whole number from 1 to 120 months.' };
	if (annualRate > 100 || feePercent > 100)
		return { valid: false as const, error: 'Interest and fees must be between 0 and 100%.' };
	if (deposit + tradeIn > price)
		return {
			valid: false as const,
			error: 'The down payment and estimated trade-in value cannot exceed the price. Trade-in acceptance is unconfirmed.'
		};
	const fees = (price * feePercent) / 100;
	const principal = price - deposit - tradeIn + fees;
	const monthlyRate = annualRate / 1200;
	const monthly =
		monthlyRate === 0
			? principal / months
			: (principal * monthlyRate) / -Math.expm1(-months * Math.log1p(monthlyRate));
	const repayment = monthly * months;
	return {
		valid: true as const,
		...values,
		fees,
		principal,
		monthly,
		interest: repayment - principal,
		repayment,
		total: repayment + deposit + tradeIn
	};
}

export function formatFinanceEur(value: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'EUR',
		maximumFractionDigits: 2
	}).format(value);
}
