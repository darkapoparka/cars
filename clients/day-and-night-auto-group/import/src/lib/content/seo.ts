import type { Locale } from '$lib/locale/core';
export const pageDescriptions = {
	calculator: {
		en: 'Estimate vehicle import costs from your confirmed price, transport, duty, VAT and preparation figures.',
		bg: 'Изчисли ориентировъчните разходи за внос по потвърдени цена, транспорт, мито, ДДС и подготовка.'
	},
	compare: {
		en: 'Compare the price, mileage and specifications of your selected cars.',
		bg: 'Сравни цена, пробег и характеристики на избраните автомобили.'
	},
	reviews: {
		en: 'Read the customer review examples presented in this template.',
		bg: 'Разгледай примерните клиентски отзиви в този шаблон.'
	},
	faqs: {
		en: 'Answers about cars, imports, viewings, documents and selling your vehicle.',
		bg: 'Отговори за автомобили, внос, огледи, документи и продажба на твоя автомобил.'
	},
	blog: {
		en: 'Read about vehicle checks, import preparation and selling a customer car.',
		bg: 'Прочети за проверките на автомобили, подготовката за внос и продажбата на клиентски автомобил.'
	},
	favorites: {
		en: 'Return to the cars you have saved and compare your options.',
		bg: 'Върни се към запазените автомобили и сравни възможностите.'
	},
	settings: {
		en: 'Choose your country and preferred language independently.',
		bg: 'Избери държава и предпочитан език независимо един от друг.'
	}
} as const satisfies Record<string, Record<Locale, string>>;
