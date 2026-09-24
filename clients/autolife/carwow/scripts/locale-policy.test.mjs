import test from 'node:test';
import assert from 'node:assert/strict';
import {
	createLocalePolicy,
	cookieValue,
	languageRegistry,
	countries
} from '../src/lib/locale/policy.ts';

export const pilot = {
	schemaVersion: 1,
	dealerId: 'ae-sharjah-al-reef-used-cars',
	dealerName: 'Al Reef Used Cars',
	enabledLocales: ['en', 'bg'],
	defaultLocale: 'en',
	dealerCountry: 'AE',
	inventoryCurrency: 'AED',
	formatLocales: { en: 'en-AE', bg: 'bg-BG' },
	preferenceMaxAge: 15552000,
	promptVersion: 'v1',
	suggestedLanguages: { BG: 'bg' }
};
const make = (changes = {}) => createLocalePolicy({ ...structuredClone(pilot), ...changes });
const resolve = (policy, pathname = '/', more = {}) =>
	policy.resolveLocale({ url: new URL(pathname, 'https://dealer.example'), ...more });
const choice = {
	action: 'save',
	locale: 'bg',
	country: 'BG',
	returnTo: '/variant-2/en/cars?make=BMW#results'
};
const request = (data = choice, options = {}) =>
	new Request(options.url ?? 'https://dealer.example/api/preferences', {
		method: 'POST',
		headers: {
			origin: 'https://dealer.example',
			'content-type': 'application/json',
			...options.headers
		},
		body: options.body ?? JSON.stringify(data)
	});

test('registered languages are metadata, not automatic release switches', () => {
	assert.deepEqual(Object.keys(languageRegistry), ['en', 'bg', 'ar', 'de', 'uk', 'tr', 'ro', 'el']);
	const p = make();
	assert.deepEqual(p.contract.enabledLocales, ['en', 'bg']);
	for (const language of ['ar', 'de', 'uk', 'tr', 'ro', 'el'])
		assert.equal(p.isLocale(language), false);
	assert.equal(languageRegistry.ar.direction, 'rtl');
	assert.equal(languageRegistry.uk.name, 'Українська');
	assert.equal(languageRegistry.el.name, 'Ελληνικά');
});
test('country vocabulary retains 249 unique codes including Madagascar', () => {
	assert.equal(countries.length, 249);
	assert.equal(new Set(countries).size, 249);
	assert.ok(countries.includes('MG'));
});
for (const [name, update] of [
	['schema', { schemaVersion: 2 }],
	['missing id', { dealerId: undefined }],
	['numeric id', { dealerId: 123 }],
	['missing prompt version', { promptVersion: undefined }],
	['missing suggestion map', { suggestedLanguages: undefined }],
	['dealer id', { dealerId: '../escape' }],
	['name', { dealerName: '' }],
	['empty enabled', { enabledLocales: [] }],
	['duplicate enabled', { enabledLocales: ['en', 'en'] }],
	['unknown locale', { enabledLocales: ['en', 'zz'] }],
	['default disabled', { defaultLocale: 'ar' }],
	['country missing', { dealerCountry: undefined }],
	['country invalid', { dealerCountry: 'ZZ' }],
	['currency invalid', { inventoryCurrency: 'ZZZ' }],
	['currency missing', { inventoryCurrency: '' }],
	['wrong locale formatter', { formatLocales: { en: 'bg-BG', bg: 'bg-BG' } }],
	['expiry', { preferenceMaxAge: 0 }],
	['expiry too long', { preferenceMaxAge: 31536001 }],
	['cookie token', { promptVersion: 'v1; Domain=bad.example' }],
	['suggest disabled', { suggestedLanguages: { AE: 'ar' } }],
	['suggest bad country', { suggestedLanguages: { ZZ: 'en' } }]
])
	test('configuration rejects ' + name, () => assert.throws(() => make(update)));

test('configuration and nested records cannot be mutated by another dealer', () => {
	const input = structuredClone(pilot),
		p = createLocalePolicy(input);
	input.enabledLocales.push('ar');
	input.formatLocales.en = 'en-GB';
	input.suggestedLanguages.AE = 'ar';
	assert.deepEqual(p.contract.enabledLocales, ['en', 'bg']);
	assert.equal(p.intlLocale('en'), 'en-AE');
	assert.throws(() => p.contract.enabledLocales.push('ar'));
	assert.throws(() => {
		p.contract.suggestedLanguages.BG = 'en';
	});
});
for (const mount of ['', '/variant-2', '/variant-3'])
	test('explicit URL wins for mount ' + (mount || '/'), () => {
		const p = make();
		const r = resolve(p, `${mount}/bg/contact?topic=trade-in&lang=en`, {
			cookie: 'cars_locale=en',
			acceptLanguage: 'en',
			trustedCountry: 'AE'
		});
		assert.equal(r.locale, 'bg');
		assert.equal(r.source, 'url');
		assert.equal(resolve(p, `${mount}/contact?lang=bg`, { cookie: 'cars_locale=en' }).locale, 'bg');
	});
test('cookie, quality-weighted header, trusted suggestion and default precedence', () => {
	const p = make();
	assert.equal(
		resolve(p, '/', { cookie: 'cars_locale=bg', acceptLanguage: 'en' }).source,
		'cookie'
	);
	assert.equal(
		resolve(p, '/', { acceptLanguage: 'en-US;q=0.2,bg-BG;q=0.9', trustedCountry: 'AE' }).locale,
		'bg'
	);
	assert.equal(resolve(p, '/', { trustedCountry: 'BG' }).source, 'country');
	assert.equal(resolve(p).source, 'default');
	assert.equal(resolve(p).suggestedCountry, 'AE');
	assert.equal(resolve(p, '/', { acceptLanguage: 'bg', trustedCountry: null }).country, 'AE');
	assert.equal(resolve(p, '/', { cookie: 'cars_country=BG' }).locale, 'en');
});
for (const [header, expected] of [
	['bg;q=0,en;q=0.6', 'en'],
	['bg;q=1.1,en;q=0.5', 'en'],
	['bg;q=NaN,en', 'en'],
	['bg;q=0.1234,en;q=0.1', 'en'],
	['bg;q=0.9;q=0.1,en', 'en'],
	['en;q=0.5,bg;q=0.5', 'en'],
	['bg-BG;q=0.7,en;q=0.5', 'bg'],
	['*', null],
	['x'.repeat(4097), null],
	['ar,de,uk,tr,ro,el', null]
])
	test('language negotiation: ' + header.slice(0, 45), () =>
		assert.equal(make().preferredLanguage(header), expected)
	);

test('no cookie, locale or currency leaks between three independent dealer policies', async () => {
	const ae = make();
	const gb = make({
		dealerId: 'gb-fixture',
		dealerName: 'GB fixture',
		dealerCountry: 'GB',
		inventoryCurrency: 'GBP',
		formatLocales: { en: 'en-GB', bg: 'bg-BG' }
	});
	const bg = make({
		dealerId: 'bg-fixture',
		dealerName: 'BG fixture',
		dealerCountry: 'BG',
		inventoryCurrency: 'EUR',
		defaultLocale: 'bg'
	});
	await Promise.all(
		Array.from({ length: 120 }, async (_, i) => {
			const [p, country, currency, expected] = [
				[ae, 'AE', 'AED', 'en'],
				[gb, 'GB', 'GBP', 'en'],
				[bg, 'BG', 'EUR', 'bg']
			][i % 3];
			const first = resolve(p),
				second = resolve(p, '/en', { cookie: 'cars_locale=bg; cars_country=DE' });
			first.locale = 'ar';
			assert.equal(resolve(p).locale, expected);
			assert.equal(resolve(p).country, country);
			assert.equal(second.locale, 'en');
			assert.equal(second.country, 'DE');
			assert.match(p.formatPrice(12000, 'en'), new RegExp(currency));
			assert.equal(p.contract.dealerCountry, country);
		})
	);
});
test('nonfinite values and disabled-language price formatting fail explicitly', () => {
	assert.throws(() => make().formatPrice(NaN, 'en'));
	assert.throws(() => make().formatPrice(Infinity, 'en'));
	assert.throws(() => make().formatPrice(20, 'ar'));
});
for (const [from, to] of [
	['/', '/bg'],
	['/contact?topic=trade-in#form', '/bg/contact?topic=trade-in#form'],
	['/variant-2/en/cars?q=golf#results', '/variant-2/bg/cars?q=golf#results'],
	['/variant-3/inventory/demo-1', '/variant-3/bg/inventory/demo-1'],
	['/variant-3', '/variant-3/bg'],
	['/variant-2', '/variant-2/bg']
])
	test('mounted route is idempotent: ' + from, () => {
		const p = make();
		assert.equal(p.localeHref(from, 'bg'), to);
		assert.equal(p.localeHref(to, 'bg'), to);
	});
for (const untouched of [
	'/api/leads',
	'/assets/car.webp',
	'/preview-switcher.js',
	'/variant-2/_next/a.js',
	'https://outside.example/',
	'tel:+971547707080',
	'mailto:test@example.com',
	'#form',
	'?topic=import',
	'//cdn.example/image.png'
]) {
	test('does not localize resource or external link: ' + untouched, () =>
		assert.equal(make().localeHref(untouched, 'bg'), untouched)
	);
}
test('enabled list controls routes, while regular short application routes remain usable', () => {
	const p = make();
	assert.equal(p.unsupportedLocale('/variant-2/ar/cars'), true);
	for (const route of ['/faq', '/cars', '/sell']) assert.equal(p.unsupportedLocale(route), false);
	assert.throws(() => p.localeHref('/', 'ar'));
	assert.throws(() => p.localeHref('/', 'en', '/another-dealer'));
});
for (const path of [
	'//outside.example',
	'/\\outside',
	'/%2f%2foutside',
	'/%5coutside',
	'/%252foutside',
	'/%61pi/leads',
	'/en/../../api/leads',
	'/ar/cars',
	'/contact\u0000',
	'/contact\u007f',
	'/contact%'
]) {
	test('rejects unsafe or unsupported return path: ' + JSON.stringify(path), () =>
		assert.equal(make().safeReturnPath(path, 'https://dealer.example'), null)
	);
}
test('safe return path keeps URLs inside query values and hashes intact', () => {
	const target = '/en/contact?source=https%3A%2F%2Fexample.com%2Fad#form';
	assert.equal(make().safeReturnPath(target, 'https://dealer.example'), target);
});
test('invalid, old and ambiguous cookie values do not select a language', () => {
	for (const c of [
		'cars_locale=%xx',
		'cars_locale=ar',
		'cars_locale=en; cars_locale=bg',
		'cars_country=ZZ; cars_prompt=old'
	]) {
		assert.equal(resolve(make(), '/', { cookie: c }).locale, 'en');
	}
	assert.equal(cookieValue('x'.repeat(16385), 'cars_locale'), null);
	assert.equal(resolve(make(), '/', { cookie: 'cars_prompt=v1' }).promptDismissed, true);
});
test('save is host-only, HttpOnly, Secure, bounded and private', async () => {
	const res = await make().preferenceResponse(request());
	assert.equal(res.status, 200);
	assert.equal((await res.json()).destination, '/variant-2/bg/cars?make=BMW#results');
	assert.equal(res.headers.get('cache-control'), 'private, no-store');
	assert.equal(res.headers.getSetCookie().length, 3);
	for (const cookie of res.headers.getSetCookie()) {
		assert.match(cookie, /Path=\/; Max-Age=15552000; SameSite=Lax; HttpOnly; Secure/);
		assert.doesNotMatch(cookie, /Domain=/i);
	}
});
test('dismissal changes only prompt completion, not country/language or URL', async () => {
	const res = await make().preferenceResponse(request({ ...choice, action: 'dismiss' }));
	assert.equal(res.status, 200);
	assert.equal(res.headers.getSetCookie().length, 1);
	assert.match(res.headers.getSetCookie()[0], /^cars_prompt=/);
	assert.equal((await res.json()).destination, choice.returnTo);
});
test('HTTP localhost keeps host-only cookies without incorrectly forcing Secure', async () => {
	const res = await make().preferenceResponse(
		request(choice, {
			url: 'http://localhost:6890/api/preferences',
			headers: { origin: 'http://localhost:6890' }
		})
	);
	assert.equal(res.status, 200);
	assert.doesNotMatch(res.headers.getSetCookie()[0], /; Secure/);
});
test('JavaScript-disabled native form returns a validated 303', async () => {
	const body = new URLSearchParams(choice).toString();
	const res = await make().preferenceResponse(
		request(choice, { body, headers: { 'content-type': 'application/x-www-form-urlencoded' } })
	);
	assert.equal(res.status, 303);
	assert.equal(res.headers.get('location'), '/variant-2/bg/cars?make=BMW#results');
});
for (const [name, data, options, status] of [
	['external origin', choice, { headers: { origin: 'https://evil.example' } }, 403],
	['cross site', choice, { headers: { 'sec-fetch-site': 'cross-site' } }, 403],
	['null origin', choice, { headers: { origin: 'null' } }, 403],
	['unexpected type', choice, { headers: { 'content-type': 'text/plain' } }, 415],
	['unsupported locale', { ...choice, locale: 'ar' }, {}, 400],
	['unknown country', { ...choice, country: 'ZZ' }, {}, 400],
	['business write', { ...choice, action: 'enquiry' }, {}, 400],
	['unknown field', { ...choice, email: 'test@example.com' }, {}, 400],
	['external return', { ...choice, returnTo: '//evil.example' }, {}, 400],
	['API return', { ...choice, returnTo: '/api/leads' }, {}, 400],
	['oversize body', choice, { body: 'x'.repeat(4097) }, 413],
	['oversize declared', choice, { headers: { 'content-length': '4097' } }, 413],
	['bad length', choice, { headers: { 'content-length': '-1' } }, 400],
	['malformed json', choice, { body: '{' }, 400],
	['array json', [], {}, 400],
	[
		'duplicate form keys',
		choice,
		{
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams(choice) + '&locale=en'
		},
		400
	]
])
	test('preference handler fails closed: ' + name, async () => {
		const res = await make().preferenceResponse(request(data, options));
		assert.equal(res.status, status);
		assert.equal(res.headers.getSetCookie().length, 0);
	});
test('GET preference endpoint is not a write', async () => {
	const res = await make().preferenceResponse(
		new Request('https://dealer.example/api/preferences')
	);
	assert.equal(res.status, 405);
	assert.equal(res.headers.get('allow'), 'POST');
	assert.equal(res.headers.getSetCookie().length, 0);
});
test('streaming body is bounded even without a content-length header', async () => {
	const body = new ReadableStream({
		start(c) {
			c.enqueue(new Uint8Array(3000));
			c.enqueue(new Uint8Array(2000));
			c.close();
		}
	});
	const req = new Request('https://dealer.example/api/preferences', {
		method: 'POST',
		headers: { origin: 'https://dealer.example', 'content-type': 'application/json' },
		body,
		duplex: 'half'
	});
	assert.equal((await make().preferenceResponse(req)).status, 413);
});
test('invalid UTF-8 is rejected instead of silently replacing bytes', async () => {
	const req = request(choice, { body: new Uint8Array([0xff, 0xfe]) });
	assert.equal((await make().preferenceResponse(req)).status, 400);
});
for (const returnTo of [
	'/x/..//evil.example/path',
	'/%2e%2e//evil.example/',
	'/..//evil.example/path?x=1'
]) {
	for (const action of ['save', 'dismiss'])
		for (const type of ['application/json', 'application/x-www-form-urlencoded']) {
			test(`normalized return rejected: ${action} ${type} ${returnTo}`, async () => {
				const data = { ...choice, action, returnTo };
				const response = await make().preferenceResponse(
					request(data, {
						headers: { 'content-type': type },
						body:
							type === 'application/json'
								? JSON.stringify(data)
								: new URLSearchParams(data).toString()
					})
				);
				assert.equal(response.status, 400);
				assert.equal(response.headers.get('location'), null);
				assert.equal(response.headers.getSetCookie().length, 0);
				assert.equal(make().safeReturnPath(returnTo, 'https://dealer.example'), null);
			});
		}
}

test('external URL confined to a query remains a host-only return', async () => {
	const returnTo = '/en/contact?source=https://outside.example/car#form';
	assert.equal(make().safeReturnPath(returnTo, 'https://dealer.example'), returnTo);
	for (const type of ['application/json', 'application/x-www-form-urlencoded']) {
		const data = { ...choice, returnTo };
		const response = await make().preferenceResponse(
			request(data, {
				headers: { 'content-type': type },
				body:
					type === 'application/json' ? JSON.stringify(data) : new URLSearchParams(data).toString()
			})
		);
		assert.equal(response.status, type === 'application/json' ? 200 : 303);
		if (type !== 'application/json')
			assert.equal(response.headers.get('location'), make().localeHref(returnTo, choice.locale));
	}
});
