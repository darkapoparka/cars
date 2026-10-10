export type FinanceInput = {
	price: number;
	downPayment: number;
	annualRate: number;
	months: number;
};
export type FinanceEstimate = {
	financed: number;
	monthly: number;
	interest: number;
	total: number;
};

/** Values are illustrative; rounding happens only at presentation, never between formula steps. */
export function estimateFinance(input: FinanceInput): FinanceEstimate | null {
	const { price, downPayment, annualRate, months } = input;
	if (![price, downPayment, annualRate, months].every(Number.isFinite)) return null;
	if (
		price < 0 ||
		downPayment < 0 ||
		downPayment > price ||
		annualRate < 0 ||
		annualRate > 100 ||
		!Number.isInteger(months) ||
		months < 1 ||
		months > 120
	)
		return null;
	const financed = price - downPayment;
	const rate = annualRate / 1200;
	const monthly =
		rate === 0 ? financed / months : (financed * rate) / (1 - Math.pow(1 + rate, -months));
	const total = monthly * months + downPayment;
	return { financed, monthly, total, interest: total - price };
}

export type FinancePolicy = {
	annualRate: number;
	months: number;
	downPaymentPercent: number;
	showEstimates: boolean;
};

export function illustrativeMonthly(price: number, policy: FinancePolicy): number {
	if (!policy.showEstimates || !Number.isFinite(price) || price <= 0) return 0;
	const result = estimateFinance({
		price,
		downPayment: (price * policy.downPaymentPercent) / 100,
		annualRate: policy.annualRate,
		months: policy.months
	});
	return result ? Math.round(result.monthly) : 0;
}
