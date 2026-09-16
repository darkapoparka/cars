export type ProfileRole =
	| 'owner'
	| 'admin'
	| 'manager'
	| 'editor'
	| 'sales'
	| 'viewer'
	| 'agency_admin';

export type AdminCapability = 'settings' | 'staff' | 'inventory' | 'content' | 'sales';

const staffRoles = new Set<ProfileRole>([
	'owner',
	'admin',
	'manager',
	'editor',
	'sales',
	'viewer',
	'agency_admin'
]);

const managerRoles = new Set<ProfileRole>([
	'owner',
	'admin',
	'manager',
	'editor',
	'sales',
	'agency_admin'
]);

const capabilityRoles: Record<AdminCapability, Set<ProfileRole>> = {
	settings: new Set(['owner', 'agency_admin']),
	staff: new Set(['owner', 'agency_admin']),
	inventory: new Set(['owner', 'admin', 'manager', 'editor', 'agency_admin']),
	content: new Set(['owner', 'admin', 'manager', 'editor', 'agency_admin']),
	sales: new Set(['owner', 'admin', 'manager', 'sales', 'agency_admin'])
};

export function isStaffRole(role: string | null | undefined): role is ProfileRole {
	return staffRoles.has(role as ProfileRole);
}

export function canManageDealer(role: ProfileRole) {
	return managerRoles.has(role);
}

export function hasAdminCapability(role: ProfileRole, capability: AdminCapability) {
	return capabilityRoles[capability].has(role);
}

export function getAdminCapabilities(role: ProfileRole) {
	return {
		settings: hasAdminCapability(role, 'settings'),
		staff: hasAdminCapability(role, 'staff'),
		inventory: hasAdminCapability(role, 'inventory'),
		content: hasAdminCapability(role, 'content'),
		sales: hasAdminCapability(role, 'sales')
	};
}
