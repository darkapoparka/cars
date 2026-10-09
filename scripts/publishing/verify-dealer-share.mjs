import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {inspectDealerShareHtml, publicOrigin} from './dealer-share.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const require = createRequire(path.join(root, 'templates/karento-best/package.json'));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

/** Anonymous crawler evidence. No bypass tokens, credentials, submissions or cache purges. */
export async function verifyDealerShare({origin, paths, receipt, fetch: fetchPage = globalThis.fetch}) {
  origin = publicOrigin(origin);
  if (!Array.isArray(paths) || !paths.length || paths.some(route => typeof route !== 'string' || !route.startsWith('/') || route.startsWith('//') || /[\\\u0000-\u0020]/.test(route))) throw Error('Provide safe mounted public paths for dealer share verification.');
  const imageCache = new Map(), pages = [];
  const request = async url => {
    const response = await fetchPage(url, {headers: {'User-Agent': 'facebookexternalhit/1.1 (+https://www.facebook.com/externalhit_uatext.php)'}, redirect: 'follow', signal: AbortSignal.timeout(20000)});
    if (new URL(response.url || url).origin !== origin) throw Error('Anonymous request redirected outside the public dealer origin: ' + url);
    return response;
  };
  async function asset(url) {
    if (imageCache.has(url)) return imageCache.get(url);
    const result = {};
    try {
      if (!url.startsWith(origin + '/')) throw Error('Asset is not an absolute URL on the public dealer origin');
      const response = await request(url), bytes = Buffer.from(await response.arrayBuffer());
      result.status = response.status; result.contentType = response.headers.get('content-type'); result.bytes = bytes.length; result.sha256 = sha256(bytes);
      if (!response.ok) throw Error('Asset returned HTTP ' + response.status);
      if (/\.ico(?:[?#]|$)/i.test(url)) {
        if (bytes.length < 22 || bytes.readUInt16LE(2) !== 1) throw Error('Favicon response is not a valid ICO');
      } else {
        const sharp = require('sharp');
        const metadata = await sharp(bytes).metadata(); result.width = metadata.width; result.height = metadata.height; result.format = metadata.format;
      }
      const expected = receipt?.assets.find(entry => entry.publicUrl === url);
      if (expected && expected.sha256 !== result.sha256) throw Error('Hosted identity asset bytes differ from reviewed package receipt');
    } catch (error) { result.error = error.message; }
    imageCache.set(url, result); return result;
  }
  for (const route of paths) {
    const url = origin + route, page = {url, problems: []};
    try {
      const response = await request(url);
      page.status = response.status; page.resolvedUrl = response.url || url; page.contentType = response.headers.get('content-type');
      if (!response.ok) throw Error('Public page returned HTTP ' + response.status);
      const html = await response.text();
      const inspected = inspectDealerShareHtml(html, page.resolvedUrl);
      Object.assign(page, inspected);
      const resolved = new URL(page.resolvedUrl), originalQuery = new URLSearchParams(resolved.search); resolved.search = ''; resolved.hash = '';
      for (const rule of Object.values(receipt?.canonicalLocaleIdentity ?? {})) if (resolved.pathname === rule.base || resolved.pathname.startsWith(rule.base + '/')) {
        if (!rule.locales.includes(inspected.language)) page.problems.push('missing-or-unsupported-document-language');
        else {
          const requested = originalQuery.getAll(rule.key);
          if (requested.length === 1 && rule.locales.includes(requested[0]) && requested[0] !== inspected.language) page.problems.push('document-language-does-not-match-request');
          // SSR resolves query, cookie and dealer default through the native
          // locale context. Sharing always makes that resolved language explicit.
          resolved.searchParams.set(rule.key, inspected.language);
        }
      }
      for (const rule of Object.values(receipt?.canonicalQueryIdentity ?? {})) if (resolved.pathname.replace(/\/$/, '') === rule.pathname) {
        for (const key of rule.keys) if (originalQuery.get(key)) resolved.searchParams.set(key, originalQuery.get(key));
      }
      if (page.canonical[0] !== resolved.href) page.problems.push('canonical-does-not-match-mounted-page');
      for (const image of inspected.metadata['og:image'] ?? []) {
        const evidence = await asset(image);
        if (evidence.error) page.problems.push('unavailable-og-image');
        else if (evidence.width !== 1200 || evidence.height !== 630) page.problems.push('og-image-is-not-reviewed-1200x630-card');
        const declaredType = inspected.metadata['og:image:type']?.[0];
        if (!evidence.error && declaredType && evidence.contentType?.split(';', 1)[0] !== declaredType) page.problems.push('og-image-declared-type-does-not-match-asset');
      }
      const twitter = inspected.metadata['twitter:image']?.[0];
      if (twitter !== inspected.metadata['og:image']?.[0]) page.problems.push('twitter-image-does-not-match-og-image');
      if (inspected.metadata['og:image:width']?.[0] !== '1200' || inspected.metadata['og:image:height']?.[0] !== '630') page.problems.push('missing-or-wrong-og-image-dimensions');
      for (const favicon of inspected.favicons) {
        const absolute = new URL(favicon.href, page.resolvedUrl).href;
        const evidence = await asset(absolute);
        if (evidence.error) page.problems.push('unavailable-favicon');
        if (receipt && !receipt.assets.some(entry => entry.publicUrl === absolute && /\/(?:icon-\d+\.png|favicon\.ico)$/.test(entry.path))) page.problems.push('favicon-not-reviewed-dealer-identity');
      }
      page.problems = [...new Set(page.problems)];
    } catch (error) { page.error = error.message; page.problems.push('anonymous-fetch-failed'); }
    pages.push(page);
  }
  return {schemaVersion: 1, checkedAt: new Date().toISOString(), access: 'anonymous-social-crawler-http', origin, passed: pages.every(page => !page.problems.length), pages, assets: [...imageCache].map(([url, result]) => ({url, ...result})), limitations: 'HTTP metadata and pixels only. Does not force Facebook to refresh its cached scrape or establish visual browser acceptance.'};
}

async function main() {
  const args = process.argv.slice(2), value = name => {const at = args.indexOf(name);return at < 0 ? undefined : args[at + 1]};
  if (args.includes('--help')) {console.log('node scripts/publishing/verify-dealer-share.mjs --origin https://existing-public-origin --paths /,/variant-2/cars,/variant-3/ --receipt <optional-package/.cars-dealer-share.json> --out <optional-evidence.json>');return;}
  const origin = value('--origin'), routes = value('--paths');
  if (!origin || !routes) throw Error('Provide --origin and comma-separated --paths; use --help.');
  const receiptFile = value('--receipt'), out = value('--out');
  const receipt = receiptFile ? JSON.parse(await fs.readFile(receiptFile, 'utf8')) : undefined;
  const evidence = await verifyDealerShare({origin, paths: routes.split(','), receipt});
  if (out) {const target = path.resolve(out);await fs.mkdir(path.dirname(target), {recursive: true});await fs.writeFile(target, JSON.stringify(evidence, null, 2) + '\n');}
  console.log(JSON.stringify({origin: evidence.origin, passed: evidence.passed, pages: evidence.pages.map(page => ({url: page.url, status: page.status, canonical: page.canonical, ogImage: page.metadata?.['og:image'], problems: page.problems})), assets: evidence.assets.length, ...(out ? {evidence: path.resolve(out)} : {})}, null, 2));
  if (!evidence.passed) process.exitCode = 1;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) main().catch(error => {console.error(error.message);process.exitCode = 1});
