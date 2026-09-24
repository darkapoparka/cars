import { localizedCopy } from '$lib/content/localized';
import type { PageServerLoad, Actions } from './$types';
import { site } from '$lib/config/site';
import { contactFormData, contactPageInfo } from '$lib/content/contact';
import { inquiryAction } from '$lib/server/inquiry-action';
export const load: PageServerLoad = ({ url, locals }) => {
	// Reading these getters makes URL-only locale navigation invalidate this server load.
	void url.pathname;
	void url.search;

	const english = locals.localeState.locale === 'en';
	return {
		contactForm: localizedCopy(contactFormData, locals.localeState.locale),
		contactInfo: {
			...localizedCopy(contactPageInfo, locals.localeState.locale),
			title: (english ? 'Contact ' : 'Свържете се с ') + site.identity.displayName,
			officeLabel: site.identity.displayName
		}
	};
};
export const actions = { default: inquiryAction } satisfies Actions;
