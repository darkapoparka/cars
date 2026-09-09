import { currentDayNightListings, type CurrentDayNightListing } from './daynight-current-inventory';

export type Car = {
	slug: string;
	title: string;
	shortTitle: string;
	brand: string;
	model: string;
	year: number;
	mileage: string;
	mileageValue: number;
	fuel: string;
	transmission: string;
	body: string;
	doors: number | string;
	engine: string;
	power: string;
	drive: string;
	color: string;
	price: number;
	priceEur: string;
	priceBgn: string;
	monthly: string;
	image: string;
	gallery: string[];
	badges: string[];
	conditionLine: string;
	description: string;
	features: string[];
	highlights: string[];
	lot: string;
	sourceUrl: string;
};

const parseLocalizedNumber = (value: string) => {
	const match = value.match(/\d[\d\s]*(?:[.,]\d+)?/);
	return match ? Number(match[0].replace(/\s+/g, '').replace(',', '.')) : 0;
};

const normalizeFuel = (fuel: string) =>
	({
		Бензинов: 'Бензин',
		Дизелов: 'Дизел',
		Електрически: 'Електрически',
		Хибриден: 'Хибрид'
	})[fuel] ?? fuel;

const normalizeTransmission = (transmission: string) =>
	transmission === 'Автоматична' ? 'Автоматик' : transmission;

const normalizeBody = (body: string) =>
	({
		'Стреч лимузина': 'Седан',
		Лимузина: 'Седан'
	})[body] ?? body;

const getVehicleIdentity = (listing: CurrentDayNightListing) => ({ brand: listing.make, model: listing.model, shortTitle: listing.title });

const listingToVehicle = (listing: CurrentDayNightListing): Car => {
	const identity = getVehicleIdentity(listing);
	const year = Number(listing.date.match(/\b(?:19|20)\d{2}\b/)?.[0] ?? 0);
	const mileageValue = Math.round(parseLocalizedNumber(listing.mileage));
	const price = parseLocalizedNumber(listing.priceEur);
	const fuel = normalizeFuel(listing.fuel);
	const transmission = normalizeTransmission(listing.transmission);
	const body = normalizeBody(listing.body);
	const isIncoming = /очакван/i.test(listing.title);
	const availability = isIncoming ? 'Очакван внос' : 'По обява';
	const drive = listing.features.some((feature) => /4x4|xdrive|quattro|4matic/i.test(feature))
		? '4x4'
		: '—';
	const slugBase = identity.shortTitle
		.toLocaleLowerCase('en-US')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	const features = listing.features.length > 0 ? listing.features : ['Свържете се за оборудване'];
	const conditionLine = `${listing.status} към 09.09.2026 — потвърдете наличност и място за оглед. ${listing.taxNote}`;

	return {
		slug: `${slugBase}-${listing.id.slice(-6)}`,
		title: `${identity.shortTitle} ${year} г., ${fuel}, ${listing.mileage}, ${availability}`,
		shortTitle: identity.shortTitle,
		brand: identity.brand,
		model: identity.model,
		year,
		mileage: listing.mileage,
		mileageValue,
		fuel,
		transmission,
		body,
		doors: '—',
		engine: '—',
		power: listing.power,
		drive,
		color: listing.color,
		price,
		priceEur: listing.priceEur,
		priceBgn: listing.priceBgn,
		monthly: 'Условията се уточняват',
		image: listing.image,
		gallery: listing.gallery,
		badges: [
			availability,
			...(listing.status && listing.status !== availability ? [listing.status] : []),
			identity.model.includes('AMG') ? 'AMG' : listing.power
		],
		conditionLine,
		description: listing.description,
		features,
		highlights: [availability, listing.power, drive],
		lot: `AD-${listing.id.slice(-6)}`,
		sourceUrl: listing.sourceUrl
	};
};

export const cars = currentDayNightListings.map(listingToVehicle);
export const daynightVehicles = cars;

export type DayNightVehicle = Car;
export type DayNightVehicleCondition = 'new' | 'used';
export type DayNightVehicleAvailability = 'available' | 'incoming';

export const getDayNightVehicleCondition = (
	vehicle: Pick<Car, 'mileageValue'>
): DayNightVehicleCondition => (vehicle.mileageValue <= 100 ? 'new' : 'used');

export const getDayNightVehicleAvailability = (
	vehicle: Pick<Car, 'highlights'>
): DayNightVehicleAvailability =>
	vehicle.highlights.some((highlight) => /очакван внос/i.test(highlight))
		? 'incoming'
		: 'available';

export const getDayNightVehicleBySlug = (slug: string) =>
	daynightVehicles.find((car) => car.slug === slug);

export const placeholderImageSlugs = new Set<string>();

export const featuredDayNightVehicles = daynightVehicles.slice(0, 6);
