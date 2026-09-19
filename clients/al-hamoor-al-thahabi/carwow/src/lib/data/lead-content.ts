export type LeadStep = {
	title: string;
	copy: string;
	icon: 'vehicle' | 'conversation' | 'offer' | 'listing' | 'quote' | 'delivery';
};

export const sellSteps: readonly LeadStep[] = [
	{ icon: 'vehicle', title: 'Данни за колата', copy: 'Номер, VIN или основните параметри.' },
	{
		icon: 'conversation',
		title: 'Кратко уточнение',
		copy: 'Свързваме се за състоянието и историята.'
	},
	{ icon: 'offer', title: 'Конкретен вариант', copy: 'Получавате оценка и следваща стъпка.' }
];
export const importSteps: readonly LeadStep[] = [
	{ icon: 'listing', title: 'Изпращате обява', copy: 'Или описвате автомобила, който търсите.' },
	{ icon: 'quote', title: 'Получавате разчет', copy: 'Цена, транспорт и следващи стъпки.' },
	{ icon: 'delivery', title: 'Организираме вноса', copy: 'Координираме покупката и доставката.' }
];

export const leadInfoContent = {
	sell: {
		title: 'Как работи продажбата',
		steps: sellSteps
	},
	import: {
		title: 'Как работи вносът',
		steps: importSteps
	}
} as const;

// XX means no origin preference; EU is a region, not a claim to be an ISO country.
export const DEFAULT_IMPORT_ORIGIN = 'XX';
export const importOrigins = [
	{ code: 'XX', label: 'Всички' },
	{ code: 'DE', label: 'Германия' },
	{ code: 'EU', label: 'Европа' },
	{ code: 'US', label: 'САЩ' },
	{ code: 'JP', label: 'Япония' },
	{ code: 'CN', label: 'Китай' }
] as const;
