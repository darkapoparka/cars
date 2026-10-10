import { defineConfig } from '@playwright/test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const port = process.env.PLAYWRIGHT_PORT ?? '4197';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;
const externalServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === '1';

export default defineConfig({
	testDir: './tests',
	testMatch: '**/*.e2e.ts',
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	workers: process.env.CI ? 2 : 3,
	timeout: 45000,
	expect: { timeout: 10000 },
	reporter: [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		reducedMotion: 'reduce'
	},
	projects: [
		{ name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 1000 } } },
		{
			name: 'mobile',
			use: {
				browserName: 'chromium',
				viewport: { width: 390, height: 844 },
				isMobile: true,
				hasTouch: true
			}
		}
	],
	...(!externalServer
		? {
				webServer: {
					command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
					url: baseURL,
					reuseExistingServer: false,
					timeout: 240000,
					env: {
						TEMPLATE_MODE: 'preview',
						DATABASE_URL: '',
						OPENAI_API_KEY: '',
						TEMPLATE_ADMIN_ENABLED: 'false',
						TEMPLATE_AI_ENABLED: 'false',
						DAYNIGHT_CMS_DATA_DIR: join(tmpdir(), `import-browser-fixtures-${port}`)
					}
				}
			}
		: {})
});
