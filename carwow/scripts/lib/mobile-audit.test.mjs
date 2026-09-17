import assert from 'node:assert/strict';
import test from 'node:test';
import { hasAuditIssues, toAuditRoute } from './mobile-audit.mjs';

const base = 'http://127.0.0.1:6463';

test('audit discovery preserves route queries and removes duplicate fragments', () => {
	assert.equal(toAuditRoute('/contact?intent=import#form', base), '/contact?intent=import');
	assert.equal(toAuditRoute(base + '/inventory/car/', base), '/inventory/car');
	assert.equal(toAuditRoute('/', base), '/');
});

test('audit discovery never visits another origin or private endpoints', () => {
	for (const href of [
		'https://example.test/inventory/car',
		'javascript:alert(1)',
		'http://user:password@127.0.0.1:6463/inventory',
		'/api/leads',
		'/admin',
		'/admin/inventory',
		'/assets/car.jpg',
		'/_app/entry.js'
	])
		assert.equal(toAuditRoute(href, base), null);
	assert.equal(toAuditRoute('/admin/login', base), '/admin/login');
});

test('audit gate reports late image failures and HTTP failures', () => {
	const clean = {
		status: 200,
		width: 390,
		scrollWidth: 390,
		mains: 1,
		targets: 1,
		errors: [],
		broken: [],
		pending: [],
		httpErrors: []
	};
	assert.equal(hasAuditIssues(clean), false);
	for (const failure of [
		{ pending: ['/pending.webp'] },
		{ broken: ['/broken.webp'] },
		{ httpErrors: [{ status: 404, url: '/missing.webp' }] },
		{ errors: ['hydration failure'] },
		{ mains: 0 },
		{ targets: 2 },
		{ scrollWidth: 430 },
		{ status: 503 },
		{ error: 'timeout' }
	])
		assert.equal(hasAuditIssues({ ...clean, ...failure }), true);
});
