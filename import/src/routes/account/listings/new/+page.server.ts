import { fail, redirect } from '@sveltejs/kit';
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
import { createVehicleSubmission, updateVehicleSubmission } from '$lib/server/inventory';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/listings/new';
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
			templateError: 'Account vehicle submission template could not be rendered',
			slotError: 'Account vehicle submission form slot could not be located'
		}
	);
	const formSlot = removeAuxeroSlotScriptTags(rawFormSlot);

	return {
		afterFormHtml: formSlot.afterHtml,
		auxeroFullPage: true,
		beforeFormHtml: formSlot.beforeHtml,
		dashboard: getAccountDashboardPageData('add-listings-2.html', renderOptions, {
			subtitle:
				'Submit a vehicle for Broadbent Car and Servicing review without leaving your account workspace.',
			title: 'Submit Vehicle'
		}),
		form: getAccountListingFormData('add-listings-2.html', renderOptions),
		formHtml: formSlot.sectionHtml,
		pageDocument: removeAuxeroPageDocumentBodyHtml(pageDocument)
	};
};

export const actions: Actions = {
	default: async ({ request, url, locals }) => {
		const session = requireDayNightPageSession(request, 'account/listings/new', url.searchParams);
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
		const submission = createVehicleSubmission({
			email: session.email,
			expectedPrice: fields.priceLabel,
			message: fields.description,
			mileage: fields.mileage ? String(fields.mileage) : undefined,
			name: session.name,
			phone: '',
			routePath: 'account/listings/new',
			source: 'customer-listing',
			status: rawStatus === 'draft' ? 'draft' : 'submitted',
			title: fields.title,
			vin: fields.vin
		});
		const uploads = await saveCmsUploadFiles({ formData, recordId: submission.id });

		updateVehicleSubmission({
			documents: uploads.documents,
			galleryImages: uploads.galleryImages,
			id: submission.id,
			previewImage: uploads.previewImage
		});
		const search = new URLSearchParams({ created: rawStatus === 'draft' ? 'draft' : 'submitted' });
		if (locals.localeState.locale === 'en') search.set('lang', 'en');
		redirect(303, `/account/listings/edit/${encodeURIComponent(submission.id)}?${search}`);
	}
};
