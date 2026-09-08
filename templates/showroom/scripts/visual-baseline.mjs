// Visual baseline / diff harness for the theme→clean migration.
//   node scripts/visual-baseline.mjs baseline   → capture current (themed) pages
//   node scripts/visual-baseline.mjs clean       → capture into a "clean" set
// Captures every public route at desktop (1440) + mobile (390), full page,
// after scrolling to trigger lazy images. Output: outputs/qa/migration-<set>/
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:5174';
const set = process.argv[2] ?? 'baseline';
const outDir = path.resolve('outputs/qa', `migration-${set}`);

const routes = [
	['home', '/'],
	['inventory', '/inventory'],
	['pdp', '/inventory/11774283016080050'],
	['compare', '/compare?ids=11774283016080050,21778067767337633,21764342419542174'],
	['sell-your-car', '/sell-your-car'],
	['services', '/services'],
	['calculator', '/calculator'],
	['financing', '/financing'],
	['contact', '/contact'],
	['about', '/about'],
	['blog', '/blog'],
	['blog-detail', '/blog/vnos-ot-kanada-proverka'],
	['faqs', '/faqs'],
	['reviews', '/reviews'],
	['agents', '/agents'],
	['agent-detail', '/agents/eliqauto-import'],
	['terms', '/terms'],
	['offer', '/offer']
];

const viewports = [
	['desktop', 1440, 900],
	['mobile', 390, 844]
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function autoScroll(page) {
	await page.evaluate(async () => {
		await new Promise((resolve) => {
			let y = 0;
			const step = () => {
				window.scrollBy(0, 700);
				y += 700;
				if (y >= document.body.scrollHeight + 1000) {
					window.scrollTo(0, 0);
					resolve();
				} else {
					setTimeout(step, 90);
				}
			};
			step();
		});
	});
}

const run = async () => {
	await mkdir(outDir, { recursive: true });
	const browser = await chromium.launch();
	let ok = 0;
	let fail = 0;
	for (const [vpName, width, height] of viewports) {
		const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
		const page = await context.newPage();
		for (const [name, route] of routes) {
			const file = path.join(outDir, `${name}.${vpName}.png`);
			try {
				await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 25000 });
				await sleep(1200);
				await autoScroll(page);
				await sleep(900);
				await page.screenshot({ path: file, fullPage: true });
				ok += 1;
				console.log(`ok   ${name}.${vpName}`);
			} catch (error) {
				fail += 1;
				console.log(`FAIL ${name}.${vpName} — ${error.message.split('\n')[0]}`);
				try {
					await page.screenshot({ path: file, fullPage: false });
				} catch {}
			}
		}
		await context.close();
	}
	await browser.close();
	console.log(`\n${set}: ${ok} ok / ${fail} failed → ${outDir}`);
};

run().catch((e) => {
	console.error(e);
	process.exit(1);
});
