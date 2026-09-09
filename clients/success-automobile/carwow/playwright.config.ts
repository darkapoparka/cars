import { defineConfig } from '@playwright/test';

const port = Number(process.env.E2E_PORT ?? 4173);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
	webServer: {
		command: `npm run build && npm run preview -- --port ${port} --strictPort`,
		port,
		timeout: 240_000
	},
	use: { baseURL },
	testMatch: '**/*.e2e.{ts,js}'
});
