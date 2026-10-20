export function formatPrice(value: number, options: Intl.NumberFormatOptions = {}) {
	const formatted = new Intl.NumberFormat('fr-FR', {
		maximumFractionDigits: 0,
		...options
	})
		.format(value)
		.replace(/\u202f/g, ' ');

	return `${formatted} EUR`;
}

export function formatAuxeroPrice(value: number) {
	return formatPrice(value);
}

export function formatMileage(value: number) {
	return `${new Intl.NumberFormat('fr-FR').format(value).replace(/\u202f/g, ' ')} km`;
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
