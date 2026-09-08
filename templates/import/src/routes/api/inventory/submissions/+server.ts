import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import { requireDayNightApiAccess } from '$lib/server/api-auth';
import {
	createVehicleSubmission,
	listVehicleSubmissions,
	normalizeVehicleSubmissionStatus,
	updateVehicleSubmission
} from '$lib/server/inventory';

export function GET({ request, url }: { request: Request; url: URL }) {
	const access = requireDayNightApiAccess({
		allowedRoles: ['admin', 'agent'],
		fallbackRole: url.searchParams.get('role') ?? undefined,
		request,
		routePath: 'admin/inquiries'
	});

	if (access.response) return access.response;

	return okJson({ submissions: listVehicleSubmissions() });
}

export async function POST({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const source = payloadString(payload, 'source');

	if (source === 'admin-listing') {
		const access = requireDayNightApiAccess({
			allowedRoles: ['admin'],
			fallbackRole: payloadString(payload, 'actorRole', 'role'),
			request,
			routePath: 'admin/inventory/new'
		});

		if (access.response) return access.response;
	}

	const submission = createVehicleSubmission({
		email: payloadString(payload, 'email'),
		expectedPrice: payloadString(payload, 'expectedPrice', 'price'),
		message: payloadString(payload, 'message'),
		mileage: payloadString(payload, 'mileage'),
		name: payloadString(payload, 'name', 'firstname', 'Firstname'),
		phone: payloadString(payload, 'phone'),
		routePath: payloadString(payload, 'routePath'),
		source:
			source === 'admin-listing'
				? 'admin-listing'
				: source === 'customer-listing'
					? 'customer-listing'
					: 'sell-your-car',
		status: source === 'admin-listing' ? 'draft' : 'submitted',
		title: payloadString(payload, 'title', 'vehicleTitle'),
		vin: payloadString(payload, 'vin', 'VIN')
	});

	return okJson({ submission }, { status: 201 });
}

export async function PATCH({ request }: { request: Request }) {
	const payload = await readApiPayload(request);
	const access = requireDayNightApiAccess({
		allowedRoles: ['admin', 'agent'],
		fallbackRole: payloadString(payload, 'actorRole', 'role'),
		request,
		routePath: 'admin/inquiries'
	});

	if (access.response) return access.response;

	const id = payloadString(payload, 'id', 'submissionId');

	if (!id) {
		return errorJson('Submission id is required', 400);
	}

	const status = normalizeVehicleSubmissionStatus(payloadString(payload, 'status'));
	const submission = updateVehicleSubmission({
		expectedPrice: payloadString(payload, 'expectedPrice', 'price'),
		id,
		message: payloadString(payload, 'message', 'note'),
		mileage: payloadString(payload, 'mileage'),
		status,
		title: payloadString(payload, 'title', 'vehicleTitle'),
		vin: payloadString(payload, 'vin', 'VIN')
	});

	if (!submission) {
		return errorJson('Day Night Auto vehicle submission not found', 404);
	}

	return okJson({ submission });
}
