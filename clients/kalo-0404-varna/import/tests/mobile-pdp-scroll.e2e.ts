import { expect, test, type Page } from '@playwright/test';
import { visit } from './helpers';

const vehiclePath = '/inventory/21778067767337633';

const dragWithTouch = async (page: Page, distance: number, cancel = false) => {
	const grip = (await page.locator('.daynight-mobile-pdp__handle').boundingBox())!;
	const x = grip.x + grip.width / 2;
	const y = grip.y + grip.height * 0.75;
	const touch = await page.context().newCDPSession(page);
	try {
		await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
		for (let step = 1; step <= 6; step++) {
			await touch.send('Input.dispatchTouchEvent', {
				type: 'touchMove',
				touchPoints: [{ x, y: y + (distance * step) / 6 }]
			});
		}
		await touch.send('Input.dispatchTouchEvent', {
			type: cancel ? 'touchCancel' : 'touchEnd',
			touchPoints: []
		});
	} finally {
		await touch.detach();
	}
};

test.describe('mobile PDP page scrolling', () => {
	test.skip(({ isMobile }) => !isMobile, 'Phone reading flow');
	for (const locale of ['bg', 'en']) {
		for (const [width, height] of [
			[320, 844],
			[390, 844],
			[320, 568]
		]) {
			test(`${locale} ${width}x${height}: free grip dragging shares the reading scroll`, async ({
				page
			}) => {
				await page.setViewportSize({ width, height });
				await visit(page, `/${locale}${vehiclePath}`);
				const drawer = page.locator('[data-mobile-pdp-drawer]');
				const grip = page.getByRole('button', {
					name: locale === 'bg' ? 'Премести панела с данни' : 'Move vehicle details',
					exact: true
				});
				const rail = page.getByRole('tablist');
				const top = await rail.evaluate((node) => parseFloat(getComputedStyle(node).top));
				const restingTop = (await drawer.boundingBox())!.y;
				expect((await grip.boundingBox())!.height).toBeGreaterThanOrEqual(44);
				await dragWithTouch(page, 90);
				await expect
					.poll(async () => Math.abs((await drawer.boundingBox())!.y - restingTop - 90))
					.toBeLessThan(2);
				await page.waitForTimeout(650); // Allow any unwanted release snapping to finish.
				expect(Math.abs((await drawer.boundingBox())!.y - restingTop - 90)).toBeLessThan(2);
				expect(await page.evaluate(() => scrollY)).toBe(0);
				await expect(grip).not.toHaveClass(/handle--dragging/);
				await expect(grip).not.toBeFocused();
				await expect(rail).toBeInViewport({ ratio: 1 });

				await dragWithTouch(page, -160);
				await expect
					.poll(async () => Math.abs((await drawer.boundingBox())!.y - restingTop + 70))
					.toBeLessThan(2);
				expect(await page.getByRole('tabpanel').evaluate((node) => node.scrollTop)).toBe(0);
				await page.mouse.move(width / 2, height - 70);
				await page.mouse.wheel(0, 650);
				await expect
					.poll(async () => Math.abs((await rail.boundingBox())!.y - top))
					.toBeLessThan(2);
				await page.mouse.wheel(0, -1500);
				await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);

				await grip.press('End');
				const loweredTop = (await drawer.boundingBox())!.y;
				expect(loweredTop).toBeGreaterThan(restingTop + 90);
				await expect(rail).toBeInViewport({ ratio: 1 });
				await grip.press('ArrowUp');
				await expect
					.poll(async () => Math.abs((await drawer.boundingBox())!.y - loweredTop + 32))
					.toBeLessThan(2);
				await dragWithTouch(page, -24, true);
				await expect(grip).not.toHaveClass(/handle--dragging/);
				await grip.press('Home');
				await expect
					.poll(async () => Math.abs((await rail.boundingBox())!.y - top))
					.toBeLessThan(2);
				await expect(page).toHaveURL(new RegExp(`/${locale}${vehiclePath}$`));
				expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
					true
				);
				if (width === 390) {
					await page.keyboard.press('End');
					await page.setViewportSize({ width, height: 320 });
					await expect
						.poll(async () => {
							const box = (await rail.boundingBox())!;
							return box.y + box.height;
						})
						.toBeLessThanOrEqual(321);
				}
			});
			test(`${locale} ${width}x${height}: one scroll pins the utilities and tabs`, async ({
				page
			}) => {
				await page.setViewportSize({ width, height });
				await visit(page, `/${locale}${vehiclePath}`);
				const rail = page.locator('.daynight-mobile-pdp__tabs');
				const toolbar = page.locator('[data-mobile-pdp-topbar]');
				const panel = page.getByRole('tabpanel');
				const top = await rail.evaluate((node) => parseFloat(getComputedStyle(node).top));
				await expect.poll(async () => (await rail.boundingBox())!.y).toBeGreaterThan(top + 100);

				// Wheel over the content: the page moves without lifting a handle first.
				await page.mouse.move(width / 2, height - 100);
				await page.mouse.wheel(0, 650);
				await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
				await expect
					.poll(async () => Math.abs((await rail.boundingBox())!.y - top))
					.toBeLessThan(2);
				await expect(toolbar).toHaveClass(/topbar--pinned/);
				expect(await panel.evaluate((node) => node.scrollTop)).toBe(0);
				for (const control of await toolbar.locator('button,a').all()) {
					await expect(control).toBeInViewport({ ratio: 1 });
					expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);
				}

				for (const name of locale === 'bg'
					? ['Данни', 'Екстри', 'Инфо']
					: ['Specs', 'Extras', 'Info']) {
					const tab = rail.getByRole('tab', { name, exact: true });
					await tab.click();
					await expect(tab).toHaveAttribute('aria-selected', 'true');
					await expect
						.poll(async () => Math.abs((await rail.boundingBox())!.y - top))
						.toBeLessThan(2);
					await expect(panel).toHaveAttribute('aria-labelledby', (await tab.getAttribute('id'))!);
					expect(await panel.evaluate((node) => node.scrollTop)).toBe(0);
				}
				const info = rail.getByRole('tab', {
					name: locale === 'bg' ? 'Инфо' : 'Info',
					exact: true
				});
				await info.press('ArrowRight');
				await expect(
					rail.getByRole('tab', { name: locale === 'bg' ? 'Данни' : 'Specs', exact: true })
				).toBeFocused();
				await rail
					.getByRole('tab', { name: locale === 'bg' ? 'Данни' : 'Specs', exact: true })
					.press('Home');
				await expect(info).toBeFocused();

				await page.mouse.move(width / 2, height - 100);
				await page.mouse.wheel(0, -1500);
				await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
				await expect(toolbar).not.toHaveClass(/topbar--pinned/);
				await page.locator('.daynight-mobile-pdp__image-button').click({
					position: { x: width / 2, y: 100 }
				});
				await expect(page.locator('.daynight-mobile-pdp__viewer')).toBeVisible();
				await page.keyboard.press('Escape');
				await expect(page.locator('.daynight-mobile-pdp__viewer')).not.toBeVisible();
				const enquiry = page.locator('.daynight-mobile-pdp__cta--primary');
				await enquiry.click();
				await expect(page.locator('.daynight-mobile-pdp__inquiry')).toBeVisible();
				expect(
					await page.evaluate(() => document.activeElement?.matches('input,textarea,select'))
				).toBe(false);
				await page.keyboard.press('Escape');
				await expect(enquiry).toBeFocused();
				expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
					true
				);
			});
		}
	}
});
