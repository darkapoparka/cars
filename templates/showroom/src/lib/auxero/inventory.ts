import type { Vehicle } from '$lib/data/vehicles';
import { localizeVehicleTermsInText, translateVehicleTerm, type Locale } from '$lib/i18n/messages';

export type AuxeroInventoryView = '3' | '4' | '5' | 'map';

export type AuxeroInventoryVehicleCard = {
	brand: string;
	delay: string;
	description: string;
	fuel: string;
	highlightClass: string;
	image: string;
	imagesCount: number;
	mileageLabel: string;
	monthlyLabel: string;
	priceEur: number;
	priceLabel: string;
	slug: string;
	tag: string;
	title: string;
	transmission: string;
	videoCount: number;
	year: number;
};

export const formatInventoryKm = (value: number) =>
	`${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} km`;

export const formatInventoryMonthly = (value: number, locale: Locale = 'en') =>
	value > 0
		? `${value.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} ${locale === 'bg' ? 'EUR/мес.' : 'EUR/mo'}`
		: '';

export const inventoryCardHighlightClass = () => 'bg-primary-2';

const cardTitleStopWords = [
	' LED ',
	' NAVI',
	' B&O',
	' B&W',
	' H&K',
	' 3XTV',
	' ПАНО',
	' BURM',
	' HUD',
	' ЛИЗИНГ'
];

const displayTitleReplacements: Array<[RegExp, string]> = [
	[/\bS LINE\b/g, 'S Line'],
	[/\bAMG LINE\b/g, 'AMG Line'],
	[/\bFACELIFT\b/g, 'Facelift'],
	[/\bLONG\b/g, 'Long'],
	[/\bXDRIVE\b/g, 'xDrive'],
	[/\b4MATIC\b/g, '4MATIC'],
	[/\b(\d{3}) I\b/g, '$1 i'],
	[/\b(\d{3}) D\b/g, '$1 d']
];

export const inventoryCardDisplayTitle = (title: string) => {
	const normalized = title.replace(/\s+/g, ' ').trim();
	const stopIndex = cardTitleStopWords
		.map((word) => normalized.toUpperCase().indexOf(word))
		.filter((index) => index > -1)
		.sort((a, b) => a - b)[0];
	const trimmed = (stopIndex ? normalized.slice(0, stopIndex) : normalized).trim();

	return displayTitleReplacements.reduce(
		(value, [pattern, replacement]) => value.replace(pattern, replacement),
		trimmed
	);
};

export const inventoryGridClassForView = (view: AuxeroInventoryView) => {
	if (view === '5') {
		return 'grid grid-cols-5 lg-grid-cols-3 md-grid-cols-2 sm-grid-cols-1 gap-20';
	}

	if (view === '4') {
		return 'grid grid-cols-4 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41';
	}

	if (view === 'map') {
		return 'grid grid-cols-1 gap-20';
	}

	return 'grid grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41';
};

// Mirror the PDP/mega-menu image override when a listing's remote primary photo
// is unreliable or off-model.
const inventoryCardImageOverrides: Record<string, string> = {
	'21778067767337633': '/assets/eliqauto/megamenu/inventory-audi-sq5-cutout.webp',
	'21778068579001193': '/assets/eliqauto/megamenu/inventory-bmw-x4m-cutout-v2.webp'
};

export const inventoryCardsFromVehicles = (
	vehicles: Vehicle[],
	locale: Locale = 'en'
): AuxeroInventoryVehicleCard[] =>
	vehicles.map((vehicle, index) => ({
		brand: vehicle.brand,
		delay: `0.${(index % 4) + 1}s`,
		description: localizeVehicleTermsInText(locale, vehicle.description),
		fuel: translateVehicleTerm(locale, 'fuels', vehicle.fuel),
		highlightClass: inventoryCardHighlightClass(),
		image: inventoryCardImageOverrides[vehicle.slug] ?? vehicle.image,
		imagesCount: vehicle.images.length || 1,
		mileageLabel: formatInventoryKm(vehicle.mileage),
		monthlyLabel: formatInventoryMonthly(vehicle.monthly, locale),
		priceEur: vehicle.price,
		priceLabel: vehicle.priceLabel,
		slug: vehicle.slug,
		tag: translateVehicleTerm(locale, 'statuses', vehicle.tag ?? 'Available'),
		title: inventoryCardDisplayTitle(vehicle.title),
		transmission: translateVehicleTerm(locale, 'transmissions', vehicle.transmission),
		videoCount: 0,
		year: vehicle.year
	}));
