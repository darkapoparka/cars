import { auxeroReviewCards, type AuxeroReviewCard } from '$lib/auxero/reviews';
import { agentCardsFromAgents, type AuxeroAgentCard } from '$lib/auxero/agents';
import { agents } from '$lib/data/agents';
import { daynightAssets, daynightContact } from '$lib/data/daynight';
import { brands, vehicles } from '$lib/data/vehicles';
import type { AuxeroPageBanner } from './page-banner';
import { auxeroServiceCards } from './services';

export type AuxeroAboutBrandCard = {
	count: string;
	href: string;
	image: string;
	name: string;
};

export type AuxeroAboutOffice = {
	address: string;
	appointment: string;
	description: string;
	email: string;
	emailHref: string;
	heading: string;
	hours: string;
	mapEmbedUrl: string;
	mapHref: string;
	phone: string;
	phoneHref: string;
	secondaryPhone: string;
	secondaryPhoneHref: string;
};

export type AuxeroAboutContent = {
	assets: {
		hero: string;
	};
	brands: AuxeroAboutBrandCard[];
	consultants: AuxeroAgentCard[];
	contact: {
		primaryPhoneHref: string;
		primaryPhoneLabel: string;
	};
	hero: AuxeroPageBanner;
	intro: {
		checklist: string[];
		description: string;
		heading: string;
		mainImageAlt: string;
		subImage: string;
		subImageAlt: string;
		title: string;
	};
	office: AuxeroAboutOffice;
	profile: {
		description: string;
		eyebrow: string;
		highlights: string[];
		heading: string;
		statement: string;
		steps: {
			description: string;
			href: string;
			image: string;
			title: string;
		}[];
	};
	process: {
		description: string;
		title: string;
	}[];
	reviews: AuxeroReviewCard[];
	stats: AuxeroAboutStat[];
	why: {
		checklist: string[];
		description: string;
		heading: string;
		image: string;
		imageAlt: string;
	};
};

export type AuxeroAboutStat = {
	label: string;
	suffix: string;
	value: string;
};

const brandLogos: Record<string, string> = {
	Audi: '/assets/daynight/brands/audi.webp',
	BMW: '/assets/daynight/brands/bmw.webp',
	Ford: '/assets/daynight/brands/ford.webp',
	Mazda: '/assets/daynight/brands/mazda.webp',
	'Mercedes-Benz': '/assets/daynight/brands/mercedes-benz.webp',
	Porsche: '/assets/daynight/brands/porsche.webp',
	Toyota: '/assets/daynight/brands/toyota.webp',
	Volkswagen: '/assets/daynight/brands/volkswagen.webp'
};

const vehicleCountLabel = (count: number) => {
	if (count === 0) return 'внос по заявка';

	return `${count} ${count === 1 ? 'автомобил' : 'автомобила'}`;
};

const aboutBrandCards: AuxeroAboutBrandCard[] = Object.entries(brandLogos).map(
	([brand, image]) => ({
		count: vehicleCountLabel(vehicles.filter((vehicle) => vehicle.brand === brand).length),
		href: `/inventory?brand=${encodeURIComponent(brand)}`,
		image,
		name: brand
	})
);

export const auxeroAboutContent: AuxeroAboutContent = {
	assets: {
		hero: daynightAssets.hero
	},
	brands: aboutBrandCards,
	consultants: [
		{
			...agentCardsFromAgents(agents)[0],
			slug: 'kristiyan-kirilov',
			name: 'Кристиян Кирилов',
			title: 'Изпълнителен директор · CEO',
			socials: [
				{
					href: 'https://www.instagram.com/kristiankirilov13/',
					icon: 'brands/instagram.svg',
					label: 'Кристиян Кирилов в Instagram'
				}
			],
			image: '/assets/daynight/team/kristian-kirilov-public.jpg'
		},
		{
			...agentCardsFromAgents(agents)[1],
			slug: 'demo-mariya-petrova',
			name: 'Мария Петрова',
			title: 'Продажби и огледи · Демо профил',
			image: '/assets/daynight/team/demo-mariya.png'
		},
		{
			...agentCardsFromAgents(agents)[2],
			slug: 'demo-aleksandar-ivanov',
			name: 'Александър Иванов',
			title: 'Внос и консултации · Демо профил',
			image: '/assets/daynight/team/demo-aleksandar.png'
		}
	],
	contact: {
		primaryPhoneHref: daynightContact.primaryPhoneHref,
		primaryPhoneLabel: daynightContact.primaryPhoneLabel
	},
	hero: {
		actions: [
			{ href: '/inventory', label: 'Виж автомобили' },
			{ href: '/contact', label: 'Свържете се', variant: 'secondary' }
		],
		description:
			'Автомобили от Европа, проверка по конкретен VIN, документи и оглед с ясен следващ ход.',
		eyebrow: 'За Day Night Auto',
		image: '/assets/daynight/hero/about-daynight-process-banner.webp',
		title: 'Day Night Auto: автомобили от Европа'
	},
	intro: {
		title: 'Какво проверяваме',
		heading: 'Услуги около внос, оглед и продажба',
		description:
			'Работата е практична и последователна: намираме правилния автомобил, проверяваме историята и документите, уточняваме разходите и подготвяме оглед или предаване без излишен шум.',
		checklist: [
			'VIN, снимки, история, пробег и сервизни следи',
			'Транспорт, мита, ДДС, подготовка и регистрация',
			'Огледи, документи и предаване с предварителна уговорка'
		],
		mainImageAlt: 'Day Night Auto showroom',
		subImage: '/assets/daynight/proof-studio-import-handoff.webp',
		subImageAlt: 'Day Night Auto handoff'
	},
	office: {
		address: daynightContact.addressLabel,
		appointment: daynightContact.appointmentNote,
		description:
			'Огледите са с уговорка, за да има време за конкретния автомобил, документи, история и следваща стъпка.',
		email: daynightContact.emailLabel,
		emailHref: daynightContact.emailHref,
		heading: 'Посети Day Night Auto',
		hours: 'Понеделник-петък: 9:00 - 18:00',
		mapEmbedUrl: daynightContact.mapEmbedUrl,
		mapHref:
			'https://www.google.com/maps/search/?api=1&query=Day Night Auto%20Plovdiv%20South%20Industrial%20Zone',
		phone: daynightContact.primaryPhoneLabel,
		phoneHref: daynightContact.primaryPhoneHref,
		secondaryPhone: daynightContact.marketplacePhoneLabel,
		secondaryPhoneHref: daynightContact.marketplacePhoneHref
	},
	profile: {
		eyebrow: 'Екип и история',
		heading: 'Екип за автомобили от Европа',
		description:
			'Day Night Auto работи около конкретния автомобил: налична кола, линк от Европа, VIN, документи, ориентир за крайни разходи, оглед и предаване.',
		statement:
			'Целта е клиентът да знае какво гледа, колко реално струва и каква е следващата стъпка преди ангажимент.',
		highlights: [
			'Подбрани автомобили',
			'Проверка по VIN и история',
			'Документи, разходи и оглед с уговорка'
		],
		steps: auxeroServiceCards.slice(0, 3)
	},
	process: [
		{
			title: '1. Заявка',
			description: 'Изпращате линк, VIN, бюджет или модел, който търсите.'
		},
		{
			title: '2. Проверка',
			description: 'Екипът гледа история, снимки, пробег, документи и реални разходи.'
		},
		{
			title: '3. Решение',
			description: 'Получавате ясен контекст дали автомобилът си струва следваща стъпка.'
		},
		{
			title: '4. Оглед и предаване',
			description: 'Организираме оглед, документи, регистрация или продажба с уговорка.'
		}
	],
	reviews: auxeroReviewCards.slice(0, 4),
	stats: [
		{ value: String(vehicles.length), suffix: '', label: 'Автомобила в наличност' },
		{ value: String(brands.length), suffix: '', label: 'Марки в инвентара' },
		{ value: '98', suffix: '%', label: 'Препоръки във Facebook' },
		{ value: '157', suffix: '', label: 'Публични отзива' }
	],
	why: {
		heading: 'Как работи процесът преди оглед или внос?',
		description:
			'Покупката или вносът не се решават само по снимка. Екипът събира контекст за произход, документи, разходи и готовност за регистрация, след което клиентът получава ясен следващ ход.',
		checklist: [
			'Подбор според бюджет, модел и очакван срок',
			'Проверка по VIN, история, снимки и документи',
			'Контекст за транспорт, мита, ДДС, подготовка и регистрация',
			'Оглед, продажба на клиентски автомобил и предаване с уговорка'
		],
		image: '/assets/daynight/cta/premium-cars-banner.webp',
		imageAlt: 'Why choose Day Night Auto'
	}
};
