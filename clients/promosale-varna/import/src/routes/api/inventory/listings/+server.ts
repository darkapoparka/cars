import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import { requireDayNightApiAccess } from '$lib/server/api-auth';
import {
	archiveInventoryListing,
	createInventoryListing,
	listInventoryForAdmin,
	updateInventoryListing
} from '$lib/server/inventory';
import type { DayNightInventoryListingStatus } from '$lib/server/db';
import type { DayNightCmsDocument } from '$lib/types/account';

export function GET({ request, url }: { request: Request; url: URL }) {
	const access = requireDayNightApiAccess({
		allowedRoles: ['admin'],
		fallbackRole: url.searchParams.get('role') ?? undefined,
		request,
		routePath: 'admin/inventory'
	});

	if (access.response) return access.response;

	const listings = listInventoryForAdmin();

	return okJson({
		listings,
		vehicles: listings.filter((listing) => listing.source === 'static-vehicle')
	});
}

const inventoryStatus = (
	value: string | undefined
): DayNightInventoryListingStatus | undefined => {
	if (value === 'draft' || value === 'published' || value === 'archived') return value;

	return undefined;
};

const payloadNumber = (payload: Record<string, unknown>, ...keys: string[]) => {
	const value = keys.map((key) => payload[key]).find((item) => item !== undefined);
	const parsed =
		typeof value === 'number' ? value : Number(String(value ?? '').replace(/[^\d.-]/g, ''));

	return Number.isFinite(parsed) ? parsed : undefined;
};

const payloadList = (payload: Record<string, unknown>, key: string) => {
	const value = payload[key];

	if (Array.isArray(value)) {
		return value.map((item) => String(item).trim()).filter(Boolean);
	}

	if (typeof value === 'string') {
		return value
			.split(/\r?\n|,/)
			.map((item) => item.trim())
			.filter(Boolean);
	}

	return undefined;
};

const payloadDocuments = (payload: Record<string, unknown>) => {
	const value = payload.documents;

	if (!Array.isArray(value)) return undefined;

	return value
		.map((document) => {
			if (!document || typeof document !== 'object') return undefined;

			const candidate = document as Partial<DayNightCmsDocument>;
			const url = typeof candidate.url === 'string' ? candidate.url.trim() : '';
			const originalName =
				typeof candidate.originalName === 'string' ? candidate.originalName.trim() : '';

			if (!url || !originalName) return undefined;

			return {
				filename:
					typeof candidate.filename === 'string' && candidate.filename.trim()
						? candidate.filename.trim()
						: originalName,
				id:
					typeof candidate.id === 'string' && candidate.id.trim()
						? candidate.id.trim()
						: `${Date.now().toString(36)}-${originalName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
				mimeType:
					typeof candidate.mimeType === 'string' && candidate.mimeType.trim()
						? candidate.mimeType.trim()
						: 'application/octet-stream',
				originalName,
				size:
					typeof candidate.size === 'number' && Number.isFinite(candidate.size)
						? candidate.size
						: 0,
				uploadedAt:
					typeof candidate.uploadedAt === 'string' && candidate.uploadedAt.trim()
						? candidate.uploadedAt.trim()
						: new Date().toISOString(),
				url
			};
		})
		.filter((document): document is DayNightCmsDocument => Boolean(document));
};

const listingPayload = (payload: Record<string, unknown>) => ({
	bodyType: payloadString(payload, 'bodyType', 'type', 'Type'),
	brand: payloadString(payload, 'brand', 'Brand'),
	color: payloadString(payload, 'color', 'Color'),
	description: payloadString(payload, 'description', 'Doorstextarea', 'message'),
	documents: payloadDocuments(payload),
	doors: payloadNumber(payload, 'doors', 'Doors'),
	engine: payloadString(payload, 'engine', 'Enterengine'),
	features: payloadList(payload, 'features'),
	fuel: payloadString(payload, 'fuel', 'FuelType'),
	galleryImages: payloadList(payload, 'galleryImages'),
	location: payloadString(payload, 'location', 'SelectLocation', 'ListingAddress'),
	mileage: payloadString(payload, 'mileage'),
	model: payloadString(payload, 'model', 'Model'),
	previewImage: payloadString(payload, 'previewImage'),
	price: payloadNumber(payload, 'price', 'PriceListing', 'PriceListing2'),
	priceLabel: payloadString(
		payload,
		'priceLabel',
		'price',
		'expectedPrice',
		'PriceListing',
		'Enternumber'
	),
	routePath: payloadString(payload, 'routePath'),
	seats: payloadNumber(payload, 'seats', 'Seats'),
	slug: payloadString(payload, 'slug'),
	sourceUrl: payloadString(payload, 'sourceUrl', 'Yoururl'),
	status: inventoryStatus(payloadString(payload, 'status')),
	stockNumber: payloadString(payload, 'stockNumber', 'Enternumber'),
	title: payloadString(payload, 'title', 'vehicleTitle'),
	transmission: payloadString(payload, 'transmission', 'Transmission'),
	vin: payloadString(payload, 'vin', 'VIN', 'EnterVIN'),
	year: payloadNumber(payload, 'year', 'Years')
});

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const access = requireDayNightApiAccess({
		allowedRoles: ['admin'],
		fallbackRole: payloadString(payload, 'actorRole', 'role'),
		request,
		routePath: 'admin/inventory'
	});

	if (access.response) return access.response;

	const values = listingPayload(payload);

	if (!values.title) {
		return errorJson('Listing title is required', 400);
	}

	const listing = createInventoryListing({
		...values,
		status: values.status ?? 'draft'
	});

	return okJson({ listing }, { status: 201 });
}

export async function PATCH({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const access = requireDayNightApiAccess({
		allowedRoles: ['admin'],
		fallbackRole: payloadString(payload, 'actorRole', 'role'),
		request,
		routePath: 'admin/inventory'
	});

	if (access.response) return access.response;

	const id = payloadString(payload, 'id', 'listingId', 'slug');

	if (!id) {
		return errorJson('Listing id is required', 400);
	}

	const listing = updateInventoryListing(id, listingPayload(payload));

	if (!listing) {
		return errorJson('Promosale Varna inventory listing not found', 404);
	}

	return okJson({ listing });
}

export async function DELETE({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const access = requireDayNightApiAccess({
		allowedRoles: ['admin'],
		fallbackRole: payloadString(payload, 'actorRole', 'role'),
		request,
		routePath: 'admin/inventory'
	});

	if (access.response) return access.response;

	const id = payloadString(payload, 'id', 'listingId', 'slug');

	if (!id) {
		return errorJson('Listing id is required', 400);
	}

	const listing = archiveInventoryListing(id);

	if (!listing) {
		return errorJson('Promosale Varna inventory listing not found', 404);
	}

	return okJson({ listing });
}
