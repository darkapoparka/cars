import type { Actions, PageServerLoad } from './$types';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { getAccountProfileFormData } from '$lib/server/account-profile-state';
import {
	removeAuxeroPageDocumentBodyHtml,
	removeAuxeroSlotScriptTags,
	renderAuxeroPageSlot
} from '$lib/server/auxero-page';
import { requireDayNightPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/profile';
	const session = requireDayNightPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: rawProfileSlot } = renderAuxeroPageSlot(
		'my-profile.html',
		renderOptions,
		{
			marker: 'data-daynight-profile-form',
			tagName: 'form',
			templateError: 'Account profile template could not be rendered',
			slotError: 'Account profile form slot could not be located'
		}
	);
	const profileSlot = removeAuxeroSlotScriptTags(rawProfileSlot);

	return {
		afterProfileHtml: profileSlot.afterHtml,
		auxeroFullPage: true,
		beforeProfileHtml: profileSlot.beforeHtml,
		dashboard: getAccountDashboardPageData('my-profile.html', renderOptions, {
			subtitle: 'Актуализирайте данните си за контакт и профила си.',
			title: 'Моят профил'
		}),
		pageDocument: removeAuxeroPageDocumentBodyHtml(pageDocument),
		profile: getAccountProfileFormData('my-profile.html', renderOptions),
		profileHtml: profileSlot.sectionHtml
	};
};

export const actions: Actions = {
	default: async () => ({ profileSaved: true })
};
