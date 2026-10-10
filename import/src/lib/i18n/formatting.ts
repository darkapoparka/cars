import { site } from '$lib/config/site';
import type { Locale } from '$lib/locale/core';
export type NumberPolicy = {
	currency: string;
	formatLocales: Readonly<Record<Locale, string>>;
};

/** Language changes presentation only. Currency is a dealer/stock fact, not visitor location. */
export function formatNumber(
	value: number,
	locale: Locale,
	policy: NumberPolicy = site.locale
): string {
	if (!Number.isFinite(value)) return '—';
	return new Intl.NumberFormat(policy.formatLocales[locale], { maximumFractionDigits: 0 }).format(
		value
	);
}
export function formatMoney(
	value: number,
	locale: Locale,
	policy: NumberPolicy = site.locale
): string {
	if (!Number.isFinite(value)) return '—';
	return new Intl.NumberFormat(policy.formatLocales[locale], {
		style: 'currency',
		currency: policy.currency,
		maximumFractionDigits: 0
	}).format(value);
}
export function listedPrice(
	value: number,
	locale: Locale,
	policy: NumberPolicy = site.locale
): string {
	return Number.isFinite(value) && value > 0
		? formatMoney(value, locale, policy)
		: locale === 'en'
			? 'On request'
			: 'По запитване';
}
