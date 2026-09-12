import { getDayNightVehicleCondition, type Car } from '$lib/data/daynight-vehicles';
import type { DayNightArticle } from '$lib/data/daynight-blog';
import { DAY_IMAGE_FALLBACK } from '$lib/utils/daynight-image-fallback';

export type SeedVehicleRow = {
	dealer_id: string;
	slug: string;
	title: string;
	short_title: string;
	brand: string;
	model: string;
	year: number;
	mileage_value: number;
	mileage_text: string;
	fuel: string;
	transmission: string;
	body: string;
	doors: number | null;
	engine: string;
	power: string;
	drive: string;
	color: string;
	price: number;
	price_eur: string;
	price_bgn: string;
	monthly: string;
	condition: 'new' | 'used';
	description: string;
	condition_line: string;
	lot: string;
	source_url: string;
	features: string[];
	highlights: string[];
	badges: string[];
	image: string;
	status: 'published';
	published_at: string;
	sold_at: null;
};

export type SeedVehiclePhotoRow = {
	dealer_id: string;
	vehicle_id: string;
	url: string;
	storage_path: null;
	alt: string;
	sort_order: number;
	is_cover: boolean;
};

export type SeedPostRow = {
	dealer_id: string;
	slug: string;
	type: 'news' | 'blog';
	title: string;
	excerpt: string;
	body: string;
	cover_url: string | null;
	category: string | null;
	tags: string[];
	author: string;
	read_minutes: number;
	published_at: string;
	status: 'published';
};

function compact(value: string | null | undefined) {
	return (value ?? '').trim();
}

function uniqueStrings(values: Array<string | null | undefined>) {
	const seen = new Set<string>();
	const result: string[] = [];

	for (const value of values) {
		const normalized = compact(value);
		if (!normalized || seen.has(normalized)) continue;

		seen.add(normalized);
		result.push(normalized);
	}

	return result;
}

export function uniqueSeedImages(vehicle: Pick<Car, 'image' | 'gallery'>) {
	const cover = compact(vehicle.image) || compact(vehicle.gallery[0]) || DAY_IMAGE_FALLBACK;
	return uniqueStrings([cover, ...vehicle.gallery]);
}

export function vehicleSeedRow(
	dealerId: string,
	vehicle: Car,
	publishedAt = new Date().toISOString()
): SeedVehicleRow {
	const images = uniqueSeedImages(vehicle);

	return {
		dealer_id: dealerId,
		slug: vehicle.slug,
		title: vehicle.title,
		short_title: vehicle.shortTitle,
		brand: vehicle.brand,
		model: vehicle.model,
		year: vehicle.year,
		mileage_value: vehicle.mileageValue,
		mileage_text: vehicle.mileage,
		fuel: vehicle.fuel,
		transmission: vehicle.transmission,
		body: vehicle.body,
		doors: Number.isInteger(vehicle.doors) ? vehicle.doors : null,
		engine: vehicle.engine,
		power: vehicle.power,
		drive: vehicle.drive,
		color: vehicle.color,
		price: vehicle.price,
		price_eur: vehicle.priceEur,
		price_bgn: vehicle.priceBgn,
		monthly: vehicle.monthly,
		condition: getDayNightVehicleCondition(vehicle),
		description: vehicle.description,
		condition_line: vehicle.conditionLine,
		lot: vehicle.lot,
		source_url: vehicle.sourceUrl,
		features: [...vehicle.features],
		highlights: [...vehicle.highlights],
		badges: [...vehicle.badges],
		image: images[0] ?? DAY_IMAGE_FALLBACK,
		status: 'published',
		published_at: publishedAt,
		sold_at: null
	};
}

export function vehiclePhotoSeedRows(
	dealerId: string,
	vehicleId: string,
	vehicle: Car
): SeedVehiclePhotoRow[] {
	return uniqueSeedImages(vehicle).map((url, index) => ({
		dealer_id: dealerId,
		vehicle_id: vehicleId,
		url,
		storage_path: null,
		alt: `${vehicle.shortTitle || vehicle.title} photo ${index + 1}`,
		sort_order: index,
		is_cover: index === 0
	}));
}

export function articleDateToPublishedAt(date: string) {
	const normalized = compact(date);
	if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
		return `${normalized}T09:00:00.000Z`;
	}

	const timestamp = Date.parse(normalized);
	if (Number.isNaN(timestamp)) {
		throw new Error(`Invalid article date "${date}".`);
	}

	return new Date(timestamp).toISOString();
}

function articleBody(article: DayNightArticle) {
	return uniqueStrings(article.body).join('\n\n');
}

export function postSeedRow(dealerId: string, article: DayNightArticle): SeedPostRow {
	return {
		dealer_id: dealerId,
		slug: article.slug,
		type: article.kind === 'news' ? 'news' : 'blog',
		title: article.title,
		excerpt: article.description,
		body: articleBody(article),
		cover_url: compact(article.image) || null,
		category: article.category,
		tags: [...article.tags],
		author: compact(article.author) || 'G Auto',
		read_minutes: Math.max(1, Math.trunc(article.readMinutes || 1)),
		published_at: articleDateToPublishedAt(article.date),
		status: 'published'
	};
}
