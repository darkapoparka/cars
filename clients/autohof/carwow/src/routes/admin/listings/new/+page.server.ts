import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { requireAdminDealer } from '$lib/server/repositories/admin';
import {
	createVehicle,
	readVehicleFormValues,
	validateVehicleForm,
	type VehicleFormFailure
} from '$lib/server/repositories/vehicles';

export const actions: Actions = {
	default: async ({ locals, request }) => {
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

		const id = await createVehicle(db, dealerId, parsed.data);

		throw redirect(303, `/admin/listings/${id}?created=1`);
	}
};
