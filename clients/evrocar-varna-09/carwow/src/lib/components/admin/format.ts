import type { BadgeVariant } from '$lib/components/ui/badge/index.js';
import type { AdminVehicleRow } from '$lib/types/admin-forms';

export function formatDate(value: string | null | undefined) {
	if (!value) return 'Not set';

	return new Intl.DateTimeFormat('en-GB', {
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(new Date(value));
}

export function formatNumber(value: number | null | undefined) {
	return new Intl.NumberFormat('en-US').format(value ?? 0);
}

export function formatPrice(vehicle: Pick<AdminVehicleRow, 'price' | 'price_eur'>) {
	if (vehicle.price_eur) return vehicle.price_eur;
	if (vehicle.price) return `${formatNumber(vehicle.price)} EUR`;

	return 'No price';
}

export function formatStatus(value: string | null | undefined) {
	return value ? value.replace(/_/g, ' ') : 'open';
}

export function statusVariant(value: string | null | undefined): BadgeVariant {
	if (!value) return 'outline';
	if (['closed', 'lost', 'archived', 'cancelled', 'delivered', 'sold'].includes(value)) {
		return 'secondary';
	}
	if (['draft', 'pending', 'in_progress', 'new', 'sourcing', 'quoted'].includes(value)) {
		return 'outline';
	}

	return 'default';
}

export function formatVehicleMeta(vehicle: Pick<AdminVehicleRow, 'brand' | 'year'>) {
	return [vehicle.brand, vehicle.year].filter(Boolean).join(' / ');
}
