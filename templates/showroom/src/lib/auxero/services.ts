import { eliqautoAssets, eliqautoContact } from '$lib/data/eliqauto';
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
		title: 'Внос и лизинг',
		description:
			'Подбор на автомобили с проследима история, ясни снимки и реалистична крайна цена преди покупка.',
		href: '/contact',
		image: '/assets/eliqauto/services/import-canada-banner-generated.webp'
	},
	{
		title: 'Проверка на обява',
		description:
			'Преглед на VIN, пробег, история, оборудване, снимки и контекст на продавача преди решение.',
		href: '/compare',
		image: '/assets/eliqauto/services/evaluate-link-service.webp'
	},
	{
		title: 'Продажба на автомобил',
		description:
			'Изпрати данни, документи, снимки и очаквания, за да изберем правилния път за продажба.',
		href: '/sell-your-car',
		image: '/assets/eliqauto/services/sell-car-service.webp'
	},
	{
		title: 'Документи и регистрация',
		description: 'Съдействие за документи по внос, техническа подготовка, регистрация и предаване.',
		href: '/services',
		image: eliqautoAssets.footerImage
	},
	{
		title: 'Огледи с уговорка',
		description:
			'Подготвени огледи, при които автомобилът, документите и консултантът са готови предварително.',
		href: '/contact',
		image: eliqautoAssets.hero
	},
	{
		title: 'Сравнение на модели',
		description:
			'Сравняваме цена, пробег, оборудване, история, разходи и срокове за няколко кандидата.',
		href: '/compare',
		image: '/assets/eliqauto/cta/import-canada-banner-v2.webp'
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
			'Изпрати линк, VIN, бюджет, срок или заявка за продажба и Eliqauto ще подготви правилната следваща стъпка.',
		emailLabel: eliqautoContact.emailLabel,
		phoneHref: eliqautoContact.primaryPhoneHref,
		phoneLabel: eliqautoContact.primaryPhoneLabel,
		secondaryPhoneHref: eliqautoContact.marketplacePhoneHref,
		secondaryPhoneLabel: eliqautoContact.marketplacePhoneLabel,
		title: 'Контакт за услуга',
		workNote: eliqautoContact.appointmentNote
	},
	hero: {
		description:
			'Подбор, проверка, документи и реалистична крайна цена за премиум автомобили, преди да стигнем до оглед.',
		eyebrow: 'Eliqauto услуги',
		image: '/assets/eliqauto/services/import-canada-banner-generated.webp',
		title: 'Търси услуга'
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
			placeholder: eliqautoContact.emailLabel,
			required: true,
			type: 'email'
		},
		{
			active: false,
			label: 'Телефон',
			name: 'phone',
			placeholder: eliqautoContact.primaryPhoneLabel,
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
		text: 'Изпращаш линк към обявата с проверена история или директно VIN номера.'
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
	intro: 'Проверка на обява, история и крайна цена преди ангажимент.',
	processLabel: 'Процес',
	title: 'Внос и лизинг'
} as const;

export const importRequestFormData = (vehicle = ''): AuxeroServiceFormData => ({
	...serviceFormData,
	fields: serviceFormData.fields.map((field) =>
		field.name === 'phone' ? { ...field, active: true, required: true } : { ...field }
	),
	serviceOptions: ['Внос и лизинг', 'Проверка на обява'],
	submitLabel: 'Изпрати за проверка',
	title: 'Провери автомобил за внос',
	vehicleField: {
		...serviceFormData.vehicleField,
		active: true,
		placeholder: 'Линк към обява с проверена история или VIN',
		required: true,
		value: vehicle
	}
});
