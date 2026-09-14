import mobileBgFeed from './daynight-listings.json';

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

export type DayNightVehicle = {
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
	features: string[];
	isClientVehicle: boolean;
	needsClientReview: boolean;
};

const feed = mobileBgFeed as MobileBgFeed;

const makeNames = [
  "Audi",
  "Citroen",
  "Opel",
  "VW",
  "Peugeot"
] as const;

const parseNumber = (value: string) => Number(value.replace(/[^\d.]/g, '')) || 0;

const normalizePrice = (value: string) => {
	const price = Math.round(parseNumber(value));

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

export const cleanDayNightDescription = (text: string) =>
	text
		.replaceAll('Бъглария', 'България')
		.replaceAll('Клиентси', 'Клиентски')
		.replaceAll('Кометар', 'Коментар')
		.replaceAll('желатено', 'желателно')
		.replaceAll('исинтиски', 'истински')
		.replaceAll('шифоране', 'шофиране')
		.replaceAll('обудхване', 'обдухване')
		.replaceAll('вакум', 'вакуум')
		.trim();

const toVehicle = (listing: MobileBgListing): DayNightVehicle => {
	const make = detectMake(listing.title);
	const { price, priceEur } = normalizePrice(listing.price);
	const mileageKm = parseMileage(listing.mileage);
	const description = cleanDayNightDescription(listing.shortDescription);

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
		location: listing.location.replace('обл. ', ''),
		color: listing.color,
		power: listing.power,
		euroStandard: listing.euroStandard,
		displacement: listing.displacement,
		photoCount: Number(listing.photoCount) || 0,
		features: listing.features,
		isClientVehicle: description.toLowerCase().includes('клиентски автомобил'),
		needsClientReview: true
	};
};

export const daynightSources = feed.sources;
export const daynightFetchedAt = feed.fetchedAt;
export const daynightVehicles = feed.listings.map(toVehicle);

export const daynightContact = {
  "primaryPhoneLabel": "0898 921 010",
  "primaryPhoneHref": "tel:+359898921010",
  "marketplacePhoneLabel": "0898 921 010",
  "marketplacePhoneHref": "tel:+359898921010",
  "emailLabel": "Онлайн запитване",
  "emailHref": "https://outletcarsvarna.mobile.bg/contacts",
  "viberHref": "",
  "facebookHref": "",
  "instagramHref": "",
  "tiktokHref": "",
  "reviewsHref": "",
  "youtubeHref": "",
  "addressLabel": "бул. Янош Хуняди 518, срещу КАТ Варна, Варна, България",
  "appointmentNote": "Пон.–пет. 08:30–17:30; съб.–нед. почивни дни",
  "mapEmbedUrl": "https://maps.google.com/maps?q=OUTLETCARS.BG%20%E2%80%94%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%B1%D1%83%D0%BB.%20%D0%AF%D0%BD%D0%BE%D1%88%20%D0%A5%D1%83%D0%BD%D1%8F%D0%B4%D0%B8%20518%2C%20%D1%81%D1%80%D0%B5%D1%89%D1%83%20%D0%9A%D0%90%D0%A2%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F&z=16&output=embed"
} as const;

export const daynightBrand = {
  "name": "OUTLETCARS.BG — Варна",
  "displayName": "OUTLETCARS.BG — ВАРНА",
  "bulgarianName": "OUTLETCARS.BG — Варна",
  "domain": "outletcarsvarna.mobile.bg",
  "tagline": "OUTLETCARS.BG — Варна · Варна",
  "legalNote": "Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата. Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация."
} as const;

export const daynightAssets = {
	logoDark: "/dealer/logo-on-dark-v2.svg",
	logoLight: "/dealer/logo-on-dark-v2.svg",
	hero: '/assets/daynight/hero/home-05-showroom-exterior.webp',
	homeHeroSlides: [],
	footerImage: '/assets/daynight/footer-premium-request-v2.webp'
} as const;

export const daynightConsultants = [
  {
    "slug": "outletcars-varna-sales",
    "name": "Продажби и огледи",
    "title": "Запитвания към OUTLETCARS.BG — Варна",
    "image": "/brand/daynight-team-placeholder.svg"
  },
  {
    "slug": "outletcars-varna-import",
    "name": "Внос и подбор",
    "title": "Запитвания за внос и наличности",
    "image": "/brand/daynight-team-placeholder.svg"
  },
  {
    "slug": "outletcars-varna-documents",
    "name": "Документи и предаване",
    "title": "Следващи стъпки по сделката",
    "image": "/brand/daynight-team-placeholder.svg"
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

export const getUniqueValues = <Key extends keyof DayNightVehicle>(key: Key) =>
	Array.from(new Set(daynightVehicles.map((vehicle) => vehicle[key]).filter(Boolean))).sort(
		(a, b) => String(a).localeCompare(String(b), 'bg')
	);
