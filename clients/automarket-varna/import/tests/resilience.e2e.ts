import { expect, test } from '@playwright/test';
import { visit } from './helpers';

test('Compare recovers when Back closes an in-flight request and Forward reopens it', async ({
	page
}) => {
	await visit(page, '/en/services');
	let release!: () => void;
	let finish!: () => void;
	const held = new Promise<void>((resolve) => (release = resolve));
	const finished = new Promise<void>((resolve) => (finish = resolve));
	await page.route(
		'**/en/compare/__data.json*',
		async (route) => {
			const response = await route.fetch();
			await held;
			await route.fulfill({ response });
			finish();
		},
		{ times: 1 }
	);
	await page.locator('[data-service="comparison"] > a').click();
	const dialog = page.getByRole('dialog', { name: 'Compare cars', exact: true });
	await expect(dialog.getByRole('status').filter({ hasText: 'Loading cars' })).toContainText(
		'Loading'
	);
	await page.goBack();
	await expect(dialog).not.toBeVisible();
	release();
	await finished;
	await page.goForward();
	await expect(dialog.getByRole('searchbox')).toBeVisible();
	await expect(
		dialog.getByRole('button', { name: 'Select car: BMW X4 M Competition', exact: true })
	).toBeVisible();
	await expect(page).toHaveURL('/en/services');
});

test('failed persistence does not overwrite the current garage or its legacy DOM projection', async ({
	page,
	isMobile
}) => {
	test.skip(isMobile, 'Exercise the native desktop controls and compatibility projection together');
	await visit(page, '/en/inventory');
	const card = page.locator('.site-vehicle-card').first();
	const href = await card.locator('h2 a').getAttribute('href');
	const slug = new URL(href!, page.url()).pathname.split('/').at(-1)!;
	await page.evaluate((slug) => {
		const original = Storage.prototype.setItem;
		Storage.prototype.setItem = function (key, value) {
			if (key === 'daynight:favorites' || key === 'daynight:compare')
				throw new DOMException('Synthetic quota failure', 'QuotaExceededError');
			original.call(this, key, value);
		};
		const legacy = document.createElement('div');
		legacy.hidden = true;
		legacy.dataset.daynightSlug = slug;
		legacy.id = 'legacy-garage-projection';
		const favorite = document.createElement('button');
		favorite.className = 'daynight-favorite';
		favorite.setAttribute('aria-pressed', 'false');
		legacy.append(favorite);
		document.body.append(legacy);
	}, slug);
	const favorite = card.locator('.site-vehicle-card__favorite');
	await favorite.click();
	await expect(favorite).toHaveAttribute('aria-pressed', 'true');
	await expect(page.locator('#legacy-garage-projection button')).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await card.locator('.site-vehicle-card__actions > button').click();
	await expect(card.locator('.site-vehicle-card__actions > button')).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await expect(page.locator('#legacy-garage-projection button')).toHaveAttribute(
		'aria-pressed',
		'true'
	);
	await favorite.click();
	await expect(favorite).toHaveAttribute('aria-pressed', 'false');
	await expect(page.locator('#legacy-garage-projection button')).toHaveAttribute(
		'aria-pressed',
		'false'
	);
	expect(await page.evaluate(() => localStorage.getItem('daynight:favorites'))).toBeNull();
});
