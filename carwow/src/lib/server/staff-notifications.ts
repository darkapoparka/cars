import { env } from '$env/dynamic/private';

export type StaffNotificationType =
	| 'lead.created'
	| 'import_request.created'
	| 'visitor_chat.started'
	| 'visitor_chat.message_created';

export type StaffNotificationPayload = {
	type: StaffNotificationType;
	title: string;
	message: string;
	dealerSlug: string;
	occurredAt: string;
	adminPath?: string;
	records: Record<string, string | null>;
	contact?: {
		name?: string | null;
		contact?: string | null;
		email?: string | null;
		phone?: string | null;
	};
	metadata?: Record<string, string | number | boolean | null>;
};

export type StaffNotificationResult =
	| { status: 'skipped' }
	| { status: 'sent'; httpStatus: number };

const DEFAULT_NOTIFICATION_TIMEOUT_MS = 2500;
const MAX_TEXT_LENGTH = 500;

function cleanText(value: string | null | undefined, max = MAX_TEXT_LENGTH) {
	const text = value?.trim();
	if (!text) return null;
	return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

function notificationTimeoutMs() {
	const parsed = Number.parseInt(env.STAFF_NOTIFICATION_TIMEOUT_MS ?? '', 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_NOTIFICATION_TIMEOUT_MS;
}

export function leadStaffNotification(input: {
	dealerSlug: string;
	leadId: string;
	conversationId: string;
	messageId: string | null;
	customerName: string;
	contact: string;
	email?: string | null;
	phone?: string | null;
	source: string;
	message?: string | null;
}) {
	return {
		type: 'lead.created',
		title: 'New website lead',
		message: cleanText(input.message) ?? `${input.customerName} submitted a lead.`,
		dealerSlug: input.dealerSlug,
		occurredAt: new Date().toISOString(),
		adminPath: '/admin/leads',
		records: {
			leadId: input.leadId,
			conversationId: input.conversationId,
			messageId: input.messageId
		},
		contact: {
			name: cleanText(input.customerName, 160),
			contact: cleanText(input.contact, 180),
			email: cleanText(input.email, 254),
			phone: cleanText(input.phone, 80)
		},
		metadata: {
			source: cleanText(input.source, 80)
		}
	} satisfies StaffNotificationPayload;
}

export function importRequestStaffNotification(input: {
	dealerSlug: string;
	importRequestId: string;
	leadId: string;
	conversationId: string;
	messageId: string | null;
	customerName: string;
	contact: string;
	email?: string | null;
	phone?: string | null;
	desiredMake?: string | null;
	desiredModel?: string | null;
	notes?: string | null;
}) {
	const vehicleLabel = [input.desiredMake, input.desiredModel]
		.map((value) => cleanText(value, 120))
		.filter(Boolean)
		.join(' ');

	return {
		type: 'import_request.created',
		title: 'New import request',
		message:
			cleanText(input.notes) ??
			(vehicleLabel
				? `${input.customerName} requested import help for ${vehicleLabel}.`
				: `${input.customerName} requested import help.`),
		dealerSlug: input.dealerSlug,
		occurredAt: new Date().toISOString(),
		adminPath: '/admin/imports',
		records: {
			importRequestId: input.importRequestId,
			leadId: input.leadId,
			conversationId: input.conversationId,
			messageId: input.messageId
		},
		contact: {
			name: cleanText(input.customerName, 160),
			contact: cleanText(input.contact, 180),
			email: cleanText(input.email, 254),
			phone: cleanText(input.phone, 80)
		},
		metadata: {
			desiredVehicle: vehicleLabel || null
		}
	} satisfies StaffNotificationPayload;
}

export function visitorChatStartedStaffNotification(input: {
	dealerSlug: string;
	conversationId: string;
	messageId: string | null;
	name?: string | null;
	email?: string | null;
	phone?: string | null;
	message?: string | null;
}) {
	return {
		type: 'visitor_chat.started',
		title: 'New visitor chat',
		message: cleanText(input.message) ?? 'A visitor started a chat.',
		dealerSlug: input.dealerSlug,
		occurredAt: new Date().toISOString(),
		adminPath: `/admin/conversations/${input.conversationId}`,
		records: {
			conversationId: input.conversationId,
			messageId: input.messageId
		},
		contact: {
			name: cleanText(input.name, 160),
			email: cleanText(input.email, 254),
			phone: cleanText(input.phone, 80)
		}
	} satisfies StaffNotificationPayload;
}

export function visitorChatMessageStaffNotification(input: {
	dealerSlug: string;
	conversationId: string;
	messageId: string;
	message: string;
}) {
	return {
		type: 'visitor_chat.message_created',
		title: 'New visitor chat message',
		message: cleanText(input.message) ?? 'A visitor sent a chat message.',
		dealerSlug: input.dealerSlug,
		occurredAt: new Date().toISOString(),
		adminPath: `/admin/conversations/${input.conversationId}`,
		records: {
			conversationId: input.conversationId,
			messageId: input.messageId
		}
	} satisfies StaffNotificationPayload;
}

export async function sendStaffNotification(
	payload: StaffNotificationPayload
): Promise<StaffNotificationResult> {
	const webhookUrl = env.STAFF_NOTIFICATION_WEBHOOK_URL?.trim();
	if (!webhookUrl) return { status: 'skipped' };

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), notificationTimeoutMs());

	try {
		const headers: Record<string, string> = {
			'content-type': 'application/json',
			'user-agent': 'daynight-auto-backend/1.0'
		};
		const token = env.STAFF_NOTIFICATION_WEBHOOK_TOKEN?.trim();
		if (token) headers.authorization = `Bearer ${token}`;

		const response = await fetch(webhookUrl, {
			method: 'POST',
			headers,
			body: JSON.stringify(payload),
			signal: controller.signal
		});

		if (!response.ok) {
			throw new Error(`Staff notification webhook returned HTTP ${response.status}.`);
		}

		return { status: 'sent', httpStatus: response.status };
	} finally {
		clearTimeout(timeout);
	}
}
