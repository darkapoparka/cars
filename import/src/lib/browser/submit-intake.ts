import { linkHref } from '$lib/utils/links';
import type { InquiryReceipt } from '$lib/domain/inquiry';

export async function submitIntake(
	endpoint: '/api/inquiries' | '/api/inventory/submissions',
	payload: Record<string, unknown>,
	fetcher: typeof fetch = fetch
): Promise<InquiryReceipt> {
	const response = await fetcher(linkHref(endpoint), {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
		signal: AbortSignal.timeout(20000)
	});
	const result = await response.json();
	const receipt = result?.data?.receipt;
	if (
		!response.ok ||
		result?.ok !== true ||
		typeof receipt?.id !== 'string' ||
		!receipt.id ||
		!['demo', 'database'].includes(receipt.storage) ||
		receipt.notification !== 'not-configured'
	)
		throw new Error('The request could not be saved');
	return { id: receipt.id, storage: receipt.storage, notification: receipt.notification };
}
