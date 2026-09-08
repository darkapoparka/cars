import { describe, expect, it } from 'vitest';
import { vehicles } from '$lib/data/vehicles';
import { accountListingsData, getAccountListingsData } from './account-listings-state';
import { accountContext } from './account-dashboard-state';

describe('account-listings-state', () => {
	it('returns admin inventory rows with Auxero table headers and actions', () => {
		const firstVehicle = vehicles[0];
		expect(firstVehicle).toBeDefined();
		if (!firstVehicle) return;

		const admin = getAccountListingsData('my-listings.html', {
			routePath: 'admin/inventory',
			searchParams: new URLSearchParams('role=admin')
		});

		expect(admin.isSubmissions).toBe(false);
		expect(admin.headers).toEqual(['Car', 'Brand', 'Year', 'Transmission', 'Fuel Type', 'Action']);
		expect(admin.pagination).toEqual(['1', '2', '3']);
		expect(admin.rows).toHaveLength(5);
		expect(admin.rows[0]?.kind).toBe('inventory');
		expect(admin.rows[0]?.title).toBe(firstVehicle.title);
		expect(admin.rows[0]?.actions.map((action) => action.kind)).toEqual([
			'edit-inventory',
			'remove'
		]);
		expect(admin.rows[0]?.actions[0]?.href).toBe(
			`/admin/inventory/edit/${encodeURIComponent(firstVehicle.slug)}`
		);
		expect(admin.rows[0]?.actions[0]?.href).not.toContain('%2F');
	});

	it('returns customer submission rows without inventory pagination', () => {
		const customer = getAccountListingsData('my-listings.html', {
			routePath: 'account/listings',
			searchParams: new URLSearchParams('role=customer')
		});

		expect(customer.isSubmissions).toBe(true);
		expect(customer.headers).toEqual([
			'Автомобил',
			'Контакти',
			'Очаквана цена',
			'Пробег',
			'Статус',
			'Действие'
		]);
		expect(customer.pagination).toBeUndefined();
		expect(customer.rows.length).toBeGreaterThan(1);
		expect(customer.rows[0]?.kind).toBe('submission');
		expect(customer.rows[0]?.actions.map((action) => action.kind)).toEqual([
			'edit-submission',
			'message'
		]);
		expect(customer.footerText).toContain('заявки за продажба');
	});

	it('keeps direct state helpers aligned with route-friendly accessors', () => {
		const options = {
			routePath: 'admin/inventory',
			searchParams: new URLSearchParams('role=admin')
		};

		expect(accountListingsData(accountContext('my-listings.html', options))).toEqual(
			getAccountListingsData('my-listings.html', options)
		);
	});
});
