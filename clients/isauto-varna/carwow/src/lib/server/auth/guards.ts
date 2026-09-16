import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { dealers, profiles } from '$lib/server/db/schema';
import { canManageDealer, getAdminCapabilities, isStaffRole } from './roles';

export async function requireAdminDealer(locals: App.Locals) {
	if (!locals.user) {
		throw redirect(303, '/admin/login');
	}

	if (!locals.db) {
		throw error(503, 'Database is not configured for admin access.');
	}

	const [profile] = await locals.db
		.select()
		.from(profiles)
		.where(eq(profiles.auth_user_id, locals.user.id))
		.limit(1);

	if (!profile?.dealer_id) {
		throw error(403, 'This admin account is not attached to a dealer.');
	}

	if (!isStaffRole(profile.role)) {
		throw error(403, 'This account is not provisioned for staff access.');
	}

	const [dealer] = await locals.db
		.select()
		.from(dealers)
		.where(and(eq(dealers.id, profile.dealer_id), eq(dealers.status, 'active')))
		.limit(1);

	if (!dealer) {
		throw error(403, 'This admin account is not attached to an active dealer.');
	}

	locals.staffProfile = profile;

	return {
		db: locals.db,
		dealer,
		dealerId: profile.dealer_id,
		profile,
		role: profile.role,
		canManageDealer: canManageDealer(profile.role),
		capabilities: getAdminCapabilities(profile.role)
	};
}
