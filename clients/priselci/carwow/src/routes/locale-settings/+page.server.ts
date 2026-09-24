import type { PageServerLoad } from './$types';
import { base } from '$app/paths';
import { localeHref, safeReturnPath } from '$lib/locale/core';
export const load: PageServerLoad = ({ url, locals }) => {
	const candidate = safeReturnPath(url.searchParams.get('returnTo'), url.origin);
	return { returnTo: candidate ?? localeHref('/', locals.localeState.locale, base) };
};
