import type { PageServerLoad } from './$types';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { getAccountMessageThreadData } from '$lib/server/account-message-state';
import {
	removeAuxeroPageDocumentBodyHtml,
	removeAuxeroSlotScriptTags,
	renderAuxeroPageSlot
} from '$lib/server/auxero-page';
import { requireDayNightPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/messages';
	const session = requireDayNightPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: rawMessageSlot } = renderAuxeroPageSlot(
		'message.html',
		renderOptions,
		{
			marker: 'data-daynight-message-container',
			templateError: 'Account messages template could not be rendered',
			slotError: 'Account messages slot could not be located'
		}
	);
	const messageSlot = removeAuxeroSlotScriptTags(rawMessageSlot);

	return {
		afterMessageHtml: messageSlot.afterHtml,
		auxeroFullPage: true,
		beforeMessageHtml: messageSlot.beforeHtml,
		dashboard: getAccountDashboardPageData('message.html', renderOptions, {
			subtitle: 'Продължете разговорите си с екипа на Day Night Auto.',
			title: 'Съобщения'
		}),
		messageHtml: messageSlot.sectionHtml,
		pageDocument: removeAuxeroPageDocumentBodyHtml(pageDocument),
		thread: getAccountMessageThreadData('message.html', renderOptions)
	};
};
