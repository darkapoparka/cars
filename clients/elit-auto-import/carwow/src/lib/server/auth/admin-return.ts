/** Keep native admin authentication redirects within this deployment's admin routes. */
export function adminReturnPath(value: string | null, base: string): string {
	const fallback = `${base}/admin`;
	if (
		!value ||
		!value.startsWith('/') ||
		value.startsWith('//') ||
		Array.from(value).some((c) => c.charCodeAt(0) < 32 || c === '\\') ||
		/%2f|%5c|%2e/i.test(value)
	)
		return fallback;
	const url = new URL(value, 'https://admin.invalid');
	const path =
		base && url.pathname.startsWith(`${base}/`) ? url.pathname.slice(base.length) : url.pathname;
	if (!/^\/admin(?:\/|$)/.test(path) || /^\/admin\/login(?:\/|$)/.test(path)) return fallback;
	return `${base}${path}${url.search}${url.hash}`;
}
