import { describe, it, expect } from 'vitest';
import { createLocalePolicy, type LocaleConfiguration } from './policy';
const config: LocaleConfiguration<'en' | 'bg'> = {
	schemaVersion: 1,
	dealerId: 'synthetic-import',
	dealerName: 'Synthetic Dealer',
	defaultLocale: 'bg',
	enabledLocales: ['en', 'bg'],
	dealerCountry: 'BG',
	inventoryCurrency: 'EUR',
	formatLocales: { en: 'en-GB', bg: 'bg-BG' },
	preferenceMaxAge: 3600,
	promptVersion: 'v1',
	suggestedLanguages: { BG: 'bg', GB: 'en' }
};
const policy = createLocalePolicy(config);
const request = (body: string, type = 'application/json', origin = 'https://fixture.test') =>
	new Request('https://fixture.test/api/preferences', {
		method: 'POST',
		headers: { origin, 'content-type': type },
		body
	});
const payload = {
	action: 'save',
	locale: 'bg',
	country: 'GB',
	returnTo: '/en/contact?topic=trade-in#form'
};
describe('request-local language policy', () => {
	it('applies explicit path, query, cookie, header, trusted country, default precedence', () => {
		const input = {
			url: new URL('https://fixture.test/en/contact?lang=bg'),
			cookie: 'cars_locale=bg',
			acceptLanguage: 'bg',
			trustedCountry: 'BG'
		};
		expect(policy.resolveLocale(input).locale).toBe('en');
		input.url = new URL('https://fixture.test/contact?lang=en');
		expect(policy.resolveLocale(input).locale).toBe('en');
		input.url = new URL('https://fixture.test/contact');
		expect(policy.resolveLocale(input).locale).toBe('bg');
		input.cookie = 'cars_locale=xx';
		input.acceptLanguage = 'en;q=0.8,bg;q=0.2';
		expect(policy.resolveLocale(input).locale).toBe('en');
		input.acceptLanguage = 'xx';
		input.trustedCountry = 'GB';
		expect(policy.resolveLocale(input).locale).toBe('en');
		input.trustedCountry = 'xx';
		expect(policy.resolveLocale(input).locale).toBe('bg');
	});
	it('keeps country independent and has no request leakage', () => {
		for (let i = 0; i < 100; i++) {
			const locale = i % 2 ? 'en' : 'bg';
			const state = policy.resolveLocale({
				url: new URL('https://fixture.test/' + locale),
				cookie: 'cars_country=US'
			});
			expect(state.locale).toBe(locale);
			expect(state.country).toBe('US');
			expect(policy.contract.inventoryCurrency).toBe('EUR');
		}
	});
	it('rejects ambiguous cookies and invalid header weights', () => {
		expect(
			policy.resolveLocale({
				url: new URL('https://fixture.test/'),
				cookie: 'cars_locale=en; cars_locale=bg',
				acceptLanguage: 'en;q=0,bg;q=1.1'
			}).source
		).toBe('default');
	});
	for (const base of ['', '/variant-2'])
		it('round trips deep links at ' + (base || 'standalone'), () => {
			const p = createLocalePolicy({ ...config, designBase: base });
			const target = p.localeHref('/inventory/car?fuel=Petrol#photos', 'en', base);
			expect(target).toBe(base + '/en/inventory/car?fuel=Petrol#photos');
			expect(p.localeHref(target, 'bg', base)).toBe(base + '/bg/inventory/car?fuel=Petrol#photos');
			expect(p.routeParts(target.split('?')[0]).path).toBe('/inventory/car');
			for (const href of [
				'/api/inquiries',
				'/assets/car.webp',
				'/admin',
				'https://else.test/',
				'//else.test/',
				'#form',
				'tel:123'
			])
				expect(p.localeHref(href, 'en', base)).toBe(href);
		});
});
describe('bounded preference-only endpoint', () => {
	it('writes independent host-only secure bounded cookies and a safe destination', async () => {
		const response = await policy.preferenceResponse(request(JSON.stringify(payload)));
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ destination: '/bg/contact?topic=trade-in#form' });
		const cookies = response.headers.getSetCookie();
		expect(cookies).toHaveLength(3);
		for (const cookie of cookies) {
			expect(cookie).toContain('Path=/; Max-Age=3600; SameSite=Lax; HttpOnly; Secure');
			expect(cookie).not.toMatch(/Domain=/i);
		}
		expect(response.headers.get('cache-control')).toBe('private, no-store');
	});
	it('dismissal writes only the prompt cookie', async () => {
		const response = await policy.preferenceResponse(
			request(JSON.stringify({ ...payload, action: 'dismiss' }))
		);
		expect(response.status).toBe(200);
		expect(response.headers.getSetCookie()).toHaveLength(1);
		expect(response.headers.getSetCookie()[0]).toMatch(/^cars_prompt=/);
	});
	it('supports the no-JS form', async () => {
		const response = await policy.preferenceResponse(
			request(new URLSearchParams(payload).toString(), 'application/x-www-form-urlencoded')
		);
		expect(response.status).toBe(303);
		expect(response.headers.get('location')).toBe('/bg/contact?topic=trade-in#form');
	});
	for (const body of [
		'{}',
		'[]',
		'null',
		'{',
		'{"action":"save","action":"dismiss"}',
		'{"action":"save","lo\\u0063ale":"en","locale":"bg"}',
		JSON.stringify({ ...payload, locale: 'ar' }),
		JSON.stringify({ ...payload, country: 'ZZ' }),
		JSON.stringify({ ...payload, action: 'send-lead' }),
		JSON.stringify({ ...payload, extra: 'x' }),
		JSON.stringify({ ...payload, locale: ['en'] })
	])
		it('rejects invalid/duplicate JSON ' + body.slice(0, 45), async () => {
			const response = await policy.preferenceResponse(request(body));
			expect(response.status).toBe(400);
			expect(response.headers.getSetCookie()).toEqual([]);
		});
	for (const returnTo of [
		'https://else.test',
		'//else.test',
		'/api/inquiries',
		'/admin',
		'/en/admin',
		'/de/contact',
		'/%2f%2felse.test',
		'/en/%252felse',
		'/en/../admin',
		'/en/contact\\evil',
		'/en/contact\n'
	])
		it('rejects unsafe return ' + JSON.stringify(returnTo), async () => {
			const response = await policy.preferenceResponse(
				request(JSON.stringify({ ...payload, returnTo }))
			);
			expect(response.status).toBe(400);
			expect(response.headers.getSetCookie()).toEqual([]);
		});
	for (const returnTo of [
		'/x/..//invalid.example/path',
		'/%2e%2e//invalid.example/',
		'/..//invalid.example/path?x=1'
	])
		for (const action of ['save', 'dismiss'] as const)
			for (const format of ['json', 'form'] as const)
				it(`rejects normalized external return ${action} ${format} ${returnTo}`, async () => {
					expect(policy.safeReturnPath(returnTo, 'https://fixture.test')).toBeNull();
					const data = { ...payload, action, returnTo };
					const response = await policy.preferenceResponse(
						request(
							format === 'json' ? JSON.stringify(data) : new URLSearchParams(data).toString(),
							format === 'json' ? 'application/json' : 'application/x-www-form-urlencoded'
						)
					);
					expect(response.status).toBe(400);
					expect(response.headers.get('location')).toBeNull();
					expect(response.headers.getSetCookie()).toEqual([]);
				});
	it('rejects duplicate form fields, cross-origin, wrong type, oversized body and method', async () => {
		expect(
			(
				await policy.preferenceResponse(
					request(new URLSearchParams(payload) + '&locale=en', 'application/x-www-form-urlencoded')
				)
			).status
		).toBe(400);
		expect(
			(
				await policy.preferenceResponse(
					request(JSON.stringify(payload), 'application/json', 'https://else.test')
				)
			).status
		).toBe(403);
		expect((await policy.preferenceResponse(request('x', 'text/plain'))).status).toBe(415);
		expect((await policy.preferenceResponse(request('x'.repeat(4097)))).status).toBe(413);
		expect(
			(await policy.preferenceResponse(new Request('https://fixture.test/api/preferences'))).status
		).toBe(405);
	});
});

it('rejects missing origin, invalid UTF-8 and an oversized streamed body before setting cookies', async () => {
	const missingOrigin = new Request('https://fixture.test/api/preferences', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload)
	});
	expect((await policy.preferenceResponse(missingOrigin)).status).toBe(403);
	const invalid = new Request('https://fixture.test/api/preferences', {
		method: 'POST',
		headers: { origin: 'https://fixture.test', 'content-type': 'application/json' },
		body: new Uint8Array([255, 254])
	});
	expect((await policy.preferenceResponse(invalid)).status).toBe(400);
	const stream = new ReadableStream<Uint8Array>({
		start(controller) {
			controller.enqueue(new Uint8Array(2048));
			controller.enqueue(new Uint8Array(2049));
			controller.close();
		}
	});
	const streamed = new Request('https://fixture.test/api/preferences', {
		method: 'POST',
		headers: { origin: 'https://fixture.test', 'content-type': 'application/json' },
		body: stream,
		duplex: 'half'
	} as RequestInit & { duplex: 'half' });
	const result = await policy.preferenceResponse(streamed);
	expect(result.status).toBe(413);
	expect(result.headers.getSetCookie()).toEqual([]);
});
it('validates mounted returns and never repeats the mount or language', async () => {
	const mounted = createLocalePolicy({ ...config, designBase: '/variant-2' });
	const result = await mounted.preferenceResponse(
		new Request('https://fixture.test/variant-2/api/preferences', {
			method: 'POST',
			headers: { origin: 'https://fixture.test', 'content-type': 'application/json' },
			body: JSON.stringify({ ...payload, returnTo: '/variant-2/en/inventory?brand=BMW#cars' })
		})
	);
	expect(await result.json()).toEqual({ destination: '/variant-2/bg/inventory?brand=BMW#cars' });
	expect(mounted.safeReturnPath('/variant-2/en/api/inquiries', 'https://fixture.test')).toBeNull();
});

it('accepts the shared v1 dismissal and the already-dismissed legacy 1 cookie', () => {
	for (const value of ['v1', '1'])
		expect(
			policy.resolveLocale({
				url: new URL('https://fixture.test/en'),
				cookie: 'cars_prompt=' + value
			}).promptDismissed
		).toBe(true);
	expect(
		policy.resolveLocale({ url: new URL('https://fixture.test/en'), cookie: 'cars_prompt=v2' })
			.promptDismissed
	).toBe(false);
});
it('portable links preserve explicit sibling designs while switching language once', () => {
	for (const designBase of ['', '/variant-2', '/variant-3', '/showroom']) {
		const p = createLocalePolicy({ ...config, designBase });
		for (const target of ['/variant-2', '/variant-3']) {
			expect(p.localeHref(target + '/en/inventory?brand=BMW#photos', 'bg', designBase)).toBe(
				target + '/bg/inventory?brand=BMW#photos'
			);
			for (const resource of ['/api/inquiries', '/assets/car.webp', '/admin', '/auth/login'])
				expect(p.localeHref(target + resource, 'bg', designBase)).toBe(target + resource);
		}
		for (const href of [
			'https://external.invalid/en/contact',
			'//external.invalid/',
			'tel:123',
			'#photos',
			'/api',
			'/admin',
			'/assets/logo.svg'
		])
			expect(p.localeHref(href, 'bg', designBase)).toBe(href);
	}
});
