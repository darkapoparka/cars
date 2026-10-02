import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';
import { promptVersion } from './locale-fixture';

for (const locale of ['bg', 'en']) {
	const english = locale === 'en';
	const nameLabel = english ? 'Make and model' : 'Марка и модел';
	const saveLabel = english ? 'Save draft' : 'Чернова';
	const sendLabel = english ? 'Submit' : 'Изпрати';
	for (const width of [320, 390]) {
		test(`finalize: ${locale} editor reflows and keeps actions reachable at ${width}px`, async ({
			page
		}, info) => {
			test.skip(info.project.name !== 'mobile');
			await page.setViewportSize({ width, height: 568 });
			await visit(page, `/account/listings/edit/submission-seed-1?lang=${locale}`);
			const form = page.locator('[data-mobile-listing-form]');
			await expect(form).toBeVisible();
			await expect(
				page.getByRole('link', { name: 'Save Draft Changes', exact: true })
			).not.toBeVisible();
			await expect(form.getByLabel(nameLabel)).toHaveValue('Client BMW evaluation');
			await expect(form.getByLabel(english ? 'Description' : 'Описание')).toHaveValue(
				/Client vehicle submitted/
			);
			await expect(form.getByRole('button', { name: saveLabel, exact: true })).toBeInViewport({
				ratio: 1
			});
			await expect(form.getByRole('button', { name: sendLabel, exact: true })).toBeInViewport({
				ratio: 1
			});
			await form.locator('summary').first().click();
			await expect(form.locator('[name="previewImage"]')).toBeVisible();
			await form.locator('summary').last().click();
			await expect(form.locator('[name="documents"]')).toBeVisible();
			expect(
				await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)
			).toBe(true);
			const results = await new AxeBuilder({ page })
				.include('[data-mobile-listing-form]')
				.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
				.analyze();
			expect(results.violations).toEqual([]);
			await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
			expect(
				await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)
			).toBe(true);
			await page.setViewportSize({ width, height: 360 });
			await form.getByLabel(english ? 'Description' : 'Описание').focus();
			await expect(form.getByRole('button', { name: sendLabel, exact: true })).toBeInViewport({
				ratio: 1
			});
		});
	}
	test(`finalize: ${locale} draft creation, uploads, editing and submission persist`, async ({
		page
	}, info) => {
		test.skip(info.project.name !== 'mobile');
		await visit(page, `/account/listings/new?lang=${locale}`);
		let form = page.locator('[data-mobile-listing-form]');
		const title = `Mobile finalization ${locale} ${Date.now()}`;
		await expect(form.getByLabel(nameLabel)).toHaveValue('');
		await form.getByLabel(nameLabel).fill(title);
		await form.locator('[name="expectedPrice"]').fill('24500');
		await form.locator('[name="mileage"]').fill('120000');
		await form.getByLabel('VIN', { exact: true }).fill('WBA8E11070K123456');
		await form
			.getByLabel(english ? 'Description' : 'Описание')
			.fill('Synthetic mobile QA draft. No contact requested.');
		await form.locator('summary').first().click();
		const photo = {
			name: 'mobile-qa.png',
			mimeType: 'image/png',
			buffer: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jD1sAAAAASUVORK5CYII=',
				'base64'
			)
		};
		await form.locator('[name="previewImage"]').setInputFiles(photo);
		await form
			.locator('[name="galleryImages"]')
			.setInputFiles({ ...photo, name: 'mobile-gallery-qa.png' });
		await form.locator('summary').last().click();
		await form.locator('[name="documents"]').setInputFiles({
			name: 'mobile-qa.pdf',
			mimeType: 'application/pdf',
			buffer: Buffer.from('%PDF-1.4\n% Synthetic local QA document.\n%%EOF')
		});
		await form.getByRole('button', { name: saveLabel, exact: true }).click();
		await expect(page).toHaveURL(/\/account\/listings\/edit\/[^?]+\?created=draft/);
		if (english) expect(new URL(page.url()).searchParams.get('lang')).toBe('en');
		const editUrl = page.url();
		form = page.locator('[data-mobile-listing-form]');
		await expect(form.getByLabel(nameLabel)).toHaveValue(title);
		await expect(form.getByRole('status')).toContainText(
			english ? 'Draft saved' : 'Черновата е запазена'
		);
		await form.locator('summary').first().click();
		await expect(form.locator('.mobile-listing-form__photos img')).toHaveCount(2);
		await form.locator('summary').last().click();
		await expect(form.getByRole('link', { name: 'mobile-qa.pdf', exact: true })).toBeVisible();
		const documentUrl = await form
			.getByRole('link', { name: 'mobile-qa.pdf', exact: true })
			.getAttribute('href');
		expect((await page.request.get(documentUrl!)).status()).toBe(200);
		for (const image of await form.locator('.mobile-listing-form__photos img').all()) {
			expect((await page.request.get((await image.getAttribute('src'))!)).status()).toBe(200);
		}
		await form.locator('[name="expectedPrice"]').fill('23900');
		await form
			.locator('[name="galleryImages"]')
			.setInputFiles({ ...photo, name: 'updated-gallery-qa.png' });
		await form.getByRole('button', { name: saveLabel, exact: true }).click();
		await expect(form.getByRole('status')).toContainText(
			english ? 'Draft saved' : 'Черновата е запазена'
		);
		await expect(form.locator('[name="galleryImages"]')).toHaveValue('');
		await page.reload();
		await expect(form.locator('[name="expectedPrice"]')).toHaveValue('23900');
		await form.getByRole('button', { name: sendLabel, exact: true }).click();
		await expect(form.getByRole('status')).toContainText(
			english ? 'demo for review' : 'демото за преглед'
		);
		await page.reload();
		await expect(form.getByRole('status')).toContainText(
			english ? 'demo for review' : 'демото за преглед'
		);
		await visit(page, `/account/listings?lang=${locale}`);
		await page.getByRole('searchbox').fill(title);
		const card = page.locator('[data-mobile-submission-id]').filter({ hasText: title });
		await expect(card).toHaveCount(1);
		await expect(card).toContainText('23900');
		await expect(card).toContainText(english ? 'Submitted' : 'Подадена');
		await visit(page, editUrl);
		await form.locator('summary').first().click();
		await expect(form.locator('.mobile-listing-form__photos img')).toHaveCount(3);
	});
}

test('finalize: invalid uploads leave the draft form intact without creating a record', async ({
	page
}, info) => {
	test.skip(info.project.name !== 'mobile');
	await visit(page, '/account/listings/new?lang=en');
	const form = page.locator('[data-mobile-listing-form]');
	const title = `Rejected upload ${Date.now()}`;
	await form.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(form.getByLabel('Make and model')).toBeFocused();
	await form.getByLabel('Make and model').fill(title);
	await form.locator('summary').last().click();
	await form.locator('[name="documents"]').setInputFiles({
		name: 'invalid.txt',
		mimeType: 'text/plain',
		buffer: Buffer.from('Synthetic invalid upload')
	});
	await form.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(form.getByRole('alert')).toContainText('Use JPG, PNG or WebP');
	await expect(form.getByLabel('Make and model')).toHaveValue(title);
	await expect(page).toHaveURL(/\/account\/listings\/new/);
	await visit(page, '/account/listings?lang=en');
	await page.getByRole('searchbox').fill(title);
	await expect(page.locator('[data-mobile-submission-id]')).toHaveCount(0);
});

test('finalize: PDP server rendering matches mobile and desktop before hydration', async ({
	browser,
	baseURL
}, info) => {
	const mobile = info.project.name === 'mobile';
	const context = await browser.newContext({
		javaScriptEnabled: false,
		reducedMotion: 'reduce',
		viewport: info.project.use.viewport
	});
	await context.addCookies([{ name: 'cars_prompt', value: promptVersion, url: baseURL! }]);
	const page = await context.newPage();
	await page.goto(`${baseURL}/bg/inventory/21754658377544573`);
	await page.evaluate(() => document.fonts.ready);
	await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
	await expect(page.locator('[data-mobile-pdp-root]')).toBeVisible({ visible: mobile });
	if (mobile) {
		await expect(page.getByRole('link', { name: 'Обади се', exact: true })).toBeInViewport({
			ratio: 1
		});
		await expect
			.poll(async () =>
				Math.abs(
					(await page.locator('[data-mobile-pdp-drawer]').boundingBox())!.y -
						info.project.use.viewport!.height * 0.34
				)
			)
			.toBeLessThan(2);
	}
	await context.close();
});

test('finalize: mobile draft saving works before JavaScript is available', async ({
	browser,
	baseURL
}, info) => {
	test.skip(info.project.name !== 'mobile');
	const context = await browser.newContext({
		javaScriptEnabled: false,
		viewport: { width: 320, height: 568 }
	});
	await context.addCookies([{ name: 'cars_prompt', value: promptVersion, url: baseURL! }]);
	const page = await context.newPage();
	await page.goto(`${baseURL}/account/listings/new?lang=en`);
	const form = page.locator('[data-mobile-listing-form]');
	const title = `No JavaScript mobile QA ${Date.now()}`;
	await form.getByLabel('Make and model').fill(title);
	await form.getByRole('button', { name: 'Save draft', exact: true }).click();
	await expect(page).toHaveURL(/\/account\/listings\/edit\/[^?]+\?created=draft&lang=en$/);
	await expect(form.getByLabel('Make and model')).toHaveValue(title);
	await expect(form.getByRole('status')).toHaveText('Draft saved.');
	await context.close();
});

test('finalize: demo upload resource rejects unsupported files and traversal', async ({
	request
}) => {
	for (const resource of [
		'/uploads/cms/example/documents/private.html',
		'/uploads/cms/example/gallery/document.pdf',
		'/uploads/cms/example/documents/%2e%2e%5cpackage.json',
		'/uploads/cms/example/documents/%00.pdf'
	])
		expect((await request.get(resource)).status()).toBe(404);
});
