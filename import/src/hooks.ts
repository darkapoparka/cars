import { base } from '$app/paths';
import type { Reroute } from '@sveltejs/kit';
import { routeParts, isPublicPath } from '$lib/locale/core';
export const reroute: Reroute = ({ url }) => {
	const parts = routeParts(url.pathname);
	const path = parts.path.replace(/\/+$/, '') || '/';
	return parts.base === base && isPublicPath(path) && (parts.locale || path !== parts.path)
		? parts.base + path
		: url.pathname;
};
