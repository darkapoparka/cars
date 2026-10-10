import type { Locale } from '$lib/i18n/messages';

/** Compact card copy only; callers retain the complete value in accessible labels. */
export function compactCardFuel(value: string): string {
	if (/^(?:lpg|лпг)$/iu.test(value.trim())) return 'LPG';
	if (
		/^(?:petrol|gasoline|бензин)\s*[/+]\s*(?:lpg|лпг|газ|пропан[-\s]?бутан)$/iu.test(value.trim())
	)
		return 'LPG';
	return value;
}

export function compactCardTransmission(value: string): string {
	return value === 'Automatic' ? 'Auto' : value;
}

export function compactCardMileage(value: string, locale: Locale): string {
	const match = value.trim().match(/^(\d{1,3}(?:[\s.,]\d{3})+|\d+)\s*(km|км|mi)$/iu);
	if (!match) return value;
	const distance = Number(match[1].replace(/[\s.,]/g, ''));
	if (!Number.isSafeInteger(distance) || distance < 10_000) return value;
	const unit = /^(km|км)$/iu.test(match[2]) ? (locale === 'bg' ? 'км' : 'km') : match[2];
	const thousands = new Intl.NumberFormat(locale, {
		maximumFractionDigits: 1,
		useGrouping: false
	}).format(distance / 1_000);
	return `${thousands}k ${unit}`;
}
