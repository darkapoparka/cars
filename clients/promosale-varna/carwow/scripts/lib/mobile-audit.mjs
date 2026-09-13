/** Keep discovery on the reviewed origin and out of private/API routes. */
export function toAuditRoute(href, base) {
	if (typeof href !== 'string' || !href.trim()) return null;
	try {
		const url = new URL(href, base);
		if (url.origin !== new URL(base).origin || url.username || url.password) return null;
		if (/^\/(?:api|_app|assets)(?:\/|$)/.test(url.pathname)) return null;
		if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') return null;
		return (url.pathname.replace(/\/+$/, '') || '/') + url.search;
	} catch {
		return null;
	}
}

export function hasAuditIssues(result) {
	return Boolean(
		result.error ||
		result.status !== 200 ||
		result.scrollWidth > result.width + 1 ||
		result.mains !== 1 ||
		result.targets !== 1 ||
		result.errors?.length ||
		result.broken?.length ||
		result.pending?.length ||
		result.httpErrors?.length
	);
}
