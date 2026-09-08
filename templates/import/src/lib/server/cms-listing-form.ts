import type { AdminInventoryRow } from './admin-cms';
import { saveCmsUploadFiles } from './cms-persistence';
import { normalizeCmsListingStatus } from './cms-workflow';
import type { InventoryListingInput } from './inventory';

const stringValue = (formData: FormData, ...keys: string[]) => {
	for (const key of keys) {
		const value = formData.get(key);

		if (typeof value === 'string' && value.trim()) return value.trim();
	}

	return undefined;
};

export const inventoryStatusFromValue = (value: string | undefined) => {
	if (!value) return undefined;

	return normalizeCmsListingStatus(value);
};

const featureValues = (formData: FormData) => {
	const features = formData
		.getAll('features')
		.filter((value): value is string => typeof value === 'string' && Boolean(value.trim()))
		.map((value) => value.trim());
	const text = stringValue(formData, 'featureText', 'featuresText');

	if (!text) return features;

	return [
		...features,
		...text
			.split(/\r?\n|,/)
			.map((item) => item.trim())
			.filter(Boolean)
	];
};

export const readInventoryListingFields = (formData: FormData): InventoryListingInput => {
	const title = stringValue(formData, 'title', 'vehicleTitle', 'VehicleTitle') ?? '';

	return {
		bodyType: stringValue(formData, 'bodyType', 'type', 'Type'),
		brand: stringValue(formData, 'brand', 'Brand') || title.split(/\s+/)[0],
		color: stringValue(formData, 'color', 'Color'),
		description: stringValue(formData, 'description', 'Doorstextarea', 'message'),
		doors: stringValue(formData, 'doors', 'Doors'),
		engine: stringValue(formData, 'engine', 'Enterengine'),
		features: featureValues(formData),
		fuel: stringValue(formData, 'fuel', 'FuelType'),
		location: stringValue(formData, 'location', 'SelectLocation', 'ListingAddress'),
		mileage: stringValue(formData, 'mileage', 'Mileage'),
		model: stringValue(formData, 'model', 'Model'),
		price: stringValue(formData, 'price', 'PriceListing2'),
		priceLabel: stringValue(formData, 'priceLabel', 'expectedPrice', 'PriceListing', 'Enternumber'),
		routePath: stringValue(formData, 'routePath'),
		seats: stringValue(formData, 'seats', 'Seats'),
		slug: stringValue(formData, 'slug'),
		sourceUrl: stringValue(formData, 'sourceUrl', 'Yoururl'),
		status: inventoryStatusFromValue(stringValue(formData, 'status', 'listingStatus')),
		// NOTE: do NOT fall back to 'Enternumber' here — that key carries the price label
		// (see account-listing-form-state.ts), so reading it corrupts stockNumber (and the
		// VIN derived from it in db.ts). The form has no dedicated stock-number input today.
		stockNumber: stringValue(formData, 'stockNumber'),
		title,
		transmission: stringValue(formData, 'transmission', 'Transmission'),
		vin: stringValue(formData, 'vin', 'VIN', 'EnterVIN'),
		year: stringValue(formData, 'year', 'Years')
	};
};

export const mergeListingUploads = async ({
	existing,
	formData,
	recordId
}: {
	existing?: AdminInventoryRow | InventoryListingInput | null;
	formData: FormData;
	recordId: string;
}): Promise<Pick<InventoryListingInput, 'documents' | 'galleryImages' | 'previewImage'>> => {
	const uploads = await saveCmsUploadFiles({ formData, recordId });
	const removedGalleryImages = new Set(
		formData
			.getAll('removeGalleryImages')
			.filter((value): value is string => typeof value === 'string' && Boolean(value.trim()))
	);
	const removedDocumentIds = new Set(
		formData
			.getAll('removeDocumentIds')
			.filter((value): value is string => typeof value === 'string' && Boolean(value.trim()))
	);
	const selectedPreviewImage = stringValue(formData, 'selectedPreviewImage');
	const galleryImages = [
		...(existing?.galleryImages ?? []).filter((image) => !removedGalleryImages.has(image)),
		...uploads.galleryImages
	];
	const documents = [
		...(existing?.documents ?? []).filter((document) => !removedDocumentIds.has(document.id)),
		...uploads.documents
	];
	const previewImage =
		uploads.previewImage ??
		(selectedPreviewImage && !removedGalleryImages.has(selectedPreviewImage)
			? selectedPreviewImage
			: existing?.previewImage);

	return {
		documents,
		galleryImages,
		previewImage
	};
};
