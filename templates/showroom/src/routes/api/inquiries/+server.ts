import {
	createInquiry,
	listInquiriesForRole,
	normalizeInquiryStatus,
	updateInquiry
} from '$lib/server/inquiries';
import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import { requireEliqautoApiAccess } from '$lib/server/api-auth';
import { normalizeEliqautoRole } from '$lib/server/roles';
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
	const subject = payloadString(payload, 'subject', 'SendInquirysubject');
	const inquiryType = payloadString(payload, 'inquiryType', 'type');
	const service = payloadString(payload, 'service');
	const preferredDate = payloadString(payload, 'date');
	const vehicle = payloadString(payload, 'vehicle', 'Vehicle', 'vin', 'VIN');

	if (!directMessage && !subject && !inquiryType && !service && !preferredDate && !vehicle) {
		return undefined;
	}

	return [
		directMessage,
		subject ? `Subject: ${subject}` : undefined,
		inquiryType ? `Inquiry type: ${inquiryType}` : undefined,
		service ? `Service: ${service}` : undefined,
		preferredDate ? `Preferred date: ${preferredDate}` : undefined,
		vehicle ? `Vehicle or VIN: ${vehicle}` : undefined
	]
		.filter(Boolean)
		.join(' | ');
};

const isValidEmail = (email: string | undefined) =>
	!email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function GET({ request, url }: { request: Request; url: URL }) {
	const role = normalizeEliqautoRole(url.searchParams.get('role'));
	const access = requireEliqautoApiAccess({
		fallbackRole: role,
		request,
		routePath: role === 'customer' ? 'account/messages' : 'admin/inquiries'
	});

	if (access.response) return access.response;

	return okJson({ inquiries: listInquiriesForRole(role ?? access.session.role) });
}

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const email = payloadString(payload, 'email', 'SendInquiryemail');
	const name = contactName(payload);
	const phone = payloadString(payload, 'phone', 'SendInquiryphone');

	if (!name) {
		return errorJson('Contact name is required', 400);
	}

	if (!phone && !email) {
		return errorJson('Phone or email is required', 400);
	}

	if (!isValidEmail(email)) {
		return errorJson('Email address is invalid', 400);
	}

	const inquiry = createInquiry({
		agentSlug: payloadString(payload, 'agentSlug', 'assignedAgentSlug'),
		email,
		message: inquiryMessage(payload),
		name,
		phone,
		routePath: payloadString(payload, 'routePath'),
		source: payloadString(payload, 'source'),
		userRole: payloadString(payload, 'role', 'userRole'),
		vehicleSlug: payloadString(payload, 'vehicleSlug')
	});

	return okJson({ inquiry }, { status: 201 });
}

export async function PATCH({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const access = requireEliqautoApiAccess({
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
		return errorJson('Eliqauto inquiry not found', 404);
	}

	return okJson({ inquiry });
}
