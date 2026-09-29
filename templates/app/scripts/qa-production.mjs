import { access, mkdir, mkdtemp, rm, stat, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';
import path from 'node:path';

const execFileAsync = promisify(execFile);
const mode = process.argv[2] ?? 'all';
const baseUrl = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4173';
const root = process.cwd();

const routes = [
  '/',
  '/cars',
  '/cars/2024-toyota-fortuner-exr',
  '/cars/2023-haval-h6-gt-top',
  '/cars/2022-mitsubishi-xpander-mid',
  '/cars/2021-mercedes-c200-amg',
  '/cars/2023-bmw-x3-xdrive30i',
  '/cars/2022-audi-a5-sportback',
  '/saved',
  '/sell',
  '/finance',
  '/service',
  '/luxe',
  '/stores',
  '/more',
];

const captures = [
  ['home-mobile.png', '/', 427, 952],
  ['inventory-mobile.png', '/cars', 427, 952],
  ['filter-mobile.png', '/cars?filters=1', 427, 952],
  ['vehicle-detail-mobile.png', '/cars/2024-toyota-fortuner-exr', 427, 952],
  ['sell-mobile.png', '/sell', 427, 952],
  ['luxe-mobile.png', '/luxe', 427, 952],
  ['stores-mobile.png', '/stores', 427, 952],
  ['menu-mobile.png', '/more', 427, 952],
  ['home-desktop.png', '/', 1440, 1000],
  ['inventory-desktop.png', '/cars', 1440, 1000],
  ['vehicle-detail-desktop.png', '/cars/2024-toyota-fortuner-exr', 1440, 1000],
];

async function checkRoutes() {
  const results = [];
  for (const route of routes) {
    const started = performance.now();
    const response = await fetch(new URL(route, baseUrl), {
      redirect: 'follow',
      signal: AbortSignal.timeout(30_000),
      headers: { 'user-agent': 'Drive24 production QA' },
    });
    const body = await response.text();
    const durationMs = Math.round(performance.now() - started);
    const ok = response.status === 200 && !/Internal Server Error|Application error/i.test(body);
    results.push({ route, status: response.status, durationMs, bytes: Buffer.byteLength(body), ok });
    console.log(`${ok ? 'PASS' : 'FAIL'} ${response.status} ${route} (${durationMs}ms, ${Buffer.byteLength(body)} bytes)`);
  }
  const failures = results.filter((result) => !result.ok);
  if (failures.length) throw new Error(`${failures.length} production route check(s) failed.`);
  return results;
}

async function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    `${process.env.LOCALAPPDATA ?? ''}/Google/Chrome/Application/chrome.exe`,
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      await access(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Try the next installed Chromium browser.
    }
  }
  throw new Error('No Chrome or Edge executable was found for screenshot capture.');
}

async function captureScreenshots() {
  const browser = await findBrowser();
  const outputDir = path.join(root, 'reference', 'final');
  await mkdir(outputDir, { recursive: true });
  const profileDir = await mkdtemp(path.join(os.tmpdir(), 'drive24-qa-'));
  const results = [];

  try {
    for (const [filename, route, width, height] of captures) {
      const outputPath = path.join(outputDir, filename);
      const url = new URL(route, baseUrl).toString();
      const args = [
        '--headless=new',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-background-networking',
        '--hide-scrollbars',
        '--no-first-run',
        '--no-default-browser-check',
        '--run-all-compositor-stages-before-draw',
        '--force-device-scale-factor=1',
        `--user-data-dir=${profileDir}`,
        `--window-size=${width},${height}`,
        '--virtual-time-budget=3500',
        `--screenshot=${outputPath}`,
        url,
      ];
      await execFileAsync(browser, args, { windowsHide: true, timeout: 60_000, maxBuffer: 2_000_000 });
      const fileStat = await stat(outputPath);
      if (fileStat.size < 20_000) throw new Error(`${filename} is unexpectedly small (${fileStat.size} bytes).`);
      results.push({ filename, route, width, height, bytes: fileStat.size });
      console.log(`CAPTURED ${filename} (${width}x${height}, ${fileStat.size} bytes)`);
    }
  } finally {
    await rm(profileDir, { recursive: true, force: true });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    logicalMobileViewport: { width: 427, height: 952 },
    desktopViewport: { width: 1440, height: 1000 },
    captures: results,
  };
  await writeFile(path.join(outputDir, 'capture-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return results;
}

try {
  if (!['all', 'routes', 'screenshots'].includes(mode)) throw new Error(`Unknown QA mode: ${mode}`);
  const routeResults = mode === 'screenshots' ? [] : await checkRoutes();
  const screenshotResults = mode === 'routes' ? [] : await captureScreenshots();
  console.log(`QA complete: ${routeResults.length} routes, ${screenshotResults.length} screenshots.`);
} catch (error) {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
}
