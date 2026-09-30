import { expect, test } from '@playwright/test';

test('menu contrast survives navigation back to Home', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/', { waitUntil: 'networkidle' });
	for (const route of ['/sell-your-car', '/']) {
		await page
			.locator('.mobile-bottom-dock')
			.getByRole('link', { name: route === '/' ? 'Начало' : 'Продай', exact: true })
			.click();
		await expect(page).toHaveURL(new RegExp(route === '/' ? '/bg$' : `${route}$`));
		await page.getByRole('button', { name: 'Меню', exact: true }).click();
		const dialog = page.getByRole('dialog', { name: 'Меню', exact: true });
		const actions = await dialog
			.locator('.mobile-menu-sheet__quick-action')
			.evaluateAll((elements) => {
				const luminance = (color: string) => {
					const channels = color
						.match(/[\d.]+/g)!
						.slice(0, 3)
						.map(Number);
					const [r, g, b] = channels.map((channel) => {
						const value = channel / 255;
						return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
					});
					return 0.2126 * r + 0.7152 * g + 0.0722 * b;
				};
				return elements.map((action) => {
					const label = getComputedStyle(action.querySelector('strong')!).color;
					const icon = getComputedStyle(action.querySelector('svg')!).color;
					const background = getComputedStyle(action).backgroundColor;
					const foregroundLuminance = luminance(label);
					const backgroundLuminance = luminance(background);
					return {
						name: action.textContent?.trim(),
						label,
						icon,
						contrast:
							(Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
							(Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
					};
				});
			});
		expect(actions).toHaveLength(2);
		for (const action of actions) {
			expect(action.icon, `${action.name} icon matches its readable label`).toBe(action.label);
			expect(
				action.contrast,
				`${action.name} text contrast after navigation`
			).toBeGreaterThanOrEqual(4.5);
		}
		await dialog.getByRole('button', { name: 'Затвори', exact: true }).click();
		await expect(dialog).not.toBeVisible();
	}
});
