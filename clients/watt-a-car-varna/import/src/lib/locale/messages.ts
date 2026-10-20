import type { Locale } from './core';
export const en = {
	trigger: 'Country and language',
	title: 'Country and language',
	welcome: 'Make yourself at home',
	description: 'Choose your country and preferred language independently.',
	suggestion: 'Approximate country suggestion: {country}',
	country: 'Country',
	language: 'Language',
	suggested: 'suggested',
	facts: 'Your choice does not change vehicle prices, currency or dealer contact details.',
	available: 'English and Bulgarian are available.',
	error: 'Preferences could not be saved. Please try again.',
	dismiss: 'Not now',
	save: 'Save preferences',
	saving: 'Saving…',
	close: 'Close'
} as const;
export const bg: Record<keyof typeof en, string> = {
	trigger: 'Държава и език',
	title: 'Държава и език',
	welcome: 'Добре дошли',
	description: 'Изберете държава и предпочитан език независимо един от друг.',
	suggestion: 'Приблизително предложение за държава: {country}',
	country: 'Държава',
	language: 'Език',
	suggested: 'предложение',
	facts: 'Изборът не променя цените, валутата или контактите на автокъщата.',
	available: 'Налични са английски и български.',
	error: 'Настройките не бяха запазени. Опитайте отново.',
	dismiss: 'Не сега',
	save: 'Запази настройките',
	saving: 'Запазване…',
	close: 'Затвори'
};
export function message(
	locale: Locale,
	key: keyof typeof en,
	parameters: Record<string, string | number> = {}
) {
	return (locale === 'en' ? en : bg)[key].replace(/\{(\w+)\}/g, (_, name: string) =>
		String(parameters[name] ?? '')
	);
}
