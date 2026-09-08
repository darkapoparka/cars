import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import {
	getDayNightGarageState,
	updateDayNightGarageState,
	type DayNightGarageState
} from '$lib/server/garage';
import { resolveDayNightApiSession } from '$lib/server/auth';

const hasPayloadKey = (payload: Record<string, unknown>, key: string) =>
	Object.prototype.hasOwnProperty.call(payload, key);

export function GET({ request, url }: { request: Request; url: URL }) {
	const session = resolveDayNightApiSession(request, url.searchParams.get('role') ?? undefined);

	if (!session) {
		return errorJson('Day Night Auto account session is required', 401);
	}

	return okJson(getDayNightGarageState(session));
}

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const session = resolveDayNightApiSession(request, payloadString(payload, 'actorRole', 'role'));

	if (!session) {
		return errorJson('Day Night Auto account session is required', 401);
	}

	const patch: Partial<DayNightGarageState> = {};

	if (hasPayloadKey(payload, 'favorites')) {
		patch.favorites = Array.isArray(payload.favorites) ? payload.favorites : [];
	}

	if (hasPayloadKey(payload, 'compare')) {
		patch.compare = Array.isArray(payload.compare) ? payload.compare : [];
	}

	return okJson(updateDayNightGarageState(session, patch));
}
