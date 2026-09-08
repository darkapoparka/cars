import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDefaultDealerSlug } from '$lib/server/app-config';
import { importRequestSchema } from '$lib/server/cms/schemas';
import { getRequestDb } from '$lib/server/db/client';
import { createImportRequestWithConversation } from '$lib/server/repositories/intake';
import { createRateLimitKey, rateLimit } from '$lib/server/rate-limit';
import {
	importRequestStaffNotification,
	sendStaffNotification
} from '$lib/server/staff-notifications';

export const POST: RequestHandler = async ({ locals, request, getClientAddress }) => {
	let db;

	try {
		db = getRequestDb(locals);
	} catch (error) {
		console.error('Import request database client failed:', error);

		return json(
			{
				message: 'Import request intake is temporarily unavailable.'
			},
			{ status: 503 }
		);
	}

	let limit;

	try {
		limit = await rateLimit(createRateLimitKey('import-requests', getClientAddress()), 5, 60_000, {
			db
		});
	} catch (error) {
		console.error('Import request rate limit failed:', error);

		return json(
			{
				message: 'Import request intake is temporarily unavailable.'
			},
			{ status: 503 }
		);
	}

	if (!limit.allowed) {
		return json(
			{ message: 'Too many requests. Try again shortly.' },
			{ status: 429, headers: { 'retry-after': String(limit.retryAfterSec) } }
		);
	}

	const body = await request.json().catch(() => null);
	const parsed = importRequestSchema.safeParse(body);

	if (!parsed.success) {
		return json(
			{
				message: 'Invalid import request.',
				details: parsed.error.flatten()
			},
			{ status: 400 }
		);
	}

	const { companyWebsite, ...importRequest } = parsed.data;

	// Honeypot tripped: accept silently (no DB write) so automated clients get no signal.
	if (companyWebsite) {
		return json({ status: 'received' }, { status: 201 });
	}

	try {
		const dealerSlug = getDefaultDealerSlug();
		const result = await createImportRequestWithConversation(db, importRequest, dealerSlug);

		try {
			await sendStaffNotification(
				importRequestStaffNotification({
					dealerSlug,
					importRequestId: result.importRequest.id,
					leadId: result.lead.id,
					conversationId: result.conversation.id,
					messageId: result.message?.id ?? null,
					customerName: importRequest.customerName,
					contact: importRequest.contact,
					email: importRequest.email ?? null,
					phone: importRequest.phone ?? null,
					desiredMake: importRequest.desiredMake ?? null,
					desiredModel: importRequest.desiredModel ?? null,
					notes: importRequest.notes
				})
			);
		} catch (error) {
			console.error('Import request staff notification failed:', error);
		}

		return json(
			{
				importRequestId: result.importRequest.id,
				leadId: result.lead.id,
				conversationId: result.conversation.id,
				status: result.importRequest.status
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Import request intake failed:', error);

		return json(
			{
				message: 'Import request intake is temporarily unavailable.'
			},
			{ status: 503 }
		);
	}
};
