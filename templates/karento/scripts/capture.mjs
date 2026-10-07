import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const origin = 'https://carento-demo.vercel.app/';
const pendingPages = new Set(['index.html', 'index-2.html', 'index-3.html']);
const visitedPages = new Set();
const pendingAssets = new Set();
const visitedAssets = new Set();
const pages = {};
const files = [];
const failures = [];

function localUrl(value, base = origin) {
  if (!value || /^(data:|#|mailto:|tel:|javascript:)/i.test(value)) return value;
  const url = new URL(value, base);
  if (url.origin !== new URL(origin).origin) return value;
  url.pathname = url.pathname.replace(/\/{2,}/g, '/');
  if (/\.html$/.test(url.pathname)) pendingPages.add(url.pathname.slice(1));
  else if (/\/assets\//.test(url.pathname)) pendingAssets.add(url.href.split('#')[0]);
  return url.pathname + url.search + url.hash;
}

async function fetchChecked(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
}

while ([...pendingPages].some((key) => !visitedPages.has(key))) {
  const keys = [...pendingPages].filter((key) => !visitedPages.has(key)).slice(0, 6);
  await Promise.all(keys.map(async (key) => {
    visitedPages.add(key);
    const url = new URL(key, origin).href;
    try {
      const html = await (await fetchChecked(url)).text();
      const $ = load(html);
      $('*').each((_, element) => {
        for (const attr of ['src', 'href', 'poster', 'data-src', 'data-background']) {
          const value = $(element).attr(attr);
          if (value) $(element).attr(attr, localUrl(value, url));
        }
        const srcset = $(element).attr('srcset');
        if (srcset) $(element).attr('srcset', srcset.split(',').map((item) => {
          const [src, ...size] = item.trim().split(/\s+/);
          return [localUrl(src, url), ...size].join(' ');
        }).join(', '));
        const style = $(element).attr('style');
        if (style) $(element).attr('style', rewriteCss(style, url));
      });
      const scripts = [];
      $('script').each((_, element) => {
        const script = $(element);
        scripts.push({ src: script.attr('src'), code: script.attr('src') ? undefined : script.html(), type: script.attr('type') });
        script.remove();
      });
      const title = $('title').text();
      $('title, meta[charset], meta[name="viewport"]').remove();
      pages[key.replace(/\.html$/, '')] = {
        title,
        head: $('head').html(),
        body: $('body').html(),
        bodyAttributes: $('body')[0]?.attribs || {},
        scripts
      };
      files.push({ url, bytes: Buffer.byteLength(html), sha256: createHash('sha256').update(html).digest('hex'), kind: 'page' });
      console.log(`page ${key}`);
    } catch (error) {
      failures.push({ url, error: String(error), kind: 'page' });
    }
  }));
}

function rewriteCss(css, base) {
  return css.replace(/url\(\s*(["']?)([^)"']+)\1\s*\)/g, (match, quote, value) => {
    return `url(${quote}${localUrl(value.trim(), base)}${quote})`;
  }).replace(/(@import\s+["'])([^"']+)(["'])/g, (_, prefix, value, suffix) => {
    return prefix + localUrl(value, base) + suffix;
  });
}

while ([...pendingAssets].some((url) => !visitedAssets.has(url))) {
  const urls = [...pendingAssets].filter((url) => !visitedAssets.has(url)).slice(0, 10);
  await Promise.all(urls.map(async (url) => {
    visitedAssets.add(url);
    try {
      const response = await fetchChecked(url);
      let content = Buffer.from(await response.arrayBuffer());
      const pathname = new URL(url).pathname;
      if (/\.css$/.test(pathname)) content = Buffer.from(rewriteCss(content.toString(), url));
      if (pathname.endsWith('/chart-data-3.js')) {
        content = Buffer.from(content.toString().replace(
          /var chart = new ApexCharts\(document\.querySelector\("#chart-3"\), options\);\s*chart\.render\(\);/,
          'var chartElement = document.querySelector("#chart-3");\nif (chartElement) {\n  var chart = new ApexCharts(chartElement, options);\n  chart.render();\n}'
        ));
      }
      if (/\.(css|js)$/.test(pathname)) {
        for (const match of content.toString().matchAll(/["'(](\/?assets\/[^"'()\s]+\.(?:svg|png|jpe?g|webp|gif|woff2?|ttf|css|js))(?:["')])/g)) {
          localUrl(match[1], origin);
        }
      }
      const output = path.resolve(root, 'static', '.' + pathname);
      if (!output.startsWith(path.join(root, 'static') + path.sep)) throw new Error('Asset escaped static root');
      await mkdir(path.dirname(output), { recursive: true });
      await writeFile(output, content);
      files.push({ url, path: 'static' + pathname, bytes: content.length, sha256: createHash('sha256').update(content).digest('hex'), kind: 'asset' });
    } catch (error) {
      failures.push({ url, error: String(error), kind: 'asset' });
    }
  }));
  console.log(`assets ${visitedAssets.size}/${pendingAssets.size}`);
}

await mkdir(path.join(root, 'src/lib/server/pages'), { recursive: true });
for (const [key, page] of Object.entries(pages)) {
  await writeFile(path.join(root, 'src/lib/server/pages', key + '.html'), page.body);
  delete page.body;
}
await writeFile(path.join(root, 'src/lib/server/pages.json'), JSON.stringify(pages, null, 2) + '\n');
await writeFile(path.join(root, 'provenance/capture.json'), JSON.stringify({
  source: origin,
  requestedReference: 'https://carento-nextjs.vercel.app/index-2',
  capturedAt: new Date().toISOString(),
  license: 'User reports an Envato license; license document was not provided.',
  pages: Object.keys(pages).sort(),
  files,
  failures
}, null, 2) + '\n');
console.log(JSON.stringify({ pages: Object.keys(pages).length, assets: files.filter((file) => file.kind === 'asset').length, failures }, null, 2));
if (failures.some((failure) => failure.kind === 'page')) process.exitCode = 1;
