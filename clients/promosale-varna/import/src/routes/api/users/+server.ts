import { listManagedUsers, normalizeManagedUserStatus, updateManagedUser } from '$lib/server/users';
import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import { requireDayNightApiAccess } from '$lib/server/api-auth';

const requireAdmin = (request: Request, fallbackRole: string | undefined) =>
	requireDayNightApiAccess({
		allowedRoles: ['admin'],
		fallbackRole,
		request,
		routePath: 'admin/users'
	});

export function GET({ request, url }: { request: Request; url: URL }) {
	const access = requireAdmin(request, url.searchParams.get('role') ?? undefined);

	if (access.response) return access.response;

	return okJson({ users: listManagedUsers() });
}

export async function PATCH({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const access = requireAdmin(request, payloadString(payload, 'actorRole', 'role'));

	if (access.response) return access.response;

	const id = payloadString(payload, 'id', 'userId');
	const email = payloadString(payload, 'email');
	const rawStatus = payloadString(payload, 'status');
	const status = normalizeManagedUserStatus(rawStatus);

	if (!id && !email) {
		return errorJson('User id or email is required', 400);
	}

	if (rawStatus && !status) {
		return errorJson('User status must be active, paused, or lead', 400);
	}

	const user = updateManagedUser({
		email,
		id,
		name: payloadString(payload, 'name'),
		phone: payloadString(payload, 'phone'),
		status
	});

	if (!user) {
		return errorJson('Day Night Auto user not found', 404);
	}

	return okJson({ user });
}
