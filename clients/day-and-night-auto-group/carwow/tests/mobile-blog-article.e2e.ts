import { expect, test } from '@playwright/test';

test('mobile article supports inline reading, related articles and direct-entry back navigation', async ({
	page
}) => {
	await page.setViewportSize({ width: 320, height: 740 });
	await page.goto('/blog/vaprosi-predi-ogled');
	const article = page.locator('.mobile-article');
	await expect(article).toBeVisible();
	await expect(page.getByRole('main')).toHaveCount(1);
	await expect(page.locator('.breadcrumb')).toHaveCount(0);
	await expect(article.locator('.mobile-article__body section')).toHaveCount(3);
	await expect(article.locator('.mobile-article__body p')).toHaveCount(6);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(
		'Какво да попитате, преди да пътувате за оглед'
	);
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true
	);
	await page
		.getByRole('heading', { name: 'Потвърдете уговорката', exact: true })
		.scrollIntoViewIfNeeded();
	await expect(page.getByRole('link', { name: 'Назад към блога' })).not.toBeInViewport();
	const related = page.locator('.mobile-article__related > a').first();
	const nextTitle = await related.locator('strong').innerText();
	await related.click();
	await expect(page.getByRole('heading', { level: 1 })).toHaveText(nextTitle);
	await expect(page.getByRole('link', { name: 'Назад към блога' })).toBeInViewport();
	await page.getByRole('link', { name: 'Назад към блога' }).click();
	await expect(page).toHaveURL(/\/blog$/);
	await page.locator('.mobile-blog__card').first().click();
	await page.setViewportSize({ width: 1280, height: 900 });
	await expect(page.locator('.blog-article-page')).toBeVisible();
	await expect(page.locator('.mobile-article')).toHaveCount(0);
});
