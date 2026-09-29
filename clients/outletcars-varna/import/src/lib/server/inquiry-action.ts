import { fail, type Action } from '@sveltejs/kit';
import { inquirySubmissionSchema, type InquiryReceipt } from '$lib/domain/inquiry';
import { readApiPayload, payloadString } from './api';
import { createInquiry } from './inquiries';
import { hasInquiryDatabase } from './inquiry-config';

export const inquiryAction: Action = async ({ request }) => {
	const payload = await readApiPayload(request);
	const values = Object.fromEntries(
		['name', 'email', 'phone', 'message', 'source', 'routePath', 'vehicleSlug'].map((key) => [
			key,
			payloadString(payload, key)
		])
	);
	const parsed = inquirySubmissionSchema.safeParse(values);
	if (!parsed.success) {
		return fail(400, {
			errors: Object.fromEntries(
				parsed.error.issues.map((issue) => [String(issue.path[0] ?? 'form'), true])
			),
			values
		});
	}
	if (payloadString(payload, 'website')) return fail(400, { errors: { form: true }, values });
	try {
		const saved = await createInquiry({ ...parsed.data, userRole: 'customer' });
		const receipt: InquiryReceipt = {
			id: saved.id,
			storage: hasInquiryDatabase() ? 'database' : 'demo',
			notification: 'not-configured'
		};
		return { receipt };
	} catch {
		return fail(503, { errors: { form: true }, values });
	}
};
