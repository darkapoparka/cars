import { and, desc, eq, inArray } from 'drizzle-orm';
import { daynightVehicles, type Car } from '$lib/data/daynight-vehicles';
import { getDefaultDealerSlug } from '$lib/server/app-config';
import { createDb, hasDatabaseUrl, type Db } from '$lib/server/db/client';
import { vehiclePhotos, vehicles } from '$lib/server/db/schema';
import { DAY_IMAGE_FALLBACK } from '$lib/utils/daynight-image-fallback';
import type { VehiclePhotoRow, VehicleRow } from '$lib/types/database';
import { getDealerBySlug } from './dealers';

function uniqueImages(images: string[]) {
	return [...new Set(images.map((image) => image.trim()).filter(Boolean))];
}

function formatMileage(value: number) {
	return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} км`;
}

function photosForVehicle(photos: VehiclePhotoRow[], vehicleId: string) {
	return photos
		.filter((photo) => photo.vehicle_id === vehicleId)
		.sort(
			(left, right) =>
				Number(right.is_cover) - Number(left.is_cover) || left.sort_order - right.sort_order
		)
		.map((photo) => photo.url);
}

export function mapPublishedVehicleToCar(vehicle: VehicleRow, photos: VehiclePhotoRow[] = []): Car {
	const gallery = uniqueImages([
		...photosForVehicle(photos, vehicle.id),
		vehicle.image,
		DAY_IMAGE_FALLBACK
	]);
	const image = gallery[0] || DAY_IMAGE_FALLBACK;
	const shortTitle = vehicle.short_title || `${vehicle.brand} ${vehicle.model}`.trim();

	return {
		slug: vehicle.slug,
		title: vehicle.title,
		shortTitle,
		brand: vehicle.brand,
		model: vehicle.model,
		year: vehicle.year,
		mileage: vehicle.mileage_text || formatMileage(vehicle.mileage_value),
		mileageValue: vehicle.mileage_value,
		fuel: vehicle.fuel,
		transmission: vehicle.transmission,
		body: vehicle.body,
		doors: vehicle.doors ?? 5,
		engine: vehicle.engine,
		power: vehicle.power,
		drive: vehicle.drive,
		color: vehicle.color,
		price: vehicle.price,
		priceEur: vehicle.price_eur,
		priceBgn: vehicle.price_bgn,
		monthly: vehicle.monthly,
		image,
		gallery,
		badges: vehicle.badges,
		conditionLine: vehicle.condition_line,
		description: vehicle.description,
		features: vehicle.features,
		highlights: vehicle.highlights,
		lot: vehicle.lot,
		sourceUrl: vehicle.source_url
	};
}

export async function getPublishedPublicInventory(
	options: {
		db?: Db;
		dealerSlug?: string;
		staticFallback?: Car[];
	} = {}
): Promise<Car[]> {
	// The branch demo never acquires a database from ambient environment values.
	if (!options.db) {
		return options.staticFallback ?? daynightVehicles;
	}

	const db = options.db ?? createDb();
	const dealer = await getDealerBySlug(db, options.dealerSlug ?? getDefaultDealerSlug());
	const vehicleRows = await db
		.select()
		.from(vehicles)
		.where(and(eq(vehicles.dealer_id, dealer.id), eq(vehicles.status, 'published')))
		.orderBy(desc(vehicles.published_at), desc(vehicles.updated_at));

	if (!vehicleRows.length) {
		return [];
	}

	const photos = await db
		.select()
		.from(vehiclePhotos)
		.where(
			and(
				eq(vehiclePhotos.dealer_id, dealer.id),
				inArray(
					vehiclePhotos.vehicle_id,
					vehicleRows.map((vehicle) => vehicle.id)
				)
			)
		)
		.orderBy(vehiclePhotos.sort_order);

	return vehicleRows.map((vehicle) => mapPublishedVehicleToCar(vehicle, photos));
}
