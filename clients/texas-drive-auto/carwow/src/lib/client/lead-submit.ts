import { resolve } from '$app/paths';

export type LeadSubmitPayload = {
	customerName: string;
	contact: string;
	email: string | null;
	phone: string | null;
	source: string;
	message: string;
	vehicleId?: string | null;
	value?: number | null;
	/** Honeypot — leave empty; only bots populate it. Dropped server-side when filled. */
	companyWebsite?: string | null;
};

export type LeadSubmitResult =
	| {
			ok: true;
			leadId: string;
			conversationId: string;
			status: string;
	  }
	| {
			ok: false;
			status: number;
			error: string;
			details?: unknown;
	  };

function isJsonObject(value: unknown): value is Record<string, unknown> {
	return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function readResponseMessage(body: unknown, fallback: string) {
	if (!isJsonObject(body) || typeof body.message !== 'string') {
		return fallback;
	}

	return body.message;
}

export async function submitLead(payload: LeadSubmitPayload): Promise<LeadSubmitResult> {
	try {
		const response = await fetch(resolve('/api/leads'), {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});
		const body = await response.json().catch(() => null);

		if (!response.ok) {
			return {
				ok: false,
				status: response.status,
				error: readResponseMessage(
					body,
					'Inquiry not sent. Please call or message us on Viber.'
				),
				details: isJsonObject(body) ? body.details : undefined
			};
		}

		if (
			!isJsonObject(body) ||
			typeof body.leadId !== 'string' ||
			typeof body.conversationId !== 'string'
		) {
			return {
				ok: false,
				status: response.status,
				error: 'Unexpected response. Please call or message us on Viber.'
			};
		}

		return {
			ok: true,
			leadId: body.leadId,
			conversationId: body.conversationId,
			status: typeof body.status === 'string' ? body.status : 'new'
		};
	} catch (error) {
		return {
			ok: false,
			status: 0,
			error:
				error instanceof Error
					? error.message
					: 'Inquiry could not be sent. Please call or message us on Viber.'
		};
	}
}
