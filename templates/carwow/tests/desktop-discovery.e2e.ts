import { expect, test } from '@playwright/test';

test('desktop type and make grids open all inventory from the final tile', async ({ page }) => {
	for (const locale of ['en', 'bg']) {
		await page.goto(`/${locale}`);
		await expect(page.getByRole('tab').first()).toBeEnabled();
		for (const sectionSelector of [
			'.daynight-home-section--vehicle-types',
			'.daynight-home-brand-section'
		]) {
			const section = page.locator(sectionSelector);
			await expect(section.locator('.desktop-section-heading a')).toHaveCount(0);
			const lastTile = section.locator('.desktop-browse-all');
			await expect(lastTile).toHaveAttribute('href', `/${locale}/inventory`);
			await lastTile.focus();
			await lastTile.press('Enter');
			await expect(page).toHaveURL(new RegExp(`/${locale}/inventory$`));
			await expect(
				page.locator('[data-daynight-grid-panel].active [data-daynight-vehicle-card]').first()
			).toBeVisible();
			await page.goto(`/${locale}`);
		}
	}
});

for (const locale of ['en', 'bg']) {
	for (const width of [992, 1280, 1440, 1920]) {
		test(`compact inventory filters stay in one row and preserve focus in ${locale} at ${width}px`, async ({
			page
		}, testInfo) => {
			await page.setViewportSize({ width, height: 1000 });
			await page.goto(`/${locale}/inventory`);
			await expect(page.locator('.inventory-filter-triggers button').first()).toBeVisible();
			await expect(page.locator('.inventory-filter-triggers button').first()).toBeEnabled();
			await page.evaluate(() => document.fonts.ready);
			const shelf = page.locator('.inventory-results-shortcuts');
			await expect(shelf).toBeVisible();
			await expect
				.poll(() =>
					page
						.locator('[data-daynight-grid-panel].active .image > a img')
						.first()
						.evaluate((image: HTMLImageElement) => ({
							loaded: image.complete && image.naturalWidth > 0,
							realPhoto: !image.currentSrc.includes('transparent-1x1'),
							currentSrc: image.currentSrc,
							viewport: innerWidth,
							gutter: getComputedStyle(document.documentElement).scrollbarGutter
						}))
				)
				.toMatchObject({ loaded: true, realPhoto: true });
			const chips = shelf.locator('a');
			await expect(chips).toHaveCount(5);
			const mainFilters = page.locator('.inventory-banner-filters .inventory-filter-triggers');
			await expect(mainFilters.locator('button')).toHaveCount(5);
			await expect(page.locator('.inventory-hero .inventory-results-shortcuts')).toHaveCount(0);
			await expect
				.poll(() =>
					shelf.evaluate((element) => {
						const box = element.getBoundingClientRect();
						const hero = document.querySelector('.inventory-hero');
						const listings = element.closest('.daynight-inventory-listing-controls');
						if (!element.isConnected || !hero || !listings) return null;
						const frame = listings.getBoundingClientRect();
						return {
							separated: box.top > hero.getBoundingClientRect().bottom,
							aligned: Math.abs(box.left - frame.left) < 1,
							contained: [...element.querySelectorAll('a')].every((chip) => {
								const bounds = chip.getBoundingClientRect();
								return (
									bounds.left >= box.left - 1 &&
									bounds.right <= box.right + 1 &&
									bounds.top >= box.top &&
									bounds.bottom <= box.bottom + 1
								);
							})
						};
					})
				)
				.toEqual({ separated: true, aligned: true, contained: true });
			await expect
				.poll(() =>
					chips.evaluateAll((elements) => {
						const shelf = elements[0]
							.closest('.inventory-results-shortcuts')!
							.getBoundingClientRect();
						const rows = new Map<number, DOMRect[]>();
						for (const element of elements) {
							const box = element.getBoundingClientRect();
							const key = Math.round(box.top);
							rows.set(key, [...(rows.get(key) ?? []), box]);
						}
						return (
							rows.size === 1 &&
							[...rows.values()].every(
								(row) =>
									row.length > 1 &&
									Math.abs(row[0].left - shelf.left) < 1 &&
									row.at(-1)!.right <= shelf.right + 1
							)
						);
					})
				)
				.toBe(true);
			const controlRows = await mainFilters
				.locator('button')
				.evaluateAll((buttons) =>
					buttons.map((button) => Math.round(button.getBoundingClientRect().top))
				);
			expect(new Set(controlRows).size).toBe(1);
			const suv = shelf.locator(
				'[data-daynight-shortcut-field="body"][data-daynight-shortcut-value="Джип"]'
			);
			await suv.focus();
			await suv.press('Enter');
			await expect(suv).toHaveAttribute('aria-current', 'true');
			await expect(suv).toBeFocused();
			await expect.poll(() => new URL(page.url()).searchParams.get('body')).toBe('Джип');
			await expect(suv).toHaveCSS('color', 'rgb(255, 255, 255)');
			await suv.press('Enter');
			await expect(suv).toHaveAttribute('aria-current', 'false');
			await expect.poll(() => new URL(page.url()).searchParams.has('body')).toBe(false);
			await expect(chips.first()).toHaveAttribute('aria-current', 'true');
			await page.screenshot({ path: testInfo.outputPath(`quick-filters-${locale}-${width}.png`) });
		});
	}
}

for (const locale of ['en', 'bg']) {
	test(`filters chosen in More filters remain visible and removable in ${locale}`, async ({
		page
	}) => {
		await page.setViewportSize({ width: 1440, height: 1000 });
		await page.goto(`/${locale}/inventory?brand=BMW`);
		await page.locator('.inventory-banner-filters .all-filters').click();
		const dialog = page.getByRole('dialog');
		await expect(dialog.locator('#modal-fuel')).toBeVisible();
		await dialog.locator('#modal-fuel').selectOption('Дизел');
		await dialog.locator('#modal-price').selectOption('under-50000');
		await dialog.locator('#modal-mileage').selectOption('under-100000');
		await dialog.locator('#modal-availability').selectOption('available');
		const priceLabel = (await dialog.locator('#modal-price option:checked').innerText()).trim();
		const mileageLabel = (await dialog.locator('#modal-mileage option:checked').innerText()).trim();
		await dialog.locator('.filter-dialog-apply').click();
		await expect(dialog).not.toBeVisible();
		for (const field of ['brand', 'fuel', 'price', 'mileage', 'availability']) {
			await expect(page.locator(`[data-daynight-clear-field="${field}"]`)).toBeVisible();
		}
		await expect(
			page.locator('[data-daynight-clear-field="price"] .select-item__label')
		).toHaveText(priceLabel);
		await expect(
			page.locator('[data-daynight-clear-field="mileage"] .select-item__label')
		).toHaveText(mileageLabel);
		await page.locator('[data-daynight-clear-field="fuel"]').click();
		await expect.poll(() => new URL(page.url()).searchParams.has('fuel')).toBe(false);
		await expect(page.locator('[data-daynight-clear-field="brand"]')).toBeVisible();
		await page.locator('[data-daynight-clear-field="brand"]').click();
		await expect.poll(() => new URL(page.url()).searchParams.has('brand')).toBe(false);
		await expect(page.locator('[data-daynight-clear-field="price"]')).toBeVisible();
		await page.locator('#btnClearAll').click();
		await expect(page).toHaveURL(new RegExp(`/${locale}/inventory$`));
		await expect(page.locator('#filterResults')).not.toBeVisible();
		await expect(page.locator('[data-daynight-shortcut-clear]')).toHaveAttribute(
			'aria-current',
			'true'
		);
	});
}

test('inventory search entry points open the full filter dialog and restore focus', async ({
	page
}) => {
	await page.goto('/inventory?brand=BMW&q=X6');
	await expect(page.locator('#daynight-inventory-hero-search')).toBeEnabled();
	const triggers = [
		page.locator('#daynight-inventory-hero-search'),
		page.locator('.daynight-inventory-searchbar__submit'),
		page.locator('#searchToggle')
	];
	for (const trigger of triggers) {
		await trigger.click();
		const dialog = page.getByRole('dialog', { name: 'Търсене на автомобили' });
		await expect(dialog).toBeVisible();
		const input = dialog.getByRole('searchbox', { name: 'Марка, модел или ключова дума' });
		await expect(input).toBeFocused();
		await expect(input).toHaveValue('X6');
		await expect(
			dialog.locator('.filter-dialog-multiselect').first().locator('summary')
		).toContainText('BMW');
		await expect(input).toHaveCSS('box-shadow', 'none');
		await expect(input).toHaveCSS('outline-style', 'none');
		await expect(dialog.locator('.filter-dialog-search')).toHaveCSS(
			'border-color',
			'rgb(23, 27, 30)'
		);
		await expect(page.locator('#searchForm')).toHaveCount(1);
		await expect(page.locator('#searchToggle')).toHaveAttribute('aria-expanded', 'true');
		await input.fill('discard this draft');
		await page.keyboard.press('Escape');
		await expect(dialog).not.toBeVisible();
		await expect(trigger).toBeFocused();
		await expect(page.locator('#searchToggle')).toHaveAttribute('aria-expanded', 'false');
		await expect(page).toHaveURL(/q=X6/);
	}
});

test('all filters support brand selection, extras, reset and keyboard search', async ({
	page
}, testInfo) => {
	await page.setViewportSize({ width: 1280, height: 720 });
	await page.goto('/inventory');
	await page.getByRole('button', { name: 'Още филтри', exact: true }).click();
	const dialog = page.getByRole('dialog', { name: 'Търсене на автомобили' });
	const brand = dialog.locator('.filter-dialog-multiselect').first();
	await brand.locator('summary').click();
	await brand.getByRole('checkbox', { name: 'BMW', exact: true }).check();
	await brand.getByRole('checkbox', { name: 'Audi', exact: true }).check();
	await expect(brand.locator('summary')).toContainText('BMW');
	await expect(brand.locator('summary')).toContainText('Audi');
	await brand.locator('summary').click();
	await dialog.locator('#modal-mileage').selectOption('under-100000');
	await dialog.getByRole('button', { name: /Всички екстри/ }).click();
	await dialog.getByRole('checkbox', { name: '4x4', exact: true }).check();
	await expect(dialog.locator('.filter-dialog-apply')).toBeInViewport();
	await expect(dialog.locator('.filter-dialog-close')).toBeInViewport();
	await dialog.getByRole('button', { name: 'Изчисти всички', exact: true }).click();
	await expect(brand.locator('summary')).toHaveText('Всички');
	await expect(dialog.getByRole('checkbox', { name: '4x4', exact: true })).not.toBeChecked();
	await expect(dialog.locator('#modal-mileage')).toHaveValue('');
	const input = dialog.getByRole('searchbox', { name: 'Марка, модел или ключова дума' });
	await input.fill('BMW');
	await input.scrollIntoViewIfNeeded();
	await page.screenshot({ path: testInfo.outputPath('all-filters-focused-1280.png') });
	await input.press('Enter');
	await expect(dialog).not.toBeVisible();
	await expect(page).toHaveURL(/q=BMW/);
	await expect(page.locator('#daynight-inventory-hero-search')).toHaveText('BMW');
	expect(await page.locator('[data-daynight-vehicle-card]:visible').count()).toBeGreaterThan(0);
	await page.locator('#daynight-inventory-hero-search').click();
	await expect(input).toHaveValue('BMW');
	await page.keyboard.press('Escape');
	await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('home filters contain keyboard focus and return it on close and selection', async ({
	page
}) => {
	await page.goto('/');
	const trigger = page.getByRole('button', { name: 'Марка: Марка', exact: true });
	await trigger.click();
	const dialog = page.getByRole('dialog', { name: 'Марка', exact: true });
	await expect(dialog.getByRole('textbox')).toBeFocused();
	await dialog.getByRole('button', { name: 'Затвори', exact: true }).last().focus();
	await page.keyboard.press('Shift+Tab');
	await page.keyboard.press('Shift+Tab');
	expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
	await page.keyboard.press('Escape');
	await expect(dialog).toHaveCount(0);
	await expect(trigger).toBeFocused();
	await trigger.click();
	await page.getByRole('option', { name: 'BMW', exact: true }).click();
	await expect(page.getByRole('button', { name: 'Марка: BMW', exact: true })).toBeFocused();
	const mileage = page.getByRole('button', { name: 'Пробег: Пробег', exact: true });
	await mileage.click();
	await expect(page.getByRole('option', { name: 'Всички пробези', exact: true })).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(mileage).toBeFocused();
});

test('card actions remain legible and retain state from home to inventory and favorites', async ({
	page
}) => {
	await page.goto('/');
	await expect(page.getByRole('tab', { name: 'Купи автомобил', exact: true })).toBeEnabled();
	const card = page.locator('.daynight-home-inventory__card').first();
	const slug = await card.getAttribute('data-daynight-slug');
	const actions = card.locator('.desktop-vehicle-actions button');
	for (const action of await actions.all()) {
		await expect(action).toHaveCSS('background-color', 'rgb(255, 255, 255)');
		await expect(action.locator('svg')).toHaveCSS('stroke', 'rgb(23, 27, 30)');
		await action.click();
		await expect(action).toHaveAttribute('aria-pressed', 'true');
		await expect(action.locator('svg path').first()).toHaveCSS('stroke', 'rgb(255, 255, 255)');
	}
	await page.goto('/inventory');
	const inventoryCard = page.locator(`[data-daynight-slug="${slug}"]`).first();
	for (const action of await inventoryCard.locator('.desktop-vehicle-actions button').all()) {
		await expect(action).toHaveAttribute('aria-pressed', 'true');
		await action.focus();
		await expect(action).toHaveCSS('outline-style', 'solid');
	}
	await page.goto('/favorites');
	await expect(page.locator(`a[href="/bg/inventory/${slug}"]`).first()).toBeVisible();
	await page.goto('/compare');
	await expect(page.locator('.card-details')).toBeVisible();
	await page.goto('/inventory');
	for (const action of await page
		.locator(`[data-daynight-slug="${slug}"]`)
		.first()
		.locator('.desktop-vehicle-actions button')
		.all()) {
		await action.click();
		await expect(action).toHaveAttribute('aria-pressed', 'false');
	}
});

test('home and inventory controls match, inventory modal applies a filter and restores focus', async ({
	page
}) => {
	await page.goto('/');
	const style = await page
		.locator('.hero-intent__filter')
		.first()
		.evaluate((element) => {
			const css = getComputedStyle(element);
			return {
				background: css.backgroundColor,
				radius: css.borderRadius,
				height: css.height,
				font: css.fontSize
			};
		});
	await page.goto('/inventory');
	const trigger = page.locator('.inventory-filter-triggers button').first();
	await expect(trigger).toHaveCSS('background-color', style.background);
	await expect(trigger).toHaveCSS('border-radius', style.radius);
	await expect(trigger).toHaveCSS('height', style.height);
	await expect(trigger).toHaveCSS('font-size', style.font);
	const input = page.locator('#daynight-inventory-hero-search');
	await expect(input).toBeEnabled();
	await input.focus();
	await expect(input).toHaveCSS('outline-style', 'none');
	await expect(page.locator('.inventory-hero .daynight-inventory-search')).toHaveCSS(
		'outline-color',
		'rgb(245, 197, 66)'
	);
	await trigger.click();
	const dialog = page.getByRole('dialog');
	await expect(dialog).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(dialog).not.toBeVisible();
	await expect(trigger).toBeFocused();
	await trigger.click();
	await dialog.getByRole('checkbox', { name: 'BMW', exact: true }).check();
	await dialog.getByRole('button', { name: /Покажи/ }).click();
	await expect(trigger).toContainText('BMW');
	await expect(page).toHaveURL(/brand=BMW/i);
	await expect(trigger).toBeFocused();
	expect(await page.locator('[data-daynight-vehicle-card]:visible').count()).toBeGreaterThan(0);
});

for (const width of [1280, 1440, 1920, 390]) {
	test(`route audit at ${width}px`, async ({ page }, testInfo) => {
		await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
		const errors: string[] = [];
		page.on('pageerror', (error) => errors.push(error.message));
		for (const path of ['/', '/inventory', '/sell-your-car', '/contact?intent=import']) {
			await page.goto(path);
			await expect(page.locator('h1').first()).toBeVisible();
			await page.evaluate(() => document.fonts.ready);
			expect(
				await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
				path
			).toBe(true);
			const broken = await page
				.locator('img:visible')
				.evaluateAll((images) =>
					images
						.filter(
							(image) =>
								image instanceof HTMLImageElement && image.complete && image.naturalWidth === 0
						)
						.map((image) => image.getAttribute('src'))
				);
			expect(broken, path).toEqual([]);
			await page.screenshot({
				path: testInfo.outputPath(
					`${path === '/' ? 'home' : path.split('?')[0].slice(1)}-${width}.png`
				),
				fullPage: true
			});
		}
		expect(errors).toEqual([]);
	});
}
