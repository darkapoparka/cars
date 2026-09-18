import { placeholderImageSlugs } from '$lib/data/daynight-vehicles';
import type { InventoryListVehicle } from '$lib/types/inventory';
import type { CountOption, SortKey } from '$lib/types/mobile-inventory';

export function uniqueSorted(values: string[]) {
	const sorted = values.filter(Boolean).sort((left, right) => left.localeCompare(right, 'bg'));
	return sorted.filter((value, index) => index === 0 || value !== sorted[index - 1]);
}

export function countOptions(values: string[]): CountOption[] {
	const counts: Record<string, number> = Object.create(null);

	for (const value of values) {
		if (!value) continue;
		counts[value] = (counts[value] ?? 0) + 1;
	}

	return Object.entries(counts)
		.map(([value, count]) => ({ value, count }))
		.sort((left, right) => left.value.localeCompare(right.value, 'bg'));
}

export function normalize(value: unknown) {
	return String(value ?? '')
		.trim()
		.toLocaleLowerCase('bg-BG');
}

export function splitParam(value: string | null) {
	return (value ?? '')
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}

export function selectionSummary(values: string[], pluralLabel: string) {
	if (!values.length) return '';
	if (values.length === 1) return values[0];
	return values.length <= 4
		? `${values[0]} +${values.length - 1}`
		: `${values.length} ${pluralLabel}`;
}

export function toggleValue(values: string[], value: string) {
	return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function formatVehicleCount(count: number) {
	return count === 1 ? '1 автомобил' : `${count} автомобила`;
}

export function getImageHealthPriority(vehicle: InventoryListVehicle) {
	return placeholderImageSlugs.has(vehicle.slug) ? 1 : 0;
}

export function sortVehicles(vehicles: InventoryListVehicle[], sort: SortKey) {
	const next = [...vehicles];

	next.sort((left, right) => {
		const imageHealth = getImageHealthPriority(left) - getImageHealthPriority(right);

		if (imageHealth !== 0) return imageHealth;
		if (sort === 'price-desc') return right.price - left.price;
		if (sort === 'year-desc') return right.year - left.year;
		if (sort === 'mileage-asc') return left.mileageValue - right.mileageValue;

		return left.price - right.price;
	});

	return next;
}
