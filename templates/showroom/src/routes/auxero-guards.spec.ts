import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const auxeroGuardsCss = readFileSync(new URL('./auxero-guards.css', import.meta.url), 'utf8');

describe('auxero-guards.css scope', () => {
	it('keeps broad button and action hover guards out of bare body selectors', () => {
		const bareBodyControlSelector =
			/(^|[,{]\s*)body\s*:where\([^{}]*(?:\.btn|button|\.compare-details|\.view-details)/m;
		const bareBodyDescendantControlSelector =
			/(^|[,{]\s*)body\s+:where\([^{}]*(?:\.btn|button|\.compare-details|\.view-details)/m;

		expect(auxeroGuardsCss).not.toMatch(bareBodyControlSelector);
		expect(auxeroGuardsCss).not.toMatch(bareBodyDescendantControlSelector);
	});
});
