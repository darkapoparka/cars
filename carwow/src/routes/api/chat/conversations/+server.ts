import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDefaultDealerSlug } from '$lib/server/app-config';
import { chatStartSchema } from '$lib/server/cms/schemas';
import { getRequestDb } from '$lib/server/db/client';
import {
	getVisitorConversation,
	listVisitorMessages,
	startVisitorConversation
} from '$lib/server/repositories/conversations';
import { createRateLimitKey, rateLimit } from '$lib/server/rate-limit';
import {
	sendStaffNotification,
	visitorChatStartedStaffNotification
} from '$lib/server/staff-notifications';
import {
	ensureVisitorChatToken,
	hashVisitorChatToken,
	readVisitorChatToken
} from '$lib/server/visitor-chat-token';

function publicConversation(
	conversation:
		| Awaited<ReturnType<typeof getVisitorConversation>>
		| NonNullable<Awaited<ReturnType<typeof getVisitorConversation>>>
) {
	if (!conversation) return null;

	return {
		id: conversation.id,
		subject: conversation.subject,
		status: conversation.status,
		lastMessageAt: conversation.last_message_at,
		createdAt: conversation.created_at,
		updatedAt: conversation.updated_at
	};
}

function publicMessage(message: Awaited<ReturnType<typeof listVisitorMessages>>[number]) {
	return {
		id: message.id,
		conversationId: message.conversation_id,
		senderType: message.sender_type,
		senderName: message.sender_name,
		body: message.body,
		readAt: message.read_at,
		createdAt: message.created_at
	};
}

function unavailable(message = 'Visitor chat is temporarily unavailable.') {
	return json({ message }, { status: 503 });
}

export const GET: RequestHandler = async ({ cookies, locals, url }) => {
	let token: string | null;

	try {
		token = readVisitorChatToken(cookies);
	} catch (error) {
		console.error('Visitor chat cookie verification failed:', error);
		return unavailable();
	}

	if (!token) {
		return json({ conversation: null, messages: [] });
	}

	let db;

	try {
		db = getRequestDb(locals);
	} catch (error) {
		console.error('Visitor chat database client failed:', error);
		return unavailable();
	}

	try {
		const tokenHash = hashVisitorChatToken(token);
		const conversation = await getVisitorConversation(db, tokenHash);
		const after = url.searchParams.get('after');
		const messages = conversation ? await listVisitorMessages(db, tokenHash, after) : [];

		return json({
			conversation: publicConversation(conversation),
			messages: messages.map(publicMessage)
		});
	} catch (error) {
		console.error('Visitor chat load failed:', error);
		return unavailable();
	}
};

export const POST: RequestHandler = async ({ cookies, getClientAddress, locals, request }) => {
	let db;

	try {
		db = getRequestDb(locals);
	} catch (error) {
		console.error('Visitor chat database client failed:', error);
		return unavailable();
	}

	let token: string;

	try {
		token = ensureVisitorChatToken(cookies);
	} catch (error) {
		console.error('Visitor chat cookie creation failed:', error);
		return unavailable();
	}

	let limit;

	try {
		limit = await rateLimit(
			createRateLimitKey('chat-start', getClientAddress(), token),
			6,
			60_000,
			{ db }
		);
	} catch (error) {
		console.error('Visitor chat rate limit failed:', error);
		return unavailable();
	}

	if (!limit.allowed) {
		return json(
			{ message: 'Получихме твърде много съобщения. Опитайте отново след малко.' },
			{ status: 429, headers: { 'retry-after': String(limit.retryAfterSec) } }
		);
	}

	const body = await request.json().catch(() => null);
	const parsed = chatStartSchema.safeParse(body);

	if (!parsed.success) {
		return json(
			{
				message: 'Invalid chat request.',
				details: parsed.error.flatten()
			},
			{ status: 400 }
		);
	}

	try {
		const tokenHash = hashVisitorChatToken(token);
		const dealerSlug = getDefaultDealerSlug();
		const result = await startVisitorConversation(db, parsed.data, tokenHash, dealerSlug);

		try {
			await sendStaffNotification(
				visitorChatStartedStaffNotification({
					dealerSlug,
					conversationId: result.conversation.id,
					messageId: result.messages[0]?.id ?? null,
					name: parsed.data.name ?? null,
					email: parsed.data.email ?? null,
					phone: parsed.data.phone ?? null,
					message: parsed.data.message
				})
			);
		} catch (error) {
			console.error('Visitor chat staff notification failed:', error);
		}

		return json(
			{
				conversation: publicConversation(result.conversation),
				messages: result.messages.map(publicMessage)
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Visitor chat start failed:', error);
		return unavailable();
	}
};
