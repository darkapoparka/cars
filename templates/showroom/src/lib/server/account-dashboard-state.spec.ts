import { describe, expect, it } from 'vitest';
import { vehicles } from '$lib/data/vehicles';
import {
	accountContext,
	accountDashboardRecentData,
	accountDashboardStatsData,
	activeRouteForAccountTemplate,
	formatDashboardDate,
	getAccountDashboardRecentData,
	getAccountDashboardStatsData
} from './account-dashboard-state';

describe('account-dashboard-state', () => {
	it('resolves active dashboard routes from account and admin paths', () => {
		expect(activeRouteForAccountTemplate('dashboard.html', 'account/messages')).toBe('messages');
		expect(activeRouteForAccountTemplate('dashboard.html', 'admin/inventory/edit/demo')).toBe(
			'add'
		);
		expect(activeRouteForAccountTemplate('dashboard.html', 'admin/users')).toBe('users');
	});

	it('builds role-aware account context without adapter markup', () => {
		const customer = accountContext('dashboard.html', {
			routePath: 'account',
			searchParams: new URLSearchParams('role=customer')
		});
		const admin = accountContext('dashboard.html', {
			routePath: 'admin',
			searchParams: new URLSearchParams('role=admin')
		});

		expect(customer).toMatchObject({
			active: 'dashboard',
			basePath: '/account',
			isAdmin: false,
			roleLabel: 'Customer'
		});
		expect(admin).toMatchObject({
			active: 'dashboard',
			basePath: '/admin',
			isAdmin: true,
			roleLabel: 'Admin'
		});
	});

	it('returns dashboard stats for customer and admin shells', () => {
		expect(
			getAccountDashboardStatsData('dashboard.html', {
				routePath: 'account',
				searchParams: new URLSearchParams('role=customer')
			}).map((stat) => stat.id)
		).toEqual(['submissions', 'messages', 'favorites', 'compare']);

		const adminStats = getAccountDashboardStatsData('dashboard.html', {
			routePath: 'admin',
			searchParams: new URLSearchParams('role=admin')
		});

		expect(adminStats.map((stat) => stat.id)).toEqual([
			'inventory',
			'inquiries',
			'messages',
			'agents'
		]);
		expect(adminStats.find((stat) => stat.id === 'inventory')?.value).toBe(String(vehicles.length));
	});

	it('returns recent data with Eliqauto activity instead of demo review copy', () => {
		const customerRecent = getAccountDashboardRecentData('dashboard.html', {
			routePath: 'account',
			searchParams: new URLSearchParams('role=customer')
		});
		const adminRecent = getAccountDashboardRecentData('dashboard.html', {
			routePath: 'admin',
			searchParams: new URLSearchParams('role=admin')
		});

		expect(customerRecent.heading).toBe('Скорошни съобщения');
		expect(customerRecent.items.length).toBeGreaterThan(0);
		expect(customerRecent.items[0]?.name).toContain('Eliqauto');
		expect(customerRecent.actions.map((action) => action.id)).toContain('open-messages');
		expect(adminRecent.heading).toBe('Admin Focus');
		expect(adminRecent.intro).toContain('Triage leads');
		expect(adminRecent.items.length).toBeGreaterThan(0);
		expect(adminRecent.items[0]?.statusLabel).toBeTruthy();
		expect(adminRecent.actions.map((action) => action.id)).toEqual([
			'review-leads',
			'reply-messages',
			'add-listing',
			'assign-team'
		]);
		expect(adminRecent.summary.map((item) => item.id)).toEqual([
			'new-leads',
			'needs-reply',
			'car-reviews'
		]);
		expect(JSON.stringify([customerRecent, adminRecent])).not.toContain('Great Experience');
	});

	it('keeps recent state and direct context helpers aligned', () => {
		const context = accountContext('dashboard.html', {
			routePath: 'admin',
			searchParams: new URLSearchParams('role=admin')
		});

		expect(accountDashboardStatsData(context)).toEqual(
			getAccountDashboardStatsData('dashboard.html', {
				routePath: 'admin',
				searchParams: new URLSearchParams('role=admin')
			})
		);
		expect(accountDashboardRecentData(context)).toEqual(
			getAccountDashboardRecentData('dashboard.html', {
				routePath: 'admin',
				searchParams: new URLSearchParams('role=admin')
			})
		);
	});

	it('formats dashboard dates with deterministic fallback labels', () => {
		expect(formatDashboardDate('2026-05-27T08:00:00.000Z')).toBe('27.05.2026 г.');
		expect(formatDashboardDate('not-a-date', 'Fallback')).toBe('Fallback');
	});
});
