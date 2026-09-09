import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAdminCmsOverview } from '$lib/server/admin-cms';
import { normalizeManagedAgentStatus, updateManagedAgent } from '$lib/server/agents';
import { requireDayNightPageSession } from '$lib/server/auth';

const value = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim();

export const load: PageServerLoad = ({ request, url }) => {
	const session = requireDayNightPageSession(request, 'admin/agents', url.searchParams);

	return {
		auxeroFullPage: true,
		cms: getAdminCmsOverview(),
		session
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const slug = value(formData, 'slug');

		if (!slug) {
			return fail(400, { error: 'Agent slug is required.' });
		}

		const agent = updateManagedAgent({
			note: value(formData, 'note'),
			slug,
			status: normalizeManagedAgentStatus(value(formData, 'status'))
		});

		if (!agent) {
			return fail(404, { error: 'Agent not found.' });
		}

		redirect(303, '/admin/agents');
	}
};
