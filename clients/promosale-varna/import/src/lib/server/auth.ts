import { createHash, timingSafeEqual } from 'node:crypto';
import { isPreviewMode, runtimeConfig } from './runtime-config';
import { error, redirect } from '@sveltejs/kit';
import { hasInquiryDatabase, templateAdminCredentials } from './inquiry-config';
import {
	canRoleAccessDayNightRoute,
	defaultRoleForDayNightRoute,
	normalizeDayNightRole
} from './roles';
import {
	createDayNightSessionRecord,
	createDayNightUserRecord,
	deleteDayNightSessionByToken,
	findDayNightSessionByToken,
	findDayNightUserByEmail,
	findDayNightUserByRole,
	type DayNightUser
} from './db';
import type { DayNightRole, DayNightSession, DayNightSessionRecord } from '$lib/types/account';

export type { DayNightRole, DayNightSession } from '$lib/types/account';
export { daynightRoleLabel } from './roles';

export const daynightDemoSessions: Record<DayNightRole, DayNightSession> = {
	admin: {
		email: 'admin@daynight.local',
		name: 'Promosale Varna Admin',
		role: 'admin'
	},
	agent: {
		email: 'agent@daynight.local',
		name: 'Promosale Varna Agent',
		role: 'agent'
	},
	customer: {
		email: 'customer@daynight.local',
		name: 'Promosale Varna Customer',
		role: 'customer'
	}
};

export const daynightSessionCookieName = 'daynight_session';

const roleFromSearch = (searchParams?: URLSearchParams): DayNightRole | undefined =>
	normalizeDayNightRole(searchParams?.get('role'));

const sessionFromUser = (user: DayNightUser): DayNightSession => ({
	email: user.email,
	name: user.name,
	role: user.role
});

const sessionFromRecord = (session: DayNightSessionRecord): DayNightSession => ({
	email: session.email,
	name: session.name,
	role: session.role,
	token: session.token
});

const bearerToken = (request: Request) => {
	const authorization = request.headers.get('authorization') ?? '';
	const match = authorization.match(/^Bearer\s+(.+)$/i);

	return match?.[1]?.trim();
};

const cookieToken = (request: Request) => {
	const cookie = request.headers.get('cookie') ?? '';

	return cookie
		.split(';')
		.map((part) => part.trim())
		.find((part) => part.startsWith(`${daynightSessionCookieName}=`))
		?.slice(daynightSessionCookieName.length + 1);
};

const sessionTokenFromRequest = (request: Request) =>
	request.headers.get('x-daynight-session')?.trim() ?? bearerToken(request) ?? cookieToken(request);

const roleFromRequestSearch = (request: Request): DayNightRole | undefined => {
	try {
		return normalizeDayNightRole(new URL(request.url).searchParams.get('role'));
	} catch {
		return undefined;
	}
};

const explicitPrototypeRole = (request: Request) =>
	normalizeDayNightRole(request.headers.get('x-daynight-prototype-role')) ??
	roleFromRequestSearch(request);

export const resolveDayNightSession = (
	routePath = '',
	searchParams?: URLSearchParams
): DayNightSession => {
	if (!isPreviewMode()) error(401, 'A verified session is required');
	const role = roleFromSearch(searchParams) ?? defaultRoleForDayNightRoute(routePath);
	const user = findDayNightUserByRole(role);

	if (user) {
		return sessionFromUser(user);
	}

	return daynightDemoSessions[role];
};

export const canAccessDayNightRoute = (session: DayNightSession, routePath = '') =>
	canRoleAccessDayNightRoute(session.role, routePath);

export const sessionCookieForDayNightSession = (session: DayNightSession) =>
	session.token
		? `${daynightSessionCookieName}=${encodeURIComponent(
				session.token
			)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 8}${isPreviewMode() ? '' : '; Secure'}`
		: undefined;

export const expiredDayNightSessionCookie = () =>
	`${daynightSessionCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isPreviewMode() ? '' : '; Secure'}`;

export const resolveDayNightApiSession = (
	request: Request,
	fallbackRole?: DayNightRole | string
): DayNightSession | undefined => {
	if (!isPreviewMode() && !runtimeConfig().adminEnabled) return undefined;
	const token = sessionTokenFromRequest(request);
	let decodedToken;
	try {
		decodedToken = token ? decodeURIComponent(token) : undefined;
	} catch {
		return undefined;
	}
	const record = decodedToken ? findDayNightSessionByToken(decodedToken) : undefined;

	if (record && new Date(record.expiresAt).getTime() > Date.now()) {
		if (
			!isPreviewMode() &&
			(record.userId !== 'template-configured-admin' ||
				record.role !== 'admin' ||
				record.email !== templateAdminCredentials().email)
		)
			return undefined;
		return sessionFromRecord(record);
	}
	if (!isPreviewMode()) return undefined;

	const role = normalizeDayNightRole(fallbackRole);
	const user =
		role && explicitPrototypeRole(request) === role ? findDayNightUserByRole(role) : undefined;

	return user ? sessionFromUser(user) : undefined;
};

export const resolveDayNightRequestSession = (
	request: Request,
	routePath = '',
	searchParams?: URLSearchParams
): DayNightSession =>
	resolveDayNightApiSession(request) ?? resolveDayNightSession(routePath, searchParams);

export const resolveDayNightPageSession = (
	request: Request,
	routePath = '',
	searchParams?: URLSearchParams
): DayNightSession | undefined => {
	const authenticated = resolveDayNightApiSession(request);

	if (authenticated) return authenticated;
	if (!isPreviewMode()) return undefined;

	return resolveDayNightSession(routePath, searchParams);
};

export const requireDayNightPageSession = (
	request: Request,
	routePath = '',
	searchParams?: URLSearchParams
): DayNightSession => {
	const session = resolveDayNightPageSession(request, routePath, searchParams);

	if (!session) {
		if (hasInquiryDatabase() && request.method === 'GET') redirect(303, '/admin/login');
		error(401, 'Promosale Varna account session is required');
	}

	// Page actions must enforce the same capability boundary as JSON APIs.
	// A valid staff session does not enable the demonstration CMS or filesystem uploads.
	if (!isPreviewMode()) {
		const route = routePath.replace(/^\/+|\/+$/g, '');
		if (route === 'admin' && request.method === 'GET') redirect(303, '/admin/inquiries');
		const supported =
			route === 'admin/inquiries' || (route === 'admin/copilot' && runtimeConfig().aiEnabled);
		if (!supported) error(503, 'This demonstration capability is not enabled in live mode');
	}

	if (!canAccessDayNightRoute(session, routePath)) {
		error(403, 'Promosale Varna account role cannot access this route');
	}

	return session;
};

export const clearDayNightRequestSession = (request: Request) => {
	const token = sessionTokenFromRequest(request);

	try {
		return token ? deleteDayNightSessionByToken(decodeURIComponent(token)) : false;
	} catch {
		return false;
	}
};

export const authenticateDayNightUser = ({
	email,
	password,
	role
}: {
	email: string;
	password: string;
	role?: DayNightRole | string;
}): DayNightSession | undefined => {
	if (!isPreviewMode()) {
		if (!runtimeConfig().adminEnabled) return undefined;
		const configured = templateAdminCredentials();
		if (
			!configured.email ||
			!configured.password ||
			configured.password.length < 16 ||
			email.trim().toLowerCase() !== configured.email ||
			(role && role !== 'admin')
		)
			return undefined;
		const digest = (value: string) => createHash('sha256').update(value).digest();
		if (!timingSafeEqual(digest(password), digest(configured.password))) return undefined;
		return sessionFromRecord(
			createDayNightSessionRecord({
				id: 'template-configured-admin',
				email: configured.email,
				name: 'Template Admin',
				phone: '',
				role: 'admin',
				status: 'active'
			})
		);
	}
	const user = findDayNightUserByEmail(email);
	const requestedRole = normalizeDayNightRole(role);
	const passwordLooksIntentional = password.trim().length >= 8;

	if (!user || !passwordLooksIntentional || (requestedRole && user.role !== requestedRole)) {
		return undefined;
	}

	const session = createDayNightSessionRecord(user);

	return {
		email: session.email,
		name: session.name,
		role: session.role,
		token: session.token
	};
};

export const registerDayNightCustomer = ({
	email,
	name,
	password,
	phone
}: {
	email: string;
	name?: string;
	password: string;
	phone?: string;
}): DayNightSession | undefined => {
	if (!isPreviewMode()) return undefined;
	const normalizedEmail = email.trim().toLowerCase();
	const passwordLooksIntentional = password.trim().length >= 8;

	if (!normalizedEmail.includes('@') || !passwordLooksIntentional) {
		return undefined;
	}

	const existing = findDayNightUserByEmail(normalizedEmail);

	if (existing && existing.role !== 'customer') {
		return undefined;
	}

	const user =
		existing ??
		createDayNightUserRecord({
			email: normalizedEmail,
			name,
			phone,
			role: 'customer',
			status: 'active'
		});
	const session = createDayNightSessionRecord(user);

	return {
		email: session.email,
		name: session.name,
		role: session.role,
		token: session.token
	};
};
