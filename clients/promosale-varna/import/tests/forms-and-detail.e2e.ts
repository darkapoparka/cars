import { expect, test } from '@playwright/test';
import { visit } from './helpers';

const fillContact = async (form: import('@playwright/test').Locator) => {
	await form.locator('[name="name"]').fill('Template Verification');
	await form.locator('[name="phone"]').fill('+359000000000');
	await form.locator('[name="email"]').fill('verification@example.invalid');
	await form
		.locator('[name="message"]')
		.fill('Synthetic refactor verification. No contact requested.');
};

test('contact submission works without JavaScript at both widths', async ({
	browser,
	baseURL
}, info) => {
	const context = await browser.newContext({
		javaScriptEnabled: false,
		locale: 'bg-BG',
		viewport: info.project.use.viewport
	});
	const page = await context.newPage();
	await page.goto(`${baseURL}/contact`);
	const form = page.locator('form.site-form:visible').first();
	await fillContact(form);
	await form.getByRole('button', { name: 'Изпрати запитване', exact: true }).click();
	await expect(
		page
			.getByRole('status')
			.filter({ hasText: /демонстрац|демо/i })
			.first()
	).toBeVisible();
	await context.close();
});

test('desktop enquiry reports saving separately from delivery', async ({ page }, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/contact');
	const form = page.locator('form.site-form:visible').first();
	await fillContact(form);
	await form.getByRole('button', { name: 'Изпрати запитване', exact: true }).click();
	await expect(
		page
			.getByRole('status')
			.filter({ hasText: /демонстрац|демо/i })
			.first()
	).toBeVisible();
});

test('PDP opens the gallery and enquiry without legacy styles', async ({ page }, info) => {
	test.skip(info.project.name !== 'desktop');
	await visit(page, '/inventory');
	await page.locator('main .site-vehicle-card__media a').first().click();
	await expect(page).toHaveURL((url) => /^\/bg\/inventory\/[^/]+$/.test(url.pathname));
	const photo = page.getByRole('button', { name: 'Отвори снимката', exact: true });
	await photo.click();
	await expect(page.getByRole('dialog')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(page.getByRole('dialog')).not.toBeVisible();
	await expect(photo).toBeFocused();
	await page.getByRole('button', { name: 'Запитване за автомобила', exact: true }).click();
	await expect(page.getByRole('dialog').locator('form')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(page.locator('link[href="/assets/app.css"]')).toHaveCount(0);
	await expect(page.locator('script[data-daynight-runtime-replay]')).toHaveCount(0);
});

test('native route changes do not leave old modal or body cleanup behind', async ({ page }) => {
	await visit(page, '/inventory');
	await page.locator('a[href="/bg/about"]:visible').first().click();
	await expect(page).toHaveURL((url) => url.pathname === '/bg/about');
	await expect(page.locator('link[data-legacy-styles]')).toHaveCount(0);
	await expect(page.locator('main h1')).toBeVisible();
	expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
});
