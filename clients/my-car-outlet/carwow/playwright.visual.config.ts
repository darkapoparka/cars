import { defineConfig } from '@playwright/test';

// Dedicated visual-regression (1:1 parity) gate. Separate from the behavioural
// e2e suite (playwright.config.ts) so the two never share a server or snapshots.
//
// Baselines are committed under tests/visual/__screenshots__/ and are the source
// of truth for "1:1". Capture them against the CURRENT build with:
//   npm run visual:baseline           (writes/updates baselines, passes)
// Verify a later build against them with:
//   npm run visual:verify             (fails on >threshold pixel diff)
// Filter to one route while iterating:
//   npm run visual:verify -- --grep terms
//
// Snapshots are platform-specific (font rasterisation differs per OS). The
// committed baselines are maintained on Windows, and CI runs this config on
// windows-latest for the same reason.
const port = Number(process.env.VISUAL_PORT ?? 4178);
const baseURL = `http://localhost:${port}`;

// reuseExistingServer is OFF by default so every run rebuilds and serves the
// CURRENT code — a stale preview would produce false "0 diff" passes. Set
// VISUAL_REUSE=1 only when you have just built and want to re-screenshot fast.
const reuse = process.env.VISUAL_REUSE === '1';

export default defineConfig({
	testDir: 'tests/visual',
	testMatch: '**/*.visual.{ts,js}',
	fullyParallel: false,
	workers: 1,
	retries: 0,
	reporter: [['list']],
	snapshotPathTemplate: 'tests/visual/__screenshots__/{arg}{ext}',
	timeout: 90_000,
	expect: {
		toHaveScreenshot: {
			// Per-pixel colour tolerance (Playwright default 0.2) absorbs anti-alias
			// noise; the ratio cap catches real layout/colour regressions. Calibrated
			// against a same-build self-test (baseline vs immediate re-verify ~= 0).
			maxDiffPixelRatio: 0.002,
			threshold: 0.2,
			animations: 'disabled',
			caret: 'hide',
			scale: 'css'
		}
	},
	use: {
		baseURL,
		reducedMotion: 'reduce'
	},
	webServer: {
		command: `npm run build && npm run preview -- --port ${port} --strictPort`,
		port,
		reuseExistingServer: reuse,
		timeout: 240_000
	}
});
