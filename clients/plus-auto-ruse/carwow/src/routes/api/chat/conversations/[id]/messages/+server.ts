import { json } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDefaultDealerSlug } from '$lib/server/app-config';
import { chatMessageSchema } from '$lib/server/cms/schemas';
import { getRequestDb, type Db } from '$lib/server/db/client';
import {
	createVisitorMessage,
	getVisitorConversation,
	listVisitorMessages
} from '$lib/server/repositories/conversations';
import { createRateLimitKey, rateLimit } from '$lib/server/rate-limit';
import {
	sendStaffNotification,
	visitorChatMessageStaffNotification
} from '$lib/server/staff-notifications';
import { hashVisitorChatToken, readVisitorChatToken } from '$lib/server/visitor-chat-token';

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

type VisitorConversationContext =
	| { ok: false; response: Response }
	| {
			ok: true;
			db: Db;
			token: string;
			tokenHash: string;
			conversation: NonNullable<Awaited<ReturnType<typeof getVisitorConversation>>>;
	  };

async function requireVisitorConversation(
	cookies: Cookies,
	locals: App.Locals,
	conversationId: string
): Promise<VisitorConversationContext> {
	const token = readVisitorChatToken(cookies);

	if (!token) {
		return {
			ok: false,
			response: json({ message: 'Conversation was not found.' }, { status: 404 })
		};
	}

	const db = getRequestDb(locals);
	const tokenHash = hashVisitorChatToken(token);
	const conversation = await getVisitorConversation(db, tokenHash);

	if (!conversation || conversation.id !== conversationId) {
		return {
			ok: false,
			response: json({ message: 'Conversation was not found.' }, { status: 404 })
		};
	}

	return { ok: true, db, token, tokenHash, conversation };
}

export const GET: RequestHandler = async ({ cookies, locals, params, url }) => {
	try {
		const context = await requireVisitorConversation(cookies, locals, params.id);
		if (!context.ok) return context.response;

		const messages = await listVisitorMessages(
			context.db,
			context.tokenHash,
			url.searchParams.get('after')
		);

		return json({
			conversationId: context.conversation.id,
			messages: messages.map(publicMessage)
		});
	} catch (error) {
		console.error('Visitor chat messages load failed:', error);
		return unavailable();
	}
};

export const POST: RequestHandler = async ({
	cookies,
	getClientAddress,
	locals,
	params,
	request
}) => {
	let context;

	try {
		context = await requireVisitorConversation(cookies, locals, params.id);
	} catch (error) {
		console.error('Visitor chat conversation verification failed:', error);
		return unavailable();
	}

	if (!context.ok) return context.response;

	let limit;

	try {
		limit = await rateLimit(
			createRateLimitKey('chat-message', getClientAddress(), context.token),
			12,
			60_000,
			{ db: context.db }
		);
	} catch (error) {
		console.error('Visitor chat message rate limit failed:', error);
		return unavailable();
	}

	if (!limit.allowed) {
		return json(
			{ message: 'Получихме твърде много съобщения. Опитайте отново след малко.' },
			{ status: 429, headers: { 'retry-after': String(limit.retryAfterSec) } }
		);
	}

	const body = await request.json().catch(() => null);
	const parsed = chatMessageSchema.safeParse(body);

	if (!parsed.success) {
		return json(
			{
				message: 'Invalid chat message.',
				details: parsed.error.flatten()
			},
			{ status: 400 }
		);
	}

	try {
		const message = await createVisitorMessage(context.db, context.tokenHash, parsed.data.message);

		try {
			await sendStaffNotification(
				visitorChatMessageStaffNotification({
					dealerSlug: getDefaultDealerSlug(),
					conversationId: context.conversation.id,
					messageId: message.id,
					message: parsed.data.message
				})
			);
		} catch (error) {
			console.error('Visitor chat message staff notification failed:', error);
		}

		return json(
			{
				message: publicMessage(message)
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Visitor chat message failed:', error);
		return unavailable();
	}
};
