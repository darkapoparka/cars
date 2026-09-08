import {
	getRelatedVehicles,
	vehicles,
	type Vehicle,
	type VehicleCondition
} from '$lib/data/vehicles';
import { listEliqautoInventoryListings } from './db';
import { publicListingStatuses } from './cms-workflow';

const fallbackImage = '/assets/images/card/card-1.jpg';

const conditionForListing = (status: string): VehicleCondition =>
	status === 'published' || status === 'reserved' ? 'Used' : 'Certified';

const priceNumber = (value: unknown, fallback = 0) => {
	if (typeof value === 'number' && Number.isFinite(value)) return value;

	const parsed = Number(String(value ?? '').replace(/[^\d.-]/g, ''));

	return Number.isFinite(parsed) ? parsed : fallback;
};

// Fixed BNB peg (1 EUR = 1.95583 BGN). Matches the static feed format "71 387.80 лв."
// (space-grouped thousands, dot decimal) so CMS listings render a real BGN price in the
// PDP "Price in BGN" slot instead of the literal placeholder phrase.
const BGN_PER_EUR = 1.95583;

const formatBgnFromEur = (eur: number) => {
	const [whole, fraction] = (eur * BGN_PER_EUR).toFixed(2).split('.');
	const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

	return `${grouped}.${fraction} лв.`;
};

const listingVehicleImageSet = (previewImage: string, galleryImages: string[]) =>
	Array.from(new Set([previewImage, ...galleryImages].filter(Boolean)));

export const vehicleFromCmsListing = (
	listing: ReturnType<typeof listEliqautoInventoryListings>[number]
): Vehicle => {
	const price = priceNumber(listing.price);
	// Listings can carry a non-numeric price (e.g. "По запитване" / price on request).
	// priceNumber() coerces those to 0; surface them as the BG on-request label instead of
	// a misleading "0 EUR" / "0 EUR/мес." across the card, PDP and BGN slot.
	const onRequest = price <= 0;
	const onRequestLabel = 'По запитване';
	const image = listing.previewImage || listing.galleryImages[0] || fallbackImage;
	const images = listingVehicleImageSet(image, listing.galleryImages);

	return {
		agentSlug: 'eliqauto-sales',
		bodyType: listing.bodyType,
		brand: listing.brand,
		condition: conditionForListing(listing.status),
		dealerSlug: 'eliqauto-sofia',
		description: listing.description,
		engine: listing.engine,
		exterior: listing.color,
		features: listing.features,
		fuel: listing.fuel,
		gallery: images.length ? images : [fallbackImage],
		image,
		images,
		interior: 'On request',
		isClientVehicle: false,
		location: listing.location,
		mileage: listing.mileage,
		model: listing.model,
		monthly: onRequest ? 0 : Math.round(price / 72),
		price,
		priceBgn: onRequest ? onRequestLabel : formatBgnFromEur(price),
		priceLabel: onRequest ? onRequestLabel : listing.priceLabel,
		rating: 4.9,
		slug: listing.slug,
		sourceUrl: listing.sourceUrl,
		stockNumber: listing.stockNumber,
		tag: 'Available',
		tagTone: 'lime',
		title: listing.title,
		transmission: listing.transmission,
		vin: listing.vin,
		year: listing.year
	};
};

export const listPublishedCmsVehicles = () =>
	listEliqautoInventoryListings()
		.filter((listing) => publicListingStatuses.has(listing.status))
		.map(vehicleFromCmsListing);

export const listPublicVehicles = () => [...vehicles, ...listPublishedCmsVehicles()];

export const getPublicVehicleBySlug = (slug: string) =>
	vehicles.find((vehicle) => vehicle.slug === slug) ??
	listPublishedCmsVehicles().find((vehicle) => vehicle.slug === slug);

export const getRelatedPublicVehicles = (vehicle: Vehicle, limit = 4) => {
	const source = listPublicVehicles();
	const staticRelated = vehicles.some((candidate) => candidate.slug === vehicle.slug)
		? getRelatedVehicles(vehicle, limit)
		: [];
	const closeMatches = source.filter(
		(candidate) =>
			candidate.slug !== vehicle.slug &&
			(candidate.brand === vehicle.brand || candidate.bodyType === vehicle.bodyType)
	);
	const fallback = source.filter(
		(candidate) =>
			candidate.slug !== vehicle.slug &&
			!closeMatches.some((match) => match.slug === candidate.slug)
	);

	return [...staticRelated, ...closeMatches, ...fallback]
		.filter(
			(candidate, index, all) => all.findIndex((match) => match.slug === candidate.slug) === index
		)
		.slice(0, limit);
};
