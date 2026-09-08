import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import {
	getEliqautoGarageState,
	updateEliqautoGarageState,
	type EliqautoGarageState
} from '$lib/server/garage';
import { resolveEliqautoApiSession } from '$lib/server/auth';

const hasPayloadKey = (payload: Record<string, unknown>, key: string) =>
	Object.prototype.hasOwnProperty.call(payload, key);

export function GET({ request, url }: { request: Request; url: URL }) {
	const session = resolveEliqautoApiSession(request, url.searchParams.get('role') ?? undefined);

	if (!session) {
		return errorJson('Eliqauto account session is required', 401);
	}

	return okJson(getEliqautoGarageState(session));
}

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const session = resolveEliqautoApiSession(request, payloadString(payload, 'actorRole', 'role'));

	if (!session) {
		return errorJson('Eliqauto account session is required', 401);
	}

	const patch: Partial<EliqautoGarageState> = {};

	if (hasPayloadKey(payload, 'favorites')) {
		patch.favorites = Array.isArray(payload.favorites) ? payload.favorites : [];
	}

	if (hasPayloadKey(payload, 'compare')) {
		patch.compare = Array.isArray(payload.compare) ? payload.compare : [];
	}

	return okJson(updateEliqautoGarageState(session, patch));
}
