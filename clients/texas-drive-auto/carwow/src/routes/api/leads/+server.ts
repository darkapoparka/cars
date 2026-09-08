import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDefaultDealerSlug } from '$lib/server/app-config';
import { leadRequestSchema } from '$lib/server/cms/schemas';
import { getRequestDb } from '$lib/server/db/client';
import { createLeadWithConversation } from '$lib/server/repositories/intake';
import { createRateLimitKey, rateLimit } from '$lib/server/rate-limit';
import { leadStaffNotification, sendStaffNotification } from '$lib/server/staff-notifications';

export const POST: RequestHandler = async ({ locals, request, getClientAddress }) => {
	let db;

	try {
		db = getRequestDb(locals);
	} catch (error) {
		console.error('Lead intake database client failed:', error);

		return json(
			{
				message: 'Lead intake is temporarily unavailable.'
			},
			{ status: 503 }
		);
	}

	// Abuse protection: cap submissions per client. On Vercel, SvelteKit's Vercel
	// adapter is expected to resolve this from the platform forwarded IP headers.
	let limit;

	try {
		limit = await rateLimit(createRateLimitKey('leads', getClientAddress()), 5, 60_000, {
			db
		});
	} catch (error) {
		console.error('Lead intake rate limit failed:', error);

		return json(
			{
				message: 'Lead intake is temporarily unavailable.'
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
	const parsed = leadRequestSchema.safeParse(body);

	if (!parsed.success) {
		return json(
			{
				message: 'Invalid lead request.',
				details: parsed.error.flatten()
			},
			{ status: 400 }
		);
	}

	const { companyWebsite, ...lead } = parsed.data;

	// Honeypot tripped: accept silently (no DB write) so automated clients get no signal.
	if (companyWebsite) {
		return json({ status: 'received' }, { status: 201 });
	}

	try {
		const dealerSlug = getDefaultDealerSlug();
		const result = await createLeadWithConversation(db, lead, dealerSlug);

		try {
			await sendStaffNotification(
				leadStaffNotification({
					dealerSlug,
					leadId: result.lead.id,
					conversationId: result.conversation.id,
					messageId: result.message?.id ?? null,
					customerName: lead.customerName,
					contact: lead.contact,
					email: lead.email ?? null,
					phone: lead.phone ?? null,
					source: lead.source,
					message: lead.message
				})
			);
		} catch (error) {
			console.error('Lead staff notification failed:', error);
		}

		return json(
			{
				leadId: result.lead.id,
				conversationId: result.conversation.id,
				status: result.lead.status
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Lead intake failed:', error);

		return json(
			{
				message: 'Lead intake is temporarily unavailable.'
			},
			{ status: 503 }
		);
	}
};
