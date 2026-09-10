import { base, resolve as kitResolve } from '$app/paths';
export * from '$app/paths';

function isMounted(path: string) {
	return Boolean(
		base &&
			(path === base ||
				path.startsWith(`${base}/`) ||
				path.startsWith(`${base}?`) ||
				path.startsWith(`${base}#`))
	);
}

/** Mount raw local URLs while preserving external, relative and already-mounted URLs. */
export function previewPath(path: string) {
	return !path.startsWith('/') || path.startsWith('//') || isMounted(path)
		? path
		: `${base}${path}`;
}

/** Keep already-mounted media paths intact; resolve route IDs through SvelteKit. */
export const resolve: typeof kitResolve = ((path: string, ...params: unknown[]) => {
	if (isMounted(path)) return path;
	return (kitResolve as (...args: unknown[]) => string)(path, ...params);
}) as typeof kitResolve;

export function localPath(pathname: string) {
	return isMounted(pathname) ? pathname.slice(base.length) || '/' : pathname;
}
