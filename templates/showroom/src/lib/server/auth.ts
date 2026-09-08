import { error } from '@sveltejs/kit';
import {
	canRoleAccessEliqautoRoute,
	defaultRoleForEliqautoRoute,
	normalizeEliqautoRole
} from './roles';
import {
	createEliqautoSessionRecord,
	createEliqautoUserRecord,
	deleteEliqautoSessionByToken,
	findEliqautoSessionByToken,
	findEliqautoUserByEmail,
	findEliqautoUserByRole,
	type EliqautoUser
} from './db';
import type { EliqautoRole, EliqautoSession, EliqautoSessionRecord } from '$lib/types/account';

export type { EliqautoRole, EliqautoSession } from '$lib/types/account';
export { eliqautoRoleLabel } from './roles';

export const eliqautoDemoSessions: Record<EliqautoRole, EliqautoSession> = {
	admin: {
		email: 'admin@eliqauto.local',
		name: 'Eliqauto Admin',
		role: 'admin'
	},
	agent: {
		email: 'agent@eliqauto.local',
		name: 'Eliqauto Agent',
		role: 'agent'
	},
	customer: {
		email: 'customer@eliqauto.local',
		name: 'Eliqauto Customer',
		role: 'customer'
	}
};

export const eliqautoSessionCookieName = 'eliqauto_session';

const roleFromSearch = (searchParams?: URLSearchParams): EliqautoRole | undefined =>
	normalizeEliqautoRole(searchParams?.get('role'));

const sessionFromUser = (user: EliqautoUser): EliqautoSession => ({
	email: user.email,
	name: user.name,
	role: user.role
});

const sessionFromRecord = (session: EliqautoSessionRecord): EliqautoSession => ({
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
		.find((part) => part.startsWith(`${eliqautoSessionCookieName}=`))
		?.slice(eliqautoSessionCookieName.length + 1);
};

const sessionTokenFromRequest = (request: Request) =>
	request.headers.get('x-eliqauto-session')?.trim() ??
	bearerToken(request) ??
	cookieToken(request);

const roleFromRequestSearch = (request: Request): EliqautoRole | undefined => {
	try {
		return normalizeEliqautoRole(new URL(request.url).searchParams.get('role'));
	} catch {
		return undefined;
	}
};

const explicitPrototypeRole = (request: Request) =>
	normalizeEliqautoRole(request.headers.get('x-eliqauto-prototype-role')) ??
	roleFromRequestSearch(request);

export const resolveEliqautoSession = (
	routePath = '',
	searchParams?: URLSearchParams
): EliqautoSession => {
	const role = roleFromSearch(searchParams) ?? defaultRoleForEliqautoRoute(routePath);
	const user = findEliqautoUserByRole(role);

	if (user) {
		return sessionFromUser(user);
	}

	return eliqautoDemoSessions[role];
};

export const canAccessEliqautoRoute = (session: EliqautoSession, routePath = '') =>
	canRoleAccessEliqautoRoute(session.role, routePath);

export const sessionCookieForEliqautoSession = (session: EliqautoSession) =>
	session.token
		? `${eliqautoSessionCookieName}=${encodeURIComponent(
				session.token
			)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 8}`
		: undefined;

export const expiredEliqautoSessionCookie = () =>
	`${eliqautoSessionCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

export const resolveEliqautoApiSession = (
	request: Request,
	fallbackRole?: EliqautoRole | string
): EliqautoSession | undefined => {
	const token = sessionTokenFromRequest(request);
	const record = token ? findEliqautoSessionByToken(decodeURIComponent(token)) : undefined;

	if (record && new Date(record.expiresAt).getTime() > Date.now()) {
		return sessionFromRecord(record);
	}

	const role = normalizeEliqautoRole(fallbackRole);
	const user =
		role && explicitPrototypeRole(request) === role ? findEliqautoUserByRole(role) : undefined;

	return user ? sessionFromUser(user) : undefined;
};

export const resolveEliqautoRequestSession = (
	request: Request,
	routePath = '',
	searchParams?: URLSearchParams
): EliqautoSession =>
	resolveEliqautoApiSession(request) ?? resolveEliqautoSession(routePath, searchParams);

export const resolveEliqautoPageSession = (
	request: Request,
	routePath = '',
	searchParams?: URLSearchParams
): EliqautoSession | undefined => {
	const authenticated = resolveEliqautoApiSession(request);

	if (authenticated) return authenticated;

	return resolveEliqautoSession(routePath, searchParams);
};

export const requireEliqautoPageSession = (
	request: Request,
	routePath = '',
	searchParams?: URLSearchParams
): EliqautoSession => {
	const session = resolveEliqautoPageSession(request, routePath, searchParams);

	if (!session) {
		error(401, 'Eliqauto account session is required');
	}

	if (!canAccessEliqautoRoute(session, routePath)) {
		error(403, 'Eliqauto account role cannot access this route');
	}

	return session;
};

export const clearEliqautoRequestSession = (request: Request) => {
	const token = sessionTokenFromRequest(request);

	return token ? deleteEliqautoSessionByToken(decodeURIComponent(token)) : false;
};

export const authenticateEliqautoUser = ({
	email,
	password,
	role
}: {
	email: string;
	password: string;
	role?: EliqautoRole | string;
}): EliqautoSession | undefined => {
	const user = findEliqautoUserByEmail(email);
	const requestedRole = normalizeEliqautoRole(role);
	const passwordLooksIntentional = password.trim().length >= 8;

	if (!user || !passwordLooksIntentional || (requestedRole && user.role !== requestedRole)) {
		return undefined;
	}

	const session = createEliqautoSessionRecord(user);

	return {
		email: session.email,
		name: session.name,
		role: session.role,
		token: session.token
	};
};

export const registerEliqautoCustomer = ({
	email,
	name,
	password,
	phone
}: {
	email: string;
	name?: string;
	password: string;
	phone?: string;
}): EliqautoSession | undefined => {
	const normalizedEmail = email.trim().toLowerCase();
	const passwordLooksIntentional = password.trim().length >= 8;

	if (!normalizedEmail.includes('@') || !passwordLooksIntentional) {
		return undefined;
	}

	const existing = findEliqautoUserByEmail(normalizedEmail);

	if (existing && existing.role !== 'customer') {
		return undefined;
	}

	const user =
		existing ??
		createEliqautoUserRecord({
			email: normalizedEmail,
			name,
			phone,
			role: 'customer',
			status: 'active'
		});
	const session = createEliqautoSessionRecord(user);

	return {
		email: session.email,
		name: session.name,
		role: session.role,
		token: session.token
	};
};
