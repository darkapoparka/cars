import type { PageServerLoad } from './$types';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { getAccountListingsData } from '$lib/server/account-listings-state';
import {
	removeAuxeroPageDocumentBodyHtml,
	removeAuxeroSlotScriptTags,
	renderAuxeroPageSlot
} from '$lib/server/auxero-page';
import { requireDayNightPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/listings';
	const session = requireDayNightPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: rawListingsSlot } = renderAuxeroPageSlot(
		'my-listings.html',
		renderOptions,
		{
			marker: 'data-daynight-account-listings',
			templateError: 'Account listings template could not be rendered',
			slotError: 'Account listings slot could not be located'
		}
	);
	const listingsSlot = removeAuxeroSlotScriptTags(rawListingsSlot);

	return {
		afterListingsHtml: listingsSlot.afterHtml,
		auxeroFullPage: true,
		beforeListingsHtml: listingsSlot.beforeHtml,
		dashboard: getAccountDashboardPageData('my-listings.html', renderOptions, {
			subtitle: 'Review submitted vehicles, statuses, and next actions.',
			title: 'My Listings'
		}),
		listings: getAccountListingsData('my-listings.html', renderOptions),
		listingsHtml: listingsSlot.sectionHtml,
		pageDocument: removeAuxeroPageDocumentBodyHtml(pageDocument)
	};
};
