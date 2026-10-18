import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
import { parse } from 'svelte/compiler';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { privateEnv } = vi.hoisted(() => ({ privateEnv: {} as Record<string, string> }));
vi.mock('$env/dynamic/private', () => ({ env: privateEnv }));

import {
	actions as profileActions,
	load as loadProfile
} from '../../routes/account/profile/+page.server';
import {
	actions as passwordActions,
	load as loadPassword
} from '../../routes/account/password/+page.server';
import * as accountAuth from './auth';
import { findDayNightUserByRole, listDayNightPasswordChanges } from './db';

const cases = [
	{
		route: 'account/profile',
		action: profileActions.default!,
		result: { profileUnavailable: true }
	},
	{
		route: 'account/password',
		action: passwordActions.default!,
		result: { passwordUnavailable: true }
	}
];
const eventFor = (route: string, role?: string, token?: string) => {
	const url = new URL('https://example.invalid/' + route);
	if (role) url.searchParams.set('role', role);
	const request = new Request(url, {
		method: 'POST',
		headers: token ? { 'x-daynight-session': token } : {},
		body: new URLSearchParams({
			first_name: 'Not saved',
			NewPassword: 'synthetic-not-a-real-password'
		})
	});
	return { request, url };
};
const liveConfig = () =>
	Object.assign(privateEnv, {
		TEMPLATE_MODE: 'live',
		TEMPLATE_ADMIN_ENABLED: 'true',
		DATABASE_URL: 'postgresql://test.invalid/demo',
		TEMPLATE_ADMIN_EMAIL: 'operator@example.invalid',
		TEMPLATE_ADMIN_PASSWORD: 'private-template-test-password'
	});
const sourceSnippet = (source: string, node: unknown) => {
	const position = node as { start?: number; end?: number } | null;
	if (typeof position?.start !== 'number' || typeof position.end !== 'number') {
		throw new Error('Expected source positions from the Svelte parser');
	}
	return source.slice(position.start, position.end);
};
beforeEach(() => {
	for (const key of Object.keys(privateEnv)) delete privateEnv[key];
	vi.restoreAllMocks();
});

describe.each(cases)('$route truthful form outcome', ({ route, action, result }) => {
	it('rejects an unauthenticated live POST before consuming its body', async () => {
		liveConfig();
		const event = eventFor(route),
			formData = vi.spyOn(event.request, 'formData');
		await expect(action(event as never)).rejects.toMatchObject({ status: 401 });
		expect(formData).not.toHaveBeenCalled();
		expect(event.request.bodyUsed).toBe(false);
	});
	it('keeps the account capability disabled for a valid configured live admin', async () => {
		liveConfig();
		const session = accountAuth.authenticateDayNightUser({
			email: privateEnv.TEMPLATE_ADMIN_EMAIL,
			password: privateEnv.TEMPLATE_ADMIN_PASSWORD
		});
		expect(session?.role).toBe('admin');
		const event = eventFor(route, 'admin', session!.token),
			formData = vi.spyOn(event.request, 'formData');
		await expect(action(event as never)).rejects.toMatchObject({ status: 503 });
		expect(formData).not.toHaveBeenCalled();
		expect(event.request.bodyUsed).toBe(false);
	});
	it.each([undefined, 'customer', 'agent', 'admin'])(
		'preserves preview role %s without a save claim or mutation',
		async (role) => {
			const guarded = vi.spyOn(accountAuth, 'requireDayNightPageSession');
			const before = JSON.stringify(
				['customer', 'agent', 'admin'].map((role) =>
					findDayNightUserByRole(role as 'customer' | 'agent' | 'admin')
				)
			);
			const passwordChanges = listDayNightPasswordChanges().length;
			const event = eventFor(route, role),
				formData = vi.spyOn(event.request, 'formData');
			await expect(action(event as never)).resolves.toEqual(result);
			expect(guarded).toHaveBeenCalledExactlyOnceWith(event.request, route, event.url.searchParams);
			expect(guarded.mock.results[0].value.role).toBe(role ?? 'customer');
			expect(formData).not.toHaveBeenCalled();
			expect(event.request.bodyUsed).toBe(false);
			expect(
				JSON.stringify(
					['customer', 'agent', 'admin'].map((role) =>
						findDayNightUserByRole(role as 'customer' | 'agent' | 'admin')
					)
				)
			).toBe(before);
			expect(listDayNightPasswordChanges()).toHaveLength(passwordChanges);
		}
	);
});

describe('actual account form consumers', () => {
	it.each([
		['profile', 'profileUnavailable', 'Profile changes are not saved.'],
		['password', 'passwordUnavailable', 'Passwords are not changed or stored.']
	])('shows a truthful %s page result and ignores old success flags', (route, flag, message) => {
		const source = readFileSync(
			new URL('../../routes/account/' + route + '/+page.svelte', import.meta.url),
			'utf8'
		);
		const ast = parse(source, { modern: true });
		const declaration = ast.instance?.content.body
			.flatMap((node) => (node.type === 'VariableDeclaration' ? node.declarations : []))
			.find((node) => node.id.type === 'Identifier' && node.id.name === 'statusMessage');
		if (declaration?.init?.type !== 'CallExpression')
			throw new Error('Missing derived page result');
		const expression = declaration.init.arguments[0];
		const code = sourceSnippet(source, expression);
		expect(runInNewContext(code, { data: { locale: 'en' }, form: { [flag]: true } })).toBe(
			'Demo only. ' + message
		);
		expect(runInNewContext(code, { data: { locale: 'bg' }, form: { [flag]: true } })).toMatch(
			/^Само демо\./
		);
		expect(
			runInNewContext(code, {
				data: { locale: 'en' },
				form: { profileSaved: true, passwordSaved: true }
			})
		).toBe('');
		expect(runInNewContext(code, { data: { locale: 'en' }, form: null })).toBe('');
	});
	it('renders demo submit labels in both native template slots', async () => {
		for (const role of ['customer', 'agent', 'admin']) {
			const profileEvent = eventFor('account/profile', role),
				passwordEvent = eventFor('account/password', role);
			const profile = await loadProfile(profileEvent as never),
				password = await loadPassword(passwordEvent as never);
			expect(profile).toHaveProperty('profileHtml');
			expect(password).toHaveProperty('passwordHtml');
			if (!profile || !password) throw new Error('Expected account page data');
			expect(profile.profileHtml).toMatch(/Profile demo|Демо профил/);
			expect(profile.profileHtml).not.toMatch(/Save Locally|Запази промените/);
			expect(password.passwordHtml).toMatch(/Password demo/);
			expect(password.passwordHtml).toContain('method="POST"');
		}
	});
	it.each([
		['AccountProfileForm.svelte', 'saveProfile', 'Demo only. Profile changes are not saved.'],
		[
			'AccountPasswordForm.svelte',
			'changePassword',
			'Demo only. Passwords are not changed or stored.'
		]
	])('runs the real %s fallback handler without claiming a save', (file, handler, message) => {
		const source = readFileSync(new URL('../components/account/' + file, import.meta.url), 'utf8');
		const ast = parse(source, { modern: true });
		const declaration = ast.instance?.content.body
			.flatMap((node) => (node.type === 'VariableDeclaration' ? node.declarations : []))
			.find((node) => node.id.type === 'Identifier' && node.id.name === handler);
		if (!declaration?.init) throw new Error('Missing fallback handler');
		const preventDefault = vi.fn();
		const code =
			'let status = ""; const handler = ' +
			sourceSnippet(source, declaration.init) +
			'; handler(event); status;';
		expect(
			runInNewContext(stripTypeScriptTypes(code), { event: { preventDefault }, profile: {} })
		).toBe(message);
		expect(preventDefault).toHaveBeenCalledOnce();
		const form = ast.fragment.nodes.find(
			(node) => node.type === 'RegularElement' && node.name === 'form'
		);
		if (form?.type !== 'RegularElement') throw new Error('Missing fallback form');
		const method = form.attributes.find(
			(attribute) => attribute.type === 'Attribute' && attribute.name === 'method'
		);
		expect(method).toMatchObject({ value: [{ type: 'Text', data: 'POST' }] });
	});
});
