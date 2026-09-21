import { promptVersion } from './locale-fixture';
import { expect, test, type Page } from '@playwright/test';

/** Wait for the app's hydration boundary, not a guessed sleep or network-idle timeout. */
export async function visit(page: Page, url: string) {
	// Legacy journeys exercise the established Bulgarian UI. Locale-specific tests own their preferences.
	await page.context().addCookies(
		['cars_prompt', 'cars_locale'].map((name) => ({
			name,
			value: name === 'cars_prompt' ? promptVersion : 'bg',
			url: test.info().project.use.baseURL as string
		}))
	);
	const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
	await expect(page.locator('html')).toHaveAttribute('data-daynight-hydrated', 'true');
	await page.evaluate(() => document.fonts.ready);
	return response;
}
