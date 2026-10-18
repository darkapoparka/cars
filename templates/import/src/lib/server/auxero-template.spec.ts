import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$env/dynamic/private', () => ({ env: { TEMPLATE_MODE: 'preview' } }));

import { POST as updateProfile } from '../../routes/api/account/profile/+server';
import { findDayNightUserByRole, updateDayNightUserProfile } from './db';
import { removeAuxeroScriptTags } from './auxero-page';
import { renderAuxeroTemplate } from './auxero-template';

let originalName: string;

beforeEach(() => {
	originalName = findDayNightUserByRole('customer')!.name;
});

afterEach(() => {
	updateDayNightUserProfile({ role: 'customer', name: originalName });
});

describe('legacy runtime script boundary', () => {
	it.each(['</script>', '</ScRiPt>'])(
		'preserves a submitted name containing %s as data after script removal',
		async (closingTag) => {
			const marker = '<b data-audit-breakout=inert>audit-probe</b>';
			const name = `${closingTag}${marker}<script>`;
			const response = await updateProfile({
				request: new Request('http://localhost/api/account/profile?role=customer', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ name, role: 'customer' })
				})
			});
			expect(response.status).toBe(200);

			const html = renderAuxeroTemplate('my-profile.html', { routePath: 'account/profile' });
			if (!html) throw new Error('The retained account profile template was not loaded');
			expect(removeAuxeroScriptTags(html)).not.toContain(marker);

			const declaration = html.match(/\bconst runtimeData = (.*);/);
			expect(declaration).not.toBeNull();
			expect(JSON.parse(declaration![1]).account.session.name).toBe(name);
		}
	);
});
