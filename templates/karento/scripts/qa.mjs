import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = process.env.KARENTO_QA_URL || 'http://127.0.0.1:6462';
const pages = JSON.parse(await readFile(path.join(root, 'src/lib/server/pages.json'), 'utf8'));
const capture = JSON.parse(await readFile(path.join(root, 'provenance/capture.json'), 'utf8'));
const results = [];
for (const [key, page] of Object.entries(pages)) {
  const body = await readFile(path.join(root, 'src/lib/server/pages', key + '.html'), 'utf8');
  for (const route of [`/${key}`, `/${key}.html`]) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    const $ = load(html);
    assert.equal($('title').text(), page.title, `${route} title`);
    assert.equal($('header').length, load(body)('header').length, `${route} header`);
    assert.equal($('h1,h2,h3,h4,h5,h6').length, load(body)('h1,h2,h3,h4,h5,h6').length, `${route} headings`);
    results.push({ route, status: response.status, bytes: Buffer.byteLength(html) });
  }
}
const assets = capture.files.filter(file => file.path);
for (let start = 0; start < assets.length; start += 12) {
  await Promise.all(assets.slice(start, start + 12).map(async file => {
    const url = base + '/' + file.path.replace(/^static\//, '');
    const response = await fetch(url, { method: 'HEAD' });
    assert.equal(response.status, 200, file.path);
  }));
}
assert.equal((await fetch(base + '/')).status, 200);
assert.equal((await fetch(base + '/does-not-exist')).status, 404);
const report = { checkedAt: new Date().toISOString(), base, pageCount: Object.keys(pages).length, routes: results, assetsChecked: assets.length, sourceGaps: capture.failures };
const destination = path.resolve(root, '../../docs/karento');
await mkdir(destination, { recursive: true });
await writeFile(path.join(destination, 'http-qa.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`${results.length} route checks, ${assets.length} assets, root and unknown-route checks passed`);
