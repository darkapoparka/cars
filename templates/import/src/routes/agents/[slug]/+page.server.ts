import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { agentDetailFromAgent } from '$lib/auxero/agent-detail';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';
import { getAgentDetailBySlug } from '$lib/server/agent-detail-state';

export const load: PageServerLoad = ({ params, request, url }) => {
	const agent = getAgentDetailBySlug(params.slug);

	if (!agent) {
		error(404, 'Agent not found');
	}

	const locale = resolveLocale(url.searchParams.get('lang'));
	const pageDocument = renderAuxeroPageDocument(
		'sale-agents-details.html',
		{
			request,
			routePath: `agents/${agent.slug}`,
			searchParams: url.searchParams,
			slug: agent.slug
		},
		'Agent detail template could not be rendered'
	);

	return {
		auxeroFullPage: true,
		detail: agentDetailFromAgent(agent),
		pageDocument,
		...auxeroPublicShellData(pageDocument, locale, '/agents')
	};
};
