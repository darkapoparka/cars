import { sellSubmissionSchema } from '$lib/domain/vehicle-intake';
import { createInquiry } from '$lib/server/inquiries';
import { runtimeConfig } from '$lib/server/runtime-config';
import { errorJson, okJson, payloadString, readApiPayload } from '$lib/server/api';
import { requireDayNightApiAccess } from '$lib/server/api-auth';
import {
	createVehicleSubmission,
	listVehicleSubmissions,
	normalizeVehicleSubmissionStatus,
	updateVehicleSubmission
} from '$lib/server/inventory';

export function GET({ request, url }: { request: Request; url: URL }) {
	if (!runtimeConfig().cmsEnabled)
		return errorJson('The demonstration inventory inbox is disabled in live mode', 503);
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
	const parsed = sellSubmissionSchema.safeParse({
		name: payloadString(payload, 'name', 'firstname', 'Firstname'),
		email: payloadString(payload, 'email'),
		phone: payloadString(payload, 'phone'),
		vin: payloadString(payload, 'vin', 'VIN'),
		title: payloadString(payload, 'title', 'vehicleTitle'),
		mileage: payloadString(payload, 'mileage'),
		expectedPrice: payloadString(payload, 'expectedPrice', 'price'),
		message: payloadString(payload, 'message'),
		routePath: payloadString(payload, 'routePath')
	});
	if (!parsed.success)
		return errorJson(
			'Provide a phone number and a valid VIN or vehicle make and model. Check the price and mileage.',
			400
		);
	const values = parsed.data;
	try {
		const config = runtimeConfig();
		if (config.inquiryStorage === 'unavailable')
			return errorJson('Submission storage is unavailable', 503);
		const saved =
			config.mode === 'preview'
				? createVehicleSubmission({
						...values,
						expectedPrice: values.expectedPrice?.toString(),
						mileage: values.mileage?.toString(),
						source: source === 'admin-listing' ? 'admin-listing' : 'sell-your-car',
						status: source === 'admin-listing' ? 'draft' : 'submitted'
					})
				: await createInquiry({
						name: values.name,
						phone: values.phone,
						email: values.email,
						source: 'sell-your-car',
						routePath: values.routePath ?? '/sell-your-car',
						userRole: 'customer',
						message: [
							values.title,
							values.vin,
							values.mileage !== undefined ? 'Mileage: ' + values.mileage : undefined,
							values.expectedPrice !== undefined
								? 'Expected price: ' + values.expectedPrice
								: undefined,
							values.message
						]
							.filter(Boolean)
							.join(' | ')
					});
		const storage = config.mode === 'preview' ? 'demo' : 'database';
		return okJson(
			{
				submission: { id: saved.id },
				receipt: { id: saved.id, storage, notification: 'not-configured' }
			},
			{ status: 201 }
		);
	} catch {
		return errorJson('The submission could not be saved. Please try again.', 503);
	}
}

export async function PATCH({ request }: { request: Request }) {
	if (!runtimeConfig().cmsEnabled)
		return errorJson('The demonstration inventory inbox is disabled in live mode', 503);
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
		return errorJson('Promosale Varna vehicle submission not found', 404);
	}

	return okJson({ submission });
}
