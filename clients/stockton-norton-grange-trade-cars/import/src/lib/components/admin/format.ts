import type { BadgeVariant } from '$lib/components/ui/badge/index.js';

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

export function formatStatus(value: string | null | undefined) {
	if (!value) return 'open';

	return value.replace(/[-_]/g, ' ');
}

export function statusVariant(value: string | null | undefined): BadgeVariant {
	if (!value) return 'outline';
	if (['closed', 'lost', 'archived', 'cancelled', 'delivered', 'sold', 'paused'].includes(value)) {
		return 'secondary';
	}
	if (['draft', 'pending', 'in_progress', 'new', 'submitted', 'reviewing'].includes(value)) {
		return 'outline';
	}

	return 'default';
}

export function formatVehicleMeta(vehicle: {
	brand?: string;
	fuel?: string;
	mileage?: string;
	year?: number | string;
}) {
	return [vehicle.brand, vehicle.year, vehicle.fuel, vehicle.mileage].filter(Boolean).join(' / ');
}
