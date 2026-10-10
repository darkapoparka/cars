import { redirect } from '@sveltejs/kit';
import { localeHref } from '$lib/locale/core';
import type { PageServerLoad } from './$types';

// Retain a native route so SvelteKit client navigation also follows the rename.
export const load: PageServerLoad = ({ url, locals }) => {
  redirect(308, localeHref('/cars' + url.search, locals.localeState.locale));
};
