import { registerEliqautoCustomer, sessionCookieForEliqautoSession } from '$lib/server/auth';
import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const email = payloadString(payload, 'email', 'username', 'SignUp-login') ?? '';
	const password = payloadString(payload, 'password', 'Password-SignUp') ?? '';
	const confirmPassword = payloadString(payload, 'confirmPassword', 'ConfirmPassword-SignUp');

	if (confirmPassword && confirmPassword !== password) {
		return errorJson('Eliqauto account passwords do not match', 400);
	}

	const session = registerEliqautoCustomer({
		email,
		name: payloadString(payload, 'name', 'fullName'),
		password,
		phone: payloadString(payload, 'phone')
	});

	if (!session) {
		return errorJson('Eliqauto customer account could not be created', 400);
	}

	const cookie = sessionCookieForEliqautoSession(session);

	return okJson(
		{ session, status: 'registered' },
		cookie
			? {
					headers: { 'set-cookie': cookie },
					status: 201
				}
			: { status: 201 }
	);
}
