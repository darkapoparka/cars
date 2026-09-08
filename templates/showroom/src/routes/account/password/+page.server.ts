import type { Actions, PageServerLoad } from './$types';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { getAccountPasswordFormData } from '$lib/server/account-profile-state';
import {
	removeAuxeroPageDocumentBodyHtml,
	removeAuxeroSlotScriptTags,
	renderAuxeroPageSlot
} from '$lib/server/auxero-page';
import { requireEliqautoPageSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/password';
	const session = requireEliqautoPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: rawPasswordSlot } = renderAuxeroPageSlot(
		'change-password.html',
		renderOptions,
		{
			marker: 'data-eliqauto-password-form',
			tagName: 'form',
			templateError: 'Account password template could not be rendered',
			slotError: 'Account password form slot could not be located'
		}
	);
	const passwordSlot = removeAuxeroSlotScriptTags(rawPasswordSlot);

	return {
		afterPasswordHtml: passwordSlot.afterHtml,
		auxeroFullPage: true,
		beforePasswordHtml: passwordSlot.beforeHtml,
		dashboard: getAccountDashboardPageData('change-password.html', renderOptions, {
			subtitle: 'Update account credentials for this Eliqauto workspace.',
			title: 'Profile Security'
		}),
		pageDocument: removeAuxeroPageDocumentBodyHtml(pageDocument),
		password: getAccountPasswordFormData('change-password.html', renderOptions),
		passwordHtml: passwordSlot.sectionHtml
	};
};

export const actions: Actions = {
	default: async () => ({ passwordSaved: true })
};
