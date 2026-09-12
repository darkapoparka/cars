import { base, resolve as kitResolve } from '$app/paths';
export * from '$app/paths';

function isMounted(path: string) {
	return Boolean(base && (path === base || path.startsWith(`${base}/`) || path.startsWith(`${base}?`) || path.startsWith(`${base}#`)));
}

export function previewPath(path: string) {
	return !path.startsWith('/') || path.startsWith('//') || isMounted(path) ? path : `${base}${path}`;
}

export const resolve: typeof kitResolve = ((path: string, ...params: unknown[]) => {
	if (isMounted(path)) return path;
	return (kitResolve as (...args: unknown[]) => string)(path, ...params);
}) as typeof kitResolve;

export function localPath(pathname: string) {
	return isMounted(pathname) ? pathname.slice(base.length) || '/' : pathname;
}

// Raw reference HTML is rendered outside Svelte's link/asset handling.
// Run this after the source renderer has matched and personalized its HTML.
export function previewHtml(html: string) {
	return html.replace(/\b(href|src|action|content)=(['"])(\/(?!\/)[^'"]*)\2/g, (match, attribute: string, quote: string, value: string) => {
		if (value === '/preview-switcher.js') return match;
		return `${attribute}=${quote}${previewPath(value)}${quote}`;
	}).replace(/url\(\s*(['"]?)(\/(?!\/)[^)'"\s]+)\1\s*\)/g, (_match, quote: string, value: string) => `url(${quote}${previewPath(value)}${quote})`);
}
