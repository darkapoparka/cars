import { describe, expect, it } from 'vitest';
import { daynightVehicles } from '../data/daynight-vehicles';
import { buildContactMessage, buildVehicleContactHref, readContactIntent } from './contact-intent';

describe('vehicle enquiry handoff', () => {
	it.each(['video', 'photos'] as const)('keeps the vehicle and %s request in the contact payload', (intent) => {
		const vehicle = daynightVehicles[0];
		const url = new URL(buildVehicleContactHref(vehicle, intent), 'https://example.test');
		const context = readContactIntent(url.searchParams);
		const message = buildContactMessage(context, 'Моля, обадете ми се.');
		expect(context.vehicle?.slug).toBe(vehicle.slug);
		expect(context.subject).toContain(intent === 'video' ? 'видео' : 'снимки');
		expect(context.message).toContain(intent === 'video' ? 'видео' : 'снимки');
		expect(message).toContain(vehicle.lot);
		expect(message).toContain(`/inventory/${vehicle.slug}`);
		expect(message).toContain('Моля, обадете ми се.');
	});

	it('does not turn an unknown vehicle or inherited object key into a claimed identity', () => {
		const context = readContactIntent(new URLSearchParams('intent=toString&vehicle=unknown'));
		expect(context.vehicle).toBeUndefined();
		expect(context.subject).toBe('');
		expect(buildContactMessage(context, 'Здравейте')).toBe('Здравейте');
	});

	it('gives a review enquiry its own subject without inventing a vehicle', () => {
		const context = readContactIntent(new URLSearchParams('intent=review'));
		expect(context.subject).toBe('Изпращане на отзив');
		expect(context.vehicle).toBeUndefined();
	});
});
