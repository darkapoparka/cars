import type { Locale } from '$lib/locale/core';

type DesktopPageCopy = {
	inventoryCaption: string;
	servicesCaption: string;
	aboutCaption: string;
	aboutCars: string;
	aboutContact: string;
	contactEnquiry: string;
};

export const desktopCopy: Record<Locale, DesktopPageCopy> = {
	bg: {
		inventoryCaption: 'Сравни цена, пробег и оборудване. Избери автомобил за оглед.',
		servicesCaption: 'Подбор, проверка и съдействие за твоя автомобил.',
		aboutCaption: 'Подбор и внос на автомобили от Европа с проверка преди покупката.',
		aboutCars: 'Разгледай коли',
		aboutContact: 'Свържи се с нас',
		contactEnquiry: 'Изпрати запитване'
	},
	en: {
		inventoryCaption: 'Compare price, mileage and equipment. Find a car to view.',
		servicesCaption: 'Sourcing, checks and support for your next car.',
		aboutCaption: 'Sourcing and importing European cars, with checks before you buy.',
		aboutCars: 'Browse our cars',
		aboutContact: 'Contact us',
		contactEnquiry: 'Send an enquiry'
	}
};

const publicPageBg = {
	compare: {
		price: 'Цена',
		year: 'Година',
		mileage: 'Пробег',
		fuel: 'Гориво',
		transmission: 'Скоростна кутия',
		title: 'Сравни автомобили',
		add: 'Добави автомобил',
		clear: 'Изчисти сравнението',
		swipe: 'Плъзни за още автомобили',
		addFour: 'Добави автомобил (до четири)',
		choose: 'Избери автомобил',
		table: 'Таблица за сравнение',
		specifications: 'Характеристики на автомобилите',
		vehicle: 'Автомобил',
		remove: 'Премахни',
		emptyTitle: 'Избери автомобили за сравнение',
		emptyText: 'Сравни характеристиките на избраните автомобили.',
		browse: 'Разгледай автомобили'
	},
	favorites: {
		title: 'Любими автомобили',
		remove: 'Премахни',
		emptyTitle: 'Все още няма запазени автомобили',
		emptyText: 'Избери сърцето до автомобил, за да го запазиш на това устройство.',
		browse: 'Разгледай автомобили'
	},
	faq: {
		title: 'Често задавани въпроси',
		ask: 'Задай въпрос'
	},
	blog: {
		title: 'Полезно за автомобила'
	},
	reviews: {
		title: 'Клиентски отзиви',
		sampleDisclosure: 'Примерно съдържание за отзиви в демонстрацията.',
		facebook: 'Отзиви във Facebook'
	},
	import: {
		title: 'Внос на автомобил',
		description: 'Изпрати линк или VIN, или опиши автомобила, който търсиш.',
		heroDescription: 'Изпрати линк или VIN. Уточни автомобила и разходите преди решение.',
		requestType: 'Начин за заявка',
		find: 'Нямам линк',
		process: 'От обява до решение',
		discuss: 'Обсъди търсенето',
		linkVin: 'LINK / VIN'
	},
	sell: {
		title: 'Продай автомобила си',
		description: 'Заяви оценка с VIN или марка и модел на автомобила.',
		heroDescription: 'Сподели данните за автомобила и обсъди следващата стъпка.',
		identification: 'Данни за автомобила',
		makeModel: 'Марка / модел',
		process: 'Как протича оценката',
		contact: 'Свържи се с нас',
		vin: 'VIN'
	},
	financing: {
		steps: [
			{
				title: 'Избери автомобил',
				text: 'Използвай цената на избрания автомобил за примерна месечна вноска.'
			},
			{
				title: 'Заяви условия',
				text: 'Уточни първоначалната вноска, срока, таксите и застраховките преди решение.'
			},
			{
				title: 'Прегледай офертата',
				text: 'Кредиторът потвърждава конкретните условия според твоите обстоятелства.'
			}
		],
		title: 'Финансиране на автомобил',
		description: 'Изчисли примерна месечна вноска и попитай за условията на финансиране.',
		heroDescription: 'Ориентировъчна вноска преди да решиш.',
		process: 'Разбери крайната цена',
		browse: 'Разгледай автомобилите'
	}
};

/** Native public route labels; shared titles also supply metadata and mobile headings. */
export const publicPageCopy = {
	bg: publicPageBg,
	en: {
		compare: {
			price: 'Price',
			year: 'Year',
			mileage: 'Mileage',
			fuel: 'Fuel',
			transmission: 'Transmission',
			title: 'Compare cars',
			add: 'Add a car',
			clear: 'Clear comparison',
			swipe: 'Swipe for more cars',
			addFour: 'Add a car (up to four)',
			choose: 'Choose a car',
			table: 'Vehicle comparison table',
			specifications: 'Vehicle specifications',
			vehicle: 'Vehicle',
			remove: 'Remove',
			emptyTitle: 'Choose cars to compare',
			emptyText: 'Compare the facts side by side, without an automatic winner.',
			browse: 'Browse cars'
		},
		favorites: {
			title: 'Saved cars',
			remove: 'Remove',
			emptyTitle: 'No saved cars yet',
			emptyText: 'Use the heart on a car to save it on this device.',
			browse: 'Browse cars'
		},
		faq: {
			title: 'Frequently asked questions',
			ask: 'Ask a question'
		},
		blog: {
			title: 'Guides and advice'
		},
		reviews: {
			title: 'Customer reviews',
			sampleDisclosure: 'Sample review content for this template preview.',
			facebook: 'Reviews on Facebook'
		},
		import: {
			title: 'Import a car',
			description: 'Send a listing or VIN, or describe the car you are looking for.',
			heroDescription: 'Send a listing or VIN. Understand the car and the costs before deciding.',
			requestType: 'Request type',
			find: 'Find a car',
			process: 'From a listing to a decision',
			discuss: 'Discuss your search',
			linkVin: 'LINK / VIN'
		},
		sell: {
			title: 'Sell your car',
			description: 'Request a vehicle appraisal with its VIN or make and model.',
			heroDescription: 'Share the car details and discuss the next step.',
			identification: 'Vehicle identification',
			makeModel: 'Make / model',
			process: 'How the appraisal works',
			contact: 'Contact us',
			vin: 'VIN'
		},
		financing: {
			steps: [
				{
					title: 'Choose a car',
					text: 'Use the vehicle price to calculate an illustrative payment.'
				},
				{
					title: 'Request the terms',
					text: 'Discuss the deposit, term, fees and insurance before making a decision.'
				},
				{
					title: 'Review the offer',
					text: 'The lender confirms the final terms for your circumstances.'
				}
			],
			title: 'Car financing',
			description: 'Calculate an illustrative monthly payment and ask about financing terms.',
			heroDescription: 'An illustrative payment before you decide.',
			process: 'Understand the full cost',
			browse: 'Browse cars'
		}
	}
} satisfies Record<Locale, typeof publicPageBg>;
