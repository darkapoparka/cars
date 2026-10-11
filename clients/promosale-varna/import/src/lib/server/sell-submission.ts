import { z } from 'zod';
import { isVin } from '$lib/domain/vehicle-intake';

const numeric = (max: number) =>
	z.preprocess(
		(value) => (value === '' || value == null ? undefined : value),
		z.coerce.number().finite().min(0).max(max).optional()
	);
export const sellSubmissionSchema = z
	.object({
		name: z.string().max(160).optional(),
		email: z.email().max(254).optional(),
		phone: z.string().min(5).max(60),
		vin: z.string().max(17).optional(),
		title: z.string().max(160).optional(),
		mileage: numeric(2000000),
		expectedPrice: numeric(10000000),
		message: z.string().max(5000).optional(),
		routePath: z.string().max(500).optional()
	})
	.refine(
		(value) =>
			Boolean(value.vin && isVin(value.vin)) ||
			Boolean(value.title && value.title.trim().length >= 2),
		{ path: ['vin'], message: 'Provide a valid VIN or the vehicle make and model' }
	);
