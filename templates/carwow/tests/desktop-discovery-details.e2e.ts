import { expect, test } from '@playwright/test';

test('Newest cars uses a centered heading, full-width pills and a final inventory tile', async ({
	page
}) => {
	for (const locale of ['en', 'bg']) {
		for (const width of [992, 1280, 1440, 1920]) {
			await page.setViewportSize({ width, height: 1000 });
			await page.goto(`/${locale}`);
			const section = page.locator('.daynight-home-inventory');
			await expect(section.locator('h2')).toBeVisible();
			await page.evaluate(() => document.fonts.ready);
			await expect(section.locator('.desktop-section-heading a')).toHaveCount(0);
			await expect
				.poll(() =>
					section.evaluate((element) => {
						const frame = element
							.querySelector('.daynight-home-inventory__body')!
							.getBoundingClientRect();
						const heading = element.querySelector('h2')!.getBoundingClientRect();
						const pills = [...element.querySelectorAll('.daynight-home-inventory__pill')];
						const first = pills[0].getBoundingClientRect(),
							last = pills.at(-1)!.getBoundingClientRect();
						return (
							Math.abs(heading.left + heading.width / 2 - frame.left - frame.width / 2) < 1 &&
							Math.abs(first.left - frame.left) < 1 &&
							Math.abs(last.right - frame.right) < 1 &&
							pills.every((pill) => {
								const box = pill.getBoundingClientRect(),
									text = pill.querySelector('span')!.getBoundingClientRect();
								return (
									text.left >= box.left + 10 &&
									text.right <= box.right - 10 &&
									box.top === first.top
								);
							})
						);
					})
				)
				.toBe(true);
			const lastTile = section.locator('[data-daynight-inventory-browse]');
			await expect(lastTile).toBeVisible();
			await expect(lastTile).toHaveAttribute('href', `/${locale}/inventory`);
			await expect(lastTile.locator('.daynight-home-inventory__browse-label')).toHaveCSS(
				'font-size',
				'20px'
			);
			await expect(lastTile.locator('.daynight-home-inventory__browse-label')).toHaveCSS(
				'font-weight',
				'700'
			);
			await expect
				.poll(() =>
					section.locator('.daynight-home-inventory__grid').evaluate((grid) => {
						const tiles = [...grid.children].filter(
							(element) => element.getClientRects().length > 0
						);
						const last = tiles.at(-1)!;
						return (
							last.hasAttribute('data-daynight-inventory-browse') &&
							Math.abs(
								last.getBoundingClientRect().height - tiles.at(-2)!.getBoundingClientRect().height
							) < 1
						);
					})
				)
				.toBe(true);
			await lastTile.focus();
			await lastTile.press('Enter');
			await expect(page).toHaveURL(new RegExp(`/${locale}/inventory$`));
		}
	}
});

test('desktop header search has a complete field frame and retains keyboard search', async ({
	page
}) => {
	for (const locale of ['en', 'bg']) {
		for (const width of [992, 1440]) {
			await page.setViewportSize({ width, height: 1000 });
			await page.goto(`/${locale}`);
			await page.locator('[data-daynight-header-tool="search"]:visible').click();
			const dialog = page.locator('#searchForm'),
				input = page.locator('#searchModalInput');
			await expect(input).toBeFocused();
			await expect(input).toHaveCSS('font-size', '16px');
			await expect
				.poll(() =>
					dialog.locator('form[role="search"] > div').evaluate((field) => {
						const box = field.getBoundingClientRect(),
							style = getComputedStyle(field);
						const input = field.querySelector('input')!.getBoundingClientRect(),
							button = field.querySelector('button')!.getBoundingClientRect();
						const inputStyle = getComputedStyle(field.querySelector('input')!),
							buttonStyle = getComputedStyle(field.querySelector('button')!);
						return (
							['Top', 'Right', 'Bottom', 'Left'].every(
								(side) => style.getPropertyValue(`border-${side.toLowerCase()}-width`) === '1px'
							) &&
							style.borderRadius === '8px' &&
							inputStyle.borderBottomWidth === '0px' &&
							buttonStyle.position === 'static' &&
							buttonStyle.borderRadius === '6px' &&
							Math.abs(box.height - 54) < 1 &&
							input.top > box.top &&
							input.bottom < box.bottom &&
							button.top > box.top &&
							button.bottom < box.bottom &&
							button.right < box.right
						);
					})
				)
				.toBe(true);
			await page.keyboard.press('Escape');
			await expect(dialog).toBeHidden();
			await page.locator('[data-daynight-header-tool="search"]:visible').click();
			await input.fill('BMW');
			await input.press('Enter');
			await expect(page).toHaveURL(
				(url) => url.pathname === `/${locale}/inventory` && url.searchParams.get('q') === 'BMW'
			);
			await expect(dialog).toBeHidden();
		}
	}
});
