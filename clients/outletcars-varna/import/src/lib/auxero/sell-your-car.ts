import type { AuxeroPageBanner } from './page-banner';
import { daynightBrand } from '$lib/data/daynight';

export type AuxeroSellCarInputField = {
	active: boolean;
	autocomplete: 'off' | 'tel';
	id: string;
	inputMode?: 'numeric' | 'tel';
	label: string;
	mobileLabel: string;
	mobilePlaceholder: string;
	name: string;
	placeholder?: string;
	required?: boolean;
	type: 'tel' | 'text';
	value?: string;
};

export type AuxeroSellCarFormData = {
	fields: AuxeroSellCarInputField[];
	submitLabel: string;
};

export type AuxeroSellCarStep = {
	text: string;
	title: string;
};

export type AuxeroSellCarMobileCopy = {
	contactLabel: string;
	formEyebrow: string;
	formTitle: string;
	logoAlt: string;
	logoSrc: string;
	messageLabel: string;
	statusMessage: string;
	stepsTitle: string;
	submitLabel: string;
	title: string;
};

export type AuxeroSellCarMobileStep = {
	text: string;
	title: string;
};

export const sellYourCarHero: AuxeroPageBanner = {
	description:
		'Изпрати VIN, пробег, очаквана цена и телефон. OUTLETCARS.BG — Варна ще прегледа автомобила и ще предложи реалистичен следващ ход.',
	eyebrow: 'OUTLETCARS.BG — Варна оценка',
	image: '/assets/daynight/services/sell-car-service.webp',
	title: 'Продай автомобила си с OUTLETCARS.BG — Варна'
};

export const auxeroSellSteps: AuxeroSellCarStep[] = [
	{
		title: 'Изпрати данни за автомобила',
		text: 'Сподели VIN, пробег, снимки, оборудване, документи и очаквана цена.'
	},
	{
		title: 'Проверка на история и състояние',
		text: 'OUTLETCARS.BG — Варна преглежда информацията и уточнява липсващите детайли преди препоръка.'
	},
	{
		title: 'Избор на път за продажба',
		text: 'Обсъждаме директна оферта, съдействие при продажба или публикуване като клиентски автомобил.'
	},
	{
		title: 'Финализиране и предаване',
		text: 'Уточняваме документи, час за оглед, плащане и реалното предаване на автомобила.'
	}
];

export const sellCarMobileCopy: AuxeroSellCarMobileCopy = {
	contactLabel: 'Контакт',
	formEyebrow: 'Бърза заявка',
	formTitle: 'Попълни за минута',
	logoAlt: daynightBrand.name,
	logoSrc: '/dealer/logo.png',
	messageLabel: 'Пиши ни',
	statusMessage: 'Заявката е подготвена. Обади се или пиши, за да я финализираме веднага.',
	stepsTitle: 'Как работи',
	submitLabel: 'Заяви оценка',
	title: 'Продай автомобил'
};

export const auxeroSellMobileSteps: AuxeroSellCarMobileStep[] = [
	{ title: 'Данни', text: 'Изпращаш VIN, пробег, очаквана цена и телефон — отнема минута.' },
	{
		title: 'Преглед',
		text: 'Преглеждаме историята, сервизните записи и реалното състояние на пазара.'
	},
	{
		title: 'Следващ ход',
		text: 'Получаваш ясна оферта: изкупуване, съдействие или публикуване. Без ангажимент.'
	}
];

export const sellCarFormData: AuxeroSellCarFormData = {
	fields: [
		{
			active: true,
			autocomplete: 'off',
			id: 'sellVIN',
			label: 'VIN номер',
			mobileLabel: 'VIN номер',
			mobilePlaceholder: 'Например WBA...',
			name: 'vin',
			placeholder: 'Въведете VIN',
			required: true,
			type: 'text'
		},
		{
			active: false,
			autocomplete: 'off',
			id: 'sellMileage',
			inputMode: 'numeric',
			label: 'Пробег',
			mobileLabel: 'Пробег',
			mobilePlaceholder: 'Пробег в км',
			name: 'mileage',
			placeholder: 'Пробег в км',
			required: true,
			type: 'text'
		},
		{
			active: false,
			autocomplete: 'off',
			id: 'sellPrice',
			inputMode: 'numeric',
			label: 'Очаквана цена',
			mobileLabel: 'Очаквана цена',
			mobilePlaceholder: 'Цена в EUR',
			name: 'price',
			placeholder: 'Очаквана цена в EUR',
			type: 'text'
		},
		{
			active: false,
			autocomplete: 'tel',
			id: 'sellPhone',
			inputMode: 'tel',
			label: 'Телефон за контакт',
			mobileLabel: 'Телефон',
			mobilePlaceholder: 'Телефон за контакт',
			name: 'phone',
			placeholder: 'Вашият телефон',
			required: true,
			type: 'tel'
		}
	],
	submitLabel: 'Заяви преглед'
};

export const sellCarFormDataWithPrefill = (vin = ''): AuxeroSellCarFormData => ({
	...sellCarFormData,
	fields: sellCarFormData.fields.map((field) =>
		field.name === 'vin' ? { ...field, value: vin } : { ...field }
	)
});
