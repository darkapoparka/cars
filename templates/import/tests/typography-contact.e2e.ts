import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

for (const locale of ['en', 'bg']) {
	test(`public typography loads the actual Sofia Sans Latin and Cyrillic faces (${locale})`, async ({
		page
	}, info) => {
		const fontResponses: Array<{ url: string; status: number }> = [];
		page.on('response', (response) => {
			if (/sofia-sans\/.*\.woff2/.test(response.url())) {
				fontResponses.push({ url: response.url(), status: response.status() });
			}
		});
		await visit(page, `/${locale}/sell-your-car`);
		const delivery = await page.evaluate(async () => {
			const faces = await Promise.all(
				['400', '600', '700'].map(async (weight) => {
					const loaded = await document.fonts.load(`${weight} 20px "Sofia Sans"`, 'Buy Купи');
					return loaded.map(({ family, weight, status }) => ({ family, weight, status }));
				})
			);
			return {
				faces: faces.flat(),
				preloaded: performance
					.getEntriesByType('resource')
					.filter((entry) => entry.name.includes('/fonts/sofia-sans/SofiaSans-'))
					.filter((entry) => (entry as PerformanceResourceTiming).initiatorType === 'link')
					.map((entry) => entry.name.split('/').pop())
			};
		});
		for (const weight of ['400', '600', '700']) {
			const faces = delivery.faces.filter((face) => face.weight === weight);
			expect(faces.length).toBeGreaterThanOrEqual(2);
			for (const face of faces) {
				expect(face).toEqual({ family: 'Sofia Sans', weight, status: 'loaded' });
			}
		}
		if (info.project.name === 'desktop') {
			for (const weight of ['Regular', 'SemiBold', 'Bold']) {
				expect(delivery.preloaded).toContain(`SofiaSans-${weight}.latin.woff2`);
				if (locale === 'bg')
					expect(delivery.preloaded).toContain(`SofiaSans-${weight}.cyrillic.woff2`);
			}
		} else {
			expect(delivery.preloaded, 'Desktop font preloads must not run on mobile').toEqual([]);
		}
		expect(fontResponses.length).toBeGreaterThan(0);
		expect(
			fontResponses,
			'Font assets must load or revalidate successfully from public URLs'
		).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ url: expect.stringContaining('SofiaSans-Regular.latin.woff2') }),
				expect.objectContaining({
					url: expect.stringContaining('SofiaSans-Regular.cyrillic.woff2')
				})
			])
		);
		expect(
			fontResponses.every(
				({ url, status }) => [200, 304].includes(status) && !url.includes('/static/')
			)
		).toBe(true);
	});
}

test('public actions share a readable control weight', async ({ page }, info) => {
	for (const route of ['/', '/inventory', '/about', '/contact', '/services', '/financing']) {
		await visit(page, route);
		const actions = page.locator('.site-action:visible');
		const metrics = await actions.evaluateAll((nodes) =>
			nodes.map((node) => ({
				text: node.textContent,
				size: parseFloat(getComputedStyle(node).fontSize),
				weight: getComputedStyle(node).fontWeight,
				height: node.getBoundingClientRect().height,
				compact: node.classList.contains('size-compact'),
				teamCard: Boolean(node.closest('.team-card__action')),
				mobileLabel: Boolean(node.closest('.service-mobile-filters, .contact-banner')),
				card: Boolean(node.closest('.site-vehicle-card')),
				filter: node.classList.contains('inventory-toolbar__all')
			}))
		);
		for (const item of metrics) {
			expect(item.weight, route + ' ' + item.text).toBe('400');
			const desktopCard = info.project.name === 'desktop' && item.card;
			const desktopTeamAction = info.project.name === 'desktop' && item.teamCard;
			expect(item.size, route + ' ' + item.text).toBeGreaterThanOrEqual(
				desktopCard || desktopTeamAction || (info.project.name === 'desktop' && item.filter)
					? 16
					: info.project.name === 'mobile' && item.mobileLabel
						? 16
						: info.project.name === 'desktop' && !item.compact && !item.filter
							? 20
							: 18
			);
			expect(item.height).toBeGreaterThanOrEqual(desktopCard || desktopTeamAction ? 36 : 44);
		}
	}
});

test('About opens with the team and retains accessible social destinations', async ({
	page
}, info) => {
	await visit(page, '/about');
	await expect(page.locator('.about-overview')).toHaveCount(0);
	await expect(page.locator('.about-team article')).toHaveCount(3);
	const socials = page.locator(
		info.project.name === 'desktop'
			? '.desktop-hero-action-panel .social-links a:visible'
			: '.about-socials .social-links a:visible'
	);
	if (info.project.name === 'desktop') {
		await expect(page.locator('.site-footer .social-links a')).toHaveCount(3);
		await expect(page.locator('.desktop-hero-action-panel .social-links--plain')).toBeVisible();
	}
	await expect(socials).toHaveCount(3);
	for (const link of await socials.all()) {
		await expect(link).toHaveAttribute('href', /^https:/);
		expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(48);
		if (info.project.name === 'desktop') {
			await expect(link.locator('svg')).toBeVisible();
			await expect(link.locator('svg')).toHaveAttribute('aria-hidden', 'true');
			await expect(link.locator('svg')).toHaveAttribute('fill', 'currentColor');
			await expect(link.locator('svg path')).toHaveCount(1);
		} else {
			await expect(link.locator('img')).toHaveAttribute('src', /assets\/icons\/brands\//);
		}
	}
});

test('Contact pairs the framed location with a usable form and reflows at narrower desktop widths', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/contact');
	const form = page.locator('.contact-form-panel');
	const bounds = await form.boundingBox();
	const parent = await page.locator('.contact-intake-grid').boundingBox();
	const location = page.locator('.contact-intake .contact-location');
	const map = (await location.boundingBox())!;
	expect(map.x + map.width).toBeLessThan(bounds!.x);
	expect(Math.abs(map.y - bounds!.y)).toBeLessThan(1);
	const locationTitle = (await location.getByRole('heading').boundingBox())!;
	const formTitle = (await form.getByRole('heading').boundingBox())!;
	expect(Math.abs(locationTitle.y - formTitle.y)).toBeLessThan(1);
	expect(Math.abs(locationTitle.x - map.x - (formTitle.x - bounds!.x))).toBeLessThan(1);
	expect(Math.abs(bounds!.x + bounds!.width - parent!.x - parent!.width)).toBeLessThan(1);
	await expect(page.locator('#contact-details .contact-intake-grid')).toBeVisible();
	await expect(page.locator('.contact-channel')).toHaveCount(0);
	const heroPanel = page.locator('.desktop-hero-action-panel .desktop-discovery-panel');
	await expect(heroPanel).toBeVisible();
	await expect(heroPanel.locator('a[href^="tel:"]')).toHaveCount(1);
	await expect(heroPanel.locator('.site-action')).toHaveCount(2);
	await expect(heroPanel.locator('a[href="#contact-enquiry"]')).toBeVisible();
	await expect(heroPanel.locator('.social-links a')).toHaveCount(3);
	await expect(page.locator('.desktop-hero-actions__secondary a')).toHaveCount(3);
	expect(
		await page.locator('.site-intro__content').evaluate((node) => getComputedStyle(node).textAlign)
	).toBe('center');
	expect(await form.locator('header').evaluate((node) => getComputedStyle(node).textAlign)).toBe(
		'left'
	);
	expect(
		await form.locator('input[name="name"]').evaluate((node) => getComputedStyle(node).fontSize)
	).toBe('18px');
	await page.setViewportSize({ width: 768, height: 1000 });
	const narrowMap = (await location.boundingBox())!;
	const narrowForm = (await form.boundingBox())!;
	expect(narrowMap.y + narrowMap.height).toBeLessThan(narrowForm.y);
	expect(Math.abs(narrowMap.x - narrowForm.x)).toBeLessThan(1);
	expect(Math.abs(narrowMap.width - narrowForm.width)).toBeLessThan(1);
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
	expect(await value.evaluate((node) => getComputedStyle(node).fontSize)).toBe('16px');
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
