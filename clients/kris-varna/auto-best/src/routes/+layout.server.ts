import type { LayoutServerLoad } from './$types';
import { routeParts } from '$lib/locale/core';
export const load: LayoutServerLoad = ({ locals, url }) => ({ localeState: { ...locals.localeState, locale: routeParts(url.pathname).locale ?? locals.localeState.locale } });
