import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAdminCmsOverview } from '$lib/server/admin-cms';
import { requireDayNightPageSession } from '$lib/server/auth';
import { normalizeVehicleSubmissionStatus, updateVehicleSubmission } from '$lib/server/inventory';

const value = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim();

export const load: PageServerLoad = ({ request, url }) => {
	const session = requireDayNightPageSession(request, 'admin/imports', url.searchParams);

	return {
		auxeroFullPage: true,
		cms: getAdminCmsOverview(),
		session
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const id = value(formData, 'id');

		if (!id) {
			return fail(400, { error: 'Import request id is required.' });
		}

		const submission = updateVehicleSubmission({
			expectedPrice: value(formData, 'expectedPrice'),
			id,
			message: value(formData, 'message'),
			mileage: value(formData, 'mileage'),
			status: normalizeVehicleSubmissionStatus(value(formData, 'status')),
			title: value(formData, 'title'),
			vin: value(formData, 'vin')
		});

		if (!submission) {
			return fail(404, { error: 'Import request not found.' });
		}

		redirect(303, '/admin/imports');
	}
};
