import { expect, test } from '@playwright/test';
import { promptVersion } from './locale-fixture';

test('account pages hydrate without recovering from a markup mismatch', async ({ page }, info) => {
	test.setTimeout(120000);
	await page.context().addCookies(
		['cars_prompt', 'cars_locale'].map((name) => ({
			name,
			value: name === 'cars_prompt' ? promptVersion : 'bg',
			url: info.project.use.baseURL as string
		}))
	);
	const warnings: string[] = [];
	page.on('console', (message) => {
		if (/hydration_(mismatch|failed)/.test(message.text())) warnings.push(message.text());
	});
	for (const route of [
		'/account/profile',
		'/account/listings',
		'/account/messages',
		'/account/password',
		'/account/listings/new'
	]) {
		await page.goto(route, { waitUntil: 'domcontentloaded' });
		await expect(page.locator('html'), route).toHaveAttribute('data-daynight-hydrated', 'true', {
			timeout: 30000
		});
		expect(warnings, route).toEqual([]);
	}
});

for (const locale of ['bg', 'en']) {
	test(`mobile ${locale} contact and account pages reflow with a 200% root font`, async ({
		page
	}, info) => {
		await page.setViewportSize({ width: 320, height: 568 });
		await page.context().addCookies([
			{ name: 'cars_prompt', value: promptVersion, url: info.project.use.baseURL as string },
			{ name: 'cars_locale', value: locale, url: info.project.use.baseURL as string }
		]);
		for (const route of [
			`/${locale}/contact`,
			`/${locale}/services`,
			`/account/profile?lang=${locale}`
		]) {
			await page.goto(route);
			await expect(page.locator('html')).toHaveAttribute('data-daynight-hydrated', 'true');
			await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
			await page.evaluate(() => document.fonts.ready);
			expect(await page.evaluate(() => innerWidth), route).toBe(320);
			expect(
				await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
				route
			).toBe(true);
			const clippedServiceTitles = await page.locator('.service-card h2').evaluateAll((titles) =>
				titles
					.filter((title) => {
						const card = title.closest('.service-card')!.getBoundingClientRect();
						const text = document.createRange();
						text.selectNodeContents(title);
						return [...text.getClientRects()].some(
							(rect) => rect.left < card.left || rect.right > card.right
						);
					})
					.map((title) => title.textContent)
			);
			expect(clippedServiceTitles, route).toEqual([]);
			const clippedActions = await page
				.locator(
					'.daynight-dashboard-overview__primary, [data-mobile-profile-form] button[type="submit"]'
				)
				.evaluateAll((actions) =>
					actions
						.filter((action) => {
							const bounds = action.getBoundingClientRect();
							return [...action.childNodes]
								.filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
								.some((node) => {
									const text = document.createRange();
									text.selectNodeContents(node);
									return [...text.getClientRects()].some(
										(rect) =>
											rect.left < bounds.left - 1 ||
											rect.right > bounds.right + 1 ||
											rect.top < bounds.top - 1 ||
											rect.bottom > bounds.bottom + 1
									);
								});
						})
						.map((action) => action.textContent)
				);
			expect(clippedActions, route).toEqual([]);
			await page.screenshot({
				path: info.outputPath(`large-font-${route.split('?')[0].replaceAll('/', '-')}.png`),
				fullPage: true
			});
		}
	});

	test(`mobile ${locale} retained account navigation and profile uploads fit at 320px`, async ({
		page
	}, info) => {
		await page.setViewportSize({ width: 320, height: 568 });
		await page.context().addCookies([
			{ name: 'cars_prompt', value: promptVersion, url: info.project.use.baseURL as string },
			{ name: 'cars_locale', value: locale, url: info.project.use.baseURL as string }
		]);
		await page.goto(`/account/listings?lang=${locale}`);
		await expect(page.locator('html')).toHaveAttribute('data-daynight-hydrated', 'true');
		const navigation = page.getByRole('navigation', {
			name: locale === 'en' ? 'Account pages' : 'Страници на профила',
			exact: true
		});
		for (const link of await navigation.getByRole('link').all()) {
			// The retained account rail scrolls at 320px; keyboard focus must reveal each link.
			await link.focus();
			await expect(link).toBeInViewport({ ratio: 0.99 });
		}
		await navigation
			.getByRole('link', { name: locale === 'en' ? 'Profile' : 'Профил', exact: true })
			.click();
		const profileForm = page.locator('[data-mobile-profile-form]');
		await expect(profileForm).toBeVisible();
		const avatar = profileForm.locator('[data-profile-image-upload="avatar"] > img');
		const dimensions = await avatar.boundingBox();
		expect(dimensions!.width).toBeLessThanOrEqual(80);
		expect(dimensions!.height).toBeLessThanOrEqual(80);
		await profileForm.locator('details').first().locator('summary').click();
		for (const target of ['avatar', 'poster']) {
			const upload = profileForm.locator(`[data-profile-image-upload="${target}"] button`);
			await upload.scrollIntoViewIfNeeded();
			await expect(upload).toBeInViewport({ ratio: 1 });
			expect((await upload.boundingBox())!.height).toBeGreaterThanOrEqual(42);
		}
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	});

	test(`mobile ${locale} profile keeps extra fields and handles save errors and retry`, async ({
		page
	}, info) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.context().addCookies([
			{ name: 'cars_prompt', value: promptVersion, url: info.project.use.baseURL as string },
			{ name: 'cars_locale', value: locale, url: info.project.use.baseURL as string }
		]);
		await page.goto(`/account/profile?lang=${locale}`);
		const form = page.locator('[data-mobile-profile-form]');
		await expect(form).toBeVisible();
		await expect(form.locator('details[open]')).toHaveCount(0);
		const data = await form.evaluate((element) => [
			...new FormData(element as HTMLFormElement).keys()
		]);
		for (const name of [
			'role',
			'actorRole',
			'Company',
			'message',
			'SalesPhone',
			'Gender',
			'DayofBirth',
			'Facebook',
			'PriceListing',
			'SelectLocation'
		]) {
			expect(data).toContain(name);
		}
		await form.locator('[name="first_name"]').fill('Mobile');
		await form.locator('[name="last_name"]').fill('Preview');
		await form.locator('[data-profile-image-upload="avatar"] input').setInputFiles({
			name: 'photo.png',
			mimeType: 'image/png',
			buffer: Buffer.from(
				'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
				'base64'
			)
		});
		await expect(form.locator('[data-profile-image-upload="avatar"] img')).toHaveAttribute(
			'src',
			/^data:image\/png;base64,/
		);
		const endpoint = '**/api/account/profile';
		await page.route(endpoint, (route) =>
			route.fulfill({ status: 500, contentType: 'application/json', body: '{"ok":false}' })
		);
		const save = form.getByRole('button', {
			name: locale === 'en' ? 'Save changes' : 'Запази промените',
			exact: true
		});
		await save.click();
		await expect(form.getByRole('status')).toHaveText(
			locale === 'en' ? 'Could not save. Try again.' : 'Не успяхме да запазим. Опитай отново.'
		);
		await expect(save).toBeEnabled();
		await page.unroute(endpoint);
		const responsePromise = page.waitForResponse((response) =>
			new URL(response.url()).pathname.endsWith('/api/account/profile')
		);
		await save.click();
		const response = await responsePromise;
		expect(response.ok()).toBe(true);
		const result = await response.json();
		expect(result.data.name).toBe('Mobile Preview');
		expect(response.request().postData()).not.toContain('photo.png');
		await expect(form.getByRole('status')).toHaveText(
			locale === 'en' ? 'Saved in this demo profile.' : 'Запазено в този демо профил.'
		);
	});
}
