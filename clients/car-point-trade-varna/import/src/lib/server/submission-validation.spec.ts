import { describe, expect, it } from 'vitest';
import { inquirySubmissionSchema } from './inquiry-validation';
import { sellSubmissionSchema } from './sell-submission';
import { isVehicleReference, isVin } from '$lib/domain/vehicle-intake';
import { receiptMessage } from '$lib/domain/inquiry';

describe('server-owned submission validation', () => {
	it('keeps phone-only and email-only inquiries without inventing contact data', () => {
		expect(inquirySubmissionSchema.parse({ name: 'Test Buyer', phone: '+359000000000' })).toEqual({
			name: 'Test Buyer',
			phone: '+359000000000'
		});
		expect(
			inquirySubmissionSchema.safeParse({ name: 'Test Buyer', email: 'buyer@example.invalid' })
				.success
		).toBe(true);
		expect(inquirySubmissionSchema.safeParse({ name: 'Test Buyer' }).success).toBe(false);
	});

	it('bounds inquiry fields and strips fields outside the public contract', () => {
		expect(
			inquirySubmissionSchema.safeParse({
				name: 'Test Buyer',
				phone: '+359000000000',
				message: 'x'.repeat(5001)
			}).success
		).toBe(false);
		expect(
			inquirySubmissionSchema.parse({ name: 'Test Buyer', phone: '+359000000000', role: 'admin' })
		).not.toHaveProperty('role');
	});

	it('supports VIN and manual entries while preserving optional numeric fields', () => {
		expect(
			sellSubmissionSchema.parse({ phone: '+359000000000', vin: 'WBA12345678901234', mileage: '' })
		).toEqual({ phone: '+359000000000', vin: 'WBA12345678901234', mileage: undefined });
		expect(
			sellSubmissionSchema.parse({
				phone: '+359000000000',
				title: 'BMW X4',
				mileage: '120000',
				expectedPrice: '23000'
			})
		).toMatchObject({ mileage: 120000, expectedPrice: 23000 });
	});

	it('rejects invalid vehicle references and out-of-range numeric submissions', () => {
		for (const fields of [{}, { vin: 'invalid' }, { title: 'BMW X4', mileage: -1 }])
			expect(sellSubmissionSchema.safeParse({ phone: '+359000000000', ...fields }).success).toBe(
				false
			);
		expect(isVin('WBA12345678901234')).toBe(true);
		expect(isVehicleReference('https://example.invalid/listing')).toBe(true);
		expect(isVehicleReference('https://user:password@example.invalid/listing')).toBe(false);
		expect(isVehicleReference('javascript:alert(1)')).toBe(false);
	});

	it('keeps browser receipt copy explicit about storage versus notification', () => {
		expect(
			receiptMessage({ id: 'synthetic', storage: 'demo', notification: 'not-configured' }, true)
		).toContain('No message was sent');
		expect(
			receiptMessage({ id: 'synthetic', storage: 'database', notification: 'not-configured' }, true)
		).toContain('Automatic notification is not configured');
	});
});
