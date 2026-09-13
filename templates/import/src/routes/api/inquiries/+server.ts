import {
	createInquiry,
	listInquiriesForRole,
	listStoredInquiriesForAdmin,
	normalizeInquiryStatus,
	updateInquiry
} from '$lib/server/inquiries';
import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import { requireDayNightApiAccess } from '$lib/server/api-auth';
import { normalizeDayNightRole } from '$lib/server/roles';
import type { ApiPayload } from '$lib/server/api';
import { z } from 'zod';
import { hasInquiryDatabase } from '$lib/server/inquiry-config';

const submissionSchema = z
	.object({
		agentSlug: z.string().max(160).optional(),
		email: z.email().max(254).optional(),
		name: z.string().min(2).max(160),
		phone: z.string().min(5).max(60).optional(),
		message: z.string().max(5000).optional(),
		routePath: z.string().max(500).optional(),
		source: z.string().max(100).optional(),
		vehicleSlug: z.string().max(160).optional()
	})
	.refine((value) => Boolean(value.email || value.phone), 'Email or phone is required');

const contactName = (payload: ApiPayload) => {
	const directName = payloadString(payload, 'name', 'SendInquiryname');

	if (directName) return directName;

	const fullName = [
		payloadString(payload, 'Firstname', 'firstname', 'first_name'),
		payloadString(payload, 'Lastname', 'lastname', 'last_name')
	]
		.filter(Boolean)
		.join(' ');

	return fullName || undefined;
};

const inquiryMessage = (payload: ApiPayload) => {
	const directMessage = payloadString(payload, 'message', 'message2');
	const inquiryType = payloadString(payload, 'inquiryType', 'type');
	const service = payloadString(payload, 'service');
	const preferredDate = payloadString(payload, 'date');
	const vehicle = payloadString(payload, 'vehicle', 'Vehicle', 'vin', 'VIN');

	if (!directMessage && !inquiryType && !service && !preferredDate && !vehicle) return undefined;

	return [
		directMessage,
		inquiryType ? `Inquiry type: ${inquiryType}` : undefined,
		service ? `Service: ${service}` : undefined,
		preferredDate ? `Preferred date: ${preferredDate}` : undefined,
		vehicle ? `Vehicle or VIN: ${vehicle}` : undefined
	]
		.filter(Boolean)
		.join(' | ');
};

export async function GET({ request, url }: { request: Request; url: URL }) {
	const role = normalizeDayNightRole(url.searchParams.get('role'));
	const access = requireDayNightApiAccess({
		allowedRoles: hasInquiryDatabase() ? ['admin'] : undefined,
		fallbackRole: role,
		request,
		routePath: role === 'customer' ? 'account/messages' : 'admin/inquiries'
	});

	if (access.response) return access.response;

	try {
		return okJson({
			inquiries: hasInquiryDatabase()
				? await listStoredInquiriesForAdmin()
				: listInquiriesForRole(role ?? access.session.role)
		});
	} catch {
		return errorJson('Inquiries are temporarily unavailable.', 503);
	}
}

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const parsed = submissionSchema.safeParse({
		agentSlug: payloadString(payload, 'agentSlug', 'assignedAgentSlug'),
		email: payloadString(payload, 'email', 'SendInquiryemail'),
		message: inquiryMessage(payload),
		name: contactName(payload),
		phone: payloadString(payload, 'phone', 'SendInquiryphone'),
		routePath: payloadString(payload, 'routePath'),
		source: payloadString(payload, 'source'),
		vehicleSlug: payloadString(payload, 'vehicleSlug')
	});
	if (!parsed.success)
		return errorJson(
			'Please provide your name and a valid email or phone. Keep the message under 5000 characters.',
			400
		);
	try {
		const inquiry = await createInquiry({ ...parsed.data, userRole: 'customer' });
		return okJson(
			{ inquiry, storage: hasInquiryDatabase() ? 'database' : 'demo' },
			{ status: 201 }
		);
	} catch {
		return errorJson('Your inquiry could not be saved. Please try again.', 503);
	}
}

export async function PATCH({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const access = requireDayNightApiAccess({
		allowedRoles: hasInquiryDatabase() ? ['admin'] : ['admin', 'agent'],
		fallbackRole: payloadString(payload, 'actorRole', 'role', 'userRole'),
		request,
		routePath: 'admin/inquiries'
	});

	if (access.response) return access.response;

	const id = payloadString(payload, 'id', 'inquiryId');

	if (!id) {
		return errorJson('Inquiry id is required', 400);
	}

	const rawStatus = payloadString(payload, 'status');
	const note = payloadString(payload, 'message', 'note');
	if ((rawStatus && !normalizeInquiryStatus(rawStatus)) || (note && note.length > 5000))
		return errorJson('Invalid inquiry update.', 400);
	try {
		const inquiry = await updateInquiry({
			assignedAgentSlug: payloadString(payload, 'assignedAgentSlug', 'agentSlug'),
			id,
			message: payloadString(payload, 'message', 'note'),
			status: normalizeInquiryStatus(payloadString(payload, 'status'))
		});

		if (!inquiry) {
			return errorJson('Day Night Auto inquiry not found', 404);
		}

		return okJson({ inquiry });
	} catch {
		return errorJson('The inquiry could not be updated. Please try again.', 503);
	}
}
