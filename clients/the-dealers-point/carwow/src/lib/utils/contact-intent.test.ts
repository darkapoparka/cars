import { templateText } from '../locale/messages';
import { describe, expect, it } from 'vitest';
import { daynightVehicles } from '../data/daynight-vehicles';
import { buildContactMessage, buildVehicleContactHref, readContactIntent } from './contact-intent';

describe('vehicle enquiry handoff', () => {
	it.each(['video', 'photos'] as const)(
		'keeps the vehicle and %s request in the contact payload',
		(intent) => {
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
		}
	);

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

describe('legacy trade-in preset', () => {
	it.each(['en', 'bg'] as const)(
		'localizes the preset for %s while preserving submitted prose and stock identity',
		(locale) => {
			const vehicle = daynightVehicles[0];
			const context = readContactIntent(
				new URLSearchParams({ topic: 'trade-in', vehicle: vehicle.slug })
			);
			expect(templateText(locale, context.subject)).toBe(
				locale === 'en' ? 'Sell or trade in' : 'Продажба или бартер'
			);
			const prose = 'My car / Моят автомобил VIN RAW-123';
			expect(buildContactMessage(context, prose)).toContain(prose);
			expect(context.vehicle?.slug).toBe(vehicle.slug);
			expect(buildContactMessage(context, prose)).toContain(vehicle.lot);
		}
	);
	it('retains explicit intent precedence', () => {
		expect(readContactIntent(new URLSearchParams('topic=trade-in&intent=video')).subject).toContain(
			'видео'
		);
	});
});
