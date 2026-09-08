import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import { resolveDayNightApiSession } from '$lib/server/auth';
import { updateDayNightUserProfile } from '$lib/server/db';

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const session = resolveDayNightApiSession(
		request,
		payloadString(payload, 'role', 'actorRole') ?? 'customer'
	);
	const name = [
		payloadString(payload, 'firstName', 'firstname', 'first_name', 'Firstname'),
		payloadString(payload, 'lastName', 'lastname', 'last_name', 'LastName')
	]
		.filter(Boolean)
		.join(' ')
		.trim();
	const phone = payloadString(payload, 'phone', 'Phone', 'SalesPhone');

	if (!session) {
		return errorJson('Day Night Auto account session is required', 401);
	}

	const user = updateDayNightUserProfile({
		email: session.email,
		name: payloadString(payload, 'name') ?? name,
		phone,
		role: session.role
	});

	if (!user) {
		return errorJson('Day Night Auto account profile not found', 404);
	}

	return okJson({
		email: user.email,
		name: user.name,
		phone: user.phone,
		role: user.role,
		status: 'saved',
		user
	});
}
