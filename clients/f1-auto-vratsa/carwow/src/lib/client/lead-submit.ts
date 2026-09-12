import dealer from '../data/dealer-records.json';
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
	if (dealer.previewOnly) return { ok: false, status: 503, error: `Демо: нищо не е изпратено. Обадете се на ${dealer.phone}, за да потвърдите избрания автомобил и условията.` };
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
					'Запитването не беше изпратено. Моля, обадете се или пишете във Viber.'
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
				error: 'Получихме неочакван отговор. Моля, обадете се или пишете във Viber.'
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
					: 'Запитването не може да бъде изпратено. Моля, обадете се или пишете във Viber.'
		};
	}
}
