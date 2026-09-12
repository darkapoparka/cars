import type { Vehicle } from '$lib/data/vehicles';
import { defaultLocale, translateVehicleTerm } from '$lib/i18n/messages';
import { formatInventoryKm } from './inventory';

export type AuxeroFavoriteVehicleCard = {
	brand: string;
	fuel: string;
	highlightClass: string;
	image: string;
	imagesCount: number;
	mileageLabel: string;
	priceLabel: string;
	slug: string;
	tag: string;
	title: string;
	transmission: string;
	videoCount: number;
	year: number;
};

const favoriteHighlightClass = () => 'bg-primary-2';

export const favoriteCardsFromVehicles = (vehicles: Vehicle[]): AuxeroFavoriteVehicleCard[] =>
	vehicles.map((vehicle) => ({
		brand: vehicle.brand,
		fuel: translateVehicleTerm(defaultLocale, 'fuels', vehicle.fuel),
		highlightClass: favoriteHighlightClass(),
		image: vehicle.image,
		imagesCount: vehicle.images.length || 1,
		mileageLabel: formatInventoryKm(vehicle.mileage),
		priceLabel: vehicle.priceLabel,
		slug: vehicle.slug,
		tag: translateVehicleTerm(defaultLocale, 'statuses', vehicle.tag ?? 'Available'),
		title: vehicle.title,
		transmission: translateVehicleTerm(defaultLocale, 'transmissions', vehicle.transmission),
		videoCount: 0,
		year: vehicle.year
	}));
