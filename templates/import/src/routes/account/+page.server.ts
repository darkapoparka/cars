import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import {
	removeAuxeroPageDocumentBodyHtml,
	removeAuxeroSlotScriptTags,
	renderAuxeroPageSlot
} from '$lib/server/auxero-page';
import { requireDayNightPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account';
	const session = requireDayNightPageSession(request, routePath, url.searchParams);

	if (session.role === 'admin') {
		redirect(302, '/admin');
	}

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: rawRecentSlot } = renderAuxeroPageSlot(
		'dashboard.html',
		renderOptions,
		{
			marker: 'dashboard-content--inner',
			templateError: 'Account dashboard template could not be rendered',
			slotError: 'Account dashboard content slot could not be located'
		}
	);
	const recentSlot = removeAuxeroSlotScriptTags(rawRecentSlot);

	return {
		afterRecentHtml: recentSlot.afterHtml,
		auxeroFullPage: true,
		beforeRecentHtml: recentSlot.beforeHtml,
		dashboard: getAccountDashboardPageData('dashboard.html', renderOptions, {
			subtitle: 'Запазени автомобили, подадени обяви и активни разговори с Day Night Auto.',
			title: 'Табло на акаунта'
		}),
		pageDocument: removeAuxeroPageDocumentBodyHtml(pageDocument)
	};
};
