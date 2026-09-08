import type { PageServerLoad } from './$types';
import { agentCardsFromAgents } from '$lib/auxero/agents';
import { listAgentDetails } from '$lib/server/agent-detail-state';
import { resolveLocale } from '$lib/i18n/messages';
import { renderAuxeroPageDocument } from '$lib/server/auxero-page';
import { auxeroPublicShellData } from '$lib/server/auxero-public-shell';

export const load: PageServerLoad = ({ request, url }) => {
	const agentList = listAgentDetails();
	const locale = resolveLocale(url.searchParams.get('lang'));
	const renderOptions = {
		request,
		routePath: 'agents',
		searchParams: url.searchParams
	};
	const pageDocument = renderAuxeroPageDocument(
		'sale-agents.html',
		renderOptions,
		'Agents template could not be rendered'
	);

	return {
		auxeroFullPage: true,
		cards: agentCardsFromAgents(agentList),
		pageDocument,
		...auxeroPublicShellData(pageDocument, locale, '/agents')
	};
};
