import { expect, test } from '@playwright/test';
import { visit } from './helpers';

const adminDemoURL = 'https://cars-admin-blue.vercel.app/';

test('retired account entry redirects without carrying customer data to the admin demo', async ({
	request
}) => {
	for (const route of ['/account', '/account?lang=en&email=private@example.com']) {
		const response = await request.get(route, { maxRedirects: 0 });
		expect(response.status()).toBe(302);
		expect(response.headers().location).toBe(adminDemoURL);
	}
});

for (const locale of ['bg', 'en'] as const) {
	test(`${locale}: desktop uses the shared admin demo while retaining the garage`, async ({
		page
	}, info) => {
		test.skip(info.project.name !== 'desktop');
		await visit(page, `/${locale}`);
		const header = page.locator('.site-header');
		const admin = header.getByRole('link', {
			name: locale === 'en' ? 'Admin dashboard (demo)' : 'Админ панел (демо)',
			exact: true
		});
		await expect(admin).toHaveAttribute('href', adminDemoURL);
		await expect(admin).toHaveAttribute('target', '_blank');
		await expect(admin).toHaveAttribute('rel', 'noopener noreferrer');
		await expect(header.locator('a[href="/account"]')).toHaveCount(0);
		await expect(header.locator('a[href*="/account/favorites"]')).toBeVisible();
		await expect(header.locator('a[href*="/compare"]')).toBeVisible();
		await page
			.context()
			.route(`${adminDemoURL}**`, (route) =>
				route.fulfill({ contentType: 'text/html', body: '<title>Shared admin destination</title>' })
			);
		const storefrontURL = page.url();
		const popupPromise = page.waitForEvent('popup');
		await admin.click();
		const popup = await popupPromise;
		await expect(popup).toHaveURL(adminDemoURL);
		await expect(page).toHaveURL(storefrontURL);
		await popup.close();
	});

	test(`${locale}: a make without stock survives the Home-to-Import handoff`, async ({
		page
	}, info) => {
		await visit(page, `/${locale}`);
		await page
			.getByRole('link', { name: /^Honda(?:\s|$)/ })
			.filter({ visible: true })
			.click();
		if (info.project.name === 'mobile') {
			await expect(page).toHaveURL((url) => url.searchParams.get('make') === 'Honda');
			await page
				.getByRole('tab', { name: locale === 'en' ? 'Find a car' : 'Нямам линк', exact: true })
				.click();
			await page
				.getByRole('button', {
					name: locale === 'en' ? 'Describe the car' : 'Опиши автомобила',
					exact: true
				})
				.click();
			await expect(
				page.getByRole('dialog').getByRole('button', {
					name: locale === 'en' ? 'Make: Honda' : 'Марка: Honda',
					exact: true
				})
			).toBeVisible();
		} else {
			const dialog = page.getByRole('dialog', {
				name: locale === 'en' ? 'Import a car' : 'Внос на автомобил',
				exact: true
			});
			await expect(dialog).toBeVisible();
			await expect(dialog.locator('[id^="import-wizard-make-"]')).toHaveValue('Honda');
		}
	});

	test(`${locale}: inventory announces loaded cars after Show more and an empty search`, async ({
		page
	}) => {
		await visit(page, `/${locale}/inventory?brand=BMW`);
		const status = page.locator('main > p.sr-only[role="status"]');
		await expect(status).toHaveText(
			locale === 'en' ? 'Showing 12 of 15 cars' : 'Показани 12 от 15 автомобила'
		);
		await page
			.getByRole('button', { name: locale === 'en' ? /^Show more cars/ : /^Покажи още автомобили/ })
			.click();
		await expect(status).toHaveText(
			locale === 'en' ? 'Showing 15 of 15 cars' : 'Показани 15 от 15 автомобила'
		);
		await visit(page, `/${locale}/inventory?keyword=NoSuchVehicleAudit`);
		await expect(status).toHaveText(
			locale === 'en' ? 'Showing 0 of 0 cars' : 'Показани 0 от 0 автомобила'
		);
	});

	test(`${locale}: a body type without stock survives the Home-to-Import handoff`, async ({
		page
	}, info) => {
		await visit(page, `/${locale}`);
		await page
			.getByRole('link', { name: locale === 'en' ? 'Hatchback' : 'Хечбек', exact: true })
			.filter({ visible: true })
			.click();
		if (info.project.name === 'mobile') {
			await expect(page).toHaveURL((url) => url.searchParams.get('bodyType') === 'Hatchback');
			await page
				.getByRole('tab', { name: locale === 'en' ? 'Find a car' : 'Нямам линк', exact: true })
				.click();
			await page
				.getByRole('button', {
					name: locale === 'en' ? 'Describe the car' : 'Опиши автомобила',
					exact: true
				})
				.click();
			await expect(page.getByRole('dialog').locator('[id^="import-wizard-type-"]')).toContainText(
				locale === 'en' ? 'Hatchback' : 'Хечбек'
			);
		} else {
			const dialog = page.getByRole('dialog', {
				name: locale === 'en' ? 'Import a car' : 'Внос на автомобил',
				exact: true
			});
			await expect(dialog).toBeVisible();
			await expect(dialog.locator('[id^="import-wizard-type-"]')).toHaveValue('Hatchback');
		}
	});
}
