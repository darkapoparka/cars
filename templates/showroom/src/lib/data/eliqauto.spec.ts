import { describe, expect, it } from 'vitest';
import {
	eliqautoBrand,
	eliqautoContact,
	eliqautoFetchedAt,
	eliqautoVehicles,
	cleanEliqautoDescription
} from './eliqauto';

describe('eliqauto data adapter', () => {
	it('loads the real listing feed snapshot', () => {
		expect(eliqautoFetchedAt).toBe('2026-06-21T13:54:02.933Z');
		expect(eliqautoVehicles).toHaveLength(16);
		expect(eliqautoVehicles[0].model).toBe(
			'Audi A5 3.0TDI S LINE FACELIFT LED NAVI B&O ЛИЗИНГ 100%'
		);
		expect(eliqautoVehicles[0].priceEur).toBe(12880);
	});

	it('normalizes the core brand and contact data', () => {
		expect(eliqautoBrand.name).toBe('Eliq Auto');
		expect(eliqautoContact.primaryPhoneHref).toBe('tel:+359896781662');
		expect(eliqautoContact.emailLabel).toBe('sales@eliqauto.bg');
		expect(eliqautoContact.addressLabel).toBe('Пазарджик');
	});

	it('cleans known source typos without changing the source JSON', () => {
		expect(cleanEliqautoDescription('асистенти за шифоране и обудхване')).toBe(
			'асистенти за шофиране и обдухване'
		);
	});

	it('localizes imported English short descriptions for public Bulgarian surfaces', () => {
		expect(
			cleanEliqautoDescription(
				'2014 Audi A5 with S Line, facelift. 245 hp, diesel, automatic transmission.'
			)
		).toBe('2014 Audi A5 с S Line и фейслифт. 245 к.с., дизел, автоматична скоростна кутия.');
	});
});
