import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { assertSixDesignSelection } from '../lib/six-design-release.mjs';
import { excluded, normalized } from '../lib/workflow.mjs';

export const SIX_PACKAGING_VERSION = '5';
const hash = value => createHash('sha256').update(value).digest('hex');
const json = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
const read = (files, name) => {
  if (!files.has(name)) throw Error('Required six-design source is missing: ' + name);
  return normalized(files.get(name)).toString('utf8');
};
const write = (files, name, value) => files.set(name, Buffer.from(value));
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The same canonical source digest used by extended dealer personalization.
// Mounting/hosting transformations happen only after this input proof passes.
export function extendedSourceDigest(files, key) {
  const prefix = key + '/';
  const entries = [...files].filter(([name]) => name.startsWith(prefix) && !excluded(name.slice(prefix.length)))
    .map(([name, bytes]) => [name.slice(prefix.length), hash(normalized(bytes))])
    .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  return hash(JSON.stringify(entries));
}

export function assertExtendedVariantSources(files, manifest) {
  if (manifest.packaging?.version !== SIX_PACKAGING_VERSION) return;
  assertSixDesignSelection(manifest.variants);
  for (const [key, name, format] of [
    ['mobile', '.cars-mobile.json', 'mobile-preview-v1'],
    ['karento-best', '.cars-signature.json', 'signature-preview-v1']
  ]) {
    const receipt = JSON.parse(read(files, name));
    if (receipt.schemaVersion !== 1 || receipt.format !== format || receipt.dealer !== manifest.slug
      || !receipt.name || receipt.template?.revision !== manifest.templateRevisions?.[key]) throw Error(key + ': dealer source receipt mismatch');
    if (receipt.sourceDigest !== extendedSourceDigest(files, key)) throw Error(key + ': source changed after personalization; regenerate and review the candidate');
    if (manifest.templateSources?.[key] && ['repository','revision','path','tree','digest'].some(field => receipt.template[field] !== manifest.templateSources[key][field])) throw Error(key + ': exact template source differs from the manifest');
    if (!Array.isArray(receipt.personalization?.logoPaths) || !receipt.personalization.logoPaths.length
      || !Number.isInteger(receipt.inventory?.count) || receipt.inventory.count < 1) throw Error(key + ': missing personalized dealer logo or inventory');
  }
}

function assetNamespaces(files, prefix) {
  return [...new Set([...files.keys()].filter(name => name.startsWith(prefix)).map(name => name.slice(prefix.length).split('/')[0]))]
    .filter(name => name && name !== 'preview-switcher.js').sort();
}
function mountAssetLiterals(text, base, namespaces) {
  if (!namespaces.length) return text;
  const names = namespaces.map(escape).join('|');
  return text.replace(new RegExp('(["\'`])/(?:(' + names + '))(?=/|["\'`?#])', 'g'), '$1' + base + '/$2')
    .replace(new RegExp('url\\(\\s*(["\']?)/(?:(' + names + '))(?=/|["\')?#])', 'g'), 'url($1' + base + '/$2');
}
function insertImport(text, statement) {
  if (text.includes(statement)) return text;
  const main = [...text.matchAll(/<script(?:\s[^>]*)?>/g)].find(match => !/\b(?:module|context\s*=)/.test(match[0]));
  return main ? text.slice(0, main.index + main[0].length) + '\n  ' + statement + text.slice(main.index + main[0].length)
    : '<script lang="ts">\n  ' + statement + '\n</script>\n' + text;
}
function expressionEnd(text, start) {
  const stack = ['{'];
  for (let i = start + 1; i < text.length; i++) {
    const ch = text[i];
    if ('\'"`'.includes(ch)) {
      const quote = ch;
      for (++i; i < text.length; i++) {
        if (text[i] === '\\') { i++; continue; }
        if (text[i] === quote) break;
      }
    } else if (text.slice(i, i + 2) === '/*') { i = text.indexOf('*/', i + 2); if (i < 0) break; i++; }
    else if (text.slice(i, i + 2) === '//') { i = text.indexOf('\n', i + 2); if (i < 0) break; }
    else if ('{[('.includes(ch)) stack.push(ch);
    else if ('}])'.includes(ch)) {
      if ('}])'['{[('.indexOf(stack.pop())] !== ch) throw Error('Unbalanced mounted Svelte URL expression');
      if (!stack.length) return i;
    }
  }
  throw Error('Unterminated mounted Svelte URL expression');
}
export function mountSvelteUrlAttributes(text, base) {
  let changed = false;
  const pattern = /\b(?:href|src|poster|action)\s*=\s*\{/g;
  const edits = [];
  for (const match of text.matchAll(pattern)) {
    const start = match.index + match[0].length - 1, end = expressionEnd(text, start);
    const value = text.slice(start + 1, end);
    if (!value.trim().startsWith('carsMountPath(')) { edits.push({start: start + 1, end, value: 'carsMountPath(' + value + ')'}); changed = true; }
  }
  for (const edit of edits.reverse()) text = text.slice(0, edit.start) + edit.value + text.slice(edit.end);
  text = text.replace(/\b(href|src|poster|action)=(['"])\/(?!\/|preview-switcher\.js|variant-[2-9](?:\/|[?'"#]))/g, '$1=$2' + base + '/');
  return { text: changed ? insertImport(text, 'import { carsMountPath } from "#lib/cars-mount.ts";') : text, changed };
}

function mountMobile(files) {
  const name = 'mobile/next.config.js';
  let config = read(files, name);
  if (/\bbasePath\s*:/.test(config)) throw Error('Mobile already has an unknown basePath; review its native adapter');
  if (config.split('module.exports = {').length !== 2) throw Error('Mobile Next configuration boundary changed');
  config = config.replace('module.exports = {', "module.exports = {\n  basePath: '/variant-5',\n  outputFileTracingRoot: __dirname,");
  write(files, name, config);
  const namespaces = assetNamespaces(files, 'mobile/public/');
  for (const [path, bytes] of files) {
    if (!path.startsWith('mobile/src/') || !/\.(?:[cm]?[jt]sx?|css|json)$/.test(path) || /\.(test|spec)\./.test(path)) continue;
    write(files, path, mountAssetLiterals(normalized(bytes).toString('utf8'), '/variant-5', namespaces));
  }
  const layoutName = 'mobile/src/app/layout.tsx';
  let layout = read(files, layoutName);
  if (!layout.includes('preview-switcher.js')) {
    if (layout.split('<body>').length !== 2) throw Error('Mobile root layout head boundary changed');
    layout = layout.replace('<body>', '<head><script defer src="/preview-switcher.js" /></head>\n      <body>');
  }
  write(files, layoutName, layout);
}

function mountAppEntry(files) {
  if (!files.has('app/package.json')) return; // A bounded framework qualification may omit the existing App.
  const name = 'app/app/page.tsx';
  let entry = read(files, name);
  // Next server redirects prepend configured basePath. Browser destinations
  // already include it, so using browserPath here repeats /variant-4 twice.
  if (/redirect\s*\(\s*browserPath\s*\(/.test(entry)) {
    if (!/import\s*\{\s*browserPath\s*\}\s*from\s*['"]@\/lib\/paths['"]/.test(entry)) throw Error('Unknown App entry redirect binding');
    entry = entry.replaceAll('browserPath', 'localePath');
    write(files, name, entry);
  }
  const configName = 'app/next.config.js';
  if (files.has(configName)) {
    let config = read(files, configName);
    if (!/\boutputFileTracingRoot\s*:/.test(config)) {
      if (config.split('const nextConfig = {').length !== 2) throw Error('App tracing configuration boundary changed');
      config = config.replace('const nextConfig = {', 'const nextConfig = {\n  outputFileTracingRoot: __dirname,');
      write(files, configName, config);
    }
  }
}

function mountSignature(files, adapter, provider) {
  const key = 'karento-best', base = '/variant-6';
  if (provider === 'vercel' && (adapter?.schemaVersion !== 1 || adapter.version !== '7.0.0' || adapter.runtime !== 'nodejs24.x'
    || adapter.input?.packageSha256 !== hash(normalized(files.get(key + '/package.json')))
    || adapter.input?.lockSha256 !== hash(normalized(files.get(key + '/package-lock.json'))))) throw Error('Signature dependency inputs changed; requalify the frozen Vercel adapter');
  const viteName = key + '/vite.config.ts';
  let vite = read(files, viteName);
  if (/\bpaths\s*:/.test(vite) || !vite.includes('"@sveltejs/adapter-node"') || vite.split('sveltekit({ adapter: adapter() })').length !== 2) throw Error('Signature Vite adapter boundary changed; review before mounting');
  vite = provider === 'vercel'
    ? vite.replace('"@sveltejs/adapter-node"', '"@sveltejs/adapter-vercel"')
      .replace('sveltekit({ adapter: adapter() })', 'sveltekit({ adapter: adapter({ runtime: "nodejs24.x" }), paths: { base: "/variant-6", relative: false } })')
    : vite.replace('sveltekit({ adapter: adapter() })', 'sveltekit({ adapter: adapter(), paths: { base: "/variant-6", relative: false } })');
  write(files, viteName, vite);
  if (provider === 'vercel') {
    files.set(key + '/package.json', json(adapter.package));
    files.set(key + '/package-lock.json', json(adapter.lock));
    write(files, key + '/.node-version', '24.21.0\n');
  }
  const helperName = key + '/src/lib/cars-mount.ts';
  if (files.has(helperName)) throw Error('Signature already contains an unknown mounting helper');
  write(files, helperName, `// Generated deployment paths; canonical template URLs stay local.\nexport const carsBase = ${JSON.stringify(base)};\nexport function carsLocalPath(value: string): string {\n  return value === carsBase ? "/" : value.startsWith(carsBase + "/") ? value.slice(carsBase.length) : value;\n}\nexport function carsMountPath<T extends string | null | undefined>(value: T): T {\n  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value === "/preview-switcher.js" || value === carsBase || value.startsWith(carsBase + "/") || value.startsWith(carsBase + "?") || value.startsWith(carsBase + "#")) return value;\n  return (carsBase + value) as T;\n}\n`);
  write(files, key + '/src/lib/cars-navigation.ts', 'import { goto as nativeGoto } from "$app/navigation";\nimport { carsMountPath } from "#lib/cars-mount.ts";\nexport * from "$app/navigation";\nexport const goto: typeof nativeGoto = (url, options) => nativeGoto(typeof url === "string" ? carsMountPath(url) : url, options);\n');
  const namespaces = assetNamespaces(files, key + '/static/');
  for (const [path, bytes] of files) {
    if (path === helperName || path.endsWith('/cars-navigation.ts')) continue;
    if (path.startsWith(key + '/src/') && /\.(?:[cm]?[jt]sx?|svelte|json)$/.test(path) && !/\.(test|spec)\./.test(path)) {
      let text = normalized(bytes).toString('utf8');
      text = mountAssetLiterals(text, base, namespaces);
      if (path.endsWith('.svelte')) {
        text = mountSvelteUrlAttributes(text, base).text;
        if (text.includes('page.url.pathname')) {
          text = text.replaceAll('page.url.pathname', 'carsLocalPath(page.url.pathname)');
          text = insertImport(text, 'import { carsLocalPath } from "#lib/cars-mount.ts";');
        }
      }
      text = text.replace(/from (['"])\$app\/navigation\1/g, 'from "#lib/cars-navigation.ts"');
      write(files, path, text);
    } else if (path.startsWith(key + '/static/') && /\.(?:css|js|html)$/.test(path)) write(files, path, mountAssetLiterals(normalized(bytes).toString('utf8'), base, namespaces));
  }
  const routesName = key + '/src/lib/routes.ts';
  let routes = read(files, routesName);
  if (routes.split('export function resolveRoute(path: string): SourceKey | null {').length !== 2) throw Error('Signature route resolver boundary changed');
  routes = 'import { carsLocalPath } from "#lib/cars-mount.ts";\n' + routes.replace('export function resolveRoute(path: string): SourceKey | null {', 'export function resolveRoute(path: string): SourceKey | null {\n  path = carsLocalPath(path);');
  write(files, routesName, routes);
  const appName = key + '/src/app.html';
  let app = read(files, appName);
  if (!app.includes('preview-switcher.js')) {
    if (app.split('</head>').length !== 2) throw Error('Signature app head boundary changed');
    app = app.replace('</head>', '  <script defer src="/preview-switcher.js"></script>\n</head>');
  }
  write(files, appName, app);
}

/** Only generated package files are transformed; source receipts remain original input proof. */
export function applySixVariantMounts(inputFiles, manifest, { provider = 'vercel', signatureAdapter } = {}) {
  if (!['vercel', 'cloudflare'].includes(provider)) throw Error('Unknown six-design hosting provider');
  if (manifest.packaging?.version !== SIX_PACKAGING_VERSION) return new Map(inputFiles);
  assertSixDesignSelection(manifest.variants);
  const files = new Map(inputFiles);
  const adapter = provider === 'vercel' ? signatureAdapter ?? JSON.parse(readFileSync(new URL('./signature-vercel-adapter.json', import.meta.url))) : undefined;
  mountAppEntry(files); mountMobile(files); mountSignature(files, adapter, provider);
  return files;
}

export function sealSixVariantBuild(files, manifest, { provider = 'vercel' } = {}) {
  if (!['vercel', 'cloudflare'].includes(provider)) throw Error('Unknown six-design hosting provider');
  if (manifest.packaging?.version !== SIX_PACKAGING_VERSION) return;
  const families = Object.fromEntries(['app', 'mobile', 'karento-best'].map(key => [key, { base: manifest.variants.find(v => v.key === key).base, digest: extendedSourceDigest(files, key) }]));
  files.set('.cars-six-build.json', json({ schemaVersion: 1, packagingVersion: SIX_PACKAGING_VERSION, dealer: manifest.slug,
    transformation: provider === 'cloudflare' ? 'six-design-cloudflare-v1' : 'six-design-services-v1',
    signature: provider === 'cloudflare' ? { provider: 'cloudflare', adapterReceipt: '.cars-cloudflare-svelte.json', buildVerified: false }
      : { adapter: '@sveltejs/adapter-vercel@7.0.0', runtime: 'nodejs24.x' }, families,
    sourceReceipts: Object.fromEntries(['.cars-app.json', '.cars-mobile.json', '.cars-signature.json'].map(name => [name, hash(files.get(name))])) }));
}
