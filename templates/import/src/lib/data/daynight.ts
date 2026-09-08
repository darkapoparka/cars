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
	primaryPhoneLabel: '0877 733 110',
	primaryPhoneHref: 'tel:0877733110',
	marketplacePhoneLabel: '0877 733 110',
	marketplacePhoneHref: 'tel:0877733110',
	emailLabel: 'Онлайн запитване',
	emailHref: 'https://daynight.mobile.bg/contacts',
	viberHref: 'viber://chat?number=%2B359877733110',
	facebookHref: 'https://www.facebook.com/deninoshtautogroup/?locale=bg_BG',
	instagramHref: 'https://www.instagram.com/kristiankirilov13/',
	tiktokHref: 'https://www.tiktok.com/@kristiankirilov13',
	reviewsHref: 'https://www.facebook.com/deninoshtautogroup/?locale=bg_BG',
	youtubeHref: '',
	addressLabel: 'гр. София, Студентски град, ул. Атанас Манчев 18',
	appointmentNote: 'Огледи с предварителна уговорка',
	mapEmbedUrl:
		'https://maps.google.com/maps?q=%D0%B3%D1%80.%20%D0%A1%D0%BE%D1%84%D0%B8%D1%8F%2C%20%D0%A1%D1%82%D1%83%D0%B4%D0%B5%D0%BD%D1%82%D1%81%D0%BA%D0%B8%20%D0%B3%D1%80%D0%B0%D0%B4%2C%20%D1%83%D0%BB.%20%D0%90%D1%82%D0%B0%D0%BD%D0%B0%D1%81%20%D0%9C%D0%B0%D0%BD%D1%87%D0%B5%D0%B2%2018&t=&z=13&ie=UTF8&iwloc=&output=embed'
} as const;

export const daynightBrand = {
	name: 'Day Night Auto Group',
	displayName: 'DAY NIGHT AUTO GROUP',
	bulgarianName: 'Ден и Нощ Ауто Груп',
	domain: 'day-night-auto-group.demo',
	tagline: 'Премиум автомобили в София с подреден процес за оглед и запитване',
	legalNote:
		'Proposal build reflects public contact channels for Day Night Auto Group; verify final assets and inventory before outreach.'
} as const;

export const daynightAssets = {
	logoDark: '/assets/daynight/brand/daynight-logo-generated.png',
	logoLight: '/assets/daynight/brand/daynight-logo-generated.png',
	hero: '/assets/daynight/hero/home-05-showroom-exterior.webp',
	homeHeroSlides: [],
	footerImage: '/assets/daynight/footer-premium-request-v2.webp'
} as const;

export const daynightConsultants = [
	{
		slug: 'day-night-auto-group-sales',
		name: 'Продажби и огледи',
		title: 'Налични автомобили и клиентски запитвания - Day Night Auto',
		image: '/assets/daynight/team/avatar-sales.jpg'
	},
	{
		slug: 'day-night-auto-group-documents',
		name: 'Документи и съдействие',
		title: 'Регистрация, финансиране и предаване',
		image: '/assets/daynight/team/avatar-logistics.jpg'
	},
	{
		slug: 'day-night-auto-group-inspection',
		name: 'Проверка и оглед',
		title: 'Оглед, история и състояние на автомобила',
		image: '/assets/daynight/team/avatar-inspection.jpg'
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
