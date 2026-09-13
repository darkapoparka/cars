import { beforeEach, describe, expect, it, vi } from 'vitest';

const { privateEnv, persistence } = vi.hoisted(() => ({
	privateEnv: {} as Record<string, string>,
	persistence: {
		insertStoredInquiry: vi.fn(),
		patchStoredInquiry: vi.fn(),
		readStoredInquiries: vi.fn()
	}
}));
vi.mock('$env/dynamic/private', () => ({ env: privateEnv }));
vi.mock('./inquiry-persistence', () => persistence);

import { GET, PATCH, POST } from '../../routes/api/inquiries/+server';
import { actions } from '../../routes/admin/inquiries/+page.server';
import {
	authenticateDayNightUser,
	resolveDayNightApiSession,
	requireDayNightPageSession
} from './auth';
import { listDayNightInquiries } from './db';

const payload = {
	name: 'Template Test',
	email: 'test@example.invalid',
	message: 'Synthetic test inquiry'
};
const request = (method: string, data: Record<string, unknown>, token?: string) =>
	new Request('http://localhost/api/inquiries', {
		method,
		headers: {
			'content-type': 'application/json',
			...(token ? { 'x-daynight-session': token } : {})
		},
		body: JSON.stringify(data)
	});
const enableDatabase = () => {
	privateEnv.DATABASE_URL = 'postgresql://test.invalid/demo';
	privateEnv.TEMPLATE_ADMIN_EMAIL = 'operator@example.invalid';
	privateEnv.TEMPLATE_ADMIN_PASSWORD = 'private-template-test-password';
};

beforeEach(() => {
	for (const key of Object.keys(privateEnv)) delete privateEnv[key];
	vi.resetAllMocks();
});

describe('inquiry persistence boundary', () => {
	it('preserves the no-database demo without invoking database operations', async () => {
		const result = await POST({ request: request('POST', payload) });
		const body = await result.json();
		expect(result.status).toBe(201);
		expect(body.data.storage).toBe('demo');
		expect(listDayNightInquiries().some((row) => row.id === body.data.inquiry.id)).toBe(true);
		expect(persistence.insertStoredInquiry).not.toHaveBeenCalled();
	});

	it('awaits durable insertion without leaking it into synthetic previews', async () => {
		enableDatabase();
		const count = listDayNightInquiries().length;
		persistence.insertStoredInquiry.mockImplementation(async (row) => row);
		const result = await POST({ request: request('POST', { ...payload, role: 'admin' }) });
		const body = await result.json();
		expect(result.status).toBe(201);
		expect(body.data.storage).toBe('database');
		expect(body.data.inquiry.userRole).toBe('customer');
		expect(listDayNightInquiries()).toHaveLength(count);
	});

	it('returns a safe failure instead of falling back to memory', async () => {
		enableDatabase();
		const count = listDayNightInquiries().length;
		persistence.insertStoredInquiry.mockRejectedValue(new Error('private connection detail'));
		const result = await POST({ request: request('POST', payload) });
		expect(result.status).toBe(503);
		expect(await result.text()).not.toContain('private connection detail');
		expect(listDayNightInquiries()).toHaveLength(count);
	});

	it('does not invent contact details when only a phone number is provided', async () => {
		enableDatabase();
		persistence.insertStoredInquiry.mockImplementation(async (row) => row);
		const result = await POST({
			request: request('POST', { name: 'Template Test', phone: '+359000000000' })
		});
		expect(result.status).toBe(201);
		expect((await result.json()).data.inquiry.contactEmail).toBe('');
	});

	it('rejects empty and oversized submissions before storage', async () => {
		for (const data of [{}, { ...payload, message: 'x'.repeat(5001) }]) {
			expect((await POST({ request: request('POST', data) })).status).toBe(400);
		}
		expect(persistence.insertStoredInquiry).not.toHaveBeenCalled();
	});
});

describe('durable inquiry access', () => {
	it('rejects malformed session tokens without accessing stored inquiries', async () => {
		enableDatabase();
		const req = new Request('http://localhost/api/inquiries', {
			headers: { 'x-daynight-session': '%E0%A4%A' }
		});
		expect((await GET({ request: req, url: new URL(req.url) })).status).toBe(401);
		expect(persistence.readStoredInquiries).not.toHaveBeenCalled();
	});
	it('rejects prototype role elevation and old prototype sessions', async () => {
		const old = authenticateDayNightUser({
			email: 'admin@daynight.local',
			password: 'prototype-password'
		});
		enableDatabase();
		const req = new Request('http://localhost/api/inquiries?role=admin', {
			headers: { 'x-daynight-prototype-role': 'admin' }
		});
		expect((await GET({ request: req, url: new URL(req.url) })).status).toBe(401);
		expect(resolveDayNightApiSession(request('POST', {}, old?.token))).toBeUndefined();
		expect((await PATCH({ request: request('PATCH', { id: 'test', role: 'admin' }) })).status).toBe(
			401
		);
		expect(persistence.readStoredInquiries).not.toHaveBeenCalled();
	});

	it('allows only configured admin credentials to read and update saved inquiries', async () => {
		enableDatabase();
		expect(
			authenticateDayNightUser({
				email: privateEnv.TEMPLATE_ADMIN_EMAIL,
				password: 'wrong-password'
			})
		).toBeUndefined();
		const session = authenticateDayNightUser({
			email: privateEnv.TEMPLATE_ADMIN_EMAIL,
			password: privateEnv.TEMPLATE_ADMIN_PASSWORD
		});
		expect(session?.role).toBe('admin');
		persistence.readStoredInquiries.mockResolvedValue([{ id: 'saved' }]);
		const req = new Request('http://localhost/api/inquiries', {
			headers: { 'x-daynight-session': session!.token! }
		});
		expect(
			(await (await GET({ request: req, url: new URL(req.url) })).json()).data.inquiries
		).toEqual([{ id: 'saved' }]);
		const id = '00000000-0000-4000-8000-000000000001';
		persistence.patchStoredInquiry.mockResolvedValue({ id, status: 'contacted' });
		expect(
			(await PATCH({ request: request('PATCH', { id, status: 'contacted' }, session!.token) }))
				.status
		).toBe(200);
		expect(persistence.patchStoredInquiry).toHaveBeenCalledWith(
			id,
			expect.objectContaining({ status: 'contacted' })
		);
	});

	it('guards the inquiry page and form action independently', async () => {
		enableDatabase();
		expect(() =>
			requireDayNightPageSession(new Request('http://localhost/admin/inquiries'), 'admin/inquiries')
		).toThrow();
		const action = actions.default!;
		await expect(
			action({ request: request('POST', { id: 'saved' }) } as Parameters<typeof action>[0])
		).rejects.toMatchObject({ status: 401 });
		expect(persistence.patchStoredInquiry).not.toHaveBeenCalled();
	});
});
