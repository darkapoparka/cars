import { vehicleUnits } from '$lib/i18n/vehicle-units';
import type { Vehicle } from '$lib/data/vehicles';
import { translateVehicleTerm, type Locale } from '$lib/i18n/messages';
import { inventoryText } from '$lib/content/inventory-localized';
import { formatNumber, formatMoney, listedPrice } from '$lib/i18n/formatting';

export type AuxeroInventoryView = '3' | '4' | '5' | 'map';

export type AuxeroInventoryVehicleCard = {
	mediaKind?: Vehicle['mediaKind'];
	brand: string;
	delay: string;
	description: string;
	fuel: string;
	highlightClass: string;
	image: string;
	imagesCount: number;
	mileageLabel: string;
	monthlyLabel: string;
	priceLabel: string;
	slug: string;
	tag: string;
	title: string;
	transmission: string;
	videoCount: number;
	year: number;
};

export const formatInventoryKm = (value: number, locale: Locale = 'en') =>
	`${formatNumber(value, locale)} ${vehicleUnits[locale].distance}`;

export const formatInventoryMonthly = (value: number, locale: Locale = 'en') =>
	`${formatMoney(value, locale)}${locale === 'bg' ? '/мес.' : '/mo'}`;

export const inventoryCardHighlightClass = () => 'bg-primary-2';

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
	'21778067767337633': '/assets/daynight/megamenu/inventory-audi-sq5-cutout.webp',
	'21778068579001193': '/assets/daynight/megamenu/inventory-bmw-x4m-cutout-v2.webp'
};

export const inventoryCardsFromVehicles = (
	vehicles: Vehicle[],
	locale: Locale = 'en'
): AuxeroInventoryVehicleCard[] =>
	vehicles.map((vehicle, index) => ({
		brand: vehicle.brand,
		delay: `0.${(index % 4) + 1}s`,
		description: inventoryText(locale, vehicle.description),
		fuel: translateVehicleTerm(locale, 'fuels', vehicle.fuel),
		highlightClass: inventoryCardHighlightClass(),
		image: inventoryCardImageOverrides[vehicle.slug] ?? vehicle.image,
		imagesCount: vehicle.images.length || 1,
		mileageLabel: formatInventoryKm(vehicle.mileage, locale),
		monthlyLabel: vehicle.monthly > 0 ? formatInventoryMonthly(vehicle.monthly, locale) : '',
		priceLabel: listedPrice(vehicle.price, locale),
		slug: vehicle.slug,
		mediaKind: vehicle.mediaKind,
		tag: translateVehicleTerm(locale, 'statuses', vehicle.tag ?? 'Available'),
		title: vehicle.title,
		transmission: translateVehicleTerm(locale, 'transmissions', vehicle.transmission),
		videoCount: 0,
		year: vehicle.year
	}));

export type VehicleCardSummary = Pick<
	AuxeroInventoryVehicleCard,
	| 'slug'
	| 'image'
	| 'title'
	| 'brand'
	| 'priceLabel'
	| 'monthlyLabel'
	| 'mileageLabel'
	| 'fuel'
	| 'transmission'
> & { year: string | number; tag?: string };
