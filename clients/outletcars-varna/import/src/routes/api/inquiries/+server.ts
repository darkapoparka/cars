import {
	createInquiry,
	listInquiriesForRole,
	normalizeInquiryStatus,
	updateInquiry
} from '$lib/server/inquiries';
import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import { requireDayNightApiAccess } from '$lib/server/api-auth';
import { normalizeDayNightRole } from '$lib/server/roles';
import type { ApiPayload } from '$lib/server/api';

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

export function GET({ request, url }: { request: Request; url: URL }) {
	const role = normalizeDayNightRole(url.searchParams.get('role'));
	const access = requireDayNightApiAccess({
		fallbackRole: role,
		request,
		routePath: role === 'customer' ? 'account/messages' : 'admin/inquiries'
	});

	if (access.response) return access.response;

	return okJson({ inquiries: listInquiriesForRole(role ?? access.session.role) });
}

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const inquiry = createInquiry({
		agentSlug: payloadString(payload, 'agentSlug', 'assignedAgentSlug'),
		email: payloadString(payload, 'email', 'SendInquiryemail'),
		message: inquiryMessage(payload),
		name: contactName(payload),
		phone: payloadString(payload, 'phone', 'SendInquiryphone'),
		routePath: payloadString(payload, 'routePath'),
		source: payloadString(payload, 'source'),
		userRole: payloadString(payload, 'role', 'userRole'),
		vehicleSlug: payloadString(payload, 'vehicleSlug')
	});

	return okJson({ inquiry }, { status: 201 });
}

export async function PATCH({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const access = requireDayNightApiAccess({
		allowedRoles: ['admin', 'agent'],
		fallbackRole: payloadString(payload, 'actorRole', 'role', 'userRole'),
		request,
		routePath: 'admin/inquiries'
	});

	if (access.response) return access.response;

	const id = payloadString(payload, 'id', 'inquiryId');

	if (!id) {
		return errorJson('Inquiry id is required', 400);
	}

	const inquiry = updateInquiry({
		assignedAgentSlug: payloadString(payload, 'assignedAgentSlug', 'agentSlug'),
		id,
		message: payloadString(payload, 'message', 'note'),
		status: normalizeInquiryStatus(payloadString(payload, 'status'))
	});

	if (!inquiry) {
		return errorJson('OUTLETCARS.BG — Варна inquiry not found', 404);
	}

	return okJson({ inquiry });
}
