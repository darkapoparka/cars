import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { visit } from './helpers';

test.skip(({ isMobile }) => !isMobile, 'Secondary mobile journeys');

for (const locale of ['en', 'bg']) {
	for (const width of [320, 390]) {
		test(`${locale} secondary pages keep one mobile header and usable navigation at ${width}px`, async ({
			page
		}) => {
			test.setTimeout(90000);
			await page.setViewportSize({ width, height: 568 });
			for (const route of [
				'about',
				'services',
				'contact',
				'compare',
				'financing',
				'calculator',
				'blog',
				'faqs',
				'reviews',
				'privacy',
				'terms',
				'cookies',
				'account/favorites',
				'locale-settings'
			]) {
				const response = await visit(page, `/${locale}/${route}`);
				expect(response?.status(), route).toBe(200);
				await expect(page.locator('[data-mobile-page-hero]:visible'), route).toHaveCount(1);
				await expect(page.getByRole('heading', { level: 1 }), route).toHaveCount(1);
				if (route === 'about' && locale === 'en')
					await expect(page.locator('.process-steps--mobile-panel')).not.toContainText(
						/[\u0400-\u04ff]/
					);
				const nav = page.getByRole('navigation', {
					name: locale === 'en' ? 'Mobile navigation' : 'Мобилна навигация',
					exact: true
				});
				await expect(nav, route).toHaveCount(1);
				await expect(nav, route).toBeInViewport();
				expect(await nav.locator('svg path').count(), route).toBeGreaterThanOrEqual(5);
				expect(
					await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
					route
				).toBe(true);
				const title = await page.getByRole('heading', { level: 1 }).boundingBox();
				expect(title!.x, route).toBeGreaterThanOrEqual(0);
				expect(title!.x + title!.width, route).toBeLessThanOrEqual(width);
			}
		});
	}

	test(`${locale} comparison picker searches, returns from Back and preserves four selections`, async ({
		page
	}) => {
		await page.setViewportSize({ width: 320, height: 568 });
		await visit(page, `/${locale}/compare`);
		const trigger = page.getByRole('button', {
			name: locale === 'en' ? /Add a car/ : /Добави автомобил/
		});
		const picker = page.getByRole('dialog', {
			name: locale === 'en' ? 'Choose a car' : 'Избери автомобил',
			exact: true
		});
		await trigger.click();
		await picker.getByRole('searchbox').fill('no matching model');
		await expect(
			picker.getByRole('button', {
				name: locale === 'en' ? 'Clear search' : 'Изчисти търсенето',
				exact: true
			})
		).toBeVisible();
		await picker
			.getByRole('button', {
				name: locale === 'en' ? 'Clear search' : 'Изчисти търсенето',
				exact: true
			})
			.click();
		await expect(picker.getByRole('searchbox')).toBeEmpty();
		const accessibility = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
			.analyze();
		expect(accessibility.violations.map(({ id }) => id)).toEqual([]);
		await page.goBack();
		await expect(picker).not.toBeVisible();
		await expect(trigger).toBeFocused();
		await expect(page).toHaveURL(new RegExp(`/${locale}/compare$`));
		for (const [index, title] of [
			'BMW X3 30e xDrive',
			'BMW X4 M Competition',
			'BMW X5 40i Black Vermilion',
			'BMW X6 M50i xDrive Shadow Line'
		].entries()) {
			await trigger.click();
			await picker.getByRole('searchbox').fill(title);
			await picker
				.getByRole('button', { name: (locale === 'en' ? 'Add ' : 'Добави ') + title, exact: true })
				.click();
			await expect(picker).not.toBeVisible();
			await expect(page.getByRole('link', { name: title, exact: true })).toBeVisible();
			await expect(page).toHaveURL(
				(url) => url.searchParams.get('ids')?.split(',').length === index + 1
			);
		}
		await expect(trigger).toBeDisabled();
		await expect(page).toHaveURL((url) => url.searchParams.get('ids')?.split(',').length === 4);
		await page.reload();
		await expect(page.getByRole('table').getByRole('columnheader')).toHaveCount(5);
		await page
			.getByRole('table')
			.getByRole('button', { name: locale === 'en' ? 'Remove' : 'Премахни', exact: true })
			.first()
			.click();
		await expect(trigger).toBeEnabled();
		await page
			.getByRole('button', {
				name: locale === 'en' ? 'Clear comparison' : 'Изчисти сравнението',
				exact: true
			})
			.click();
		await expect(page.getByRole('table')).not.toBeVisible();
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
			true
		);
	});

	test(`${locale} service filters and search clear an empty result and keep service destinations`, async ({
		page
	}) => {
		await page.setViewportSize({ width: 320, height: 568 });
		await visit(page, `/${locale}/services`);
		const search = page.getByRole('searchbox', {
			name: locale === 'en' ? 'Search services' : 'Търси услуга'
		});
		const filters = page.getByRole('group', {
			name: locale === 'en' ? 'Quick service filters' : 'Бърз избор на услуга'
		});
		const filterButtons = filters.getByRole('button');
		const rows = await filterButtons.evaluateAll((buttons) =>
			buttons.map((button) => button.getBoundingClientRect().top)
		);
		expect(Math.max(...rows) - Math.min(...rows)).toBeLessThanOrEqual(1);
		for (const filter of await filterButtons.all()) {
			await filter.scrollIntoViewIfNeeded();
			await expect(filter).toBeInViewport({ ratio: 1 });
		}
		expect(await filters.evaluate((rail) => rail.scrollLeft)).toBeGreaterThan(0);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
			320
		);
		const vin = filters.getByRole('button', {
			name: locale === 'en' ? 'Check / VIN' : 'Проверка / VIN',
			exact: true
		});
		await vin.click();
		await expect(vin).toHaveAttribute('aria-pressed', 'true');
		await expect(search).toHaveValue('VIN');
		await expect(page.locator('.service-card')).toHaveCount(1);
		await expect(page.locator('.service-card > a')).toHaveAttribute('href', `/${locale}/import`);
		const all = filters.getByRole('button', {
			name: locale === 'en' ? 'All' : 'Всички',
			exact: true
		});
		await all.click();
		await expect(search).toBeEmpty();
		await expect(all).toHaveAttribute('aria-pressed', 'true');
		await expect(page.locator('.service-card')).toHaveCount(6);
		await search.fill('no matching service');
		await expect(page.locator('.service-empty')).toBeVisible();
		await page.locator('.service-empty button').click();
		await expect(search).toBeEmpty();
		await expect(page.locator('.service-card')).toHaveCount(6);
	});

	test(`${locale} mobile calculator summaries update and expose invalid amounts`, async ({
		page
	}) => {
		await page.setViewportSize({ width: 320, height: 568 });
		await visit(page, `/${locale}/financing`);
		const finance = page.locator('.finance-estimator');
		await finance.getByRole('spinbutton').nth(0).fill('50000');
		await finance.getByRole('spinbutton').nth(1).fill('0');
		await finance.getByRole('spinbutton').nth(2).fill('0');
		await finance.getByRole('combobox').selectOption('12');
		await expect(finance.locator('.finance-estimator__total dd')).toContainText(/4\D*167/);
		await finance.getByRole('spinbutton').nth(1).fill('60000');
		await expect(finance.locator('.site-form-error')).toBeVisible();
		await visit(page, `/${locale}/calculator`);
		for (const [index, value] of ['10000', '1000', '10', '20', '200'].entries()) {
			await page.locator('.import-estimator').getByRole('spinbutton').nth(index).fill(value);
		}
		await expect(page.locator('.import-estimator__mobile-summary output')).toContainText(
			/14\D*600/
		);
		await page.locator('.import-estimator').getByRole('spinbutton').first().fill('-1');
		await expect(page.locator('.import-estimator__mobile-summary output')).toHaveText('—');
		await expect(page.locator('.import-estimator > section [role="status"]')).toBeVisible();
	});

	test(`${locale} policy accordions retain their complete text and work from a section link`, async ({
		page
	}) => {
		await visit(page, `/${locale}/privacy`);
		const sections = page.locator('.policy-page details');
		expect(await sections.count()).toBeGreaterThan(1);
		await expect(sections.first()).toHaveAttribute('open', '');
		await expect(sections.nth(1)).not.toHaveAttribute('open');
		await sections.nth(1).locator('summary').click();
		await expect(sections.nth(1)).toHaveAttribute('open', '');
		await expect(sections.nth(1).locator('p').first()).toBeVisible();
		const id = await sections.nth(1).getAttribute('id');
		await visit(page, `/${locale}/privacy#${id}`);
		await expect(page.locator(`details[id="${id}"]`)).toHaveAttribute('open', '');
	});
}

for (const width of [320, 390]) {
	test(`account navigation and Messages remain usable at ${width}x568`, async ({ page }) => {
		await page.setViewportSize({ width, height: 568 });
		await visit(page, '/account?lang=en');
		const links = page.getByRole('navigation', { name: 'Account pages', exact: true });
		await links.getByRole('link', { name: 'Profile', exact: true }).click();
		await expect(page).toHaveURL(/\/account\/profile\?lang=en$/);
		await expect(page.getByRole('heading', { level: 1, name: 'Your profile' })).toBeVisible();
		await expect(page.locator('#dashboardToggleBtn')).not.toBeVisible();
		const profileMap = page.locator('[data-mobile-profile-form] iframe');
		const mapAddress = new URL((await profileMap.getAttribute('src'))!).searchParams.get('q');
		expect(mapAddress).toContain('София');
		await expect(profileMap).toHaveAttribute('title', /София/);
		await page
			.getByRole('navigation', { name: 'Account pages', exact: true })
			.getByRole('link', { name: 'Cars', exact: true })
			.click();
		await expect(page).toHaveURL(/\/account\/listings\?lang=en$/);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
			true
		);
		await page
			.getByRole('navigation', { name: 'Account pages', exact: true })
			.getByRole('link', { name: 'Messages', exact: true })
			.click();
		const composer = page.getByRole('textbox', { name: 'Write a message', exact: true });
		await expect(composer).toBeInViewport();
		await expect(
			page.getByText('Demo conversation · messages are not delivered', { exact: true })
		).toBeVisible();
		await composer.fill('Synthetic preview message');
		await page.getByRole('button', { name: 'Preview message', exact: true }).click();
		await expect(page.getByText('Synthetic preview message', { exact: true })).toBeInViewport();
		await expect(composer).toBeEmpty();
		await expect(page.locator('.mobile-bottom-nav svg path')).not.toHaveCount(0);
		await page.getByRole('link', { name: 'Your account', exact: true }).click();
		await expect(page).toHaveURL(/\/account\?lang=en$/);
	});
}

test('account forms hydrate their mobile menu and preserve keyboard focus', async ({ page }) => {
	for (const route of ['/account/password', '/account/listings/new']) {
		await visit(page, route + '?lang=en');
		const menu = page
			.getByRole('navigation', { name: 'Mobile navigation', exact: true })
			.getByRole('button', { name: 'Menu', exact: true });
		await menu.click();
		const dialog = page.getByRole('dialog');
		await expect(dialog).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(dialog).not.toBeVisible();
		await expect(menu).toBeFocused();
	}
});
