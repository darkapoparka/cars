import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAdminCmsOverview } from '$lib/server/admin-cms';
import { requireDayNightPageSession } from '$lib/server/auth';
import { normalizeManagedUserStatus, updateManagedUser } from '$lib/server/users';

const allowedUserRoles = new Set(['all', 'admin', 'agent', 'customer', 'lead']);
const value = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim();

export const load: PageServerLoad = ({ request, url }) => {
	const session = requireDayNightPageSession(request, 'admin/users', url.searchParams);
	const searchQuery = (url.searchParams.get('q') ?? '').trim();
	const requestedUserRole = (url.searchParams.get('userRole') ?? 'all').toLowerCase();
	const selectedUserRole = allowedUserRoles.has(requestedUserRole) ? requestedUserRole : 'all';
	const cms = getAdminCmsOverview();
	const searchNeedle = searchQuery.toLowerCase();
	const users = cms.users.filter((user) => {
		const rowRole = user.role.toLowerCase();
		const matchesRole = selectedUserRole === 'all' || rowRole === selectedUserRole;
		const matchesSearch =
			!searchNeedle ||
			[user.name, user.email, user.phone, user.context, user.roleLabel]
				.join(' ')
				.toLowerCase()
				.includes(searchNeedle);

		return matchesRole && matchesSearch;
	});

	return {
		auxeroFullPage: true,
		cms,
		searchQuery,
		selectedUserRole,
		session,
		users
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const id = value(formData, 'id');

		if (!id) {
			return fail(400, { error: 'User id is required.' });
		}

		const user = updateManagedUser({
			id,
			name: value(formData, 'name'),
			phone: value(formData, 'phone'),
			status: normalizeManagedUserStatus(value(formData, 'status'))
		});

		if (!user) {
			return fail(404, { error: 'Only account users can be edited here.' });
		}

		redirect(303, '/admin/users');
	}
};
