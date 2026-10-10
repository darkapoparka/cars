import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

for (const route of ['/', '/inventory', '/contact', '/import', '/sell-your-car', '/financing']) {
	test(`accessible landmarks and controls on ${route}`, async ({ page }) => {
		await visit(page, route);
		const result = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
			.analyze();
		const failures = result.violations.map((item) => ({
			id: item.id,
			impact: item.impact,
			nodes: item.nodes.map((node) => ({ target: node.target, summary: node.failureSummary }))
		}));
		expect(failures).toEqual([]);
	});
}
