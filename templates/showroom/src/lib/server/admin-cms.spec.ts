import { rmSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getAdminInventoryRow } from './admin-cms';
import { resetCmsPersistenceForTests } from './cms-persistence';
import { createInventoryListing } from './inventory';

const resetCmsState = () => {
	resetCmsPersistenceForTests();
	rmSync('static/uploads/cms/admin-cms-spec', { force: true, recursive: true });
};

describe('admin CMS inventory rows', () => {
	beforeEach(resetCmsState);
	afterEach(resetCmsState);

	it('resolves persisted listings by id, slug, and encoded route slug', () => {
		const listing = createInventoryListing({
			slug: 'admin-cms-spec-x5',
			status: 'published',
			title: 'Admin CMS Spec BMW X5',
			vin: 'ADMIN-CMS-X5'
		});

		expect(getAdminInventoryRow(listing.id)?.title).toBe('Admin CMS Spec BMW X5');
		expect(getAdminInventoryRow('admin-cms-spec-x5')?.id).toBe(listing.id);
		expect(getAdminInventoryRow(encodeURIComponent(listing.slug))?.id).toBe(listing.id);
		expect(getAdminInventoryRow('11778678187411931')?.title).toBe('BMW 740 Завиващ заден мост');
	});
});
