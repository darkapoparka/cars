import type { DayNightInventoryListingStatus } from '$lib/types/account';

export type CmsListingStatus = DayNightInventoryListingStatus;

export type CmsCompletenessLevel = 'blocked' | 'complete' | 'needs_work' | 'ready';

export type CmsCompleteness = {
	level: CmsCompletenessLevel;
	missing: string[];
	score: number;
	warnings: string[];
};

export type CmsCompletenessInput = {
	bodyType?: string;
	brand?: string;
	color?: string;
	description?: string;
	documents?: unknown[];
	engine?: string;
	features?: string[];
	fuel?: string;
	galleryImages?: string[];
	location?: string;
	mileage?: number | string;
	model?: string;
	previewImage?: string;
	price?: number | string;
	priceLabel?: string;
	sourceUrl?: string;
	status?: string;
	stockNumber?: string;
	title?: string;
	transmission?: string;
	vin?: string;
	year?: number | string;
};

export const cmsListingStatusOptions: Array<{
	description: string;
	label: string;
	value: CmsListingStatus;
}> = [
	{
		description: 'Record exists but is not ready for public display.',
		label: 'Draft',
		value: 'draft'
	},
	{ description: 'Vehicle is being inspected or entered.', label: 'Intake', value: 'intake' },
	{ description: 'Specs and media are nearly ready.', label: 'Media ready', value: 'media_ready' },
	{ description: 'Visible on public inventory.', label: 'Published', value: 'published' },
	{ description: 'Vehicle has an active reservation.', label: 'Reserved', value: 'reserved' },
	{ description: 'Vehicle is sold and retained for reporting.', label: 'Sold', value: 'sold' },
	{
		description: 'Hidden from normal admin and public inventory.',
		label: 'Archived',
		value: 'archived'
	}
];

const statusValues = new Set(cmsListingStatusOptions.map((status) => status.value));
export const publicListingStatuses = new Set<CmsListingStatus>(['published', 'reserved']);

const emptyMarkers = new Set(['', 'on request', 'draft', 'daynight', 'daynight inventory draft']);

export const normalizeCmsListingStatus = (
	value: string | null | undefined,
	fallback: CmsListingStatus = 'draft'
): CmsListingStatus => {
	const normalized = value
		?.trim()
		.toLowerCase()
		.replace(/[-\s]+/g, '_');

	return normalized && statusValues.has(normalized as CmsListingStatus)
		? (normalized as CmsListingStatus)
		: fallback;
};

export const cmsListingStatusLabel = (value: string | null | undefined) =>
	cmsListingStatusOptions.find((status) => status.value === normalizeCmsListingStatus(value))
		?.label ?? 'Draft';

const meaningful = (value: number | string | null | undefined) => {
	if (typeof value === 'number') return value > 0;

	const normalized = value?.trim().toLowerCase() ?? '';

	return !emptyMarkers.has(normalized);
};

const hasRealPreviewImage = (value: string | undefined) =>
	meaningful(value) && !value?.includes('/assets/images/card/card-1.jpg');

const addMissing = ({
	condition,
	missing,
	name,
	points
}: {
	condition: boolean;
	missing: string[];
	name: string;
	points: number;
}) => {
	if (condition) return points;

	missing.push(name);
	return 0;
};

export const scoreInventoryCompleteness = (listing: CmsCompletenessInput): CmsCompleteness => {
	const missing: string[] = [];
	const warnings: string[] = [];
	let score = 0;

	score += addMissing({ condition: meaningful(listing.title), missing, name: 'title', points: 8 });
	score += addMissing({ condition: meaningful(listing.brand), missing, name: 'brand', points: 6 });
	score += addMissing({ condition: meaningful(listing.model), missing, name: 'model', points: 6 });
	score += addMissing({ condition: meaningful(listing.year), missing, name: 'year', points: 5 });
	score += addMissing({
		condition: meaningful(listing.vin) || meaningful(listing.stockNumber),
		missing,
		name: 'VIN or stock number',
		points: 8
	});
	score += addMissing({
		condition: meaningful(listing.bodyType),
		missing,
		name: 'body type',
		points: 5
	});
	score += addMissing({ condition: meaningful(listing.fuel), missing, name: 'fuel', points: 5 });
	score += addMissing({
		condition: meaningful(listing.transmission),
		missing,
		name: 'transmission',
		points: 7
	});
	score += addMissing({
		condition: meaningful(listing.mileage),
		missing,
		name: 'mileage',
		points: 5
	});
	score += addMissing({
		condition: meaningful(listing.engine),
		missing,
		name: 'engine',
		points: 5
	});
	score += addMissing({ condition: meaningful(listing.color), missing, name: 'color', points: 4 });
	score += addMissing({
		condition: meaningful(listing.priceLabel) || meaningful(listing.price),
		missing,
		name: 'price',
		points: 7
	});
	score += addMissing({
		condition: meaningful(listing.location),
		missing,
		name: 'location',
		points: 4
	});
	score += addMissing({
		condition:
			meaningful(listing.description) &&
			!listing.description?.includes('queued in the Promosale Varna CMS'),
		missing,
		name: 'description',
		points: 8
	});
	score += addMissing({
		condition: (listing.features?.filter(Boolean).length ?? 0) >= 3,
		missing,
		name: 'at least 3 features',
		points: 7
	});
	score += addMissing({
		condition: hasRealPreviewImage(listing.previewImage),
		missing,
		name: 'preview image',
		points: 6
	});
	score += addMissing({
		condition: (listing.galleryImages?.filter(Boolean).length ?? 0) >= 3,
		missing,
		name: 'at least 3 gallery images',
		points: 6
	});
	score += meaningful(listing.sourceUrl) ? 2 : 0;
	score += (listing.documents?.length ?? 0) > 0 ? 1 : 0;

	if (!meaningful(listing.sourceUrl)) warnings.push('source URL');
	if ((listing.documents?.length ?? 0) === 0) warnings.push('documents');

	const clampedScore = Math.min(100, score);
	const level: CmsCompletenessLevel =
		missing.length === 0
			? 'complete'
			: clampedScore >= 85
				? 'ready'
				: clampedScore >= 55
					? 'needs_work'
					: 'blocked';

	return {
		level,
		missing,
		score: clampedScore,
		warnings
	};
};

export const canPublishListing = (listing: CmsCompletenessInput) =>
	scoreInventoryCompleteness(listing).score >= 85;
