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
		.replace(/(?:EUR|€|%)/gi, '')
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
			if (field === 'months') value = value.replace(/\s*месеца?\s*$/, '');
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
			error: 'Въведете валидни неотрицателни числа във всички полета.'
		};
	if (price <= 0 || price > 10000000)
		return { valid: false as const, error: 'Въведете цена между 0 и 10 000 000 €.' };
	if (!Number.isInteger(months) || months < 1 || months > 120)
		return { valid: false as const, error: 'Срокът трябва да е от 1 до 120 цели месеца.' };
	if (annualRate > 100 || feePercent > 100)
		return { valid: false as const, error: 'Лихвата и таксите трябва да са между 0 и 100%.' };
	if (deposit + tradeIn > price)
		return {
			valid: false as const,
			error: 'Първоначалната вноска и бартерът не могат да надвишават цената.'
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
	return new Intl.NumberFormat('bg-BG', {
		style: 'currency',
		currency: 'EUR',
		maximumFractionDigits: 2
	}).format(value);
}
