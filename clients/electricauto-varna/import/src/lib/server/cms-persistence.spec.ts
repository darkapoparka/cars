import { describe, expect, it, vi } from 'vitest';
const { env } = vi.hoisted(() => ({ env: { TEMPLATE_MODE: 'live' } }));
vi.mock('$env/dynamic/private', () => ({ env }));
import { readCmsCollection, writeCmsCollection, saveCmsUploadFiles } from './cms-persistence';
describe('live filesystem isolation', () => {
	it('does not expose demo collections in live mode', () => {
		expect(readCmsCollection('inventory-listings')).toEqual([]);
	});
	it('rejects file persistence and uploads in live mode', async () => {
		expect(() => writeCmsCollection('inventory-listings', [])).toThrow('disabled');
		await expect(
			saveCmsUploadFiles({ formData: new FormData(), recordId: 'synthetic-test' })
		).rejects.toThrow('disabled');
	});
});
