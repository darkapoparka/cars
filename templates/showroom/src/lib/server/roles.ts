import type { EliqautoRole } from '$lib/types/account';

export const eliqautoRoles = ['customer', 'agent', 'admin'] as const;

export type { EliqautoRole } from '$lib/types/account';

export const isEliqautoRole = (value: unknown): value is EliqautoRole =>
	typeof value === 'string' && eliqautoRoles.includes(value as EliqautoRole);

export const normalizeEliqautoRole = (value: unknown): EliqautoRole | undefined => {
	const normalized = typeof value === 'string' ? value.toLowerCase() : undefined;

	return isEliqautoRole(normalized) ? normalized : undefined;
};

export const defaultRoleForEliqautoRoute = (routePath = ''): EliqautoRole => {
	const normalized = routePath.replace(/^\/+|\/+$/g, '');

	if (normalized.startsWith('admin')) return 'admin';
	if (normalized.startsWith('agent')) return 'agent';

	return 'customer';
};

export const canRoleAccessEliqautoRoute = (role: EliqautoRole, routePath = '') => {
	const normalized = routePath.replace(/^\/+|\/+$/g, '');

	if (!normalized.startsWith('admin')) return true;
	if (role === 'admin') return true;

	return role === 'agent' && (normalized === 'admin/inquiries' || normalized === 'admin/messages');
};

export const eliqautoRoleLabel = (role: EliqautoRole) => {
	if (role === 'admin') return 'Admin';
	if (role === 'agent') return 'Agent';

	return 'Customer';
};
