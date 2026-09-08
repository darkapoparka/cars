import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import { resolveEliqautoApiSession } from '$lib/server/auth';
import { createEliqautoPasswordChangeRecord, findEliqautoUserByEmail } from '$lib/server/db';

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const session = resolveEliqautoApiSession(
		request,
		payloadString(payload, 'role', 'actorRole') ?? 'customer'
	);
	const nextPassword = payloadString(payload, 'newPassword', 'NewPassword', 'password');
	const confirmPassword = payloadString(
		payload,
		'confirmPassword',
		'RetypeNewPassword',
		'ConfirmPassword'
	);
	const user = session ? findEliqautoUserByEmail(session.email) : undefined;

	if (!session) {
		return errorJson('Eliqauto account session is required', 401);
	}

	if (!nextPassword || nextPassword.length < 8) {
		return errorJson('Password must be at least 8 characters', 400);
	}

	if (confirmPassword && confirmPassword !== nextPassword) {
		return errorJson('Password confirmation does not match', 400);
	}

	if (!user) {
		return errorJson('Eliqauto account not found', 404);
	}

	const passwordChange = createEliqautoPasswordChangeRecord(user);

	return okJson({
		changedAt: passwordChange.createdAt,
		email: passwordChange.email,
		role: passwordChange.role,
		status: 'password-change-recorded'
	});
}
