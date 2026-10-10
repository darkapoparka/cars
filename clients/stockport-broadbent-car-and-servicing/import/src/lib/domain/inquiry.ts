import type { z } from 'zod';
import type { inquirySubmissionSchema } from '$lib/server/inquiry-validation';

export type InquirySubmission = z.infer<typeof inquirySubmissionSchema>;
export type InquiryReceipt = {
	id: string;
	storage: 'demo' | 'database';
	notification: 'not-configured';
};

export const receiptMessage = (receipt: InquiryReceipt, english = false) =>
	receipt.storage === 'demo'
		? english
			? 'Demo request saved temporarily. No message was sent to a dealer.'
			: 'Демо заявката е запазена временно. Не е изпратено съобщение до търговец.'
		: english
			? 'Request saved. Automatic notification is not configured; contact the dealer directly for a response.'
			: 'Заявката е запазена. Автоматично известяване не е настроено; свържи се с търговеца за отговор.';
