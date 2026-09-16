import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { requireAdminDealer } from '$lib/server/repositories/admin';
import {
	deleteVehicle,
	duplicateVehicle,
	getVehicleInventoryOverview,
	parseVehicleStatus,
	updateVehicleStatus,
	updateVehiclesStatus,
	type VehicleInventoryFilters,
	type VehicleInventoryOverview
} from '$lib/server/repositories/vehicles';
import type { VehicleStatus } from '$lib/types/database';

const emptyInventory: VehicleInventoryOverview = {
	vehicles: [],
	counts: {
		all: 0,
		published: 0,
		draft: 0,
		sold: 0,
		archived: 0
	},
	filters: {
		status: 'all',
		query: ''
	}
};

function readFilters(url: URL): VehicleInventoryFilters {
	const rawStatus = url.searchParams.get('status');
	const status = ['published', 'draft', 'sold', 'archived'].includes(rawStatus ?? '')
		? (rawStatus as VehicleStatus)
		: 'all';

	return {
		status,
		query: url.searchParams.get('q')?.trim() ?? ''
	};
}

function readVehicleId(formData: FormData) {
	const id = formData.get('id');
	return typeof id === 'string' && id ? id : null;
}

function readVehicleIds(formData: FormData) {
	return formData
		.getAll('ids')
		.filter((id): id is string => typeof id === 'string' && id.length > 0);
}

function readNotice(url: URL) {
	if (url.searchParams.get('deleted') === '1') return 'Listing deleted.';
	if (url.searchParams.get('updated') === 'status') return 'Listing status updated.';
	if (url.searchParams.get('bulk') === 'status') return 'Selected listings updated.';
	return '';
}

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	const layout = await parent();
	const filters = readFilters(url);

	if (!locals.db || !layout.dealer?.id) {
		return {
			inventory: {
				...emptyInventory,
				filters
			},
			notice: readNotice(url)
		};
	}

	return {
		inventory: await getVehicleInventoryOverview(locals.db, layout.dealer.id, filters),
		notice: readNotice(url)
	};
};

export const actions: Actions = {
	updateStatus: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = readVehicleId(formData);
		const status = parseVehicleStatus(formData.get('status'));

		if (!id || !status) {
			return fail(400, {
				error: 'Choose a valid listing and status.'
			});
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.inventory) {
			return fail(403, { error: 'This account cannot manage inventory.' });
		}

		await updateVehicleStatus(db, dealerId, id, status);

		throw redirect(303, '/admin/listings?updated=status');
	},
	bulkStatus: async ({ locals, request }) => {
		const formData = await request.formData();
		const ids = readVehicleIds(formData);
		const status = parseVehicleStatus(formData.get('status'));

		if (!ids.length || !status) {
			return fail(400, {
				error: 'Select listings and choose a valid status.'
			});
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.inventory) {
			return fail(403, { error: 'This account cannot manage inventory.' });
		}

		await updateVehiclesStatus(db, dealerId, ids, status);

		throw redirect(303, '/admin/listings?bulk=status');
	},
	duplicate: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = readVehicleId(formData);

		if (!id) {
			return fail(400, {
				error: 'Choose a listing to duplicate.'
			});
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.inventory) {
			return fail(403, { error: 'This account cannot manage inventory.' });
		}

		const duplicateId = await duplicateVehicle(db, dealerId, id);

		if (!duplicateId) {
			return fail(404, {
				error: 'Listing was not found.'
			});
		}

		throw redirect(303, `/admin/listings/${duplicateId}?created=copy`);
	},
	remove: async ({ locals, request }) => {
		const formData = await request.formData();
		const id = readVehicleId(formData);

		if (!id) {
			return fail(400, {
				error: 'Choose a listing to delete.'
			});
		}

		const { db, dealerId, capabilities } = await requireAdminDealer(locals);
		if (!capabilities.inventory) {
			return fail(403, { error: 'This account cannot manage inventory.' });
		}

		await deleteVehicle(db, dealerId, id);

		throw redirect(303, '/admin/listings?deleted=1');
	}
};
