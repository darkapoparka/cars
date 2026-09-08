import type { Actions, PageServerLoad } from './$types';
import { getAccountDashboardPageData } from '$lib/server/account-dashboard-state';
import { getAccountListingFormData } from '$lib/server/account-listing-form-state';
import {
	removeAuxeroPageDocumentBodyHtml,
	removeAuxeroSlotScriptTags,
	renderAuxeroPageSlot
} from '$lib/server/auxero-page';
import { requireEliqautoPageSession } from '$lib/server/auth';
import { readInventoryListingFields } from '$lib/server/cms-listing-form';
import { saveCmsUploadFiles } from '$lib/server/cms-persistence';
import { createVehicleSubmission, updateVehicleSubmission } from '$lib/server/inventory';

export const load: PageServerLoad = ({ request, url }) => {
	const routePath = 'account/listings/new';
	const session = requireEliqautoPageSession(request, routePath, url.searchParams);

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
			marker: 'data-eliqauto-add-listing-form',
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
			subtitle: 'Submit a vehicle for Eliqauto review without leaving your account workspace.',
			title: 'Submit Vehicle'
		}),
		form: getAccountListingFormData('add-listings-2.html', renderOptions),
		formHtml: formSlot.sectionHtml,
		pageDocument: removeAuxeroPageDocumentBodyHtml(pageDocument)
	};
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const session = requireEliqautoPageSession(request, 'account/listings/new', url.searchParams);
		const formData = await request.formData();
		const fields = readInventoryListingFields(formData);
		const rawStatus = String(formData.get('listingStatus') ?? formData.get('status') ?? '').trim();
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
	}
};
