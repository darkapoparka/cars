import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireAdminDealer } from '$lib/server/repositories/admin';
import {
	deleteVehicle,
	getVehicleById,
	readVehicleFormValues,
	updateVehicle,
	validateVehicleForm,
	type VehicleFormFailure
} from '$lib/server/repositories/vehicles';

function readNotice(url: URL) {
	if (url.searchParams.get('created') === '1') return 'Listing created.';
	if (url.searchParams.get('created') === 'copy') return 'Draft copy created.';
	if (url.searchParams.get('updated') === '1') return 'Listing updated.';
	return '';
}

export const load: PageServerLoad = async ({ locals, parent, params, url }) => {
	const layout = await parent();

	if (!locals.db || !layout.dealer?.id) {
		throw error(500, 'Admin inventory is not configured.');
	}

	const vehicle = await getVehicleById(locals.db, layout.dealer.id, params.id);

	if (!vehicle) {
		throw error(404, 'Listing was not found.');
	}

	return {
		vehicle,
		notice: readNotice(url)
	};
};

export const actions: Actions = {
	save: async ({ locals, params, request }) => {
		const values = readVehicleFormValues(await request.formData());
		const parsed = validateVehicleForm(values);

		if (!parsed.success) {
			return fail(400, {
				error: 'Fix the highlighted listing fields.',
				values,
				errors: parsed.error.flatten().fieldErrors
			} satisfies VehicleFormFailure);
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.inventory) {
			return fail(403, { error: 'This account cannot manage inventory.' });
		}

		const updated = await updateVehicle(db, dealerId, params.id, parsed.data);

		if (!updated) {
			return fail(404, {
				error: 'Listing was not found.',
				values
			} satisfies VehicleFormFailure);
		}

		throw redirect(303, `/admin/listings/${params.id}?updated=1`);
	},
	remove: async ({ locals, params }) => {
		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.inventory) {
			return fail(403, { error: 'This account cannot manage inventory.' });
		}

		await deleteVehicle(db, dealerId, params.id);

		throw redirect(303, '/admin/listings?deleted=1');
	}
};
