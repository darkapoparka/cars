import { inventoryText } from '$lib/content/inventory-localized';
import type { Locale } from '$lib/locale/core';
const optionEnglish = {
	Всички: 'All',
	Китай: 'China',
	Германия: 'Germany',
	САЩ: 'United States',
	Япония: 'Japan',
	'Южна Корея': 'South Korea',
	Бензин: 'Petrol',
	Дизел: 'Diesel',
	Хибрид: 'Hybrid',
	Електрически: 'Electric',
	Автомат: 'Automatic',
	Ръчни: 'Manual',
	'Без значение': 'Any time',
	'До 1 месец': 'Within 1 month',
	'До 3 месеца': 'Within 3 months',
	'До 6 месеца': 'Within 6 months',
	Друга: 'Other'
} as const;
/** Display only: values passed to the search and intake contracts never change. */
export function optionLabel(value: string, locale: Locale): string {
	return locale === 'en'
		? ((optionEnglish as Record<string, string>)[value] ?? inventoryText(locale, value))
		: inventoryText(locale, value);
}
