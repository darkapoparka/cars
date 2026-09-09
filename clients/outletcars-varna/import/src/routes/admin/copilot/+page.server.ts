import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';
import {
	buildCopilotContext,
	getIncompleteListings,
	copilotQuickPrompts,
	copilotWelcomeMessage
} from '$lib/server/admin-copilot';
import { requireDayNightPageSession } from '$lib/server/auth';

const modelName = () => env.OPENAI_MODEL || 'gpt-5.5';
const hasOpenAiKey = () => Boolean(env.OPENAI_API_KEY?.trim());

export const load: PageServerLoad = ({ request, url }) => {
	const session = requireDayNightPageSession(request, 'admin/copilot', url.searchParams);
	const cms = buildCopilotContext();

	return {
		auxeroFullPage: true,
		copilot: {
			enabled: hasOpenAiKey(),
			model: hasOpenAiKey() ? modelName() : undefined,
			quickPrompts: copilotQuickPrompts,
			welcome: copilotWelcomeMessage(cms)
		},
		cms,
		incompleteListings: getIncompleteListings(cms).map((item) => ({
			brand: item.listing.brand,
			id: item.listing.id,
			missing: item.missing,
			model: item.listing.model,
			priceLabel: item.listing.priceLabel,
			status: item.listing.status,
			title: item.listing.title
		})),
		session
	};
};
