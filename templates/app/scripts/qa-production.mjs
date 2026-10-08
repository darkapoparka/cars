import {access, mkdir, readFile, writeFile} from 'node:fs/promises';
import {constants} from 'node:fs';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';

const execFileAsync = promisify(execFile);
const mode = process.argv[2] ?? 'routes';
const base = new URL(process.env.QA_BASE_URL ?? 'http://127.0.0.1:6473/');
if (!['http:', 'https:'].includes(base.protocol)) throw new Error('QA_BASE_URL must be an HTTP(S) URL.');
base.pathname = base.pathname.replace(/\/$/, '') + '/';
base.search = ''; base.hash = '';
// Relative URL construction intentionally preserves a mounted dealer base path.
const urlFor = route => new URL(route.replace(/^\//, ''), base).href;
const dealer = JSON.parse(await readFile('lib/dealer.json', 'utf8'));
const inventory = JSON.parse(await readFile('lib/dealer-inventory.json', 'utf8'));
const slugs = dealer.mode === 'dealer' ? inventory.slice(0, 2).map(vehicle => vehicle.slug) : ['2024-toyota-fortuner-exr', '2023-suzuki-ciaz-glx'];
const journeys = ['', '/cars', '/saved', '/sell', '/sell/details', '/finance', '/service', '/service/details', '/more', '/search', '/stores'];
const routes = [...new Set(dealer.enabledLocales.flatMap(locale => [
  ...['', '/2'].flatMap(variant => journeys.map(route => '/' + locale + variant + route)),
  '/' + locale + '/2/services', ...slugs.map(slug => '/' + locale + '/cars/' + encodeURIComponent(slug)),
]))];

async function checkRoutes() {
  const results = [];
  for (const route of routes) {
    const response = await fetch(urlFor(route), {redirect: 'follow', signal: AbortSignal.timeout(30000)});
    const body = await response.text();
    const ok = response.status === 200 && !/Internal Server Error|Application error/i.test(body);
    results.push({route, status: response.status, ok});
    console.log(`${ok ? 'PASS' : 'FAIL'} ${response.status} ${route}`);
  }
  if (results.some(result => !result.ok)) throw new Error('Production route checks failed.');
  return results;
}
async function findBrowser() {
  for (const candidate of [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']) {
    if (!candidate) continue;
    try {await access(candidate, constants.X_OK); return candidate;} catch { /* Try the next installed browser. */ }
  }
  throw new Error('Set CHROME_PATH to a Chromium browser executable for screenshot QA.');
}
async function captureScreenshots() {
  const chrome = await findBrowser();
  const directory = path.resolve(process.env.QA_OUTPUT_DIR ?? 'runtime/qa');
  await mkdir(directory, {recursive: true});
  const captures = [];
  for (const locale of dealer.enabledLocales) for (const variant of ['', '/2']) for (const width of [320, 390, 1440]) {
    const route = '/' + locale + variant;
    const file = `${locale}-${variant ? '2' : 'home'}-${width}.png`;
    await execFileAsync(process.execPath, ['scripts/cdp-capture.mjs', urlFor(route), path.join(directory, file), String(width), '900'], {
      env: {...process.env, CHROME_PATH: chrome}, timeout: 60000, maxBuffer: 2000000, windowsHide: true,
    });
    captures.push({route, width, file});
    console.log(`CAPTURE ${file}`);
  }
  await writeFile(path.join(directory, 'capture-report.json'), JSON.stringify({baseUrl: base.href, captures}, null, 2) + '\n');
  return captures;
}
try {
  if (!['all', 'routes', 'screenshots'].includes(mode)) throw new Error('Unknown QA mode: ' + mode);
  const checks = mode === 'screenshots' ? [] : await checkRoutes();
  const captures = mode === 'routes' ? [] : await captureScreenshots();
  console.log(`QA complete: ${checks.length} routes, ${captures.length} screenshots.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
