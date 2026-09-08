import { okJson, payloadString, readApiPayload } from '$lib/server/api';
import { createMessage } from '$lib/server/messages';

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const email = payloadString(payload, 'email', 'username', 'email-forgot-password');
	const message = createMessage({
		email,
		message: 'Password recovery request from the preserved Day Night Auto auth modal.',
		name: 'Day Night Auto password recovery',
		routePath: '/account/password',
		threadId: 'daynight-auth'
	});

	return okJson({ message, status: 'recovery-request-recorded' }, { status: 201 });
}
