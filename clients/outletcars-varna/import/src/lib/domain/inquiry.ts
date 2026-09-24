import { z } from 'zod';

export const inquirySubmissionSchema = z
	.object({
		agentSlug: z.string().max(160).optional(),
		email: z.email().max(254).optional(),
		name: z.string().min(2).max(160),
		phone: z.string().min(5).max(60).optional(),
		message: z.string().max(5000).optional(),
		routePath: z.string().max(500).optional(),
		source: z.string().max(100).optional(),
		vehicleSlug: z.string().max(160).optional()
	})
	.refine((value) => Boolean(value.email || value.phone), {
		message: 'Provide an email address or phone number',
		path: ['phone']
	});

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
