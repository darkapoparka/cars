import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAdminCmsOverview } from '$lib/server/admin-cms';
import { requireEliqautoPageSession } from '$lib/server/auth';
import { normalizeInquiryStatus, updateInquiry } from '$lib/server/inquiries';

const value = (formData: FormData, key: string) => String(formData.get(key) ?? '').trim();

export const load: PageServerLoad = ({ request, url }) => {
	const session = requireEliqautoPageSession(request, 'admin/inquiries', url.searchParams);
	const cms = getAdminCmsOverview();
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
		const formData = await request.formData();
		const id = value(formData, 'id');

		if (!id) {
			return fail(400, { error: 'Inquiry id is required.' });
		}

		const inquiry = updateInquiry({
			assignedAgentSlug: value(formData, 'assignedAgentSlug'),
			id,
			message: value(formData, 'message'),
			status: normalizeInquiryStatus(value(formData, 'status'))
		});

		if (!inquiry) {
			return fail(404, { error: 'Inquiry not found.' });
		}

		redirect(303, `/admin/inquiries?lead=${encodeURIComponent(inquiry.id)}`);
	}
};
