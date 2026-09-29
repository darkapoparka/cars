export function formatPrice(value: number, options: Intl.NumberFormatOptions = {}) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
		...options
	}).format(value);
}

const euroPriceFormatter = new Intl.NumberFormat('bg-BG', {
	useGrouping: 'always',
	minimumFractionDigits: 0,
	maximumFractionDigits: 2
});
const euroPriceWithCentsFormatter = new Intl.NumberFormat('bg-BG', {
	useGrouping: 'always',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});

/** Public car prices use Bulgarian separators and retain any cents. */
export function formatEuroPrice(value: number, locale: 'en' | 'bg' = 'bg'): string {
	if (locale === 'en')
		return new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
			maximumFractionDigits: 2
		}).format(value);
	const formatter = Number.isInteger(value) ? euroPriceFormatter : euroPriceWithCentsFormatter;
	return `${formatter.format(value).replaceAll('\u00a0', ' ')} €`;
}

/** Keep the displayed amount: the database's numeric sort price may omit cents. */
export function formatEuroPriceLabel(label: string): string {
	const match = label.match(/^\s*(\d[\d\s]*)(?:[.,](\d{1,2}))?\s*€?\s*$/);
	if (!match) return label;
	const amount = Number(`${match[1].replace(/\s/g, '')}.${match[2] ?? '0'}`);
	return Number.isFinite(amount) ? formatEuroPrice(amount) : label;
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
 * fuel name ("Електрически" → "Електрич.") so it never clips the 2×2 spec grid.
 * The full word is kept on detail pages where there's room. */
export function shortFuel(fuel: string, locale: 'en' | 'bg' = 'bg'): string {
	if (locale === 'en')
		return (
			(
				{
					Бензин: 'Petrol',
					Дизел: 'Diesel',
					Електрически: 'Electric',
					Хибриден: 'Hybrid',
					'Бензин/Газ': 'Petrol/LPG',
					'Газ/Бензин': 'Petrol/LPG'
				} as Record<string, string>
			)[fuel] ?? fuel
		);
	return fuel === 'Електрически' ? 'Електрич.' : fuel;
}
