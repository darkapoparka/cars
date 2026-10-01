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
		'/account',
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
			`/account?lang=${locale}`,
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
					'.daynight-dashboard-overview__primary, .daynight-profile-form button[type="submit"]'
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

	test(`mobile ${locale} account labels and profile uploads fit at 320px`, async ({
		page
	}, info) => {
		await page.setViewportSize({ width: 320, height: 568 });
		await page.context().addCookies([
			{ name: 'cars_prompt', value: promptVersion, url: info.project.use.baseURL as string },
			{ name: 'cars_locale', value: locale, url: info.project.use.baseURL as string }
		]);
		await page.goto(`/account?lang=${locale}`);
		await expect(page.locator('html')).toHaveAttribute('data-daynight-hydrated', 'true');
		const navigation = page.getByRole('navigation', {
			name: locale === 'en' ? 'Account pages' : 'Страници на профила',
			exact: true
		});
		for (const link of await navigation.getByRole('link').all()) {
			await expect(link).toBeInViewport({ ratio: 1 });
		}
		const splitWords = await page
			.locator('[data-daynight-dashboard-stat] .h7')
			.evaluateAll((labels) =>
				labels.flatMap((label) => {
					const text = label.firstChild;
					if (!text) return [];
					return [...(text.textContent ?? '').matchAll(/\S+/g)].flatMap((word) => {
						const range = document.createRange();
						range.setStart(text, word.index!);
						range.setEnd(text, word.index! + word[0].length);
						return range.getClientRects().length > 1 ? [word[0]] : [];
					});
				})
			);
		expect(splitWords).toEqual([]);
		await navigation
			.getByRole('link', { name: locale === 'en' ? 'Profile' : 'Профил', exact: true })
			.click();
		await expect(page.locator('[data-daynight-profile-form]')).toBeVisible();
		const avatar = page.locator('.upload-preview--avatar');
		const dimensions = await avatar.boundingBox();
		expect(dimensions!.width).toBeLessThanOrEqual(80);
		expect(dimensions!.height).toBeLessThanOrEqual(80);
		for (const target of ['avatarInput', 'posterInput']) {
			const upload = page.locator(`button[data-target="${target}"]`);
			await upload.scrollIntoViewIfNeeded();
			await expect(upload).toBeInViewport({ ratio: 1 });
			expect((await upload.boundingBox())!.height).toBeGreaterThanOrEqual(44);
		}
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
			true
		);
	});
}
