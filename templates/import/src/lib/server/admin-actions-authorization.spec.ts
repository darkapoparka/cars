import { beforeEach, describe, expect, it, vi } from 'vitest';

const { privateEnv, mutations } = vi.hoisted(() => ({
	privateEnv: {} as Record<string, string>,
	mutations: {
		agent: vi.fn(() => ({ slug: 'test-agent' })),
		user: vi.fn(() => ({ id: 'test-record' })),
		message: vi.fn(() => ({ id: 'test-thread' })),
		reply: vi.fn(() => ({ id: 'test-reply' })),
		import: vi.fn(() => ({ id: 'test-record' }))
	}
}));

vi.mock('$env/dynamic/private', () => ({ env: privateEnv }));
vi.mock('./admin-cms', () => ({ getAdminCmsOverview: vi.fn() }));
vi.mock('./agents', () => ({
	listManagedAgents: vi.fn(),
	normalizeManagedAgentStatus: vi.fn(),
	updateManagedAgent: mutations.agent
}));
vi.mock('./users', () => ({
	normalizeManagedUserStatus: vi.fn(),
	updateManagedUser: mutations.user
}));
vi.mock('./messages', () => ({
	createMessage: mutations.reply,
	normalizeMessageStatus: vi.fn(),
	updateMessage: mutations.message
}));
vi.mock('./inventory', () => ({
	normalizeVehicleSubmissionStatus: vi.fn(),
	updateVehicleSubmission: mutations.import
}));

import { actions as agentActions } from '../../routes/admin/agents/+page.server';
import { actions as agentDetailActions } from '../../routes/admin/agents/[slug]/+page.server';
import { actions as userActions } from '../../routes/admin/users/+page.server';
import { actions as messageActions } from '../../routes/admin/messages/+page.server';
import { actions as importActions } from '../../routes/admin/imports/+page.server';
import { authenticateDayNightUser } from './auth';

const actionCases = [
	{
		route: 'admin/agents',
		action: agentActions.default!,
		mutation: mutations.agent,
		location: '/admin/agents'
	},
	{
		route: 'admin/agents/test-agent',
		action: agentDetailActions.default!,
		mutation: mutations.agent,
		location: '/admin/agents/test-agent'
	},
	{
		route: 'admin/users',
		action: userActions.default!,
		mutation: mutations.user,
		location: '/admin/users'
	},
	{
		route: 'admin/messages',
		action: messageActions.default!,
		mutation: mutations.message,
		location: '/admin/messages?thread=test-thread'
	},
	{
		route: 'admin/imports',
		action: importActions.default!,
		mutation: mutations.import,
		location: '/admin/imports'
	}
];

const requestFor = (route: string, role?: string, token?: string) => {
	const url = new URL(`https://example.invalid/${route}`);
	if (role) url.searchParams.set('role', role);
	return new Request(url, {
		method: 'POST',
		headers: token ? { 'x-daynight-session': token } : {},
		body: new URLSearchParams({
			id: 'test-record',
			slug: 'test-agent',
			threadId: 'test-thread',
			reply: 'Synthetic preview reply'
		})
	});
};

const eventFor = (request: Request) => ({
	params: { slug: 'test-agent' },
	request,
	url: new URL(request.url)
});

const enableLiveAdmin = () => {
	Object.assign(privateEnv, {
		TEMPLATE_MODE: 'live',
		TEMPLATE_ADMIN_ENABLED: 'true',
		DATABASE_URL: 'postgresql://test.invalid/demo',
		TEMPLATE_ADMIN_EMAIL: 'operator@example.invalid',
		TEMPLATE_ADMIN_PASSWORD: 'private-template-test-password'
	});
};

beforeEach(() => {
	for (const key of Object.keys(privateEnv)) delete privateEnv[key];
	vi.clearAllMocks();
});

describe.each(actionCases)('$route action access', ({ route, action, mutation, location }) => {
	const expectDenied = async (request: Request, status: number) => {
		const formData = vi.spyOn(request, 'formData');
		await expect(action(eventFor(request) as never)).rejects.toMatchObject({ status });
		expect(formData).not.toHaveBeenCalled();
		for (const mutate of Object.values(mutations)) expect(mutate).not.toHaveBeenCalled();
	};

	const expectAllowed = async (request: Request) => {
		const formData = vi.spyOn(request, 'formData');
		await expect(action(eventFor(request) as never)).rejects.toMatchObject({
			status: 303,
			location
		});
		expect(formData).toHaveBeenCalledOnce();
		expect(mutation).toHaveBeenCalledOnce();
		if (route === 'admin/messages') expect(mutations.reply).toHaveBeenCalledOnce();
	};

	it('rejects an unauthenticated live POST before reading or mutating', async () => {
		enableLiveAdmin();
		await expectDenied(requestFor(route), 401);
	});

	it('rejects the disabled live capability even with a configured admin session', async () => {
		enableLiveAdmin();
		const session = authenticateDayNightUser({
			email: privateEnv.TEMPLATE_ADMIN_EMAIL,
			password: privateEnv.TEMPLATE_ADMIN_PASSWORD
		});
		expect(session?.role).toBe('admin');
		await expectDenied(requestFor(route, undefined, session!.token!), 503);
	});

	it('honors the customer preview role before reading or mutating', async () => {
		await expectDenied(requestFor(route, 'customer'), 403);
	});

	it('preserves the agent preview permission for messages only', async () => {
		const request = requestFor(route, 'agent');
		if (route === 'admin/messages') await expectAllowed(request);
		else await expectDenied(request, 403);
	});

	it.each([undefined, 'admin'])('preserves the admin preview for role %s', async (role) => {
		await expectAllowed(requestFor(route, role));
	});
});
