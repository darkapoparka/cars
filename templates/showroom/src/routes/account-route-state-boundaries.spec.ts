import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const routeSource = (routeFile: string) =>
	readFileSync(new URL(routeFile, import.meta.url), 'utf-8');

describe('account route state boundaries', () => {
	it('loads dashboard recent data from route-specific server state modules, not the raw adapter', () => {
		const accountDashboard = routeSource('./account/+page.server.ts');
		const adminDashboard = routeSource('./admin/+page.server.ts');

		expect([accountDashboard, adminDashboard].join('\n')).not.toContain('auxero-account-data');
		expect(accountDashboard).toContain('getAccountDashboardPageData');
		expect(adminDashboard).toContain('getAdminCmsOverview');
	});

	it('loads account message data from the server state module, not the raw adapter', () => {
		const accountMessages = routeSource('./account/messages/+page.server.ts');

		expect(accountMessages).not.toContain('auxero-account-data');
		expect(accountMessages).toContain('getAccountMessageThreadData');
	});

	it('loads admin message and inquiry data from the CMS state module', () => {
		const adminRoutes = [
			routeSource('./admin/messages/+page.server.ts'),
			routeSource('./admin/inquiries/+page.server.ts')
		].join('\n');

		expect(adminRoutes).not.toContain('auxero-account-data');
		expect(adminRoutes).toContain('getAdminCmsOverview');
	});

	it('keeps account raw adapter exports scoped to compatibility rendering', () => {
		const adapterSource = routeSource('../lib/server/auxero-account-data.ts');

		expect(adapterSource).toContain('applyAccountTemplateData');
		expect(adapterSource).toContain('getAuxeroAccountRuntimeData');
		expect(adapterSource).not.toMatch(
			/export const getAuxero(?:Dashboard|Message|Account(?:Listings|Profile|Password|ListingForm)|User)/
		);
	});
});
