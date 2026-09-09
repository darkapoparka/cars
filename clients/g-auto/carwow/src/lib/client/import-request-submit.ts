import { daynightSite } from '$lib/data/daynight-site';
import { resolve } from '$app/paths';

export type ImportRequestSubmitPayload = {
	customerName: string;
	contact: string;
	email: string | null;
	phone: string | null;
	originCountry: string;
	destinationCountry: string;
	desiredMake: string | null;
	desiredModel: string | null;
	desiredYearMin: number | null;
	desiredYearMax: number | null;
	budgetMin: number | null;
	budgetMax: number | null;
	fuel: string | null;
	transmission: string | null;
	notes: string;
	/** Honeypot — leave empty; only bots populate it. Dropped server-side when filled. */
	companyWebsite?: string | null;
};

export type ImportRequestSubmitResult =
	| {
			ok: true;
			importRequestId: string;
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

export async function submitImportRequest(
	payload: ImportRequestSubmitPayload
): Promise<ImportRequestSubmitResult> {
	if (daynightSite.previewMode) return {ok:false,status:503,error:'Демонстрационна форма: съобщението не е изпратено. Свържете се с G Auto на 0896 645 757.'};
	try {
		const response = await fetch(resolve('/api/import-requests'), {
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
					'Заявката не беше изпратена. Моля, обадете се или пишете във Viber.'
				),
				details: isJsonObject(body) ? body.details : undefined
			};
		}

		if (
			!isJsonObject(body) ||
			typeof body.importRequestId !== 'string' ||
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
			importRequestId: body.importRequestId,
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
					: 'Заявката не може да бъде изпратена. Моля, обадете се или пишете във Viber.'
		};
	}
}
