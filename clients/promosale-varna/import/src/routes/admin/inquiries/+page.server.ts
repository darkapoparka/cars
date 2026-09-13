import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAdminCmsOverview } from '$lib/server/admin-cms';
import { requireDayNightPageSession } from '$lib/server/auth';
import { normalizeInquiryStatus, updateInquiry } from '$lib/server/inquiries';

const value = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim();

export const load: PageServerLoad = async ({ request, url }) => {
	const session = requireDayNightPageSession(request, 'admin/inquiries', url.searchParams);
	const cms = await getAdminCmsOverview();
	const requestedInquiryId = url.searchParams.get('lead');
	const activeInquiry =
		cms.inquiries.find((inquiry) => inquiry.id === requestedInquiryId) ?? cms.inquiries[0] ?? null;

	return {
		activeInquiryId: activeInquiry?.id ?? null,
		auxeroFullPage: true,
		cms,
		session
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		requireDayNightPageSession(request, 'admin/inquiries');
		const formData = await request.formData();
		const id = value(formData, 'id');

		if (!id) {
			return fail(400, { error: 'Inquiry id is required.' });
		}

		const assignedAgentSlug = value(formData, 'assignedAgentSlug');
		const message = value(formData, 'message');
		const status = normalizeInquiryStatus(value(formData, 'status'));
		if (!status || assignedAgentSlug.length > 120 || message.length > 5000) {
			return fail(400, {
				error: 'Choose a valid status and keep the note within 5,000 characters.'
			});
		}
		let inquiry;
		try {
			inquiry = await updateInquiry({ assignedAgentSlug, id, message, status });
		} catch {
			return fail(503, { error: 'The inquiry could not be saved. Please try again.' });
		}

		if (!inquiry) {
			return fail(404, { error: 'Inquiry not found.' });
		}

		redirect(303, `/admin/inquiries?lead=${encodeURIComponent(inquiry.id)}`);
	}
};
