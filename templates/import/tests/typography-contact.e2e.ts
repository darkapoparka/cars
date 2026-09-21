import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test('public action labels share a readable regular-weight role', async ({ page }, info) => {
	for (const route of ['/', '/inventory', '/about', '/contact', '/services', '/financing']) {
		await visit(page, route);
		const actions = page.locator('.site-action:visible');
		const metrics = await actions.evaluateAll((nodes) =>
			nodes.map((node) => ({
				text: node.textContent,
				size: parseFloat(getComputedStyle(node).fontSize),
				weight: getComputedStyle(node).fontWeight,
				height: node.getBoundingClientRect().height,
				compact: node.classList.contains('size-compact')
			}))
		);
		for (const item of metrics) {
			expect(item.weight, route + ' ' + item.text).toBe('400');
			expect(item.size).toBeGreaterThanOrEqual(
				info.project.name === 'desktop' && !item.compact ? 20 : 18
			);
			expect(item.height).toBeGreaterThanOrEqual(44);
		}
	}
});

test('About opens with the team, not a wall of duplicate introduction copy', async ({ page }) => {
	await visit(page, '/about');
	await expect(page.locator('.about-overview')).toHaveCount(0);
	await expect(page.locator('.about-team article')).toHaveCount(3);
	await expect(page.locator('.about-socials .social-links a')).toHaveCount(3);
	for (const link of await page.locator('.about-socials .social-links a').all()) {
		await expect(link).toHaveAttribute('href', /^https:/);
		expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(48);
		await expect(link.locator('img')).toHaveAttribute('src', /assets\/icons\/brands\//);
	}
});

test('Contact has centered contact channels and a centered usable form', async ({ page }, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/contact');
	const form = page.locator('.contact-form-panel');
	const bounds = await form.boundingBox();
	const parent = await page.locator('.contact-intake').boundingBox();
	const viewportCenter = parent!.x + parent!.width / 2;
	expect(Math.abs(bounds!.x + bounds!.width / 2 - viewportCenter)).toBeLessThan(2);
	await expect(page.locator('.contact-channel')).toHaveCount(3);
	expect(
		await page.locator('.site-intro__content').evaluate((node) => getComputedStyle(node).textAlign)
	).toBe('center');
	expect(await form.locator('header').evaluate((node) => getComputedStyle(node).textAlign)).toBe(
		'center'
	);
	expect(
		await form.locator('input[name="name"]').evaluate((node) => getComputedStyle(node).fontSize)
	).toBe('18px');
	const result = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
		.analyze();
	expect(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
		[]
	);
});

test('buying-panel selections retain their size and weight after choosing', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/');
	const trigger = page.locator('.home-hero__panel .hfp__field').first();
	await trigger.click();
	const dialog = page.getByRole('dialog');
	await dialog.getByRole('button', { name: /BMW/ }).click();
	await dialog.getByRole('button', { name: /Готово/ }).click();
	await expect(trigger).toBeFocused();
	const value = trigger.locator('.hfp__value');
	expect(await value.evaluate((node) => getComputedStyle(node).fontWeight)).toBe('400');
	expect(await value.evaluate((node) => getComputedStyle(node).fontSize)).toBe('18px');
	await expect(trigger).toHaveClass(/hfp__field--compact/);
	await expect(value).toContainText('BMW');
});

test('home buying controls wrap before default labels are truncated', async ({ page }, info) => {
	test.skip(info.project.name !== 'desktop');
	for (const width of [768, 1024, 1100, 1200, 1440]) {
		await page.setViewportSize({ width, height: 1000 });
		await visit(page, '/');
		const clipped = await page
			.locator('.home-hero__panel .hfp__value')
			.evaluateAll((nodes) =>
				nodes
					.filter((node) => node.scrollWidth > node.clientWidth + 1)
					.map((node) => node.textContent)
			);
		expect(clipped, 'width ' + width).toEqual([]);
	}
});
