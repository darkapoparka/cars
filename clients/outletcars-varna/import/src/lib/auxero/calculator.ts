import { supportFaqs } from './faqs';

export type AuxeroCalculatorInputKey = 'dutyRate' | 'prep' | 'price' | 'transport' | 'vatRate';

export type AuxeroCalculatorOutputKey =
	| 'duty'
	| 'prep'
	| 'price'
	| 'total'
	| 'totalSmall'
	| 'transport'
	| 'vat';

export type AuxeroCalculatorField = {
	active: boolean;
	key: AuxeroCalculatorInputKey;
	label: string;
	min: number;
	mutedLabel?: string;
	name: string;
	step: number;
	value: number;
};

export type AuxeroCalculatorSummaryRow = {
	key: AuxeroCalculatorOutputKey;
	label: string;
	value: number;
};

export type AuxeroCalculatorData = {
	ctaHref: string;
	ctaLabel: string;
	fields: AuxeroCalculatorField[];
	summaryRows: AuxeroCalculatorSummaryRow[];
	subtitle: string;
	title: string;
	total: number;
	totalNote: string;
	totalRowLabel: string;
};

export type AuxeroCalculatorBudgetLink = {
	href: string;
	label: string;
	price: string;
};

export const auxeroCalculatorInitial = {
	price: 25000,
	transport: 3200,
	dutyRate: 10,
	vatRate: 20,
	prep: 1800
} satisfies Record<AuxeroCalculatorInputKey, number>;

export const auxeroCalculatorFields: AuxeroCalculatorField[] = [
	{
		active: true,
		key: 'price',
		label: 'Цена на автомобила',
		min: 0,
		name: 'price',
		step: 100,
		value: auxeroCalculatorInitial.price
	},
	{
		active: false,
		key: 'transport',
		label: 'Транспорт и портови разходи',
		min: 0,
		name: 'transport',
		step: 100,
		value: auxeroCalculatorInitial.transport
	},
	{
		active: false,
		key: 'dutyRate',
		label: 'Мито',
		min: 0,
		mutedLabel: '(%)',
		name: 'dutyRate',
		step: 0.1,
		value: auxeroCalculatorInitial.dutyRate
	},
	{
		active: false,
		key: 'vatRate',
		label: 'ДДС',
		min: 0,
		mutedLabel: '(%)',
		name: 'vatRate',
		step: 0.1,
		value: auxeroCalculatorInitial.vatRate
	},
	{
		active: false,
		key: 'prep',
		label: 'Подготовка и регистрация',
		min: 0,
		name: 'prep',
		step: 100,
		value: auxeroCalculatorInitial.prep
	}
];

export const formatEur = (value: number) =>
	`${Math.round(value)
		.toLocaleString('fr-FR')
		.replace(/\u202f/g, ' ')} EUR`;

export const calculateAuxeroCalculatorTotals = (
	values: Record<AuxeroCalculatorInputKey, number> = auxeroCalculatorInitial
) => {
	const duty = values.price * (values.dutyRate / 100);
	const vatBase = values.price + values.transport + duty;
	const vat = vatBase * (values.vatRate / 100);
	const total = vatBase + vat + values.prep;

	return { duty, total, vat };
};

export const createAuxeroCalculatorData = (): AuxeroCalculatorData => {
	const totals = calculateAuxeroCalculatorTotals();

	return {
		ctaHref: '/contact',
		ctaLabel: 'Заяви точна оферта',
		fields: auxeroCalculatorFields,
		summaryRows: [
			{ key: 'price', label: 'Цена на автомобила', value: auxeroCalculatorInitial.price },
			{ key: 'transport', label: 'Транспорт', value: auxeroCalculatorInitial.transport },
			{ key: 'duty', label: 'Мито', value: totals.duty },
			{ key: 'vat', label: 'ДДС', value: totals.vat },
			{ key: 'prep', label: 'Подготовка и регистрация', value: auxeroCalculatorInitial.prep }
		],
		subtitle: 'Обобщение на разходите',
		title: 'Ориентировъчна крайна цена*',
		total: totals.total,
		totalNote: 'преди потвърждение за конкретния автомобил',
		totalRowLabel: 'Обща сума'
	};
};

export const auxeroCalculatorData = createAuxeroCalculatorData();

export const auxeroCalculatorBudgetLinks: AuxeroCalculatorBudgetLink[] = [
	{ href: '/inventory?sort=highest-price', label: 'Налични автомобили', price: 'До 20k EUR' },
	{ href: '/inventory?sort=best-match', label: 'Подбрани автомобили', price: 'До 30k EUR' },
	{ href: '/inventory?sort=newest-listed', label: 'Клиентски автомобили', price: 'До 40k EUR' },
	{ href: '/inventory?sort=newest-year', label: 'SUV кандидати', price: 'До 60k EUR' },
	{ href: '/inventory?sort=highest-price', label: 'Премиум автомобили', price: 'Над 60k EUR' }
];

export const auxeroCalculatorFaqs = supportFaqs.filter((faq) =>
	['Costs', 'Documents', 'Timing'].includes(faq.topic)
);
