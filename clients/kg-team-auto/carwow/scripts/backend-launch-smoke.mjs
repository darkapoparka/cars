#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const baseUrl = new URL(process.env.BACKEND_SMOKE_BASE ?? 'http://127.0.0.1:4399');
const expectPostFailClosed = process.env.BACKEND_SMOKE_EXPECT_POST_FAIL_CLOSED === '1';
const skipPublicWrites = process.env.BACKEND_SMOKE_SKIP_PUBLIC_WRITES === '1';
const adminSmokeEmail = process.env.BACKEND_SMOKE_ADMIN_EMAIL?.trim();
const adminSmokePassword = process.env.BACKEND_SMOKE_ADMIN_PASSWORD?.trim();
const prefix =
	process.env.BACKEND_SMOKE_PREFIX ??
	`Backend smoke ${new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')}`;
const timeoutMs = Number(process.env.BACKEND_SMOKE_TIMEOUT_MS ?? 15_000);
const outputPath = process.env.BACKEND_SMOKE_OUTPUT;

const smokeManifest = {
	prefix,
	baseUrl: baseUrl.origin,
	mode: expectPostFailClosed ? 'fail-closed' : 'write',
	publicWritesSkipped: skipPublicWrites,
	startedAt: new Date().toISOString(),
	completedAt: null,
	lead: null,
	importRequest: null,
	chat: null,
	admin: null
};

const publicGetRoutes = [
	'/',
	'/inventory',
	'/inventory/bmw-i7-2023-full-maxx',
	'/sell-your-car',
	'/contact',
	'/about',
	'/services',
	'/blog',
	'/faq',
	'/terms',
	'/api/feeds/daynight-auto/cars-bg.csv',
	'/api/feeds/daynight-auto/mobile-bg.xml',
	'/sitemap.xml',
	'/robots.txt',
	'/admin/login',
	'/api/chat/conversations'
];

const protectedAdminRoutes = [
	'/admin',
	'/admin/listings',
	'/admin/listings/new',
	'/admin/posts',
	'/admin/posts/new',
	'/admin/leads',
	'/admin/imports',
	'/admin/conversations',
	'/admin/analytics',
	'/admin/settings',
	'/admin/assistant'
];

const disabledAuthRoutes = [
	'/api/auth/sign-up/email',
	'/api/auth/request-password-reset',
	'/api/auth/reset-password',
	'/api/auth/send-verification-email',
	'/api/auth/verify-email'
];

const sitemapBlockedFragments = [
	'/admin',
	'/dashboard',
	'/home1',
	'/home1-box',
	'/home2',
	'/home3',
	'/presentation',
	'/calculator',
	'/compare',
	'/sell-car'
];

function routeUrl(path) {
	return new URL(path, baseUrl).toString();
}

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

async function request(path, options = {}) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);

	try {
		return await fetch(routeUrl(path), {
			redirect: 'manual',
			...options,
			signal: controller.signal,
			headers: {
				'user-agent': 'daynight-backend-launch-smoke/1.0',
				...(options.headers ?? {})
			}
		});
	} finally {
		clearTimeout(timeout);
	}
}

async function readJson(response) {
	const text = await response.text();
	if (!text) return null;

	try {
		return JSON.parse(text);
	} catch {
		return { raw: text.slice(0, 300) };
	}
}

function getSetCookies(response) {
	if (typeof response.headers.getSetCookie === 'function') {
		return response.headers.getSetCookie();
	}

	const header = response.headers.get('set-cookie');
	return header ? [header] : [];
}

function mergeCookies(cookieHeader, response) {
	const next = new Map(
		cookieHeader
			.split(';')
			.map((part) => part.trim())
			.filter(Boolean)
			.map((part) => {
				const [name, ...rest] = part.split('=');
				return [name, rest.join('=')];
			})
	);

	for (const setCookie of getSetCookies(response)) {
		const [pair] = setCookie.split(';');
		const [name, ...rest] = pair.split('=');
		if (name && rest.length) {
			next.set(name.trim(), rest.join('=').trim());
		}
	}

	return Array.from(next, ([name, value]) => `${name}=${value}`).join('; ');
}

async function checkPublicGetRoutes() {
	for (const path of publicGetRoutes) {
		const response = await request(path);
		assert(response.status === 200, `${path} returned ${response.status}, expected 200`);
		console.log(`ok GET ${path} -> 200`);
	}
}

async function checkFeedAndSeoContent() {
	const carsBg = await request('/api/feeds/daynight-auto/cars-bg.csv');
	const carsBgBody = await carsBg.text();
	assert(
		carsBg.headers.get('content-type')?.startsWith('text/csv'),
		'cars.bg feed is not served as CSV'
	);
	assert(
		carsBg.headers.get('content-disposition')?.includes('daynight-auto-cars-bg.csv'),
		'cars.bg feed is missing the expected download filename'
	);
	assert(carsBgBody.startsWith('"id","slug","title"'), 'cars.bg feed is missing CSV headers');
	assert(!carsBgBody.toLowerCase().includes('<!doctype html'), 'cars.bg feed returned HTML');
	console.log('ok feed /api/feeds/daynight-auto/cars-bg.csv -> CSV content');

	const mobileBg = await request('/api/feeds/daynight-auto/mobile-bg.xml');
	const mobileBgBody = await mobileBg.text();
	assert(
		mobileBg.headers.get('content-type')?.startsWith('application/xml'),
		'mobile.bg feed is not served as XML'
	);
	assert(mobileBgBody.trimStart().startsWith('<?xml'), 'mobile.bg feed is missing XML declaration');
	assert(mobileBgBody.includes('<vehicles'), 'mobile.bg feed is missing vehicles root');
	assert(!mobileBgBody.toLowerCase().includes('<!doctype html'), 'mobile.bg feed returned HTML');
	console.log('ok feed /api/feeds/daynight-auto/mobile-bg.xml -> XML content');

	const sitemap = await request('/sitemap.xml');
	const sitemapBody = await sitemap.text();
	assert(
		sitemap.headers.get('content-type')?.startsWith('application/xml'),
		'sitemap is not served as XML'
	);
	assert(sitemapBody.includes('<urlset'), 'sitemap is missing urlset root');
	assert(
		sitemapBody.includes('/inventory/bmw-i7-2023-full-maxx'),
		'sitemap is missing the launch PDP URL'
	);

	for (const fragment of sitemapBlockedFragments) {
		assert(!sitemapBody.includes(fragment), `sitemap exposed blocked route fragment ${fragment}`);
	}

	console.log('ok SEO /sitemap.xml -> public routes only');

	const robots = await request('/robots.txt');
	const robotsBody = await robots.text();
	assert(
		robots.headers.get('content-type')?.startsWith('text/plain'),
		'robots.txt is not served as text/plain'
	);
	assert(robotsBody.includes('Disallow: /admin'), 'robots.txt does not block admin routes');
	assert(robotsBody.includes('Disallow: /dashboard'), 'robots.txt does not block dashboard routes');
	const sitemapLine = robotsBody.split(/\r?\n/).find((line) => line.trim().startsWith('Sitemap: '));
	assert(sitemapLine, 'robots.txt is missing a Sitemap directive');

	const sitemapUrlText = sitemapLine.replace('Sitemap:', '').trim();
	let robotsSitemapUrl;
	try {
		robotsSitemapUrl = new URL(sitemapUrlText);
	} catch {
		throw new Error(`robots.txt Sitemap directive is not an absolute URL: ${sitemapUrlText}`);
	}

	assert(
		robotsSitemapUrl.host === baseUrl.host,
		`robots.txt Sitemap host was ${robotsSitemapUrl.host}, expected ${baseUrl.host}`
	);
	assert(
		robotsSitemapUrl.pathname === '/sitemap.xml',
		`robots.txt Sitemap path was ${robotsSitemapUrl.pathname}, expected /sitemap.xml`
	);
	assert(
		robotsSitemapUrl.protocol === 'http:' || robotsSitemapUrl.protocol === 'https:',
		`robots.txt Sitemap protocol was ${robotsSitemapUrl.protocol}, expected http(s)`
	);
	console.log('ok SEO /robots.txt -> protected routes blocked');
}

async function checkProtectedAdminRedirects() {
	for (const path of protectedAdminRoutes) {
		const response = await request(path);
		const location = response.headers.get('location') ?? '';
		assert(response.status === 303, `${path} returned ${response.status}, expected 303`);
		assert(
			location.startsWith('/admin/login?redirectTo='),
			`${path} redirected to ${location || '(missing location)'}`
		);
		console.log(`ok admin gate ${path} -> 303 ${location}`);
	}
}

async function checkDisabledAuthRoutes() {
	for (const path of disabledAuthRoutes) {
		const response = await request(path, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				email: 'backend-smoke-auth-probe@example.com',
				password: 'backend-smoke-password-1234'
			})
		});

		assert(
			response.status === 403 || response.status === 404,
			`${path} returned ${response.status}, expected disabled 403/404`
		);
		console.log(`ok auth disabled ${path} -> ${response.status}`);
	}
}

async function checkAdminLogin() {
	if (!adminSmokeEmail || !adminSmokePassword) {
		console.log('skip admin login smoke -> BACKEND_SMOKE_ADMIN_EMAIL/PASSWORD not set');
		return;
	}

	let cookieHeader = '';
	const initial = await request('/admin/login');
	assert(initial.status === 200, `/admin/login returned ${initial.status}, expected 200`);
	cookieHeader = mergeCookies(cookieHeader, initial);

	const body = new URLSearchParams({
		email: adminSmokeEmail,
		password: adminSmokePassword
	});
	const login = await request('/admin/login?/login&redirectTo=%2Fadmin', {
		method: 'POST',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
			origin: baseUrl.origin,
			referer: routeUrl('/admin/login'),
			...(cookieHeader ? { cookie: cookieHeader } : {})
		},
		body
	});
	cookieHeader = mergeCookies(cookieHeader, login);

	const location = login.headers.get('location') ?? '';
	assert(
		login.status === 303 || login.status === 200,
		`/admin/login action returned ${login.status}, expected 303 or SvelteKit action 200`
	);
	if (login.status === 303) {
		assert(location === '/admin', `/admin/login redirected to ${location || '(missing location)'}`);
	}
	assert(cookieHeader, '/admin/login did not return an authenticated cookie');

	const admin = await request('/admin', {
		headers: { cookie: cookieHeader }
	});
	assert(admin.status === 200, `/admin with staff cookie returned ${admin.status}, expected 200`);

	smokeManifest.admin = {
		email: adminSmokeEmail,
		authenticated: true
	};
	console.log(`ok admin login ${adminSmokeEmail} -> /admin`);
}

async function postJson(path, body, cookieHeader = '') {
	const headers = { 'content-type': 'application/json' };
	if (cookieHeader) {
		headers.cookie = cookieHeader;
	}

	const response = await request(path, {
		method: 'POST',
		headers,
		body: JSON.stringify(body)
	});

	return { response, body: await readJson(response) };
}

function assertFailClosed(path, response, body) {
	assert(response.status === 503, `${path} returned ${response.status}, expected fail-closed 503`);
	assert(
		body && typeof body.message === 'string',
		`${path} fail-closed response is missing message`
	);
	console.log(`ok POST ${path} -> fail-closed 503`);
}

async function checkLeadPost() {
	const { response, body } = await postJson('/api/leads', {
		customerName: `${prefix} lead`,
		contact: '+359 888 100 100',
		email: 'backend-smoke@example.com',
		phone: '+359 888 100 100',
		source: 'launch-smoke',
		message: `${prefix}: launch lead smoke`
	});

	if (expectPostFailClosed) {
		assertFailClosed('/api/leads', response, body);
		return;
	}

	assert(response.status === 201, `/api/leads returned ${response.status}, expected 201`);
	assert(typeof body?.leadId === 'string', '/api/leads response is missing leadId');
	assert(typeof body?.conversationId === 'string', '/api/leads response is missing conversationId');
	assert(body?.status === 'new', `/api/leads status was ${body?.status}, expected new`);
	smokeManifest.lead = {
		leadId: body.leadId,
		conversationId: body.conversationId,
		status: body.status
	};
	console.log(`ok POST /api/leads -> 201 lead=${body.leadId} conversation=${body.conversationId}`);
}

async function checkImportPost() {
	const { response, body } = await postJson('/api/import-requests', {
		customerName: `${prefix} import`,
		contact: '+359 888 200 200',
		email: 'backend-smoke@example.com',
		phone: '+359 888 200 200',
		originCountry: 'DE',
		destinationCountry: 'BG',
		desiredMake: 'BMW',
		desiredModel: 'X5',
		desiredYearMin: 2021,
		desiredYearMax: 2024,
		budgetMin: 25000,
		budgetMax: 65000,
		notes: `${prefix}: launch import smoke`
	});

	if (expectPostFailClosed) {
		assertFailClosed('/api/import-requests', response, body);
		return;
	}

	assert(response.status === 201, `/api/import-requests returned ${response.status}, expected 201`);
	assert(
		typeof body?.importRequestId === 'string',
		'/api/import-requests response is missing importRequestId'
	);
	assert(typeof body?.leadId === 'string', '/api/import-requests response is missing leadId');
	assert(
		typeof body?.conversationId === 'string',
		'/api/import-requests response is missing conversationId'
	);
	assert(body?.status === 'new', `/api/import-requests status was ${body?.status}, expected new`);
	smokeManifest.importRequest = {
		importRequestId: body.importRequestId,
		leadId: body.leadId,
		conversationId: body.conversationId,
		status: body.status
	};
	console.log(
		`ok POST /api/import-requests -> 201 import=${body.importRequestId} conversation=${body.conversationId}`
	);
}

async function checkChatFlow() {
	let cookieHeader = '';

	const initial = await request('/api/chat/conversations');
	assert(initial.status === 200, `/api/chat/conversations GET returned ${initial.status}`);
	console.log('ok GET /api/chat/conversations -> 200');

	const start = await postJson('/api/chat/conversations', {
		name: `${prefix} visitor`,
		email: 'backend-smoke@example.com',
		phone: '+359 888 300 300',
		message: `${prefix}: launch chat smoke`
	});

	cookieHeader = mergeCookies(cookieHeader, start.response);

	if (expectPostFailClosed) {
		assertFailClosed('/api/chat/conversations', start.response, start.body);
		return;
	}

	assert(
		start.response.status === 201,
		`/api/chat/conversations returned ${start.response.status}`
	);
	const conversationId = start.body?.conversation?.id;
	assert(
		typeof conversationId === 'string',
		'/api/chat/conversations response is missing conversation.id'
	);
	assert(
		Array.isArray(start.body?.messages),
		'/api/chat/conversations response is missing messages'
	);
	assert(cookieHeader, '/api/chat/conversations did not set a visitor cookie');
	smokeManifest.chat = {
		conversationId,
		startedMessageCount: start.body.messages.length,
		followUpMessageId: null,
		pollMessageCount: null
	};
	console.log(`ok POST /api/chat/conversations -> 201 conversation=${conversationId}`);

	const reply = await postJson(
		`/api/chat/conversations/${conversationId}/messages`,
		{ message: `${prefix}: follow-up chat smoke` },
		cookieHeader
	);
	cookieHeader = mergeCookies(cookieHeader, reply.response);

	assert(
		reply.response.status === 201,
		`/api/chat/conversations/${conversationId}/messages returned ${reply.response.status}`
	);
	assert(
		typeof reply.body?.message?.id === 'string',
		'chat message response is missing message.id'
	);
	smokeManifest.chat.followUpMessageId = reply.body.message.id;
	console.log(`ok POST /api/chat/conversations/${conversationId}/messages -> 201`);

	const poll = await request(`/api/chat/conversations/${conversationId}/messages`, {
		headers: { cookie: cookieHeader }
	});
	const pollBody = await readJson(poll);
	assert(poll.status === 200, `chat message poll returned ${poll.status}, expected 200`);
	assert(Array.isArray(pollBody?.messages), 'chat message poll response is missing messages');
	assert(
		pollBody.messages.length >= 2,
		`chat message poll returned ${pollBody.messages.length} messages`
	);
	smokeManifest.chat.pollMessageCount = pollBody.messages.length;
	console.log(`ok GET /api/chat/conversations/${conversationId}/messages -> 200`);
}

async function writeSmokeManifest() {
	smokeManifest.completedAt = new Date().toISOString();
	console.log('Backend smoke record manifest:');
	console.log(JSON.stringify(smokeManifest, null, 2));

	if (!outputPath) {
		return;
	}

	const resolvedOutputPath = resolve(outputPath);
	await mkdir(dirname(resolvedOutputPath), { recursive: true });
	await writeFile(resolvedOutputPath, `${JSON.stringify(smokeManifest, null, 2)}\n`, 'utf8');
	console.log(`Backend smoke manifest written to ${resolvedOutputPath}`);
}

try {
	console.log(`Backend launch smoke base: ${baseUrl}`);
	console.log(
		expectPostFailClosed
			? 'POST mode: expecting fail-closed 503 responses'
			: 'POST mode: expecting durable 201 writes'
	);
	if (skipPublicWrites) {
		console.log('Public write POST smoke: skipped by BACKEND_SMOKE_SKIP_PUBLIC_WRITES=1');
	}

	await checkPublicGetRoutes();
	await checkFeedAndSeoContent();
	await checkProtectedAdminRedirects();
	await checkDisabledAuthRoutes();
	await checkAdminLogin();

	if (!skipPublicWrites) {
		await checkLeadPost();
		await checkImportPost();
		await checkChatFlow();
	}

	await writeSmokeManifest();
	console.log('Backend launch smoke passed.');
} catch (error) {
	console.error('Backend launch smoke failed.');
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
}
