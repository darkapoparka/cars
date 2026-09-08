import { and, desc, eq } from 'drizzle-orm';
import { daynightVehicles, type Car } from '$lib/data/daynight-vehicles';
import { getDefaultDealerSlug } from '$lib/server/app-config';
import { createDb, hasDatabaseUrl, type Db } from '$lib/server/db/client';
import { vehicles } from '$lib/server/db/schema';
import { getDealerBySlug } from '$lib/server/repositories/dealers';
import type { InventoryCountSummary } from '$lib/types/inventory';

const budgetTiers = [
	{ label: 'До 10 000 EUR', value: 'under-10000', limit: 10000 },
	{ label: 'До 20 000 EUR', value: 'under-20000', limit: 20000 },
	{ label: 'До 30 000 EUR', value: 'under-30000', limit: 30000 },
	{ label: 'До 50 000 EUR', value: 'under-50000', limit: 50000 },
	{ label: 'Над 50 000 EUR', value: 'over-50000', min: 50000 }
] as const;

type SummaryVehicle = Pick<Car, 'slug' | 'brand' | 'body' | 'price'>;

function counted<Key extends 'brand' | 'body'>(values: string[], key: Key) {
	const counts = new Map<string, number>();

	for (const value of values) {
		if (!value) continue;
		counts.set(value, (counts.get(value) ?? 0) + 1);
	}

	return [...counts.entries()]
		.map(([value, count]) => ({ [key]: value, count }) as Record<Key, string> & { count: number })
		.sort((left, right) => right.count - left.count || left[key].localeCompare(right[key], 'bg'));
}

export function buildInventoryCountSummary(
	publishedVehicles: SummaryVehicle[],
	source: InventoryCountSummary['source']
): InventoryCountSummary {
	return {
		total: publishedVehicles.length,
		activeSlugs: publishedVehicles.map((vehicle) => vehicle.slug),
		brandCounts: counted(
			publishedVehicles.map((vehicle) => vehicle.brand),
			'brand'
		),
		bodyCounts: counted(
			publishedVehicles.map((vehicle) => vehicle.body),
			'body'
		),
		budgetBuckets: budgetTiers.map((tier) => ({
			label: tier.label,
			value: tier.value,
			count: publishedVehicles.filter((vehicle) =>
				'limit' in tier
					? vehicle.price > 0 && vehicle.price <= tier.limit
					: vehicle.price > tier.min
			).length
		})),
		source
	};
}

export async function loadInventoryCountSummary({
	db,
	dealerSlug = getDefaultDealerSlug()
}: {
	db?: Db | null;
	dealerSlug?: string;
} = {}) {
	if (!db && !hasDatabaseUrl()) {
		return buildInventoryCountSummary(daynightVehicles, 'static-fallback');
	}

	const requestDb = db ?? createDb();
	const dealer = await getDealerBySlug(requestDb, dealerSlug);
	const publishedVehicles = await requestDb
		.select({
			slug: vehicles.slug,
			brand: vehicles.brand,
			body: vehicles.body,
			price: vehicles.price
		})
		.from(vehicles)
		.where(and(eq(vehicles.dealer_id, dealer.id), eq(vehicles.status, 'published')))
		.orderBy(desc(vehicles.published_at), desc(vehicles.updated_at));

	return buildInventoryCountSummary(publishedVehicles, 'database');
}
