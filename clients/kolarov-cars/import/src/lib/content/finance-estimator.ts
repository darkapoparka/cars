import type { Locale } from '$lib/locale/core';

export const financeEstimatorCopy = {
	bg: {
		noScript:
			'Интерактивните изчисления изискват JavaScript. Можеш да заявиш изчисление чрез контактната форма.',
		requestEstimate: 'Заяви изчисление',
		label: 'Калкулатор за месечна вноска',
		title: 'Изчисли месечна вноска',
		price: 'Цена на автомобила',
		deposit: 'Първоначална вноска',
		term: 'Срок (месеци)',
		interest: 'Годишна лихва (%)',
		financed: 'Финансирана сума',
		total: 'Общо с първоначалната вноска',
		monthly: 'Ориентировъчна месечна вноска',
		invalid: 'Провери цената, първоначалната вноска, срока и лихвата.',
		disclosure:
			'Примерно изчисление, не кредитна оферта. Такси и застраховки не са включени; кредиторът потвърждава крайните условия.',
		enquiry: 'Запитване за финансиране'
	},
	en: {
		noScript:
			'Interactive calculations require JavaScript. You can request an estimate using the contact form.',
		requestEstimate: 'Request an estimate',
		label: 'Monthly payment calculator',
		title: 'Calculate your payment',
		price: 'Vehicle price',
		deposit: 'Down payment',
		term: 'Term (months)',
		interest: 'Annual interest (%)',
		financed: 'Financed amount',
		total: 'Total including down payment',
		monthly: 'Estimated monthly payment',
		invalid: 'Check the price, down payment, term and interest rate.',
		disclosure:
			'Illustrative calculation, not a credit offer. Fees and insurance are not included; the lender confirms the final terms.',
		enquiry: 'Ask about financing'
	}
} as const satisfies Record<Locale, Record<string, string>>;
