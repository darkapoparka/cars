import { resolve } from '$app/paths';
import {
	postIntake,
	invalidIntakeResponse,
	hasResponseId,
	type IntakeOptions
} from './intake-request';

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

export async function submitLead(
	payload: LeadSubmitPayload,
	options: IntakeOptions = {}
): Promise<LeadSubmitResult> {
	const result = await postIntake(resolve('/api/leads'), payload, options);
	if (!result.ok) return result;
	const { body } = result;
	if (!hasResponseId(body, 'leadId') || !hasResponseId(body, 'conversationId'))
		return invalidIntakeResponse(result.status);
	return {
		ok: true,
		leadId: body.leadId,
		conversationId: body.conversationId,
		status: typeof body.status === 'string' ? body.status : 'new'
	};
}
