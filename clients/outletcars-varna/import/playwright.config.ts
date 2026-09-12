import { defineConfig } from '@playwright/test';

const host = '127.0.0.1';
const port = process.env.PLAYWRIGHT_PORT ?? '4197';
const baseURL = `http://${host}:${port}`;
const shouldManageWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER !== '1';

export default defineConfig({
	...(shouldManageWebServer
		? {
				webServer: {
					command: `npm run build && npm run preview -- --host ${host} --port ${port} --strictPort`,
					reuseExistingServer: !process.env.CI,
					timeout: 120_000,
					url: baseURL
				}
			}
		: {}),
	use: { baseURL },
	testMatch: '**/*.e2e.{ts,js}'
});
