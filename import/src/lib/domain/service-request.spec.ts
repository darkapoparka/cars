import { describe, expect, it } from 'vitest';
import { serviceRequestInquiry, serviceRequestSchema } from './service-request';

const contact = { name: 'Demo Customer', phone: '+359 888 000 111' };

describe('service requests', () => {
	it.each(['https://example.com/cars/123', 'WBAKS410700C71234'])(
		'accepts a listing or VIN: %s',
		(reference) => {
			expect(
				serviceRequestSchema.safeParse({ ...contact, kind: 'vin-check', reference }).success
			).toBe(true);
		}
	);
	it.each(['not a VIN', 'javascript:alert(1)', 'https://user:password@example.com/car'])(
		'rejects an unusable vehicle reference: %s',
		(reference) => {
			expect(
				serviceRequestSchema.safeParse({ ...contact, kind: 'vin-check', reference }).success
			).toBe(false);
		}
	);
	it('requires contact and relevant documents instead of an empty generic enquiry', () => {
		expect(
			serviceRequestSchema.safeParse({ ...contact, kind: 'registration', message: '' }).success
		).toBe(false);
		expect(
			serviceRequestSchema.safeParse({
				kind: 'registration',
				message: 'Registration for an imported car'
			}).success
		).toBe(false);
	});
	it('retains viewing context and omits unrelated document fields', () => {
		const data = serviceRequestSchema.parse({
			...contact,
			kind: 'viewing',
			reference: 'BMW X5',
			preferredDate: '2026-10-15T14:30',
			message: 'unrelated stale documents'
		});
		expect(serviceRequestInquiry(data)).toEqual({
			...contact,
			source: 'service-viewing',
			routePath: undefined,
			message:
				'Service: Viewing request\nVehicle or VIN: BMW X5\nPreferred date and time (dealer local time): 2026-10-15T14:30'
		});
	});
	it('preserves document requests and strips irrelevant reference/date fields', () => {
		const data = serviceRequestSchema.parse({
			...contact,
			kind: 'registration',
			message: '  Registration for an imported car  ',
			reference: 'stale car',
			preferredDate: '2026-10-15T14:30',
			routePath: '/bg/services'
		});
		expect(serviceRequestInquiry(data)).toEqual({
			...contact,
			source: 'service-registration',
			routePath: '/bg/services',
			message: 'Service: Documents and registration\nRegistration for an imported car'
		});
	});
	it('rejects unknown service types and malformed dates', () => {
		expect(serviceRequestSchema.safeParse({ ...contact, kind: 'unknown' }).success).toBe(false);
		expect(
			serviceRequestSchema.safeParse({
				...contact,
				kind: 'viewing',
				reference: 'BMW X5',
				preferredDate: 'tomorrow'
			}).success
		).toBe(false);
		expect(
			serviceRequestSchema.safeParse({
				...contact,
				kind: 'viewing',
				reference: 'BMW X5',
				preferredDate: '2026-02-30T14:30'
			}).success
		).toBe(false);
		expect(
			serviceRequestSchema.safeParse({
				...contact,
				kind: 'viewing',
				reference: 'BMW X5',
				phone: 'not a phone'
			}).success
		).toBe(false);
	});
});
