import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAdminCmsOverview } from '$lib/server/admin-cms';
import {
	listManagedAgents,
	normalizeManagedAgentStatus,
	updateManagedAgent
} from '$lib/server/agents';
import { requireDayNightPageSession } from '$lib/server/auth';

const value = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim();

export const load: PageServerLoad = ({ params, request, url }) => {
	const routePath = `admin/agents/${params.slug}`;
	const session = requireDayNightPageSession(request, routePath, url.searchParams);
	const agent = listManagedAgents().find((candidate) => candidate.slug === params.slug);

	if (!agent) {
		error(404, 'Dashboard agent not found');
	}

	return {
		agent,
		auxeroFullPage: true,
		cms: getAdminCmsOverview(),
		session
	};
};

export const actions: Actions = {
	default: async ({ params, request }) => {
		const formData = await request.formData();
		const agent = updateManagedAgent({
			note: value(formData, 'note'),
			slug: params.slug,
			status: normalizeManagedAgentStatus(value(formData, 'status'))
		});

		if (!agent) {
			return fail(404, { error: 'Agent not found.' });
		}

		redirect(303, `/admin/agents/${params.slug}`);
	}
};
