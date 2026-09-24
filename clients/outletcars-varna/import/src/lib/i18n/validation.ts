import type { Locale } from '$lib/locale/core';

export const validationMessages = {
	en: {
		required: 'Complete this field.',
		email: 'Enter a valid email address.',
		url: 'Enter a valid web address.',
		pattern: 'Use the requested format.',
		short: 'Enter a longer value.',
		long: 'Enter a shorter value.',
		range: 'Enter a value within the allowed range.',
		number: 'Enter a valid number.',
		step: 'Use one of the allowed values.'
	},
	bg: {
		required: 'Попълни това поле.',
		email: 'Въведи валиден имейл адрес.',
		url: 'Въведи валиден уеб адрес.',
		pattern: 'Използвай указания формат.',
		short: 'Въведи по-дълга стойност.',
		long: 'Въведи по-кратка стойност.',
		range: 'Въведи стойност в допустимите граници.',
		number: 'Въведи валидно число.',
		step: 'Използвай една от допустимите стойности.'
	}
} satisfies Record<Locale, Record<string, string>>;

/** Select authored constraint copy without reading or modifying a visitor's input value. */
export function constraintMessage(
	validity: Partial<ValidityState>,
	type: string,
	locale: Locale
): string {
	const text = validationMessages[locale];
	if (validity.valueMissing) return text.required;
	if (validity.typeMismatch)
		return type === 'email' ? text.email : type === 'url' ? text.url : text.pattern;
	if (validity.badInput) return text.number;
	if (validity.tooShort) return text.short;
	if (validity.tooLong) return text.long;
	if (validity.rangeUnderflow || validity.rangeOverflow) return text.range;
	if (validity.stepMismatch) return text.step;
	return validity.patternMismatch ? text.pattern : '';
}
