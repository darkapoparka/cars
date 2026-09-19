import { defineConfig, type BrowserName } from '@playwright/test';

const browserName = process.env.E2E_BROWSER ?? 'chromium';
if (!['chromium', 'firefox', 'webkit'].includes(browserName))
	throw new Error('Invalid E2E_BROWSER');
const port = Number(process.env.E2E_PORT ?? 4173);
const externalBaseURL = process.env.E2E_BASE_URL;
const baseURL = externalBaseURL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
	testDir: './tests',
	testMatch: '**/*.e2e.{ts,js}',
	workers: process.env.CI ? 1 : 2,
	forbidOnly: Boolean(process.env.CI),
	reporter: 'list',
	webServer: externalBaseURL
		? undefined
		: {
				command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
				url: baseURL,
				timeout: 240_000
			},
	use: {
		browserName: browserName as BrowserName,
		baseURL,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure'
	}
});
