import { parseAuxeroHeadAssets, type AuxeroPageDocument } from '$lib/auxero/page-document';

export const locales = ['bg', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'bg';

export type HomePageCopy = {
	actionBand: {
		buyBody: string;
		buyCta: string;
		buyTitle: string;
		importBody: string;
		importCta: string;
		importTitle: string;
	};
	brandCta: string;
	brandTitle: string;
	budgetTabs: Array<{ active: boolean; label: string }>;
	budgetTitle: string;
	byline: string;
	commonCta: string;
	compareEmpty: string;
	compareTitle: string;
	featuredTitle: string;
	newsTitle: string;
	readMore: string;
	reviewsTitle: string;
	seo: {
		description: string;
		title: string;
	};
	typeCta: string;
	typeTitle: string;
	vehicleCard: VehicleCardCopy;
};

export type VehicleCardCopy = {
	compare: string;
	finance: string;
	fuelAlt: string;
	mileageAlt: string;
	photosAlt: string;
	savePrefix: string;
	transmissionAlt: string;
	videoAlt: string;
	viewDetails: string;
	yearAlt: string;
};

export type InventoryCopy = {
	emptyBody: string;
	emptyTitle: string;
	reset: string;
	vehicleCard: VehicleCardCopy;
};

export type DetailCopy = {
	callDayNight: string;
	carOverview: string;
	cash: string;
	chatOnViber: string;
	compare: string;
	description: string;
	detailDescriptionFallback: string;
	directions: string;
	email: string;
	finance: string;
	financeIntro: string;
	financeTerms: string;
	formConsent: string;
	formTerms: string;
	formTermsLink: string;
	getToKnow: string;
	inquiryTitle: string;
	inquiryCta: string;
	inquiryIntro: string;
	inquirySuccess: string;
	callCta: string;
	name: string;
	phone: string;
	playVideo: string;
	price: string;
	priceIntro: string;
	monthlyTitle: string;
	priceInBgn: string;
	priceInBgnAria: string;
	bgnRateNote: string;
	savePrefix: string;
	sendInquiry: string;
	subject: string;
	subjectAvailability: string;
	subjectDocuments: string;
	subjectViewing: string;
	viewAllPhoto: string;
	consultantLabel: string;
	message: string;
	messagePlaceholder: string;
};

export type PublicMessages = {
	detail: DetailCopy;
	header: {
		addListing: string;
		compare: string;
		languageCurrent: string;
		languageOptions: string[];
		megaDetails: string;
		megaView: string;
		searchPlaceholder: string;
		signIn: string;
		wishlist: string;
	};
	home: HomePageCopy;
	hero: {
		checksTitle: string;
		ctaLabel: string;
		features: string[];
		heading: string;
		searchSubmitPrefix: string;
		searchSubmitSuffix: string;
		slideSubtitle: string;
		statuses: string[];
		tabs: Array<{ active: boolean; label: string }>;
		yearLabel: string;
		filters: {
			allBodyTypes: string;
			allBrand: string;
			allFuelTypes: string;
			allModel: string;
			allPrice: string;
			allStatuses: string;
			allTransmissions: string;
			bodyType: string;
			fuelType: string;
			maxPrice: string;
			selectBrand: string;
			selectModel: string;
			status: string;
			transmission: string;
		};
	};
	inventory: InventoryCopy;
	nav: Record<'/' | '/about' | '/contact' | '/inventory' | '/services', string>;
	vehicleTerms: {
		bodyTypes: Record<string, string>;
		fuels: Record<string, string>;
		statuses: Record<string, string>;
		transmissions: Record<string, string>;
	};
};

const vehicleCardEn: VehicleCardCopy = {
	compare: 'Compare',
	finance: 'See Finance',
	fuelAlt: 'fuel',
	mileageAlt: 'mileage',
	photosAlt: 'photos',
	savePrefix: 'Save',
	transmissionAlt: 'transmission',
	videoAlt: 'video',
	viewDetails: 'View details',
	yearAlt: 'year'
};

const vehicleCardBg: VehicleCardCopy = {
	compare: 'Сравни',
	finance: 'Виж финансиране',
	fuelAlt: 'гориво',
	mileageAlt: 'пробег',
	photosAlt: 'снимки',
	savePrefix: 'Запази',
	transmissionAlt: 'скоростна кутия',
	videoAlt: 'видео',
	viewDetails: 'Виж детайли',
	yearAlt: 'година'
};

export const messages: Record<Locale, PublicMessages> = {
	en: {
		header: {
			addListing: 'Add Listing',
			compare: 'Compare',
			languageCurrent: 'English',
			languageOptions: ['English', 'Bulgarian'],
			megaDetails: 'Details',
			megaView: 'View',
			searchPlaceholder: 'Search Promosale Varna inventory',
			signIn: 'Sign In',
			wishlist: 'Wishlist'
		},
		home: {
			actionBand: {
				buyBody: 'Discuss import, documents, viewing and next steps with a Promosale Varna consultant.',
				buyCta: 'Book time',
				buyTitle: 'Book A Consultation',
				importBody: 'Selection, inspection, documents and delivery from Europe.',
				importCta: 'See the process',
				importTitle: 'Import From Europe'
			},
			brandCta: 'View All Brand',
			brandTitle: 'Explore Our Brands',
			budgetTabs: [
				{ label: 'All Cars', active: false },
				{ label: '20 000 - 50 000 EUR', active: true },
				{ label: '50 000 - 70 000 EUR', active: false },
				{ label: '70 000 - 100 000 EUR', active: false },
				{ label: '100 000+ EUR', active: false }
			],
			budgetTitle: 'Promosale Varna by Budget',
			byline: 'by Promosale Varna',
			commonCta: 'View All',
			compareEmpty: 'Your compare is currently empty',
			compareTitle: 'Compare Top Rated Vehicles',
			featuredTitle: 'Newest Vehicles',
			newsTitle: 'Promosale Varna notes',
			readMore: 'Read more',
			reviewsTitle: 'Client Reviews',
			seo: {
				description:
					'Promosale Varna: verified cars with clear origin, plus Europe import — selection, inspection, documents, delivery and warranty for Bulgaria.',
				title: 'Promosale Varna — Cars & Import From Europe'
			},
			typeCta: 'View All Types',
			typeTitle: 'Browse By Type',
			vehicleCard: vehicleCardEn
		},
		hero: {
			checksTitle: 'Promosale Varna Checks',
			ctaLabel: 'View Inventory',
			features: [
				'Verified source listing',
				'History review',
				'Mileage review',
				'Document trail',
				'Europe import support',
				'Registration readiness',
				'Viewing by appointment',
				'Client vehicle intake'
			],
			heading: 'Browse, Compare, Drive With Promosale Varna!',
			searchSubmitPrefix: 'Show',
			searchSubmitSuffix: 'Matches',
			slideSubtitle: 'Europe-sourced vehicles with verified history and clear appointment support.',
			statuses: ['New listing', 'Available', 'Client vehicle'],
			tabs: [
				{ active: true, label: 'All Vehicles' },
				{ active: false, label: 'New Listings' },
				{ active: false, label: 'Client Vehicles' }
			],
			yearLabel: 'Year',
			filters: {
				allBodyTypes: 'All Body Types',
				allBrand: 'All Brand',
				allFuelTypes: 'All Fuel Types',
				allModel: 'All Model',
				allPrice: 'All Price',
				allStatuses: 'All Statuses',
				allTransmissions: 'All Transmissions',
				bodyType: 'Body Type',
				fuelType: 'Fuel Type',
				maxPrice: 'Max Price',
				selectBrand: 'Select Brand',
				selectModel: 'Select Model',
				status: 'Status',
				transmission: 'Transmission'
			}
		},
		inventory: {
			emptyBody: 'Clear filters or contact Promosale Varna for a Europe import request.',
			emptyTitle: 'No Promosale Varna vehicles match these filters',
			reset: 'Reset inventory',
			vehicleCard: vehicleCardEn
		},
		detail: {
			callDayNight: 'Call Promosale Varna',
			carOverview: 'Car Overview',
			cash: 'Cash',
			chatOnViber: 'Chat on Viber',
			compare: 'Compare',
			consultantLabel: 'Promosale Varna Consultant',
			description: 'Description',
			detailDescriptionFallback:
				'is available through Promosale Varna with source review and viewing by appointment.',
			directions: 'Get Directions',
			email: 'Email',
			finance: 'Finance',
			financeIntro: 'Estimated payment before final taxes, registration, and transport costs.',
			financeTerms: 'Estimated over 72 months. Final terms confirmed by Promosale Varna.',
			formConsent:
				'Yes, I would like to receive price alerts on this vehicle and helpful shopping information.',
			formTerms: 'By using this service, you accept our',
			formTermsLink: 'Visitor Agreement.',
			getToKnow: 'Get To Know this car',
			inquiryTitle: 'Send Inquiry about Vehicle',
			inquiryCta: 'Inquire',
			inquiryIntro: 'Leave your details and Promosale Varna will get back to you about this car.',
			inquirySuccess: 'Done — Promosale Varna will be in touch as soon as possible.',
			callCta: 'Call',
			message: 'Message',
			messagePlaceholder: 'Comment',
			name: 'Name',
			phone: 'Phone',
			playVideo: 'Play Video',
			price: 'Price:',
			priceIntro:
				'Listed vehicle price. Final taxes and registration costs confirmed before purchase.',
			monthlyTitle: 'Est. monthly:',
			priceInBgn: 'Price in BGN',
			priceInBgnAria: 'Show the price in Bulgarian lev',
			bgnRateNote:
				'At the fixed BNB rate (1 EUR = 1.95583 BGN). Final taxes and registration are confirmed before purchase.',
			savePrefix: 'Save',
			sendInquiry: 'Send Inquiry',
			subject: 'Subject',
			subjectAvailability: "This Vehicle's Availability",
			subjectDocuments: 'Registration and documents',
			subjectViewing: 'Viewing appointment',
			viewAllPhoto: 'View All Photo'
		},
		nav: {
			'/': 'Home',
			'/about': 'About',
			'/contact': 'Contact',
			'/inventory': 'Inventory',
			'/services': 'Services'
		},
		vehicleTerms: {
			bodyTypes: {},
			fuels: {},
			statuses: {},
			transmissions: {}
		}
	},
	bg: {
		header: {
			addListing: 'Добави обява',
			compare: 'Сравни',
			languageCurrent: 'Български',
			languageOptions: ['Български', 'English'],
			megaDetails: 'Детайли',
			megaView: 'Виж',
			searchPlaceholder: 'Търси в наличните автомобили',
			signIn: 'Вход',
			wishlist: 'Любими'
		},
		home: {
			actionBand: {
				buyBody: 'Уточни внос, документи, оглед и следващи стъпки с консултант.',
				buyCta: 'Запази час',
				buyTitle: 'Запази консултация',
				importBody: 'Подбор, проверка, документи и доставка от Европа.',
				importCta: 'Виж процеса',
				importTitle: 'Подбрани автомобили'
			},
			brandCta: 'Виж всички марки',
			brandTitle: 'Разгледай по марка',
			budgetTabs: [
				{ label: 'Всички автомобили', active: false },
				{ label: '20 000 - 50 000 EUR', active: true },
				{ label: '50 000 - 70 000 EUR', active: false },
				{ label: '70 000 - 100 000 EUR', active: false },
				{ label: '100 000+ EUR', active: false }
			],
			budgetTitle: 'Автомобили по бюджет',
			byline: 'от Promosale Varna',
			commonCta: 'Виж всички',
			compareEmpty: 'Списъкът за сравнение е празен',
			compareTitle: 'Сравни избрани автомобили',
			featuredTitle: 'Най-нови автомобили',
			newsTitle: 'Съвети от Promosale Varna',
			readMore: 'Прочети повече',
			reviewsTitle: 'Отзиви от клиенти',
			seo: {
				description:
					'Promosale Varna: проверени автомобили с ясен произход и подбор на автомобили — подбор, проверка, документи, доставка и гаранция за България.',
				title: 'Promosale Varna — автомобили и подбор на автомобили'
			},
			typeCta: 'Виж всички типове',
			typeTitle: 'Разгледай по тип',
			vehicleCard: vehicleCardBg
		},
		hero: {
			checksTitle: 'Проверки от Promosale Varna',
			ctaLabel: 'Виж наличните',
			features: [
				'Проверен източник',
				'Проверка на история',
				'Проверка на пробег',
				'Документална следа',
				'Съдействие за подбор на автомобили',
				'Готовност за регистрация',
				'Оглед с предварителна уговорка',
				'Прием на клиентски автомобили'
			],
			heading: 'Разгледай, сравни и избери с Promosale Varna!',
			searchSubmitPrefix: 'Покажи',
			searchSubmitSuffix: 'автомобила',
			slideSubtitle: 'Автомобили от Европа с проверена история и ясни следващи стъпки преди оглед.',
			statuses: ['Нова обява', 'Наличен', 'Клиентски автомобил'],
			tabs: [
				{ active: true, label: 'Всички автомобили' },
				{ active: false, label: 'Нови обяви' },
				{ active: false, label: 'Клиентски автомобили' }
			],
			yearLabel: 'Година',
			filters: {
				allBodyTypes: 'Всички типове',
				allBrand: 'Всички марки',
				allFuelTypes: 'Всички горива',
				allModel: 'Всички модели',
				allPrice: 'Всички цени',
				allStatuses: 'Всички статуси',
				allTransmissions: 'Всички скорости',
				bodyType: 'Категория',
				fuelType: 'Гориво',
				maxPrice: 'Макс. цена',
				selectBrand: 'Избери марка',
				selectModel: 'Избери модел',
				status: 'Статус',
				transmission: 'Скорости'
			}
		},
		inventory: {
			emptyBody: 'Изчисти филтрите или се свържи с Promosale Varna за подбор на автомобили.',
			emptyTitle: 'Няма автомобили, които отговарят на тези филтри',
			reset: 'Изчисти филтрите',
			vehicleCard: vehicleCardBg
		},
		detail: {
			callDayNight: 'Обади се на Promosale Varna',
			carOverview: 'Основни данни',
			cash: 'В брой',
			chatOnViber: 'Чат във Viber',
			compare: 'Сравни',
			consultantLabel: 'Консултант Promosale Varna',
			description: 'Описание',
			detailDescriptionFallback:
				'е наличен чрез Promosale Varna с проверка на източника и оглед с предварителна уговорка.',
			directions: 'Виж упътване',
			email: 'Имейл',
			finance: 'Финансиране',
			financeIntro:
				'Ориентировъчна вноска преди окончателни данъци, регистрация и транспортни разходи.',
			financeTerms: 'Ориентировъчно за 72 месеца. Финалните условия се потвърждават от Promosale Varna.',
			formConsent:
				'Да, искам да получавам информация за цената на този автомобил и полезна информация за покупката.',
			formTerms: 'С използването на тази услуга приемате нашето',
			formTermsLink: 'потребителско споразумение.',
			getToKnow: 'Опознай автомобила',
			inquiryTitle: 'Изпрати запитване за автомобила',
			inquiryCta: 'Запитване',
			inquiryIntro: 'Остави данните си и ще се свържем с теб за този автомобил.',
			inquirySuccess: 'Готово — ще се свържем с теб възможно най-скоро.',
			callCta: 'Обади се',
			message: 'Съобщение',
			messagePlaceholder: 'Коментар',
			name: 'Име',
			phone: 'Телефон',
			playVideo: 'Пусни видео',
			price: 'Цена:',
			priceIntro:
				'Обявена цена на автомобила. Финалните данъци и регистрационни разходи се потвърждават преди покупка.',
			monthlyTitle: 'Ориентировъчна вноска:',
			priceInBgn: 'Цена в лева',
			priceInBgnAria: 'Покажи цената в лева',
			bgnRateNote:
				'По фиксирания курс на БНБ (1 EUR = 1.95583 лв.). Крайните данъци и регистрация се потвърждават преди покупка.',
			savePrefix: 'Запази',
			sendInquiry: 'Изпрати запитване',
			subject: 'Тема',
			subjectAvailability: 'Наличност на автомобила',
			subjectDocuments: 'Регистрация и документи',
			subjectViewing: 'Уговорка за оглед',
			viewAllPhoto: 'Виж всички снимки'
		},
		nav: {
			'/': 'Начало',
			'/about': 'За нас',
			'/contact': 'Контакти',
			'/inventory': 'Автомобили',
			'/services': 'Услуги'
		},
		vehicleTerms: {
			bodyTypes: {
				Cabriolet: 'Кабрио',
				Car: 'Автомобил',
				Coupe: 'Купе',
				Crossover: 'Кросоувър',
				Electric: 'Електрически',
				Hatchback: 'Хечбек',
				Luxury: 'Лукс',
				'Pickup Truck': 'Пикап',
				Sedan: 'Седан',
				SUV: 'SUV',
				'View all': 'Виж всички',
				Wagon: 'Комби'
			},
			fuels: {
				Diesel: 'Дизел',
				EV: 'Електрически',
				Hybrid: 'Хибрид',
				Petrol: 'Бензин',
				PHEV: 'PHEV',
				'On request': 'По запитване'
			},
			statuses: {
				Available: 'Наличен',
				'Client vehicle': 'Клиентски автомобил',
				'New listing': 'Нова обява'
			},
			transmissions: {
				Automatic: 'Автомат',
				Auto: 'Автомат',
				Manual: 'Ръчни',
				'On request': 'По запитване'
			}
		}
	}
};

export const resolveLocale = (value: string | null | undefined): Locale =>
	value === 'en' ? 'en' : defaultLocale;

export const getMessages = (locale: Locale) => messages[locale];

export const translateVehicleTerm = (
	locale: Locale,
	group: keyof PublicMessages['vehicleTerms'],
	value: string
) => messages[locale].vehicleTerms[group][value] ?? value;

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const localizeVehicleTermsInText = (locale: Locale, value: string) => {
	if (locale === 'en') return value;

	const termGroups: Array<keyof PublicMessages['vehicleTerms']> = [
		'bodyTypes',
		'fuels',
		'statuses',
		'transmissions'
	];

	return termGroups.reduce(
		(localized, group) =>
			Object.entries(messages[locale].vehicleTerms[group]).reduce(
				(text, [source, replacement]) =>
					text.replace(new RegExp(`\\b${escapeRegExp(source)}\\b`, 'g'), replacement),
				localized
			),
		value
	);
};

export const localizeCount = (locale: Locale, count: string) =>
	locale === 'bg' ? count.replace(/\bVehicles\b/g, 'автомобила') : count;

/**
 * Bulgarian count noun for "автомобил": singular for counts ending in 1 (but not 11),
 * paucal/plural form otherwise. Avoids ungrammatical strings like "1 автомобила".
 */
export const bgVehicleCountNoun = (count: number) =>
	count % 10 === 1 && count % 100 !== 11 ? 'автомобил' : 'автомобила';

const auxeroBgReplacements: Array<[RegExp, string]> = [
	// Inventory + detail template strings. Multi-word/compound phrases are listed
	// before the generic single-word rules below (e.g. /Price/) so they match first.
	[
		/Showing (\d+)\s*[-–]\s*(\d+) of (\d+) matching(?: Promosale Varna)? Listings/g,
		'Показани $1 – $2 от $3 съвпадащи обяви'
	],
	[
		/Showing (\d+)\s*[-–]\s*(\d+) of (\d+)(?: Promosale Varna)? Listings/g,
		'Показани $1 – $2 от $3 обяви'
	],
	[/Showing 0 of (\d+)(?: Promosale Varna)? Listings/g, 'Показани 0 от $1 обяви'],
	// Inventory banner + searchbar
	[/Promosale Varna current stock/gi, 'Налични автомобили в Promosale Varna'],
	[
		/(\d+) vehicles available with appointment viewings and source checks\./g,
		'$1 налични автомобила с оглед по уговорка и проверен произход.'
	],
	[
		/(\d+) matching vehicles available with appointment viewings and source checks\./g,
		'$1 съвпадащи автомобила с оглед по уговорка и проверен произход.'
	],
	[/Search Promosale Varna inventory/g, 'Търси в Promosale Varna'],
	[/Search brand, model, stock #/g, 'Търси марка, модел, номер #'],
	[
		/Search make, model, year, fuel, extras\.\.\./g,
		'Търси по марка, модел, година, гориво, екстри...'
	],
	[/Search for anything/g, 'Търси каквото и да е'],
	[/Promosale Varna Inventory/g, 'Инвентар'],
	[/\bFilters\b/g, 'Филтри'],
	[/\bMake\b/g, 'Марка'],
	[/\bModel\b/g, 'Модел'],
	[/\bGearbox\b/g, 'Скорости'],
	[/\bBody\b/g, 'Купе'],
	[/\bExtras\b/g, 'Екстри'],
	[/All vehicles/g, 'Всички'],
	[/Under 50 000 EUR/g, 'До 50 000 EUR'],
	[/Up to 30 000 EUR/g, 'До 30 000 EUR'],
	[/Up to 50 000 EUR/g, 'До 50 000 EUR'],
	[/Up to 70 000 EUR/g, 'До 70 000 EUR'],
	[/Up to 100 000 EUR/g, 'До 100 000 EUR'],
	[/Up to 50 000 km/g, 'До 50 000 км'],
	[/Up to 80 000 km/g, 'До 80 000 км'],
	[/Up to 100 000 km/g, 'До 100 000 км'],
	[/Up to 150 000 km/g, 'До 150 000 км'],
	[/\bSedan\b/g, 'Седан'],
	[/\bCabriolet\b/g, 'Кабрио'],
	[/\bConvertible\b/g, 'Кабрио'],
	[/\bCoupe\b/g, 'Купе'],
	[/\bHatchback\b/g, 'Хечбек'],
	[/\bCrossover\b/g, 'Кросоувър'],
	[/\bPickup\b/g, 'Пикап'],
	[/\bWagon\b/g, 'Комби'],
	// Shared auxero footer (every secondary template page)
	[/Terms Of Services/g, 'Общи условия'],
	[/Privacy Policy/g, 'Поверителност'],
	[/Cookie Policy/g, 'Бисквитки'],
	[/Contact Promosale Varna/g, 'Контакт с Promosale Varna'],
	[/Buying With Promosale Varna/g, 'Покупка с Promosale Varna'],
	[/Inventory Map/g, 'Карта на наличните'],
	[/Import Calculator/g, 'Калкулатор за внос'],
	[/Promosale Varna Online/g, 'Promosale Varna онлайн'],
	[/Opening Hours:/g, 'Работно време:'],
	[/Monday-Friday 9:00 - 18:00/g, 'Понеделник-петък 9:00 - 18:00'],
	[/Weekend viewings by appointment/g, 'Огледи през уикенда с уговорка'],
	[/QUICK LINKS/g, 'БЪРЗИ ВРЪЗКИ'],
	[/BUYING & SELLING/g, 'ПОКУПКА И ПРОДАЖБА'],
	[/All Rights Reserved\./g, 'Всички права запазени.'],
	[/\bNews\b/g, 'Новини'],
	[/This Vehicle's Availability/g, 'Наличност на автомобила'],
	[/Send Inquiry about Vehicle/g, 'Запитване за автомобила'],
	[/Send Inquiry/g, 'Изпрати запитване'],
	[/View All Photo/g, 'Виж всички снимки'],
	[/You might also like/g, 'Може да харесате също'],
	[/Get To Know this car/gi, 'Опознай автомобила'],
	[/Car Overview/g, 'Основни данни'],
	[/Vehicle in the VAT system/g, 'Автомобил с включено ДДС'],
	[/Special tax on motor vehicles:/g, 'Специален данък върху МПС:'],
	[/Price with special tax:/g, 'Цена със специален данък:'],
	[/Price & Payment/g, 'Цена и плащане'],
	[/Car Price/g, 'Цена на автомобила'],
	[/Great Price/g, 'Отлична цена'],
	[/Full Price/g, 'Пълна цена'],
	[/Highest Price/g, 'Най-висока цена'],
	[/Lowest Price/g, 'Най-ниска цена'],
	[/Lowest Mileage/g, 'Най-малък пробег'],
	[/Newest Listed/g, 'Най-нови обяви'],
	[/Newest Year/g, 'Най-нова година'],
	[/Best Match/g, 'Най-подходящи'],
	[/Sort Vehicles by/gi, 'Подреди по'],
	[/Advanced Search/g, 'Разширено търсене'],
	[/All Stock/g, 'Всички автомобили'],
	[/No accidents/gi, 'Без катастрофи'],
	[/Clear filters/g, 'Изчисти филтрите'],
	[/(\d+) selected/g, '$1 избрани'],
	[/(\d+) matches\b/g, '$1 съвпадения'],
	[/(\d+) match\b/g, '$1 съвпадение'],
	[/Brand:/g, 'Марка:'],
	[/Body:/g, 'Купе:'],
	[/Condition:/g, 'Състояние:'],
	[/Feature:/g, 'Екстра:'],
	[/Fuel:/g, 'Гориво:'],
	[/Location:/g, 'Локация:'],
	[/Max mileage:/g, 'Макс. пробег:'],
	[/Max price:/g, 'Макс. цена:'],
	[/Max year:/g, 'До година:'],
	[/Min mileage:/g, 'Мин. пробег:'],
	[/Min price:/g, 'Мин. цена:'],
	[/Min year:/g, 'От година:'],
	[/Search:/g, 'Търсене:'],
	[/Stock:/g, 'Номер:'],
	[/Status:/g, 'Статус:'],
	[/Transmission:/g, 'Скорости:'],
	[/Financing Calculator/g, 'Калкулатор за финансиране'],
	[/Monthly Payment:/g, 'Месечна вноска:'],
	[/Down Payment/g, 'Първоначална вноска'],
	[/Interest Rate/g, 'Лихвен процент'],
	[/Loan Term \(months\)/g, 'Срок (месеци)'],
	[/Est\. Total Loan:/g, 'Прибл. общо:'],
	[/Total Interest Payment:/g, 'Обща лихва:'],
	[/Verified Dealer/g, 'Проверен дилър'],
	[/Get Directions/g, 'Посоки'],
	[/Play Video/gi, 'Гледай видео'],
	[/Sign In/g, 'Вход'],
	[/Sign in/g, 'Вход'],
	[/Sign Up/g, 'Регистрация'],
	[/Login Here/g, 'Влез оттук'],
	[/Log In/g, 'Вход'],
	[/Forgot Your Password\?/g, 'Забравена парола?'],
	[/Forgot Password/g, 'Забравена парола'],
	[/Remember me/gi, 'Запомни ме'],
	[/\bCash\b/g, 'В брой'],
	[/See Finance/g, 'Виж финансиране'],
	[/\bFinancing\b/g, 'Финансиране'],
	[/\bFinance\b/g, 'Финансиране'],
	[/\bExterior\b/g, 'Екстериор'],
	[/\bSafety\b/g, 'Безопасност'],
	[/\bTechnology\b/g, 'Технологии'],
	[/\bMechanical\b/g, 'Техника'],
	[/\bDescription\b/g, 'Описание'],
	[/\bPhotos\b/g, 'Снимки'],
	[/\bYear\b/g, 'Година'],
	// Detail page feature tabs + helper copy (built in English by applyDetailData,
	// translated here). Verbatim strings copied from the source so they match.
	[/Promosale Varna Notes/g, 'Съвети от Promosale Varna'],
	[
		/Estimated payment before final taxes, registration, and transport costs\./g,
		'Прогнозна вноска без крайни данъци, регистрация и транспорт.'
	],
	[
		/Estimated over 72 months\. Final terms confirmed by Promosale Varna\./g,
		'Прогноза за 72 месеца. Крайните условия се потвърждават от Promosale Varna.'
	],
	[
		/Listed vehicle price\. Final taxes and registration costs confirmed before purchase\./g,
		'Обявена цена. Крайните данъци и регистрация се потвърждават преди покупка.'
	],
	[/Europe import review/g, 'Проверка при подбор на автомобили'],
	[/Document trail review/g, 'Преглед на документи'],
	[/Registration readiness discussion/g, 'Разговор за регистрация'],
	[/Mechanical inspection can be arranged/g, 'Може да се организира технически преглед'],
	[/Engine details on request/g, 'Детайли за двигателя по запитване'],
	[
		/Inventory refreshed from Promosale Varna source data/g,
		'Наличността е обновена от данните на Promosale Varna'
	],
	[/Inventory refreshed/g, 'Наличността е обновена'],
	[/Verified source listing/g, 'Проверена обява от източника'],
	[/History review available/g, 'Налична е история'],
	[/Viewing by appointment/g, 'Оглед по уговорка'],
	[/Vehicle viewings by appointment/g, 'Огледите се потвърждават предварително'],
	[/Registration and documents/g, 'Регистрация и документи'],
	[/Viewing appointment/g, 'Оглед по уговорка'],
	[/Promosale Varna Consultants/g, 'Консултанти на Promosale Varna'],
	[/Promosale Varna Consultant/g, 'Консултант на Promosale Varna'],
	[/Call Promosale Varna/g, 'Обади се на Promosale Varna'],
	[/Chat on Viber/g, 'Пиши във Viber'],
	[/EUR\/mo/g, 'EUR/мес.'],
	[/\bEquipment\b/g, 'Оборудване'],
	[/\bComfort\b/g, 'Комфорт'],
	[/\bHistory\b/g, 'История'],
	[/\bSpecs\b/g, 'Спецификации'],
	[/Role Access Notes/g, 'Бележки за достъп по роли'],
	[/\bNotes\b/g, 'Бележки'],
	[/\bSearch\b/g, 'Търсене'],
	[/WHAT ARE YOU LOOKING FOR\?/g, 'Какво търсите?'],
	[/\bPages\b/g, 'Раздели'],
	[/\bHome\b/g, 'Начало'],
	[/\bServices\b/g, 'Услуги'],
	[/\bAbout\b/g, 'За нас'],
	[/\bContact\b/g, 'Контакти'],
	[/Browse inventory/gi, 'Разгледай наличните автомобили'],
	[/Browse Inventory/g, 'Разгледай автомобили'],
	[/All Vehicles/g, 'Всички автомобили'],
	[/Grid View/g, 'Изглед с карти'],
	[/Map View/g, 'Карта'],
	[/Compare Vehicles/g, 'Сравни автомобили'],
	[/Shop By Body Type/g, 'По тип купе'],
	[/Shop By Fuel Type/g, 'По гориво'],
	[/Promosale Varna Support/g, 'Съдействие от Promosale Varna'],
	[/Import & Buying Services/g, 'Внос и покупка'],
	[/Import Cost Calculator/g, 'Калкулатор за внос'],
	[/Sell Your Car/g, 'Продай автомобила си'],
	[/Meet Our Consultants/g, 'Нашите консултанти'],
	[/Book A Consultation/g, 'Запази консултация'],
	[/Find a Car/g, 'Намери автомобил'],
	[/Find a Consultant/g, 'Намери консултант'],
	[/Verified Listings/g, 'Проверени обяви'],
	[/Client Reviews/g, 'Отзиви от клиенти'],
	[/Contact Promosale Varna/g, 'Контакт с Promosale Varna'],
	[/Frequently Asked Questions/g, 'Често задавани въпроси'],
	[/Promosale Varna Notes/g, 'Съвети от Promosale Varna'],
	[/Compare Promosale Varna Vehicles Side-by-Side/g, 'Сравни автомобили от Promosale Varna'],
	[
		/Compare price, mileage, source details, and specifications before you book a viewing\./g,
		'Сравни цена, пробег, източник и спецификации преди да запазиш оглед.'
	],
	[/Mileage/g, 'Пробег'],
	[/Years/g, 'Година'],
	[/Fuel/g, 'Гориво'],
	[/Color/g, 'Цвят'],
	[/Location/g, 'Локация'],
	[/Interior/g, 'Интериор'],
	[/Engine/g, 'Двигател'],
	[/Transmission/g, 'Скорости'],
	[/Source ID/g, 'ID от източника'],
	[/Stock Number/g, 'Номер в наличност'],
	[/Price/g, 'Цена'],
	[/On request/g, 'По запитване'],
	[/Remove/g, 'Премахни'],
	[/View All Inventory/g, 'Виж всички автомобили'],
	[/View All/g, 'Виж всички'],
	[/View details/g, 'Виж детайли'],
	[/View Details/g, 'Виж детайли'],
	[/See Finance/g, 'Виж финансиране'],
	[/Compare/g, 'Сравни'],
	[/New listing/g, 'Нова обява'],
	[/Available/g, 'Наличен'],
	[/Client vehicle/g, 'Клиентски автомобил'],
	[/Petrol/g, 'Бензин'],
	[/Diesel/g, 'Дизел'],
	[/Hybrid/g, 'Хибрид'],
	[/Automatic/g, 'Автомат'],
	[/Manual/g, 'Ръчни'],
	[/Enter your e-mail/g, 'Въведете имейл'],
	[/Enter your email/g, 'Въведете имейл']
];

const localizeAuxeroHtmlSegment = (html: string) =>
	auxeroBgReplacements.reduce(
		(localized, [pattern, replacement]) => localized.replace(pattern, replacement),
		html
	);

const localizeAuxeroTagAttributes = (tag: string) =>
	tag.replace(
		/\s(aria-label|alt|placeholder|title)=(["'])(.*?)\2/gi,
		(match, name: string, quote: string, value: string) =>
			` ${name}=${quote}${localizeAuxeroHtmlSegment(value)}${quote}`
	);

export const localizeAuxeroHtml = (html: string, locale: Locale) =>
	locale === 'bg'
		? html
				.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<!--[\s\S]*?-->|<[^>]+>)/gi)
				.map((segment) => {
					if (
						segment.startsWith('<!--') ||
						/^<script\b/i.test(segment) ||
						/^<style\b/i.test(segment)
					) {
						return segment;
					}

					return segment.startsWith('<')
						? localizeAuxeroTagAttributes(segment)
						: localizeAuxeroHtmlSegment(segment);
				})
				.join('')
		: html;

export const localizeAuxeroPageDocument = (
	pageDocument: AuxeroPageDocument,
	locale: Locale
): AuxeroPageDocument => {
	const headHtml = localizeAuxeroHtml(pageDocument.headHtml, locale);

	return {
		...pageDocument,
		bodyHtml: localizeAuxeroHtml(pageDocument.bodyHtml, locale),
		headAssets: parseAuxeroHeadAssets(headHtml),
		headHtml
	};
};
