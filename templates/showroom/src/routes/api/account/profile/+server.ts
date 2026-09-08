import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import { resolveEliqautoApiSession } from '$lib/server/auth';
import { updateEliqautoUserProfile } from '$lib/server/db';

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const session = resolveEliqautoApiSession(
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
		return errorJson('Eliqauto account session is required', 401);
	}

	const user = updateEliqautoUserProfile({
		email: session.email,
		name: payloadString(payload, 'name') ?? name,
		phone,
		role: session.role
	});

	if (!user) {
		return errorJson('Eliqauto account profile not found', 404);
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
