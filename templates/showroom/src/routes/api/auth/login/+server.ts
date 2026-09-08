import { authenticateEliqautoUser, sessionCookieForEliqautoSession } from '$lib/server/auth';
import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const email = payloadString(payload, 'email', 'username', 'email-login') ?? '';
	const password = payloadString(payload, 'password', 'Password-login') ?? '';
	const role = payloadString(payload, 'role');
	const session = authenticateEliqautoUser({ email, password, role });

	if (!session) {
		return errorJson('Invalid Eliqauto account credentials', 401);
	}

	const cookie = sessionCookieForEliqautoSession(session);

	return okJson(
		{ session },
		cookie
			? {
					headers: {
						'set-cookie': cookie
					}
				}
			: undefined
	);
}
