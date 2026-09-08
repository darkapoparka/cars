import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { getAccountListingFormData } from '$lib/server/account-listing-form-state';
import {
	removeAuxeroPageDocumentBodyHtml,
	removeAuxeroSlotScriptTags,
	renderAuxeroPageSlot
} from '$lib/server/auxero-page';
import { requireDayNightPageSession } from '$lib/server/auth';
import { readInventoryListingFields } from '$lib/server/cms-listing-form';
import { saveCmsUploadFiles } from '$lib/server/cms-persistence';
import { listVehicleSubmissions, updateVehicleSubmission } from '$lib/server/inventory';

export const load: PageServerLoad = ({ params, request, url }) => {
	const routePath = `account/listings/edit/${params.id}`;
	const session = requireDayNightPageSession(request, routePath, url.searchParams);

	const renderOptions = {
		request,
		routePath,
		searchParams: url.searchParams,
		session
	};
	const { pageDocument, slot: rawFormSlot } = renderAuxeroPageSlot(
		'add-listings-2.html',
		renderOptions,
		{
			marker: 'data-daynight-add-listing-form',
			tagName: 'form',
			templateError: 'Account vehicle edit template could not be rendered',
			slotError: 'Account vehicle edit form slot could not be located'
		}
	);
	const formSlot = removeAuxeroSlotScriptTags(rawFormSlot);

	return {
		afterFormHtml: formSlot.afterHtml,
		auxeroFullPage: true,
		beforeFormHtml: formSlot.beforeHtml,
		dashboard: getAccountDashboardPageData('add-listings-2.html', renderOptions, {
			subtitle: 'Update a submitted vehicle from inside your account workspace.',
			title: 'Edit Submission'
		}),
		form: getAccountListingFormData('add-listings-2.html', renderOptions),
		formHtml: formSlot.sectionHtml,
		pageDocument: removeAuxeroPageDocumentBodyHtml(pageDocument)
	};
};

export const actions: Actions = {
	default: async ({ params, request, url }) => {
		requireDayNightPageSession(request, `account/listings/edit/${params.id}`, url.searchParams);
		const existing = listVehicleSubmissions().find((submission) => submission.id === params.id);

		if (!existing) {
			return fail(404, { error: 'Vehicle submission not found.' });
		}

		const formData = await request.formData();
		const fields = readInventoryListingFields(formData);
		const rawStatus = String(formData.get('listingStatus') ?? formData.get('status') ?? '').trim();
		const uploads = await saveCmsUploadFiles({ formData, recordId: existing.id });

		updateVehicleSubmission({
			documents: [...(existing.documents ?? []), ...uploads.documents],
			expectedPrice: fields.priceLabel,
			galleryImages: [...(existing.galleryImages ?? []), ...uploads.galleryImages],
			id: existing.id,
			message: fields.description,
			mileage: fields.mileage ? String(fields.mileage) : undefined,
			previewImage: uploads.previewImage ?? existing.previewImage,
			status: rawStatus === 'draft' ? 'draft' : 'submitted',
			title: fields.title,
			vin: fields.vin
		});
	}
};
