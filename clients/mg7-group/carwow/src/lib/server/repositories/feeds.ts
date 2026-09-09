import { and, desc, eq, inArray } from 'drizzle-orm';
import { daynightVehicles, type Car } from '$lib/data/daynight-vehicles';
import { getDealerBySlug } from '$lib/server/repositories/dealers';
import type { Db } from '$lib/server/db/client';
import { vehiclePhotos, vehicles } from '$lib/server/db/schema';
import type { DealerRow, Json, VehiclePhotoRow, VehicleRow } from '$lib/types/database';

export type FeedVehicle = Pick<
	VehicleRow,
	| 'id'
	| 'slug'
	| 'title'
	| 'brand'
	| 'model'
	| 'year'
	| 'price'
	| 'mileage_value'
	| 'fuel'
	| 'transmission'
	| 'body'
	| 'color'
	| 'description'
	| 'image'
> & {
	photos: Array<Pick<VehiclePhotoRow, 'url'>>;
};

export type FeedExportKey = 'mobileBgXml' | 'carsBgCsv';

function isJsonRecord(value: Json | undefined): value is Record<string, Json | undefined> {
	return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function readBoolean(record: Record<string, Json | undefined>, key: string, fallback = false) {
	return typeof record[key] === 'boolean' ? record[key] : fallback;
}

export function isDealerFeedEnabled(settings: Json, exportKey: FeedExportKey) {
	const root = isJsonRecord(settings) ? settings : {};
	const feeds = isJsonRecord(root.feeds) ? root.feeds : {};
	const feedExports = isJsonRecord(root.feedExports) ? root.feedExports : {};

	return readBoolean(feeds, 'public', true) && readBoolean(feedExports, exportKey, true);
}

function carToStaticFeedVehicle(car: Car): FeedVehicle {
	const photos = [...new Set(car.gallery.length ? car.gallery : [car.image])]
		.filter(Boolean)
		.map((url) => ({ url }));

	return {
		id: car.slug,
		slug: car.slug,
		title: car.title,
		brand: car.brand,
		model: car.model,
		year: car.year,
		price: car.price,
		mileage_value: car.mileageValue,
		fuel: car.fuel,
		transmission: car.transmission,
		body: car.body,
		color: car.color,
		description: car.description,
		image: car.image,
		photos
	};
}

export function getStaticFeedVehicles() {
	return daynightVehicles.map(carToStaticFeedVehicle);
}

function escapeXml(value: string | number | null | undefined) {
	return String(value ?? '')
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

function csvCell(value: string | number | null | undefined) {
	const text = String(value ?? '');
	return `"${text.replaceAll('"', '""')}"`;
}

export async function getFeedDealerState(
	db: Db,
	dealerSlug: string,
	exportKey: FeedExportKey
): Promise<{ dealer: DealerRow; enabled: boolean }> {
	const dealer = await getDealerBySlug(db, dealerSlug);

	return {
		dealer,
		enabled: isDealerFeedEnabled(dealer.settings, exportKey)
	};
}

export async function getPublishedFeedVehiclesForDealer(
	db: Db,
	dealerId: string
): Promise<FeedVehicle[]> {
	const vehicleRows = await db
		.select()
		.from(vehicles)
		.where(and(eq(vehicles.dealer_id, dealerId), eq(vehicles.status, 'published')))
		.orderBy(desc(vehicles.updated_at));

	if (!vehicleRows.length) {
		return [];
	}

	const photos = await db
		.select()
		.from(vehiclePhotos)
		.where(
			inArray(
				vehiclePhotos.vehicle_id,
				vehicleRows.map((vehicle) => vehicle.id)
			)
		)
		.orderBy(vehiclePhotos.sort_order);

	const photosByVehicle = new Map<string, VehiclePhotoRow[]>();

	for (const photo of photos) {
		const list = photosByVehicle.get(photo.vehicle_id) ?? [];
		list.push(photo);
		photosByVehicle.set(photo.vehicle_id, list);
	}

	return vehicleRows.map((vehicle) => ({
		...vehicle,
		photos: photosByVehicle.get(vehicle.id) ?? []
	}));
}

export async function getPublishedFeedVehicles(db: Db, dealerSlug: string): Promise<FeedVehicle[]> {
	const dealer = await getDealerBySlug(db, dealerSlug);

	return getPublishedFeedVehiclesForDealer(db, dealer.id);
}

export function renderMobileBgXml(vehicles: FeedVehicle[]) {
	const items = vehicles
		.map(
			(vehicle) => `  <vehicle>
    <id>${escapeXml(vehicle.id)}</id>
    <slug>${escapeXml(vehicle.slug)}</slug>
    <title>${escapeXml(vehicle.title)}</title>
    <brand>${escapeXml(vehicle.brand)}</brand>
    <model>${escapeXml(vehicle.model)}</model>
    <year>${escapeXml(vehicle.year)}</year>
    <price currency="EUR">${escapeXml(vehicle.price)}</price>
    <mileage unit="km">${escapeXml(vehicle.mileage_value)}</mileage>
    <fuel>${escapeXml(vehicle.fuel)}</fuel>
    <transmission>${escapeXml(vehicle.transmission)}</transmission>
    <body>${escapeXml(vehicle.body)}</body>
    <color>${escapeXml(vehicle.color)}</color>
    <description>${escapeXml(vehicle.description)}</description>
    <photos>
${vehicle.photos.map((photo) => `      <photo>${escapeXml(photo.url)}</photo>`).join('\n')}
    </photos>
  </vehicle>`
		)
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<vehicles generated_at="${escapeXml(new Date().toISOString())}">
${items}
</vehicles>
`;
}

export function renderCarsBgCsv(vehicles: FeedVehicle[]) {
	const rows = [
		[
			'id',
			'slug',
			'title',
			'brand',
			'model',
			'year',
			'price_eur',
			'mileage_km',
			'fuel',
			'transmission',
			'body',
			'color',
			'cover_photo',
			'photo_urls'
		],
		...vehicles.map((vehicle) => [
			vehicle.id,
			vehicle.slug,
			vehicle.title,
			vehicle.brand,
			vehicle.model,
			vehicle.year,
			vehicle.price,
			vehicle.mileage_value,
			vehicle.fuel,
			vehicle.transmission,
			vehicle.body,
			vehicle.color,
			vehicle.image,
			vehicle.photos.map((photo) => photo.url).join('|')
		])
	];

	return `${rows.map((row) => row.map(csvCell).join(',')).join('\n')}\n`;
}
