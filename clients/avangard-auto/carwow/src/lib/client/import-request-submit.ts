import { resolve } from '$app/paths';
import {
	postIntake,
	invalidIntakeResponse,
	hasResponseId,
	type IntakeOptions
} from './intake-request';

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

export async function submitImportRequest(
	payload: ImportRequestSubmitPayload,
	options: IntakeOptions = {}
): Promise<ImportRequestSubmitResult> {
	const result = await postIntake(resolve('/api/import-requests'), payload, options);
	if (!result.ok) return result;
	const { body } = result;
	if (
		!hasResponseId(body, 'importRequestId') ||
		!hasResponseId(body, 'leadId') ||
		!hasResponseId(body, 'conversationId')
	)
		return invalidIntakeResponse(result.status);
	return {
		ok: true,
		importRequestId: body.importRequestId,
		leadId: body.leadId,
		conversationId: body.conversationId,
		status: typeof body.status === 'string' ? body.status : 'new'
	};
}
