import { error } from '@sveltejs/kit';
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
		name: 'Day Night Auto Admin',
		role: 'admin'
	},
	agent: {
		email: 'agent@daynight.local',
		name: 'Day Night Auto Agent',
		role: 'agent'
	},
	customer: {
		email: 'customer@daynight.local',
		name: 'Day Night Auto Customer',
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
	request.headers.get('x-daynight-session')?.trim() ??
	bearerToken(request) ??
	cookieToken(request);

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
			)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 8}`
		: undefined;

export const expiredDayNightSessionCookie = () =>
	`${daynightSessionCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

export const resolveDayNightApiSession = (
	request: Request,
	fallbackRole?: DayNightRole | string
): DayNightSession | undefined => {
	const token = sessionTokenFromRequest(request);
	const record = token ? findDayNightSessionByToken(decodeURIComponent(token)) : undefined;

	if (record && new Date(record.expiresAt).getTime() > Date.now()) {
		return sessionFromRecord(record);
	}

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

	return resolveDayNightSession(routePath, searchParams);
};

export const requireDayNightPageSession = (
	request: Request,
	routePath = '',
	searchParams?: URLSearchParams
): DayNightSession => {
	const session = resolveDayNightPageSession(request, routePath, searchParams);

	if (!session) {
		error(401, 'Day Night Auto account session is required');
	}

	if (!canAccessDayNightRoute(session, routePath)) {
		error(403, 'Day Night Auto account role cannot access this route');
	}

	return session;
};

export const clearDayNightRequestSession = (request: Request) => {
	const token = sessionTokenFromRequest(request);

	return token ? deleteDayNightSessionByToken(decodeURIComponent(token)) : false;
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
