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
import { readInventoryListingFields, submissionDraftValues } from '$lib/server/cms-listing-form';
import { saveCmsUploadFiles, validateCmsUploadFiles } from '$lib/server/cms-persistence';
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
	default: async ({ params, request, url, locals }) => {
		requireDayNightPageSession(request, `account/listings/edit/${params.id}`, url.searchParams);
		const existing = listVehicleSubmissions().find((submission) => submission.id === params.id);

		if (!existing) {
			return fail(404, { error: 'Vehicle submission not found.' });
		}

		const formData = await request.formData();
		const fields = readInventoryListingFields(formData);
		const values = submissionDraftValues(fields);
		if (!fields.title) {
			return fail(400, {
				values,
				error:
					locals.localeState.locale === 'en' ? 'Enter a make and model.' : 'Въведи марка и модел.'
			});
		}
		const rawStatus = String(formData.get('listingStatus') ?? formData.get('status') ?? '').trim();
		try {
			validateCmsUploadFiles(formData);
		} catch {
			return fail(400, {
				values,
				error:
					locals.localeState.locale === 'en'
						? 'Use JPG, PNG or WebP up to 8 MB, or PDF/DOC documents up to 10 MB.'
						: 'Използвай JPG, PNG или WebP до 8 MB, или PDF/DOC документи до 10 MB.'
			});
		}
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
		return { saved: true, status: rawStatus === 'draft' ? 'draft' : 'submitted' };
	}
};
