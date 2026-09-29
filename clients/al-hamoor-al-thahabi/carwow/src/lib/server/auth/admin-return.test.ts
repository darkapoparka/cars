import { describe, expect, it } from 'vitest';
import { adminReturnPath } from './admin-return';
describe('native admin return paths', () => {
	for (const base of ['', '/variant-3']) {
		it(`preserves admin path/query/hash under ${base || 'standalone'}`, () => {
			expect(adminReturnPath(`${base}/admin/vehicles?q=car#row`, base)).toBe(
				`${base}/admin/vehicles?q=car#row`
			);
			expect(adminReturnPath('/admin/vehicles', base)).toBe(`${base}/admin/vehicles`);
		});
		it(`rejects external, public, login and encoded separators under ${base}`, () => {
			for (const value of [
				'//evil.test/admin',
				'/administer',
				'/admin/login',
				'/inventory',
				'/admin/../../contact',
				'/admin/%2e%2e/contact',
				'/admin%2fvehicles',
				'/admin\\evil',
				null
			])
				expect(adminReturnPath(value, base)).toBe(`${base}/admin`);
		});
	}
});
