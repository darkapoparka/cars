import type { DayNightRole } from '$lib/types/account';

export const daynightRoles = ['customer', 'agent', 'admin'] as const;

export type { DayNightRole } from '$lib/types/account';

export const isDayNightRole = (value: unknown): value is DayNightRole =>
	typeof value === 'string' && daynightRoles.includes(value as DayNightRole);

export const normalizeDayNightRole = (value: unknown): DayNightRole | undefined => {
	const normalized = typeof value === 'string' ? value.toLowerCase() : undefined;

	return isDayNightRole(normalized) ? normalized : undefined;
};

export const defaultRoleForDayNightRoute = (routePath = ''): DayNightRole => {
	const normalized = routePath.replace(/^\/+|\/+$/g, '');

	if (normalized.startsWith('admin')) return 'admin';
	if (normalized.startsWith('agent')) return 'agent';

	return 'customer';
};

export const canRoleAccessDayNightRoute = (role: DayNightRole, routePath = '') => {
	const normalized = routePath.replace(/^\/+|\/+$/g, '');

	if (!normalized.startsWith('admin')) return true;
	if (role === 'admin') return true;

	return role === 'agent' && (normalized === 'admin/inquiries' || normalized === 'admin/messages');
};

export const daynightRoleLabel = (role: DayNightRole) => {
	if (role === 'admin') return 'Admin';
	if (role === 'agent') return 'Agent';

	return 'Customer';
};
