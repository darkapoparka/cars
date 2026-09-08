import mobileBgFeed from './eliqauto-listings.json';
import { eliqAboutCompany } from './eliqauto-about';
import { eliqYouTubeChannel } from './eliqauto-media';

export type MobileBgListing = {
	id: string;
	title: string;
	price: string;
	priceBgn: string;
	vat: string;
	badge: string;
	location: string;
	production: string;
	mileage: string;
	color: string;
	fuel: string;
	power: string;
	euroStandard: string;
	displacement: string;
	gearbox: string;
	category: string;
	photoCount: string;
	image: string;
	images?: string[];
	href: string;
	shortDescription: string;
	features: string[];
};

type MobileBgFeed = {
	fetchedAt: string;
	sources: Record<string, string>;
	count: number;
	listings: MobileBgListing[];
};

export type EliqautoVehicle = {
	id: string;
	make: string;
	model: string;
	year: number;
	price: string;
	priceBgn: string;
	priceEur: number;
	vatNote: string;
	description: string;
	mileage: string;
	mileageKm: number;
	fuel: string;
	transmission: string;
	body: string;
	status: string;
	label: string;
	image: string;
	sourceUrl: string;
	sourceId: string;
	location: string;
	color: string;
	power: string;
	euroStandard: string;
	displacement: string;
	photoCount: number;
	images: string[];
	features: string[];
	isClientVehicle: boolean;
	needsClientReview: boolean;
};

const feed = mobileBgFeed as MobileBgFeed;

const makeNames = [
	'Mercedes-Benz',
	'Volkswagen',
	'Porsche',
	'Toyota',
	'Audi',
	'BMW',
	'Ford',
	'Mazda'
] as const;

const parseNumber = (value: string) => Number(value.replace(/[^\d.]/g, '')) || 0;

const normalizePrice = (value: string) => {
	const price = Math.round(parseNumber(value));

	// Non-numeric prices ("По запитване" / price on request) parse to 0. Surface the
	// on-request label instead of a misleading "0 EUR"; priceEur 0 also zeroes the
	// monthly estimate so the card and PDP hide the financing line.
	if (price <= 0) {
		return { priceEur: 0, price: 'По запитване' };
	}

	return {
		priceEur: price,
		price: `${price.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} EUR`
	};
};

const parseYear = (production: string) => {
	const match = production.match(/\b(19|20)\d{2}\b/);

	return match ? Number(match[0]) : new Date().getFullYear();
};

const parseMileage = (mileage: string) => Number(mileage.replace(/\D/g, '')) || 0;

const detectMake = (title: string) => makeNames.find((make) => title.startsWith(make)) ?? 'Други';

const normalizeBody = (category: string) => {
	if (category === 'Джип') return 'SUV';
	if (category === 'Кабрио') return 'Cabriolet';
	if (category === 'Седан') return 'Sedan';
	if (category === 'Комби') return 'Wagon';
	if (category === 'Купе') return 'Coupe';
	if (category === 'Стреч лимузина') return 'Limousine';
	if (category === 'Хечбек') return 'Hatchback';
	if (category === 'Ван') return 'Van';

	return category || 'Car';
};

const normalizeFuel = (fuel: string) => {
	if (fuel === 'Бензинов') return 'Petrol';
	if (fuel === 'Дизелов') return 'Diesel';
	if (fuel === 'Хибриден') return 'Hybrid';
	if (fuel === 'Електрически') return 'EV';

	return fuel || 'On request';
};

const normalizeTransmission = (gearbox: string) => {
	if (gearbox === 'Автоматична') return 'Automatic';
	if (gearbox === 'Ръчна') return 'Manual';

	return gearbox || 'On request';
};

export const cleanEliqautoDescription = (text: string) =>
	localizeImportedShortDescription(text)
		.replaceAll('Бъглария', 'България')
		.replaceAll('Клиентси', 'Клиентски')
		.replaceAll('Кометар', 'Коментар')
		.replaceAll('желатено', 'желателно')
		.replaceAll('исинтиски', 'истински')
		.replaceAll('шифоране', 'шофиране')
		.replaceAll('обудхване', 'обдухване')
		.replaceAll('вакум', 'вакуум')
		.trim();

const joinBgList = (items: string[]) => {
	if (items.length <= 1) return items[0] ?? '';

	return `${items.slice(0, -1).join(', ')} и ${items.at(-1)}`;
};

const localizeImportedFeature = (feature: string) => {
	const normalized = feature.trim();
	const replacements: Record<string, string> = {
		facelift: 'фейслифт',
		long: 'дълга база',
		designo: 'designo изпълнение'
	};

	return replacements[normalized] ?? normalized;
};

const localizeImportedFuel = (fuel: string) => {
	const replacements: Record<string, string> = {
		diesel: 'дизел',
		petrol: 'бензин'
	};

	return replacements[fuel.trim().toLowerCase()] ?? fuel.trim();
};

const localizeImportedTransmission = (transmission: string) => {
	const replacements: Record<string, string> = {
		'automatic transmission': 'автоматична скоростна кутия',
		'manual transmission': 'ръчна скоростна кутия'
	};

	return replacements[transmission.trim().toLowerCase()] ?? transmission.trim();
};

const localizeImportedShortDescription = (text: string) => {
	const match = text
		.trim()
		.match(/^(\d{4})\s+(.+?) with (.+?)\.\s+(\d+)\s+hp,\s+([^,]+),\s+(.+?)\.$/i);

	if (!match) return text;

	const [, year, model, features, power, fuel, transmission] = match;
	const localizedFeatures = joinBgList(features.split(',').map(localizeImportedFeature));

	return `${year} ${model} с ${localizedFeatures}. ${power} к.с., ${localizeImportedFuel(fuel)}, ${localizeImportedTransmission(transmission)}.`;
};

const toVehicle = (listing: MobileBgListing): EliqautoVehicle => {
	const make = detectMake(listing.title);
	const { price, priceEur } = normalizePrice(listing.price);
	const mileageKm = parseMileage(listing.mileage);
	const description = cleanEliqautoDescription(listing.shortDescription);

	return {
		id: listing.id,
		make,
		model: listing.title,
		year: parseYear(listing.production),
		price,
		priceBgn: listing.priceBgn,
		priceEur,
		vatNote: listing.vat,
		description,
		mileage: `${mileageKm.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`,
		mileageKm,
		fuel: normalizeFuel(listing.fuel),
		transmission: normalizeTransmission(listing.gearbox),
		body: normalizeBody(listing.category),
		status: listing.badge === 'НОВА ОБЯВА' ? 'New listing' : 'Available',
		label: String(parseYear(listing.production)),
		image: listing.image,
		sourceUrl: listing.href,
		sourceId: listing.id,
		location: listing.location.replace('обл. ', '').replace('гр. София', 'гр. Пазарджик'),
		color: listing.color,
		power: listing.power,
		euroStandard: listing.euroStandard,
		displacement: listing.displacement,
		photoCount: Number(listing.photoCount) || 0,
		images: listing.images ?? (listing.image ? [listing.image] : []),
		features: listing.features,
		isClientVehicle: description.toLowerCase().includes('клиентски автомобил'),
		needsClientReview: true
	};
};

export const eliqautoSources = feed.sources;
export const eliqautoFetchedAt = feed.fetchedAt;
export const eliqautoVehicles = feed.listings.map(toVehicle);

export const eliqautoContact = {
	primaryPhoneLabel: '+359 896 781 662',
	primaryPhoneHref: 'tel:+359896781662',
	marketplacePhoneLabel: '+359 897 415 674',
	marketplacePhoneHref: 'tel:+359897415674',
	emailLabel: 'sales@eliqauto.bg',
	emailHref: 'mailto:sales@eliqauto.bg',
	viberHref: 'viber://chat?number=%2B359896781662',
	facebookHref: 'https://www.facebook.com/kosta.uzunov/',
	reviewsHref: 'https://www.facebook.com/kosta.uzunov/',
	youtubeHref: eliqYouTubeChannel,
	addressLabel: 'Пазарджик',
	addressCopyLabel: 'Шоурум ELIQ AUTO · Пазарджик',
	hours: eliqAboutCompany.hours,
	thirdPhoneLabel: eliqAboutCompany.thirdPhone,
	thirdPhoneHref: eliqAboutCompany.thirdPhoneHref,
	locationNote: eliqAboutCompany.locationNote,
	appointmentNote: 'Огледи с предварителна уговорка',
	mapHref: eliqAboutCompany.mapHref,
	mapEmbedUrl: eliqAboutCompany.mapEmbedUrl
} as const;

export const eliqautoBrand = {
	name: 'Eliq Auto',
	displayName: 'ELIQ AUTO',
	bulgarianName: 'Елик Ауто',
	domain: 'eliqauto.bg',
	tagline: 'Премиум автомобили с проверена история и гъвкаво финансиране',
	legalNote:
		'Proposal build reflects current public Eliqauto contact channels and appointment viewing.'
} as const;

export const eliqautoAssets = {
	logoDark: '/assets/eliqauto/brand/eliq-auto-wordmark-header.png',
	logoLight: '/assets/eliqauto/brand/eliq-auto-wordmark-clean.png',
	avatar: '/assets/eliqauto/brand/eliq-auto-avatar-raster-v1-transparent.png',
	emblem: '/assets/eliqauto/brand/eliq-auto-emblem-raster-v1-transparent.png',
	hero: '/assets/eliqauto/cars/11780254722465322/img-01.webp',
	homeHeroSlides: [],
	footerImage: '/assets/eliqauto/cars/11780907716855488/img-01.webp'
} as const;

export const eliqautoConsultants = [
	{
		slug: 'eliqauto-sales',
		name: 'Продажби и огледи',
		title: 'Налични автомобили и клиентски запитвания',
		image: '/assets/eliqauto/brand/eliq-auto-avatar-raster-v1-transparent.png'
	},
	{
		slug: 'eliqauto-import',
		name: 'Лизинг и финансиране',
		title: 'Лизинг 100%, схеми и крайни разходи',
		image: '/assets/eliqauto/brand/eliq-auto-avatar-raster-v1-transparent.png'
	},
	{
		slug: 'eliqauto-inspection',
		name: 'Проверка и документи',
		title: 'VIN, история, регистрация и предаване',
		image: '/assets/eliqauto/brand/eliq-auto-avatar-raster-v1-transparent.png'
	}
] as const;

export const mainNavigation = [
	{ label: 'Начало', href: '/', matchPrefixes: ['/'] },
	{ label: 'Автомобили', href: '/inventory', matchPrefixes: ['/inventory'] },
	{
		label: 'Услуги',
		href: '/services',
		matchPrefixes: [
			'/services',
			'/import',
			'/financing',
			'/calculator',
			'/sell-your-car',
			'/compare'
		]
	},
	{
		label: 'За нас',
		href: '/about',
		matchPrefixes: ['/about', '/agents', '/reviews', '/faqs', '/blog']
	},
	{ label: 'Контакти', href: '/contact', matchPrefixes: ['/contact'] }
] as const;

export const isPrimaryNavActive = (pathname: string, item: (typeof mainNavigation)[number]) =>
	item.matchPrefixes.some(
		(prefix) => pathname === prefix || (prefix !== '/' && pathname.startsWith(prefix))
	);

export const getUniqueValues = <Key extends keyof EliqautoVehicle>(key: Key) =>
	Array.from(new Set(eliqautoVehicles.map((vehicle) => vehicle[key]).filter(Boolean))).sort(
		(a, b) => String(a).localeCompare(String(b), 'bg')
	);
