import { describe, expect, it } from 'vitest';
import { accountContext } from './account-dashboard-state';
import {
	accountUserManagementData,
	accountUserManagementNotesData,
	accountUserManagementRowsData,
	accountUserManagementStatsData,
	getAccountUserManagementData
} from './account-users-state';

describe('account-users-state', () => {
	it('builds admin user table rows outside the raw adapter', () => {
		const rows = accountUserManagementRowsData();

		expect(rows.length).toBeGreaterThan(2);
		expect(rows.some((row) => row.columns.includes('customer@eliqauto.local'))).toBe(true);
		expect(rows.some((row) => row.columns.includes('Lead'))).toBe(true);
		expect(JSON.stringify(rows)).toContain('Import & leasing lead');
		expect(rows.every((row) => row.actions.length === 2)).toBe(true);
		expect(rows[0]?.actions.map((action) => action.href)).toEqual([
			'/admin/messages?role=admin',
			'/admin/inquiries?role=admin'
		]);
	});

	it('returns table data only for admin contexts', () => {
		const admin = accountContext('dashboard.html', {
			routePath: 'admin/users',
			searchParams: new URLSearchParams('role=admin')
		});
		const customer = accountContext('dashboard.html', {
			routePath: 'account',
			searchParams: new URLSearchParams('role=customer')
		});

		expect(accountUserManagementData(admin).headers).toEqual([
			'User',
			'Email',
			'Role',
			'Context',
			'Status',
			'Action'
		]);
		expect(accountUserManagementData(admin).rows.length).toBeGreaterThan(2);
		expect(accountUserManagementData(customer).rows).toEqual([]);
	});

	it('keeps helper output aligned with direct context data', () => {
		const options = {
			routePath: 'admin/users',
			searchParams: new URLSearchParams('role=admin')
		};

		expect(getAccountUserManagementData('dashboard.html', options)).toEqual(
			accountUserManagementData(accountContext('dashboard.html', options))
		);
	});

	it('keeps stats and notes as typed state instead of adapter literals', () => {
		const stats = accountUserManagementStatsData();
		const notes = accountUserManagementNotesData();

		expect(stats.map((stat) => stat.label)).toEqual([
			'User Roles',
			'Open Leads',
			'Message Threads',
			'Agents'
		]);
		expect(Number(stats[0]?.value)).toBe(accountUserManagementRowsData().length);
		expect(notes.map((note) => note.title)).toEqual(['Admin', 'Agent', 'Customer']);
		expect(JSON.stringify({ notes, stats })).not.toContain('Super Admin');
	});
});
