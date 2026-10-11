import { expect, test } from '@playwright/test';
import { visit } from './helpers';

for (const locale of ['bg', 'en']) {
	for (const width of [320, 390]) {
		test(`${locale} mobile account cars search, sort and edit at ${width}px`, async ({
			page,
			isMobile
		}) => {
			test.skip(!isMobile, 'Mobile listings composition');
			await page.setViewportSize({ width, height: 844 });
			await visit(page, `/account/listings?lang=${locale}`);
			const listings = page.locator('[data-mobile-account-listings]');
			// Other form journeys legitimately add submissions to the shared preview server.
			const cards = listings.locator('[data-mobile-submission-id^="submission-seed-"]');
			const search = listings.getByRole('searchbox');
			const sort = listings.getByRole('combobox', {
				name: locale === 'en' ? 'Sort your cars' : 'Подреди автомобилите'
			});
			await expect(listings).toBeVisible();
			await expect(page.locator('.search-form-listing')).not.toBeVisible();
			await expect(listings.locator('img[src$="car.svg"]')).toHaveCount(0);
			await expect(cards).toHaveCount(2);
			await expect(cards.first()).toHaveAttribute('data-mobile-submission-id', 'submission-seed-2');
			const field = (await listings.locator('.search-field').boundingBox())!;
			const icon = (await listings.locator('.search-field > svg').boundingBox())!;
			expect(Math.abs(icon.y + icon.height / 2 - (field.y + field.height / 2))).toBeLessThanOrEqual(
				1
			);
			const toolbar = (await listings.locator('.mobile-account-listings__toolbar').boundingBox())!;
			const sortBox = (await sort.boundingBox())!;
			expect(Math.abs(toolbar.x + toolbar.width - sortBox.x - sortBox.width)).toBeLessThanOrEqual(
				1
			);
			await sort.selectOption('oldest');
			await expect(cards.first()).toHaveAttribute('data-mobile-submission-id', 'submission-seed-1');
			await sort.selectOption('newest');
			await expect(cards.first()).toHaveAttribute('data-mobile-submission-id', 'submission-seed-2');
			await search.fill('CLIENT-BMW-001');
			await expect(cards).toHaveCount(1);
			await expect(listings.getByRole('status')).toHaveText(
				locale === 'en' ? '1 car' : '1 автомобил'
			);
			const edit = cards.getByRole('link', { name: locale === 'en' ? /^Edit / : /^Редактирай / });
			await expect(edit).toHaveAttribute(
				'href',
				'/account/listings/edit/submission-seed-1' + (locale === 'en' ? '?lang=en' : '')
			);
			await edit.click();
			await expect(page).toHaveURL(
				new RegExp(
					'/account/listings/edit/submission-seed-1' + (locale === 'en' ? '\\?lang=en$' : '$')
				)
			);
			await expect(page.locator('html')).toHaveAttribute('data-daynight-hydrated', 'true');
			await page.goBack();
			await expect(listings).toBeVisible();
			await search.fill('no matching car');
			await expect(cards).toHaveCount(0);
			await listings
				.getByRole('button', { name: locale === 'en' ? 'Clear search' : 'Изчисти търсенето' })
				.click();
			await expect(search).toBeEmpty();
			await expect(cards).toHaveCount(2);
			expect(
				await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)
			).toBe(true);
			await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
			await page.evaluate(() => document.fonts.ready);
			expect(
				await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)
			).toBe(true);
			const clippedTitles = await cards.locator('h2').evaluateAll((titles) =>
				titles
					.filter((title) => {
						const bounds = title.closest('article')!.getBoundingClientRect();
						const range = document.createRange();
						range.selectNodeContents(title);
						return [...range.getClientRects()].some(
							(rect) => rect.left < bounds.left || rect.right > bounds.right
						);
					})
					.map((title) => title.textContent)
			);
			expect(clippedTitles).toEqual([]);
		});
	}
	test(`${locale} contact keeps the map, call action and enquiry without duplicate rows`, async ({
		page,
		isMobile
	}) => {
		test.skip(!isMobile, 'Mobile Contact composition');
		await visit(page, `/${locale}/contact`);
		const contact = page.locator('[data-daynight-contact-mobile]');
		await expect(contact.locator('iframe')).toHaveAttribute('src', /google.*maps/);
		await expect(contact.locator('a[href^="tel:"]')).toHaveCount(1);
		await expect(contact).not.toContainText(/Онлайн запитване|Online enquiry/);
		await contact
			.getByRole('button', {
				name: locale === 'en' ? 'Open contact form' : 'Отвори форма за контакт',
				exact: true
			})
			.click();
		await expect(page.getByRole('dialog')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog')).not.toBeVisible();
	});
}

test('desktop account listings keep their existing controls and table', async ({
	page,
	isMobile
}) => {
	test.skip(isMobile, 'Retained desktop composition');
	await visit(page, '/account/listings');
	await expect(page.locator('[data-mobile-account-listings]')).not.toBeVisible();
	await expect(page.locator('.search-form-listing')).toBeVisible();
	await expect(
		page.locator('.account-listings-desktop [data-daynight-submissions-table]')
	).toBeVisible();
});
