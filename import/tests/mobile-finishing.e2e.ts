import { expect, test } from '@playwright/test';
import { visit, controlHeight } from './helpers';

test.skip(({ isMobile }) => !isMobile, 'Mobile finishing regressions');

for (const locale of ['en', 'bg']) {
	test(`${locale} home financing keeps the selected vehicle and price`, async ({ page }) => {
		await visit(page, `/${locale}`);
		const card = page.locator('[data-daynight-home-vehicles] [data-daynight-slug]').first();
		const slug = await card.getAttribute('data-daynight-slug');
		const title = await card.locator('.card-box__title a').getAttribute('title');
		const price = (await card.locator('.daynight-card-price__amount').innerText()).replace(
			/\D/g,
			''
		);
		await card.locator('.daynight-card-price__finance-link').click();
		await expect(page).toHaveURL(
			(url) => url.pathname === `/${locale}/financing` && url.searchParams.get('vehicle') === slug
		);
		await expect(page.locator('.finance-estimator input').first()).toHaveValue(price);
		await expect(page.getByRole('heading', { name: title!, exact: true })).toBeVisible();
		await expect(page.locator('.finance-estimator a')).toHaveAttribute(
			'href',
			new RegExp(`vehicle=${slug}`)
		);
	});

	for (const width of [320, 390]) {
		test(`${locale} Sell summary preserves the full VIN at ${width}px`, async ({ page }) => {
			await page.setViewportSize({ width, height: 568 });
			await visit(page, `/${locale}/sell-your-car`);
			await page.locator('#sell-entry-panel button').click();
			const wizard = page.locator('.sell-flow:visible');
			const vin = 'WBA12345678901234';
			await wizard.locator('#sell-flow-vin').fill(vin);
			await wizard.locator('.sell-flow__next').click();
			const summary = wizard.locator('.sell-summary');
			await expect(summary.locator('strong')).toHaveText(vin);
			const geometry = await summary.evaluate((node) => {
				const box = node.getBoundingClientRect();
				const title = node.querySelector('strong')!.getBoundingClientRect();
				const edit = node.querySelector('button')!.getBoundingClientRect();
				return {
					contained: title.left >= box.left && title.right <= box.right,
					separated: title.top >= edit.bottom || title.right <= edit.left,
					editHeight: edit.height,
					overflow: node.scrollWidth - node.clientWidth
				};
			});
			expect(geometry.contained).toBe(true);
			expect(geometry.separated).toBe(true);
			expect(geometry.editHeight).toBeGreaterThanOrEqual(
				await controlHeight(summary.getByRole('button'))
			);
			expect(geometry.overflow).toBeLessThanOrEqual(1);
			await summary.getByRole('button').click();
			await expect(wizard.locator('#sell-flow-vin')).toHaveValue(vin);
		});
	}
}
