import { describe, expect, it } from 'vitest';
import { legacyDashboardRedirects, resolveLegacyDashboardRedirect } from './legacy-redirects';

describe('historical staff URLs', () => {
	it.each(Object.entries(legacyDashboardRedirects))(
		'keeps %s pointing at its native dashboard',
		(path, target) => {
			expect(resolveLegacyDashboardRedirect(path)).toBe(target);
		}
	);
	it.each([
		'',
		'unknown',
		'dashboard/unknown',
		'constructor',
		'__proto__',
		'toString',
		'dashboard.html'
	])('does not turn %s into a redirect or raw template', (path) => {
		expect(resolveLegacyDashboardRedirect(path)).toBeNull();
	});
});
