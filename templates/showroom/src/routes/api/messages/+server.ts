import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import {
	createMessage,
	listMessagesForRole,
	normalizeMessageStatus,
	updateMessage
} from '$lib/server/messages';
import { requireEliqautoApiAccess } from '$lib/server/api-auth';
import { normalizeEliqautoRole } from '$lib/server/roles';

const messagesRouteForRole = (role = 'customer') =>
	role === 'customer' ? 'account/messages' : 'admin/messages';

export function GET({ request, url }: { request: Request; url: URL }) {
	const role = normalizeEliqautoRole(url.searchParams.get('role'));
	const access = requireEliqautoApiAccess({
		fallbackRole: role,
		request,
		routePath: messagesRouteForRole(role)
	});

	if (access.response) return access.response;

	return okJson({ messages: listMessagesForRole(role ?? access.session.role) });
}

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const message = createMessage({
		email: payloadString(
			payload,
			'email',
			'email-comment',
			'footer-email',
			'email-newsletter',
			'search-headerSubscribe'
		),
		message: payloadString(payload, 'message', 'comment'),
		name: payloadString(payload, 'name', 'name-review'),
		routePath: payloadString(payload, 'routePath'),
		threadId: payloadString(payload, 'threadId'),
		vehicleSlug: payloadString(payload, 'vehicleSlug')
	});

	return okJson({ message }, { status: 201 });
}

export async function PATCH({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const role = normalizeEliqautoRole(payloadString(payload, 'actorRole', 'role', 'userRole'));
	const access = requireEliqautoApiAccess({
		fallbackRole: role,
		request,
		routePath: messagesRouteForRole(role)
	});

	if (access.response) return access.response;

	const id = payloadString(payload, 'id', 'messageId', 'threadId');

	if (!id) {
		return errorJson('Message id or thread id is required', 400);
	}

	const message = updateMessage({
		id,
		message: payloadString(payload, 'message', 'note'),
		status: normalizeMessageStatus(payloadString(payload, 'status'))
	});

	if (!message) {
		return errorJson('Eliqauto message thread not found', 404);
	}

	return okJson({ message });
}
