import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test('header reserves the same trailing slot without inventing Home or Contact menus', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/');
	await expect(page.locator('.site-nav-item .site-nav-slot')).toHaveCount(2);
	for (const width of [768, 1024, 1200, 1280, 1440, 1920]) {
		await page.setViewportSize({ width, height: 1000 });
		const boxes = await page.evaluate(() => {
			const rect = (selector: string) =>
				document.querySelector(selector)!.getBoundingClientRect().toJSON();
			return {
				nav: rect('.site-header__nav'),
				logo: rect('.site-header__logo'),
				actions: rect('.site-header__actions')
			};
		});
		const overlap = (a: typeof boxes.nav, b: typeof boxes.nav) =>
			a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
		expect(overlap(boxes.nav, boxes.logo)).toBe(false);
		expect(overlap(boxes.nav, boxes.actions)).toBe(false);
	}
	await expect(
		page.locator('.site-nav-item').filter({ hasText: 'Начало' }).getByRole('button')
	).toHaveCount(0);
	const widths = await page
		.locator('.site-nav-slot, .site-nav-toggle')
		.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width));
	expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
});

test('desktop buying panel contrasts with its hero without shrinking the tabs', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/');
	const surface = await page.locator('.home-hero__panel').evaluate((node) => ({
		panel: getComputedStyle(node).backgroundColor,
		hero: getComputedStyle(node.closest('.home-hero')!).backgroundColor
	}));
	expect(surface.panel).not.toBe(surface.hero);
	expect(surface.panel).not.toBe('rgba(0, 0, 0, 0)');
	expect(
		await page
			.locator('.home-hero__box [role="tab"]')
			.first()
			.evaluate((node) => parseFloat(getComputedStyle(node).fontSize))
	).toBeGreaterThanOrEqual(20);
	await page.locator('.home-hero__box').getByRole('tab', { name: 'Внос', exact: true }).click();
	await expect(page.locator('#home-query')).toHaveAttribute('placeholder', 'LINK / VIN');
});

test('all-brands tile renders an icon, not an empty image, and preserves locale', async ({
	page
}) => {
	await visit(page, '/?lang=en');
	const all = page.locator('.home-brands .home-browse-all');
	await expect(all).toHaveCount(1);
	await expect(all.locator('svg')).toHaveCount(1);
	await expect(all.locator('img')).toHaveCount(0);
	await all.click();
	await expect(page).toHaveURL(
		(url) =>
			url.pathname === '/en/inventory' &&
			url.searchParams.get('lang') === 'en' &&
			!url.searchParams.has('brand')
	);
});

test('reviews retain their avatars and articles share a complete card on the home and blog routes', async ({
	page
}) => {
	await visit(page, '/');
	const avatars = page.locator('.home-reviews .review-card__avatar img');
	await expect(avatars).toHaveCount(3);
	for (const image of await avatars.all()) {
		await image.scrollIntoViewIfNeeded();
		await expect
			.poll(() => image.evaluate((node) => (node as HTMLImageElement).naturalWidth))
			.toBeGreaterThan(0);
	}
	const first = page.locator('.home-news .article-card').first();
	await expect(first.locator('.article-card__body')).toBeVisible();
	expect(
		await first
			.locator('a')
			.evaluate((node) => parseFloat(getComputedStyle(node).borderTopLeftRadius))
	).toBeGreaterThan(0);
	await expect(first.locator('.article-card__more')).toContainText('Прочети');
	const href = await first.locator('a').getAttribute('href');
	await first.locator('a').click();
	await expect(page).toHaveURL((url) => url.pathname === href);
	await visit(page, '/blog');
	await expect(page.locator('.article-card__body').first()).toBeVisible();
});

test('compact filters fit on desktop and retain an accessible persistent footer', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/inventory');
	const trigger = page.locator('.inventory-toolbar__all');
	await trigger.click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	const scrollRegions = await dialog.evaluate((node) =>
		[...node.querySelectorAll<HTMLElement>('*')]
			.filter(
				(element) =>
					element.scrollHeight > element.clientHeight + 2 &&
					['auto', 'scroll'].includes(getComputedStyle(element).overflowY)
			)
			.map((element) => element.className)
	);
	expect(scrollRegions).toHaveLength(0);
	const surfaces = await dialog.evaluate((node) => ({
		body: getComputedStyle(node.querySelector('.site-dialog__body')!).backgroundColor,
		group: getComputedStyle(node.querySelector('.compact-field__trigger')!).backgroundColor
	}));
	expect(surfaces.body).not.toBe(surfaces.group);
	const footer = dialog.locator('.site-dialog__footer');
	const initial = await footer.boundingBox();
	await dialog.locator('.site-dialog__body').evaluate((node) => {
		node.scrollTop = node.scrollHeight;
	});
	expect((await footer.boundingBox())!.y).toBe(initial!.y);
	await expect(footer.getByRole('button', { name: 'Покажи автомобили' })).toBeVisible();
	const results = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
		.analyze();
	expect(
		results.violations.map((item) => ({
			id: item.id,
			targets: item.nodes.map((node) => node.target)
		}))
	).toEqual([]);
	await page.keyboard.press('Escape');
	await expect(dialog).not.toBeVisible();
	await expect(trigger).toBeFocused();
});

test('all-filters search preserves hidden selected models and replaces canonical price values', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/inventory?brand=BMW&maxPrice=50000&view=3');
	await page.locator('.inventory-toolbar__all').click();
	const dialog = page.getByRole('dialog');
	await dialog.getByRole('button', { name: /^Модел / }).click();
	const model = page.locator('.compact-field__popover');
	const search = model.getByRole('searchbox');
	const firstChoice = model.getByRole('checkbox').first();
	const selected = await firstChoice.locator('..').innerText();
	await search.fill(selected!);
	const choice = model.getByRole('checkbox').first();
	await choice.check();
	await search.fill('no-matching-model');
	await model.getByRole('button', { name: 'Готово', exact: true }).click();
	await expect(dialog.locator('input[type="hidden"][name="q"]')).toHaveValue(selected!);
	await dialog.getByRole('spinbutton', { name: 'Максимална цена (EUR)' }).fill('30000');
	await dialog
		.locator('.site-dialog__footer')
		.getByRole('button', { name: 'Покажи автомобили' })
		.click();
	await expect(page).toHaveURL(
		(url) =>
			url.searchParams.get('maxPrice') === '30000' &&
			url.searchParams.get('q') === selected &&
			url.searchParams.get('brand') === 'BMW' &&
			!url.searchParams.has('priceTo') &&
			url.searchParams.get('view') === '3'
	);
});
