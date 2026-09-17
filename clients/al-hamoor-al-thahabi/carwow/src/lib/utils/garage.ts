import type { Car } from '$lib/data/daynight-vehicles';

export const MAX_COMPARE_VEHICLES = 3;

/** Persist identifiers, never stale vehicle details or a snapshot of the seed catalogue. */
export function normalizeGarageSlugs(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return [
		...new Set(
			value.filter(
				(item): item is string =>
					typeof item === 'string' && /^[\p{L}\p{N}][\p{L}\p{N}_-]{0,159}$/u.test(item)
			)
		)
	];
}

export function resolveGarageVehicles(slugs: string[], catalogue: Car[]) {
	const bySlug = new Map(catalogue.map((vehicle) => [vehicle.slug, vehicle]));
	const available: Car[] = [];
	const unavailable: string[] = [];
	for (const slug of slugs) {
		const vehicle = bySlug.get(slug);
		if (vehicle) available.push(vehicle);
		else unavailable.push(slug);
	}
	return { available, unavailable };
}
