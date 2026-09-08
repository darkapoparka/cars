import { auxeroReviewCards, type AuxeroReviewCard } from '$lib/auxero/reviews';
import { agentCardsFromAgents, type AuxeroAgentCard } from '$lib/auxero/agents';
import { agents } from '$lib/data/agents';
import { eliqautoAssets, eliqautoContact } from '$lib/data/eliqauto';
import { brands, vehicles } from '$lib/data/vehicles';
import type { AuxeroPageBanner } from './page-banner';
import { auxeroServiceCards } from './services';
import { eliqAboutCompany } from '$lib/data/eliqauto-about';

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
	Audi: '/assets/eliqauto/brands/audi.webp',
	BMW: '/assets/eliqauto/brands/bmw.webp',
	Ford: '/assets/eliqauto/brands/ford.webp',
	Mazda: '/assets/eliqauto/brands/mazda.webp',
	'Mercedes-Benz': '/assets/eliqauto/brands/mercedes-benz.webp',
	Porsche: '/assets/eliqauto/brands/porsche.webp',
	Toyota: '/assets/eliqauto/brands/toyota.webp',
	Volkswagen: '/assets/eliqauto/brands/volkswagen.webp'
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
		hero: eliqautoAssets.hero
	},
	brands: aboutBrandCards,
	consultants: agentCardsFromAgents(agents),
	contact: {
		primaryPhoneHref: eliqautoContact.primaryPhoneHref,
		primaryPhoneLabel: eliqautoContact.primaryPhoneLabel
	},
	hero: {
		actions: [
			{ href: '/inventory', label: 'Виж автомобили' },
			{ href: '/contact', label: 'Свържете се', variant: 'secondary' }
		],
		description:
			'Премиум автомобили, проверка по конкретен VIN, документи и оглед с ясен следващ ход.',
		eyebrow: 'За Eliqauto',
		image: '/assets/eliqauto/hero/about-eliqauto-process-banner.webp',
		title: 'Eliqauto: премиум автомобили'
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
		mainImageAlt: 'Eliqauto showroom',
		subImage: '/assets/eliqauto/proof-studio-import-handoff.webp',
		subImageAlt: 'Eliqauto handoff'
	},
	office: {
		address: eliqautoContact.addressLabel,
		appointment: eliqautoContact.appointmentNote,
		description:
			'Огледите са с уговорка, за да има време за конкретния автомобил, документи, история и следваща стъпка.',
		email: eliqautoContact.emailLabel,
		emailHref: eliqautoContact.emailHref,
		heading: 'Огледи и предаване в Пазарджик',
		hours: eliqAboutCompany.hours.join(' · '),
		mapEmbedUrl: eliqAboutCompany.mapEmbedUrl,
		mapHref: eliqAboutCompany.mapHref,
		phone: eliqautoContact.primaryPhoneLabel,
		phoneHref: eliqautoContact.primaryPhoneHref,
		secondaryPhone: eliqautoContact.marketplacePhoneLabel,
		secondaryPhoneHref: eliqautoContact.marketplacePhoneHref
	},
	profile: {
		eyebrow: 'Екип и история',
		heading: 'Екип в Пазарджик за премиум автомобили',
		description:
			'Eliqauto работи около конкретния автомобил: налична кола, линк с проверена история, VIN, документи, ориентир за крайни разходи, оглед и предаване.',
		statement:
			'Целта е клиентът да знае какво гледа, колко реално струва и каква е следващата стъпка преди ангажимент.',
		highlights: [
			'Внос и лизинг',
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
		image: '/assets/eliqauto/cta/import-canada-banner.webp',
		imageAlt: 'Why choose Eliqauto'
	}
};
