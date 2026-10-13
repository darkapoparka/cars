import { z } from 'zod';
import type { InquirySubmission } from './inquiry';
import { isVehicleReference } from './vehicle-intake';

export const serviceRequestKinds = ['vin-check', 'registration', 'viewing'] as const;
export type ServiceRequestKind = (typeof serviceRequestKinds)[number];

function isPreferredDate(value: string): boolean {
	if (!value) return true;
	if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return false;
	const date = new Date(`${value}:00Z`);
	return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 16) === value;
}

export const serviceRequestSchema = z
	.object({
		kind: z.enum(serviceRequestKinds),
		name: z.string().trim().min(2).max(160),
		phone: z
			.string()
			.trim()
			.min(5)
			.max(60)
			.refine((value) => value.replace(/\D/g, '').length >= 5),
		reference: z.string().trim().max(2000).default(''),
		message: z.string().trim().max(2000).default(''),
		preferredDate: z.string().refine(isPreferredDate).default(''),
		routePath: z.string().max(500).optional()
	})
	.superRefine((value, context) => {
		if (value.kind === 'vin-check' && !isVehicleReference(value.reference))
			context.addIssue({
				code: 'custom',
				path: ['reference'],
				message: 'Enter a listing URL or VIN.'
			});
		if (value.kind === 'registration' && value.message.length < 5)
			context.addIssue({
				code: 'custom',
				path: ['message'],
				message: 'Describe the documents needed.'
			});
		if (value.kind === 'viewing' && value.reference.length < 2)
			context.addIssue({ code: 'custom', path: ['reference'], message: 'Enter the vehicle.' });
	});

export type ServiceRequest = z.infer<typeof serviceRequestSchema>;

const serviceNames: Record<ServiceRequestKind, string> = {
	'vin-check': 'Listing / VIN check',
	registration: 'Documents and registration',
	viewing: 'Viewing request'
};

/** Keep the selected service and its details in the existing inquiry storage contract. */
export function serviceRequestInquiry(request: ServiceRequest): InquirySubmission {
	return {
		name: request.name,
		phone: request.phone,
		routePath: request.routePath,
		source: `service-${request.kind}`,
		message: [
			`Service: ${serviceNames[request.kind]}`,
			request.kind !== 'registration' && request.reference
				? `Vehicle or VIN: ${request.reference}`
				: undefined,
			request.kind === 'registration' ? request.message : undefined,
			request.kind === 'viewing' && request.preferredDate
				? `Preferred date and time (dealer local time): ${request.preferredDate}`
				: undefined
		]
			.filter(Boolean)
			.join('\n')
	};
}
