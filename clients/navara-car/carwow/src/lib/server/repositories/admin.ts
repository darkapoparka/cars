export {
	canManageDealer,
	getAdminCapabilities,
	hasAdminCapability,
	isStaffRole,
	type AdminCapability,
	type ProfileRole
} from '$lib/server/auth/roles';

export { requireAdminDealer } from '$lib/server/auth/guards';
