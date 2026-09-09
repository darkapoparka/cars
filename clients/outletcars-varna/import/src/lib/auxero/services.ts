import { daynightAssets, daynightContact } from '$lib/data/daynight';
import type { AuxeroPageBanner } from './page-banner';

export type AuxeroSupportService = {
	description: string;
	href: string;
	image: string;
	title: string;
};

export type AuxeroServicesContent = {
	cards: AuxeroSupportService[];
	cardsDescription: string;
	cardsTitle: string;
	contact: {
		checklist: string[];
		description: string;
		emailLabel: string;
		phoneHref: string;
		phoneLabel: string;
		secondaryPhoneHref: string;
		secondaryPhoneLabel: string;
		title: string;
		workNote: string;
	};
	hero: AuxeroPageBanner;
};

export type AuxeroServiceInputField = {
	active: boolean;
	id?: string;
	label: string;
	name: string;
	placeholder?: string;
	required?: boolean;
	type: 'date' | 'email' | 'tel' | 'text';
	value?: string;
};

export type AuxeroServiceFormData = {
	fields: AuxeroServiceInputField[];
	serviceLabel: string;
	serviceName: string;
	serviceOptions: string[];
	submitLabel: string;
	title: string;
	vehicleField: AuxeroServiceInputField;
};

export const auxeroServiceCards: AuxeroSupportService[] = [
	{
		title: 'Подбрани автомобили',
		description:
			'Подбор на автомобили с проследима история, ясни снимки и реалистична крайна цена преди покупка.',
		href: '/contact',
		image: '/assets/daynight/services/premium-cars-banner-generated.webp'
	},
	{
		title: 'Проверка на обява',
		description:
			'Преглед на VIN, пробег, история, оборудване, снимки и контекст на продавача преди решение.',
		href: '/compare',
		image: '/assets/daynight/services/evaluate-link-service.webp'
	},
	{
		title: 'Продажба на автомобил',
		description:
			'Изпрати данни, документи, снимки и очаквания, за да изберем правилния път за продажба.',
		href: '/sell-your-car',
		image: '/assets/daynight/services/sell-car-service.webp'
	},
	{
		title: 'Документи и регистрация',
		description: 'Съдействие за документи по внос, техническа подготовка, регистрация и предаване.',
		href: '/services',
		image: daynightAssets.footerImage
	},
	{
		title: 'Огледи с уговорка',
		description:
			'Подготвени огледи, при които автомобилът, документите и консултантът са готови предварително.',
		href: '/contact',
		image: daynightAssets.hero
	},
	{
		title: 'Сравнение на модели',
		description:
			'Сравняваме цена, пробег, оборудване, история, разходи и срокове за няколко кандидата.',
		href: '/compare',
		image: '/assets/daynight/cta/premium-cars-banner-v2.webp'
	}
];

export const auxeroServicesContent: AuxeroServicesContent = {
	cards: auxeroServiceCards,
	cardsDescription:
		'Практична подкрепа за покупка, внос, проверка, документи и продажба, без излишен шум.',
	cardsTitle: 'Услуги за покупка и внос',
	contact: {
		checklist: [
			'Специалисти по внос и документи',
			'Огледи само с уговорен час',
			'Ясни ориентировъчни разходи преди ангажимент',
			'Съдействие от заявка до предаване'
		],
		description:
			'Изпрати линк, VIN, бюджет, срок или заявка за продажба и OUTLETCARS.BG — Варна ще подготви правилната следваща стъпка.',
		emailLabel: daynightContact.emailLabel,
		phoneHref: daynightContact.primaryPhoneHref,
		phoneLabel: daynightContact.primaryPhoneLabel,
		secondaryPhoneHref: daynightContact.marketplacePhoneHref,
		secondaryPhoneLabel: daynightContact.marketplacePhoneLabel,
		title: 'Контакт за услуга',
		workNote: daynightContact.appointmentNote
	},
	hero: {
		description:
			'Подбор, проверка, документи и реалистична крайна цена за автомобили от Европа, преди да стигнем до оглед.',
		eyebrow: 'OUTLETCARS.BG — Варна услуги',
		image: '/assets/daynight/services/premium-cars-banner-generated.webp',
		title: 'Услуги за покупка и внос'
	}
};

export const serviceFormData: AuxeroServiceFormData = {
	fields: [
		{
			active: true,
			label: 'Име',
			name: 'name',
			placeholder: 'Вашето име',
			required: true,
			type: 'text'
		},
		{
			active: false,
			label: 'Имейл',
			name: 'email',
			placeholder: daynightContact.emailLabel,
			required: true,
			type: 'email'
		},
		{
			active: false,
			label: 'Телефон',
			name: 'phone',
			placeholder: daynightContact.primaryPhoneLabel,
			type: 'tel'
		},
		{
			active: false,
			label: 'Предпочитана дата',
			name: 'date',
			type: 'date'
		}
	],
	serviceLabel: 'Услуга',
	serviceName: 'service',
	serviceOptions: auxeroServiceCards.map((service) => service.title),
	submitLabel: 'Изпрати заявка',
	title: 'Заяви услуга',
	vehicleField: {
		active: false,
		label: 'Автомобил или VIN',
		name: 'vehicle',
		placeholder: 'Линк към автомобил или VIN',
		type: 'text'
	}
};

export const importRequestSteps = [
	{
		title: 'Линк/VIN',
		text: 'Изпращаш линк към обявата от Европа или директно VIN номера.'
	},
	{
		title: 'Проверка',
		text: 'Преглеждаме историята, щетите и реалните разходи до България.'
	},
	{
		title: 'Отговор',
		text: 'Връщаме риск, крайна цена и ясен следващ ход. Без ангажимент.'
	}
] as const;

export const importRequestMobileCopy = {
	intro: 'Изпрати линк или VIN. Проверяваме автомобила и реалните разходи до България.',
	processLabel: 'Процес',
	title: 'Внос на автомобил'
} as const;

export const importRequestFormData = (vehicle = ''): AuxeroServiceFormData => ({
	...serviceFormData,
	fields: serviceFormData.fields.map((field) =>
		field.name === 'phone' ? { ...field, active: true, required: true } : { ...field }
	),
	serviceOptions: ['Подбрани автомобили', 'Проверка на обява'],
	submitLabel: 'Изпрати за проверка',
	title: 'Провери автомобил за внос',
	vehicleField: {
		...serviceFormData.vehicleField,
		active: true,
		placeholder: 'Линк към обява от Европа или VIN',
		required: true,
		value: vehicle
	}
});
