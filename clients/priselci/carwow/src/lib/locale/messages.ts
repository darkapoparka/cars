import { dealerLocalizedText } from './config';
import { en, bg, sourceKeys, ambiguousAliases } from './catalog';
import { localeContract, intlLocale, type Locale } from './core';
export type MessageKey = keyof typeof en;
export type MessageParameters = Record<string, string | number>;
const renderedValues = {
	en: new Set<string>(Object.values(en)),
	bg: new Set<string>(Object.values(bg))
};
const escapePattern = (value: string) =>
	[...value].map((char) => ('\\^$.*+?()[]{}|'.includes(char) ? '\\' + char : char)).join('');
const resolvedPatterns = Object.fromEntries(
	Object.entries({ en, bg }).map(([locale, catalog]) => [
		locale,
		Object.values(catalog)
			.filter((pattern) => /\{[a-zA-Z]/.test(pattern))
			.map(
				(pattern) =>
					new RegExp(
						'^' +
							pattern
								.split(/(\{[a-zA-Z][a-zA-Z0-9_]*\})/)
								.map((part) => (/^\{[a-zA-Z]/.test(part) ? '[\\s\\S]*?' : escapePattern(part)))
								.join('') +
							'$'
					)
			)
	])
) as Record<Locale, RegExp[]>;

/** Native messages; parameters are data, never translated or interpreted as markup. */
export function message(
	locale: Locale,
	key: MessageKey,
	parameters: MessageParameters = {}
): string {
	const pattern: string = (locale === 'bg' ? bg : en)[key];
	if (typeof pattern !== 'string') throw new Error(`Missing ${locale} message: ${key}`);
	const values: MessageParameters = {
		dealerName: localeContract.dealerName,
		dealerCity: dealerLabel(locale, 'city'),
		dealerAddress: dealerLabel(locale, 'address'),
		dealerAddressLine: dealerLabel(locale, 'addressLine'),
		inventoryCurrency: localeContract.inventoryCurrency,
		...parameters
	};
	return pattern.replace(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g, (_placeholder, name: string) => {
		if (!Object.hasOwn(values, name)) throw new Error(`Missing parameter ${name} for ${key}`);
		return String(values[name]);
	});
}
/** Exact immutable presentation copy only; unknown prose fails instead of falling back. */
export function templateText<T>(locale: Locale, value: T): T {
	if (typeof value !== 'string') return value;
	const source = value.replace(/\s+/g, ' ').trim();
	if (
		!source ||
		renderedValues[locale].has(source) ||
		resolvedPatterns[locale].some((pattern) => pattern.test(source))
	)
		return value;
	const key = (sourceKeys as Record<string, MessageKey>)[source];
	if (!key)
		throw new Error(
			`${(ambiguousAliases as readonly string[]).includes(source) ? 'Ambiguous' : 'Missing'} template copy; use a context-specific message key: ${source}`
		);
	return (value.match(/^\s*/)?.[0] + message(locale, key) + value.match(/\s*$/)?.[0]) as T;
}
export function vehicleCount(locale: Locale, count: number): string {
	const category = new Intl.PluralRules(intlLocale(locale)).select(count);
	return message(locale, category === 'one' ? 'inventory.count.one' : 'inventory.count.other', {
		count: new Intl.NumberFormat(intlLocale(locale)).format(count)
	});
}
export type DealerTextField = keyof typeof dealerLocalizedText.en;
export function dealerLabel(locale: Locale, field: DealerTextField): string {
	const value = dealerLocalizedText[locale][field];
	if (typeof value !== 'string' || !value.trim())
		throw new Error(`Dealer field ${field} requires reviewed EN/BG dealer-owned copy`);
	return value;
}
/** Reviewed stock taxonomy only; brands/models and raw business values remain intact. */
export function specificationText<T>(locale: Locale, value: T): T {
	if (typeof value !== 'string') return value;
	const key = (sourceKeys as Record<string, MessageKey>)[value.replace(/\s+/g, ' ').trim()];
	return key ? (message(locale, key) as T) : value;
}
