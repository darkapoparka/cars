import { error, redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { getDefaultDealerSlug } from '$lib/server/app-config';
import { dealers, profiles } from '$lib/server/db/schema';
import { isStaffRole } from '$lib/server/repositories/admin';

const publicAdminRoutes = new Set(['/admin/login']);

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const isPublicAdminRoute = publicAdminRoutes.has(url.pathname);
	const { session, user } = locals;

	if (!session || !user) {
		if (isPublicAdminRoute) {
			return {
				session: null,
				user: null,
				profile: null,
				dealer: null,
				defaultDealerSlug: getDefaultDealerSlug()
			};
		}

		throw redirect(303, `/admin/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
	}

	if (!locals.db) {
		throw error(503, 'Database is not configured for admin access.');
	}

	const [profile] = await locals.db
		.select({
			id: profiles.id,
			dealer_id: profiles.dealer_id,
			email: profiles.email,
			full_name: profiles.full_name,
			role: profiles.role,
			phone: profiles.phone,
			avatar_url: profiles.avatar_url
		})
		.from(profiles)
		.where(eq(profiles.auth_user_id, user.id))
		.limit(1);

	if (!profile?.dealer_id || !isStaffRole(profile.role)) {
		if (isPublicAdminRoute) {
			return {
				session: null,
				user: null,
				profile: null,
				dealer: null,
				defaultDealerSlug: getDefaultDealerSlug()
			};
		}

		throw error(403, 'This account is not provisioned for staff access.');
	}

	if (isPublicAdminRoute) {
		throw redirect(303, '/admin');
	}

	const [dealer] = await locals.db
		.select({
			id: dealers.id,
			slug: dealers.slug,
			name: dealers.name,
			brand_name: dealers.brand_name,
			phone_label: dealers.phone_label,
			email: dealers.email,
			city: dealers.city,
			settings: dealers.settings
		})
		.from(dealers)
		.where(and(eq(dealers.id, profile.dealer_id), eq(dealers.status, 'active')))
		.limit(1);

	if (!dealer) {
		throw error(403, 'This admin account is not attached to an active dealer.');
	}

	return {
		session: null,
		user: {
			id: user.id,
			email: user.email ?? null
		},
		profile,
		dealer,
		defaultDealerSlug: dealer.slug ?? getDefaultDealerSlug()
	};
};
