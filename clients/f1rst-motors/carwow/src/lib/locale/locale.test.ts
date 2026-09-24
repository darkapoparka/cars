import { describe, expect, it, vi } from 'vitest';
vi.mock('$app/environment', () => ({ building: false }));
vi.mock('$app/paths', () => ({ base: '' }));
import { localeHandle } from './server';
import { resolveLocale, localeHref, routeParts, preferenceResponse } from './core';
import { message, templateText, dealerLabel } from './messages';
import { stockValue } from './stock';
const event = (path: string, method = 'GET', headers: Record<string, string> = {}) => ({
	url: new URL(path, 'https://cars.example'),
	request: new Request(new URL(path, 'https://cars.example'), { method, headers }),
	locals: {}
});
async function handle(path: string, method = 'GET', headers: Record<string, string> = {}) {
	const requestEvent = event(path, method, headers);
	const downstream = vi.fn(
		async (e, options) =>
			new Response(
				options.transformPageChunk({
					html: `<html lang="%cars.locale%">${e.locals.localeState.locale}</html>`
				}),
				{ headers: { 'Content-Type': 'text/html', Vary: 'User-Agent' } }
			)
	);
	const response = await localeHandle({ event: requestEvent, resolve: downstream } as never);
	return { response, downstream, requestEvent };
}
describe('native Carwow locale adapter', () => {
	it('keeps explicit URL language ahead of saved preferences', () =>
		expect(
			resolveLocale({
				url: new URL('https://cars.example/variant-3/en/inventory'),
				cookie: 'cars_locale=bg; cars_country=GB',
				acceptLanguage: 'bg'
			})
		).toMatchObject({ locale: 'en', country: 'GB', source: 'url' }));
	it('keeps route identity and dealer facts independent', () => {
		expect(routeParts('/variant-3/bg/inventory')).toMatchObject({
			base: '/variant-3',
			locale: 'bg',
			path: '/inventory'
		});
		expect(dealerLabel('en', 'city')).toBe('Dubai');
		expect(dealerLabel('bg', 'city')).toBe('Dubai');
		expect(dealerLabel('en', 'address')).toBe('18 Atanas Manchev Street, Studentski Grad, Dubai');
		expect(stockValue('en', 'Mercedes-Benz')).toBe('Mercedes-Benz');
		expect(stockValue('en', '80 000 км')).toBe('80,000 km');
	});
	it('preserves mount, query and hash, and resource URLs', () => {
		expect(localeHref('/variant-3/bg/inventory?q=BMW#filters', 'en')).toBe(
			'/variant-3/en/inventory?q=BMW#filters'
		);
		for (const value of [
			'/api/leads',
			'/admin',
			'https://example.com/a',
			'tel:+359123',
			'/assets/a.webp'
		])
			expect(localeHref(value, 'en')).toBe(value);
	});
	it('localizes the no-verified-reviews dealer disclosure', () => {
		const disclosure = '? ???? ????????? ??????? ?? ?? ???????? ?????????? ????????? ??????.';
		expect(templateText('bg', disclosure)).toBe(disclosure);
		expect(templateText('en', disclosure)).toBe(
			'This independent preview does not include confirmed customer reviews.'
		);
	});
	it('fails on unknown immutable copy and missing parameters', () => {
		expect(() => templateText('en', 'unreviewed interface message')).toThrow();
		expect(() => message('en', 'locale.suggestion')).toThrow('Missing parameter');
	});
	it('preserves original device vary with private locale responses', async () => {
		const { response, downstream } = await handle('/en');
		expect(downstream).toHaveBeenCalledOnce();
		expect(response.headers.get('vary')).toContain('User-Agent');
		expect(response.headers.get('vary')).toContain('Cookie');
		expect(response.headers.get('cache-control')).toContain('no-store');
		expect(await response.text()).toContain('lang="en"');
	});
	it('isolates concurrent requests', async () => {
		const outputs = await Promise.all(
			Array.from({ length: 40 }, (_, i) =>
				handle(i % 2 ? '/bg' : '/en', 'GET', {
					cookie: i % 2 ? 'cars_locale=en' : 'cars_locale=bg'
				})
			)
		);
		for (let i = 0; i < outputs.length; i++)
			expect(await outputs[i].response.text()).toContain(i % 2 ? 'lang="bg"' : 'lang="en"');
	});
	it('redirects legacy URLs without dropping query', async () => {
		const { response, downstream } = await handle('/variant-3/inventory?q=BMW', 'GET', {
			'accept-language': 'en'
		});
		expect(response.status).toBe(307);
		expect(response.headers.get('location')).toBe('/variant-3/en/inventory?q=BMW');
		expect(downstream).not.toHaveBeenCalled();
	});
	it('leaves admin authentication downstream and English-only', async () => {
		const { requestEvent, downstream } = await handle('/admin', 'GET', {
			cookie: 'cars_locale=bg'
		});
		expect(requestEvent.locals).toMatchObject({ localeState: { locale: 'en' } });
		expect(downstream).toHaveBeenCalledOnce();
	});
	for (const path of ['/api/leads', '/api/import-requests', '/api/chat', '/variant-3/api/leads'])
		it(`fails closed before business handlers: ${path}`, async () => {
			const { response, downstream } = await handle(path, 'POST');
			expect(response.status).toBe(403);
			expect(downstream).not.toHaveBeenCalled();
		});
	it('dismisses without accepting preferences', async () => {
		const response = await preferenceResponse(
			new Request('https://cars.example/api/preferences', {
				method: 'POST',
				headers: { origin: 'https://cars.example', 'content-type': 'application/json' },
				body: JSON.stringify({
					action: 'dismiss',
					locale: 'en',
					country: 'GB',
					returnTo: '/bg/inventory?q=BMW#filters'
				})
			})
		);
		expect(response.status).toBe(200);
		const cookies = response.headers.getSetCookie();
		expect(cookies).toHaveLength(1);
		expect(cookies[0]).toContain('cars_prompt=');
		expect(cookies[0]).toContain('HttpOnly');
		expect(cookies[0]).toContain('Secure');
		expect(cookies[0]).not.toContain('Domain=');
	});
});

describe('native redirect mount preservation', () => {
	for (const [target, expected] of [
		['/admin/posts?updated=1', '/variant-3/admin/posts?updated=1'],
		['/presentation/home2', '/variant-3/en/presentation/home2'],
		['/sell-your-car?source=legacy', '/variant-3/en/sell-your-car?source=legacy'],
		['https://external.example/path', 'https://external.example/path']
	])
		it(`normalizes ${target} without changing auth destinations`, async () => {
			const response = await localeHandle({
				event: event('/variant-3/en/contact'),
				resolve: async () => new Response(null, { status: 303, headers: { location: target } })
			} as never);
			expect(response.headers.get('location')).toBe(expected);
		});
});

describe('preference endpoint and query boundaries', () => {
	for (const path of [
		'/en/api/preferences',
		'/bg/api/preferences',
		'/variant-3/api/preferences',
		'/variant-3/en/api/preferences'
	])
		it('rejects noncanonical POST ' + path, async () => {
			const { response, downstream } = await handle(path, 'POST');
			expect(response.status).toBe(403);
			expect(response.headers.getSetCookie()).toEqual([]);
			expect(downstream).not.toHaveBeenCalled();
		});
	for (const lang of ['de', 'EN', 'bogus', ''])
		it('rejects unsupported query ' + lang, async () => {
			const { response } = await handle('/contact?lang=' + lang);
			expect(response.status).toBe(400);
		});
	it('keeps explicit supported locale ahead of invalid query', async () => {
		const { response, downstream } = await handle('/en/contact?lang=de');
		expect(response.status).toBe(200);
		expect(downstream).toHaveBeenCalledOnce();
	});
});
