export function formatPrice(value: number, options: Intl.NumberFormatOptions = {}) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
		...options
	}).format(value);
}

export function formatTemplatePrice(value: number) {
	return `$${new Intl.NumberFormat('de-DE', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(value)}`;
}

export function formatMileage(value: number) {
	return `${new Intl.NumberFormat('en-US').format(value)} miles`;
}

export function formatNumber(value: number) {
	return new Intl.NumberFormat('en-US').format(value);
}

export function calculateMonthlyPayment(
	principal: number,
	annualRate: number,
	months: number,
	downPayment = 0
) {
	const financed = Math.max(principal - downPayment, 0);
	const monthlyRate = annualRate / 100 / 12;

	if (months <= 0) return 0;
	if (monthlyRate === 0) return Math.round(financed / months);

	const payment =
		(financed * monthlyRate * Math.pow(1 + monthlyRate, months)) /
		(Math.pow(1 + monthlyRate, months) - 1);

	return Math.round(payment);
}

/** Compact fuel label for tight spec chips — truncates the one long Bulgarian
 * fuel name ("Electric" → "Electric") so it never clips the 2×2 spec grid.
 * The full word is kept on detail pages where there's room. */
export function shortFuel(fuel: string): string {
	return fuel === 'Electric' ? 'Electric' : fuel;
}
