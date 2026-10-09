import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import path from 'node:path';

export const DEALER_SHARE_VERSION = 'dealer-share-v1';
const root = path.resolve(import.meta.dirname, '../..');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';
const roots = {'auto-best': 'auto-best/static/', import: 'import/static/', modern: 'modern/apps/web/public/', app: 'app/public/', mobile: 'mobile/public/', 'karento-best': 'karento-best/static/'};
const nextRoots = {modern: 'modern/apps/web/', app: 'app/', mobile: 'mobile/src/'};

function dependency(name) {
  const candidates = ['templates/karento-best/package.json', 'templates/mobile/package.json', 'templates/app/package.json'];
  for (const candidate of candidates) {
    try { return createRequire(path.join(root, candidate))(name); }
    catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error; }
  }
  throw Error(`Dealer share packaging requires ${name}; install the maintained template dependencies first.`);
}

export function publicOrigin(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/' || url.port || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(url.hostname) || /^(?:localhost|127\.|0\.|10\.|192\.168\.|169\.254\.|\[)/i.test(url.hostname)) {
    throw Error('Dealer share publicOrigin must be the reviewed public HTTPS origin without a path or credentials.');
  }
  return url.origin;
}

/** Keep the requested mounted pathname; filter/query state is not a different shared page. */
export function canonicalPublicUrl(origin, pathname, {preserveQuery = []} = {}) {
  const url = new URL(origin);
  const route = String(pathname).split(/[?#]/, 1)[0];
  if (!route.startsWith('/') || route.startsWith('//') || /[\\\u0000-\u0020]/.test(route)) throw Error('Invalid public page pathname');
  url.pathname = route;
  url.search = '';
  url.hash = '';
  const query = new URLSearchParams(String(pathname).split('?', 2)[1]?.split('#', 1)[0] ?? '');
  for (const key of preserveQuery) if (query.get(key)) url.searchParams.set(key, query.get(key));
  return url.href;
}

export function mountedPathname(pathname, base = '') {
  const route = pathname.startsWith('/') ? pathname : '/' + pathname;
  return !base || route === base || route.startsWith(base + '/') ? route : base + route;
}

function safeAsset(value) {
  if (typeof value !== 'string' || !/^[\w./@()-]+\.(?:png|webp)$/i.test(value) || value.startsWith('/') || value.split('/').some(part => !part || part === '.' || part === '..')) throw Error('Dealer share logo must be an explicit package-relative reviewed PNG/WebP.');
  return value;
}

export function resolveShareIdentity(files, manifest) {
  const input = manifest.shareIdentity;
  if (!input || typeof input.name !== 'string' || !input.name.trim() || input.name.length > 180 || /[\u0000-\u001f]/.test(input.name)) throw Error('Manifest shareIdentity needs the reviewed dealer name.');
  const origin = publicOrigin(input.publicOrigin);
  const sourcePath = safeAsset(input.logo?.sourcePath);
  const bytes = files.get(sourcePath);
  if (!bytes) throw Error('Reviewed dealer share logo is missing: ' + sourcePath);
  if (!/^[a-f0-9]{64}$/.test(input.logo?.sha256 ?? '') || hash(bytes) !== input.logo.sha256) throw Error('Reviewed dealer share logo SHA-256 differs: ' + sourcePath);
  let icon;
  if (input.logo.faviconSourcePath) {
    const iconPath = safeAsset(input.logo.faviconSourcePath), iconBytes = files.get(iconPath);
    if (!iconBytes || !/^[a-f0-9]{64}$/.test(input.logo.faviconSha256 ?? '') || hash(iconBytes) !== input.logo.faviconSha256) throw Error('Reviewed dealer favicon source SHA-256 differs: ' + iconPath);
    icon = {sourcePath: iconPath, sha256: hash(iconBytes), bytes: Buffer.from(iconBytes)};
  }
  const description = input.description ?? 'Dealer website preview.';
  if (typeof description !== 'string' || !description.trim() || description.length > 500 || /[\u0000-\u001f]/.test(description)) throw Error('Dealer share description must be bounded reviewed text.');
  return {name: input.name.trim(), publicOrigin: origin, description, logo: {sourcePath, sha256: hash(bytes), bytes: Buffer.from(bytes)}, icon};
}

const escapeXml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

async function trimTransparent(sharp, bytes) {
  const image = sharp(bytes, {limitInputPixels: 40_000_000});
  const metadata = await image.metadata();
  if (!['png', 'webp'].includes(metadata.format) || !metadata.width || !metadata.height) throw Error('Dealer logo source must decode to PNG/WebP pixels.');
  // Remove empty alpha padding only. Never crop a wordmark, remove an opaque
  // logo background, repaint a reviewed identity or infer an unreviewed icon.
  const {data, info} = await image.ensureAlpha().raw().toBuffer({resolveWithObject: true});
  let left = info.width, top = info.height, right = -1, bottom = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * info.channels + info.channels - 1]) {
      left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
  }
  if (right < 0) throw Error('Reviewed dealer logo is entirely transparent.');
  const bounds = {left, top, width: right - left + 1, height: bottom - top + 1};
  return {bytes: await sharp(bytes).extract(bounds).png().toBuffer(), original: {width: metadata.width, height: metadata.height}, bounds};
}

function pngIco(entries) {
  const header = Buffer.alloc(6 + entries.length * 16);
  header.writeUInt16LE(1, 2); header.writeUInt16LE(entries.length, 4);
  let offset = header.length;
  for (const [index, entry] of entries.entries()) {
    const at = 6 + index * 16;
    header[at] = entry.size === 256 ? 0 : entry.size;
    header[at + 1] = header[at];
    header.writeUInt16LE(1, at + 4); header.writeUInt16LE(32, at + 6);
    header.writeUInt32LE(entry.bytes.length, at + 8); header.writeUInt32LE(offset, at + 12);
    offset += entry.bytes.length;
  }
  return Buffer.concat([header, ...entries.map(entry => entry.bytes)]);
}

export async function createDealerShareAssets(identity, {sharp = dependency('sharp')} = {}) {
  const logo = await trimTransparent(sharp, identity.logo.bytes);
  const icon = identity.icon ? await trimTransparent(sharp, identity.icon.bytes) : logo;
  const outputs = new Map();
  outputs.set('logo.webp', await sharp(logo.bytes).resize({width: 1600, height: 640, fit: 'inside', withoutEnlargement: true}).webp({lossless: true, effort: 6}).toBuffer());
  const logoPanel = await sharp(logo.bytes).resize({width: 960, height: 320, fit: 'inside', withoutEnlargement: false}).png().toBuffer({resolveWithObject: true});
  const nameSize = identity.name.length > 52 ? 32 : identity.name.length > 35 ? 40 : 48;
  const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="180"><text x="600" y="72" text-anchor="middle" font-family="Arial, sans-serif" font-size="${nameSize}" font-weight="700" fill="#17212b">${escapeXml(identity.name)}</text><text x="600" y="126" text-anchor="middle" font-family="Arial, sans-serif" font-size="25" fill="#5a6470">Website preview</text></svg>`);
  const social = await sharp({create: {width: 1200, height: 630, channels: 3, background: '#ffffff'}}).composite([
    {input: logoPanel.data, left: Math.round((1200 - logoPanel.info.width) / 2), top: Math.round(80 + (320 - logoPanel.info.height) / 2)},
    {input: text, left: 0, top: 410},
  ]).png({compressionLevel: 9}).toBuffer();
  outputs.set('social.png', social);
  const iconEntries = [];
  for (const size of [16, 32, 48, 180, 512]) {
    const inset = size <= 48 ? Math.max(1, Math.round(size / 12)) : Math.round(size / 10);
    const contained = await sharp(icon.bytes).resize({width: size - 2 * inset, height: size - 2 * inset, fit: 'inside'}).png().toBuffer({resolveWithObject: true});
    const png = await sharp({create: {width: size, height: size, channels: 3, background: '#ffffff'}}).composite([{input: contained.data, left: Math.round((size - contained.info.width) / 2), top: Math.round((size - contained.info.height) / 2)}]).png({compressionLevel: 9}).toBuffer();
    if ([16, 32, 48].includes(size)) iconEntries.push({size, bytes: png});
    if ([32, 180, 512].includes(size)) outputs.set(`icon-${size}.png`, png);
  }
  outputs.set('favicon.ico', pngIco(iconEntries));
  const id = hash(Buffer.from(json({version: DEALER_SHARE_VERSION, name: identity.name, description: identity.description, outputs: [...outputs].map(([name, bytes]) => [name, hash(bytes)])}))).slice(0, 20);
  const publicDirectory = '/dealer-share/' + id;
  return {publicDirectory, outputs, layout: {width: 1200, height: 630, logoBox: {left: 120, top: 80, width: 960, height: 320}, logoRender: {width: logoPanel.info.width, height: logoPanel.info.height}, logoSource: logo.original, transparentBounds: logo.bounds, faviconSource: identity.icon ? 'reviewed-icon' : 'contained-reviewed-wordmark'}};
}

export function removeIdentityHeadTags(source) {
  const removed = [];
  const result = source.replace(/<(meta|link)\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi, tag => {
    const attribute = name => tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1]?.toLowerCase();
    const rel = attribute('rel');
    const key = attribute('property') ?? attribute('name');
    if ((rel && /^(?:canonical|icon|shortcut icon|apple-touch-icon|apple-touch-icon-precomposed)$/.test(rel)) || (key && (/^og:(?:url|site_name|title|description|type|image(?::.*)?)$/.test(key) || /^twitter:(?:card|title|description|image(?::.*)?)$/.test(key)))) {
      removed.push(tag); return '';
    }
    return tag;
  });
  return {source: result, removed};
}

function svelteMetadata(identity, assets, key) {
  const signature = key === 'karento-best';
  const canonical = signature ? "const canonical = $derived.by(() => {\n    const url = new URL(identity.publicOrigin + page.url.pathname);\n    url.searchParams.set('lang', locale.locale);\n    const id = page.url.searchParams.get('id');\n    if (/\\/vehicle\\/?$/.test(page.url.pathname) && id) url.searchParams.set('id', id);\n    return url.href;\n  });" : 'const canonical = $derived(identity.publicOrigin + page.url.pathname);';
  const localeScript = signature ? "import { useLocale } from '$lib/i18n/context.svelte';\n  const locale = useLocale();\n  " : '';
  const imageAlt = signature ? "locale.t('metadata.websitePreview', { dealer: identity.name })" : "identity.name + ' dealer website preview'";
  return `<script lang="ts">\n  import { page } from '$app/state';\n  ${localeScript}const identity = ${JSON.stringify({name: identity.name, publicOrigin: identity.publicOrigin, description: identity.description})};\n  const directory = ${JSON.stringify(identity.publicOrigin + assets.publicDirectory)};\n  ${canonical}\n</script>\n\n<svelte:head>\n  <link rel="canonical" href={canonical} />\n  <link rel="icon" type="image/png" sizes="32x32" href={directory + '/icon-32.png'} />\n  <link rel="shortcut icon" href={directory + '/favicon.ico'} />\n  <link rel="apple-touch-icon" sizes="180x180" href={directory + '/icon-180.png'} />\n  <meta property="og:type" content="website" />\n  <meta property="og:site_name" content={identity.name} />\n  <meta property="og:title" content={identity.name} />\n  <meta property="og:description" content={identity.description} />\n  <meta property="og:url" content={canonical} />\n  <meta property="og:image" content={directory + '/social.png'} />\n  <meta property="og:image:secure_url" content={directory + '/social.png'} />\n  <meta property="og:image:type" content="image/png" />\n  <meta property="og:image:width" content="1200" />\n  <meta property="og:image:height" content="630" />\n  <meta property="og:image:alt" content={${imageAlt}} />\n  <meta name="twitter:card" content="summary_large_image" />\n  <meta name="twitter:title" content={identity.name} />\n  <meta name="twitter:description" content={identity.description} />\n  <meta name="twitter:image" content={directory + '/social.png'} />\n  <meta name="twitter:image:alt" content={${imageAlt}} />\n</svelte:head>\n`;
}

function removeUnusedSvelteImports(source, ts) {
  if (!ts) return source;
  return source.replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/g, (_match, open, script, close) => {
    const ast = ts.createSourceFile('layout.ts', script, ts.ScriptTarget.Latest, true);
    const imports = ast.statements.filter(ts.isImportDeclaration);
    let references = source;
    for (const item of imports) references = references.replace(item.getText(ast), '');
    const edits = [];
    for (const item of imports) {
      const clause = item.importClause, bindings = clause?.namedBindings;
      if (!bindings || !ts.isNamedImports(bindings)) continue;
      const used = bindings.elements.filter(element => new RegExp('(?:^|[^\\w.$])' + element.name.text + '(?![\\w$])').test(references));
      if (used.length === bindings.elements.length) continue;
      const next = used.length || clause.name ? ts.factory.updateImportDeclaration(item, item.modifiers, ts.factory.updateImportClause(clause, clause.isTypeOnly, clause.name, used.length ? ts.factory.createNamedImports(used) : undefined), item.moduleSpecifier, item.attributes) : undefined;
      edits.push({start: item.getStart(ast), end: item.end, text: next ? ts.createPrinter().printNode(ts.EmitHint.Unspecified, next, ast) : ''});
    }
    let after = script;
    for (const edit of edits.sort((a,b)=>b.start-a.start)) after = after.slice(0,edit.start) + edit.text + after.slice(edit.end);
    return open + after + close;
  });
}

function patchSvelte(files, key, identity, assets, changed, ts) {
  const layout = key + '/src/routes/+layout.svelte';
  if (!files.has(layout)) throw Error('Missing Svelte dealer root layout: ' + layout);
  const component = key + '/src/lib/CarsDealerShare.svelte';
  for (const [name, bytes] of files) {
    if (!name.startsWith(key + '/') || !/\.(?:svelte|html)$/.test(name) || name.includes('/provenance/')) continue;
    const before = bytes.toString('utf8');
    let after = name.endsWith('.svelte') ? before.replace(/<svelte:head\b[^>]*>[\s\S]*?<\/svelte:head\s*>/g, head => removeIdentityHeadTags(head).source.replaceAll('page.url.origin', JSON.stringify(identity.publicOrigin))) : removeIdentityHeadTags(before).source;
    // Only the known canonical helper owns metadata origin selection. Do not
    // alter request-origin security checks, form preferences or UI actions.
    if (name === 'import/src/routes/(site)/+layout.svelte') after = after.replaceAll('data.site.identity.origin', JSON.stringify(identity.publicOrigin));
    // Retain typed helper use without emitting another canonical tag. Import's
    // inner site layout otherwise keeps an unused local after its tag is removed.
    if (/\bconst canonical = \$derived\(/.test(after) && !/href=\{canonical\}|content=\{canonical\}/.test(after)) after = after.replace(/<svelte:head\b[^>]*>/, '$&{#if canonical}{/if}');
    if (name === layout) {
      if (!/<script\b[^>]*>/.test(after)) throw Error('Unsupported Svelte root script: ' + layout);
      after = after.replace(/<script\b[^>]*>/, "$&\n  import CarsDealerShare from '../lib/CarsDealerShare.svelte';");
      after += '\n<CarsDealerShare />\n';
    }
    if (name.endsWith('.svelte') && after !== before) after = removeUnusedSvelteImports(after, ts);
    if (after !== before) {files.set(name, Buffer.from(after)); changed.push(name);}
  }
  files.set(component, Buffer.from(svelteMetadata(identity, assets, key))); changed.push(component);
}

function nextMetadataModule(identity, assets, variant) {
  const definition = {name: identity.name, publicOrigin: identity.publicOrigin, description: identity.description, directory: identity.publicOrigin + assets.publicDirectory, entry: variant.entry};
  return `import type { Metadata } from 'next';\nimport { headers } from 'next/headers';\n\nconst identity = ${JSON.stringify(definition)};\n\nexport async function dealerShareMetadata(input: Metadata | Promise<Metadata>): Promise<Metadata> {\n  const original = await input;\n  const requestHeaders = await headers();\n  const candidate = requestHeaders.get('x-cars-public-path') ?? identity.entry;\n  const pathname = candidate.startsWith('/') && !candidate.startsWith('//') && !/[\\\\\\u0000-\\u0020]/.test(candidate) ? candidate.split(/[?#]/, 1)[0] : identity.entry;\n  const canonical = identity.publicOrigin + pathname;\n  const title = typeof original.title === 'string' ? original.title : original.title && typeof original.title === 'object' && 'absolute' in original.title ? original.title.absolute : identity.name;\n  const description = original.description ?? identity.description;\n  const image = {url: identity.directory + '/social.png', width: 1200, height: 630, type: 'image/png', alt: identity.name + ' dealer website preview'};\n  const languages = original.alternates?.languages ? Object.fromEntries(Object.entries(original.alternates.languages).map(([locale, value]) => [locale, typeof value === 'string' || value instanceof URL ? identity.publicOrigin + new URL(value, identity.publicOrigin).pathname : value])) : undefined;\n  return {\n    ...original, applicationName: identity.name, metadataBase: new URL(identity.publicOrigin),\n    alternates: {...original.alternates, ...(languages ? {languages} : {}), canonical},\n    icons: {icon: [{url: identity.directory + '/icon-32.png', sizes: '32x32', type: 'image/png'}], shortcut: identity.directory + '/favicon.ico', apple: [{url: identity.directory + '/icon-180.png', sizes: '180x180', type: 'image/png'}]},\n    openGraph: {...original.openGraph, type: 'website', title, description, siteName: identity.name, url: canonical, images: [image]},\n    twitter: {...original.twitter, card: 'summary_large_image', title, description, images: [{url: image.url, alt: image.alt}]},\n  };\n}\n`;
}

/** Preserve locale/security proxies and all their request headers/cookies. */
function nextProxyModule(base, hasOriginal, config) {
  const matcher = config ?? "{matcher: ['/((?!_next/|api/|.*\\\\.[^/]+$).*)']}";
  return `import {NextResponse, type NextProxy} from 'next/server';\n${hasOriginal ? "import * as original from './cars-original-proxy';\n" : ''}\nexport const config = ${matcher};\n\nexport const proxy: NextProxy = async (request, event) => {\n  ${hasOriginal ? "const originalProxy = 'default' in original && typeof original.default === 'function' ? original.default : 'proxy' in original && typeof original.proxy === 'function' ? original.proxy : undefined;\n  if (typeof originalProxy !== 'function') throw new Error('Missing reviewed Next proxy');\n  const response = (await originalProxy(request, event)) ?? NextResponse.next();" : 'const response = NextResponse.next();'}\n  const forwarded = new Headers(request.headers);\n  for (const name of (response.headers.get('x-middleware-override-headers') ?? '').split(',').filter(Boolean)) {\n    const value = response.headers.get('x-middleware-request-' + name);\n    if (value === null) forwarded.delete(name); else forwarded.set(name, value);\n  }\n  const base = ${JSON.stringify(base)};\n  const pathname = request.nextUrl.pathname;\n  forwarded.set('x-cars-public-path', !base || pathname === base || pathname.startsWith(base + '/') ? pathname : base + pathname);\n  const overrides = NextResponse.next({request: {headers: forwarded}});\n  for (const [name, value] of overrides.headers) {\n    if (name === 'x-middleware-override-headers' || name.startsWith('x-middleware-request-')) response.headers.set(name, value);\n  }\n  return response;\n};\n`;
}

function patchNextMetadataSource(source, filename, helper, ts) {
  const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, filename.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const edits = [];
  const exported = node => node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword);
  let wrapper = '', originals = 0;
  for (const statement of ast.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name?.text === 'generateMetadata' && exported(statement)) {
      edits.push({start: statement.getStart(ast), end: statement.end, text: statement.getText(ast).replace(/^export\s+/, '').replace(/\bgenerateMetadata\b/, 'carsOriginalGenerateMetadata')});
      wrapper = 'export async function generateMetadata(...args: Parameters<typeof carsOriginalGenerateMetadata>) {\n  return dealerShareMetadata(carsOriginalGenerateMetadata(...args));\n}\n'; originals++;
    } else if (ts.isVariableStatement(statement) && exported(statement)) {
      const metadata = statement.declarationList.declarations.filter(declaration => ts.isIdentifier(declaration.name) && ['metadata', 'generateMetadata'].includes(declaration.name.text));
      if (!metadata.length) continue;
      if (metadata.length !== 1 || statement.declarationList.declarations.length !== 1) throw Error('Unsupported combined Next metadata declaration: ' + filename);
      const name = metadata[0].name.text;
      const renamed = name === 'metadata' ? 'carsOriginalMetadata' : 'carsOriginalGenerateMetadata';
      edits.push({start: statement.getStart(ast), end: statement.end, text: statement.getText(ast).replace(/^export\s+/, '').replace(new RegExp('\\b' + name + '\\b'), renamed)});
      wrapper = name === 'metadata' ? 'export async function generateMetadata() {\n  return dealerShareMetadata(carsOriginalMetadata);\n}\n' : 'export async function generateMetadata(...args: Parameters<typeof carsOriginalGenerateMetadata>) {\n  return dealerShareMetadata(carsOriginalGenerateMetadata(...args));\n}\n'; originals++;
    }
  }
  if (originals > 1) throw Error('Next route exports conflicting metadata: ' + filename);
  // Explicit JSX head icons would bypass Next's metadata merge.
  const visit = node => {
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(ast) === 'link') {
      const rel = node.attributes.properties.find(attribute => ts.isJsxAttribute(attribute) && attribute.name.getText(ast) === 'rel');
      if (rel?.initializer && ts.isStringLiteral(rel.initializer) && /^(?:icon|shortcut icon|apple-touch-icon)$/.test(rel.initializer.text)) edits.push({start: node.getStart(ast), end: node.end, text: ''});
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  let result = source;
  for (const edit of edits.sort((a, b) => b.start - a.start)) result = result.slice(0, edit.start) + edit.text + result.slice(edit.end);
  if (originals) result = `import {dealerShareMetadata} from ${JSON.stringify(helper)};\n` + result + '\n' + wrapper;
  return {source: result, metadata: originals > 0};
}

function patchNext(files, variant, identity, assets, changed, ts) {
  const prefix = nextRoots[variant.key], app = prefix + 'app/';
  const helper = prefix + 'lib/cars-dealer-share.ts';
  let count = 0;
  for (const [name, bytes] of files) {
    if (!name.startsWith(app) || !/\.(?:tsx?|jsx?)$/.test(name) || /\.(?:test|spec)\./.test(name)) continue;
    let relative = path.posix.relative(path.posix.dirname(name), helper).replace(/\.ts$/, '');
    if (!relative.startsWith('.')) relative = './' + relative;
    const before = bytes.toString('utf8'), result = patchNextMetadataSource(before, name, relative, ts);
    if (result.source !== before) {files.set(name, Buffer.from(result.source)); changed.push(name);}
    if (result.metadata) count++;
  }
  if (!count) throw Error('Missing reviewed Next metadata boundary: ' + variant.key);
  files.set(helper, Buffer.from(nextMetadataModule(identity, assets, variant))); changed.push(helper);
  const proxy = variant.key === 'mobile' && files.has('mobile/proxy.ts') ? 'mobile/proxy.ts' : prefix + 'proxy.ts';
  const original = files.get(proxy);
  let config;
  if (original) {
    const parsed = ts.createSourceFile(proxy, original.toString('utf8'), ts.ScriptTarget.Latest, true);
    for (const statement of parsed.statements) if (ts.isVariableStatement(statement)) {
      const declaration = statement.declarationList.declarations.find(item => ts.isIdentifier(item.name) && item.name.text === 'config');
      if (!declaration) continue;
      if (!declaration.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) throw Error('Unsupported reviewed Next proxy matcher: ' + proxy);
      config = declaration.initializer.getText(parsed);
    }
    if (!config) throw Error('Missing reviewed Next proxy matcher: ' + proxy);
  }
  if (original) {files.set(proxy.replace('/proxy.ts', '/cars-original-proxy.ts'), original); changed.push(proxy.replace('/proxy.ts', '/cars-original-proxy.ts'));}
  files.set(proxy, Buffer.from(nextProxyModule(variant.base, Boolean(original), config))); changed.push(proxy);
  return count;
}

/** One shared asset set per dealer; only reviewed, derived publishing bytes change. */
export async function applyDealerShare(files, manifest, options = {}) {
  if (files.has('.cars-dealer-share.json')) throw Error('Dealer share metadata already applied; regenerate from reviewed source.');
  if (!manifest.variants?.some(variant => variant.key === 'auto-best' && variant.base === '')) throw Error('Shared dealer metadata requires the existing root Auto Best service.');
  const signatureVariants = manifest.variants.filter(variant => variant.key === 'karento-best');
  const enabledLocales = manifest.localization?.enabledLocales;
  if (signatureVariants.length && (!Array.isArray(enabledLocales) || !enabledLocales.length || enabledLocales.some(locale => typeof locale !== 'string' || !/^[a-z]{2,3}(?:-[a-zA-Z0-9]{2,8})*$/.test(locale)) || new Set(enabledLocales).size !== enabledLocales.length)) throw Error('Signature share metadata requires the approved enabledLocales contract.');
  const identity = resolveShareIdentity(files, manifest);
  const assets = await createDealerShareAssets(identity, options);
  const before = new Map([...files].map(([name, bytes]) => [name, hash(bytes)]));
  const changed = [], suppressed = [], counts = {};
  for (const [name, bytes] of assets.outputs) files.set('auto-best/static' + assets.publicDirectory + '/' + name, bytes);
  const ts = manifest.variants.some(variant => nextRoots[variant.key]) ? (options.typescript ?? dependency('typescript')) : undefined;
  for (const variant of manifest.variants) {
    const prefix = roots[variant.key];
    if (!prefix) throw Error('Unsupported dealer metadata family: ' + variant.key);
    // Browser fallback /favicon.ico and PWA icons remain correct for each app.
    files.set(prefix + 'favicon.ico', assets.outputs.get('favicon.ico'));
    if (nextRoots[variant.key]) {
      // Next file-based metadata takes priority over declared metadata. Remove
      // only those derived convention files; their maintained source is intact.
      const app = nextRoots[variant.key] + 'app/';
      for (const name of [...files.keys()]) {
        if (name.startsWith(app) && /\/(?:favicon\.ico|(?:icon|apple-icon|opengraph-image|twitter-image)(?:\d+)?\.(?:ico|png|jpe?g|webp|svg|tsx?|jsx?))$/.test(name)) {files.delete(name); suppressed.push(name);}
      }
      counts[variant.key] = patchNext(files, variant, identity, assets, changed, ts);
    } else {patchSvelte(files, variant.key, identity, assets, changed, ts); counts[variant.key] = 1;}
    for (const [name, bytes] of files) {
      if (!name.startsWith(prefix) || !/\.webmanifest$/.test(name)) continue;
      const input = JSON.parse(bytes.toString('utf8'));
      const output = {...input, name: identity.name, short_name: identity.name, start_url: variant.entry, scope: variant.base ? variant.base + '/' : '/', icons: [{src: identity.publicOrigin + assets.publicDirectory + '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'}]};
      files.set(name, Buffer.from(json(output))); changed.push(name);
    }
  }
  const receipt = {schemaVersion: 1, version: DEALER_SHARE_VERSION, dealer: manifest.slug, identity: {name: identity.name, publicOrigin: identity.publicOrigin, description: identity.description, logo: {sourcePath: identity.logo.sourcePath, sha256: identity.logo.sha256}, ...(identity.icon ? {icon: {sourcePath: identity.icon.sourcePath, sha256: identity.icon.sha256}} : {})},
    publicDirectory: assets.publicDirectory, assetHosting: 'shared-root-autobest', layout: assets.layout, metadataBoundaries: counts, canonicalQueryIdentity: Object.fromEntries(signatureVariants.map(variant => [variant.key, {pathname: variant.base + '/vehicle', keys: ['id']} ])), canonicalLocaleIdentity: Object.fromEntries(signatureVariants.map(variant => [variant.key, {base: variant.base, key: 'lang', locales: [...enabledLocales]}])), suppressedFileBasedMetadata: suppressed,
    assets: [...assets.outputs].map(([name, bytes]) => ({path: 'auto-best/static' + assets.publicDirectory + '/' + name, publicUrl: identity.publicOrigin + assets.publicDirectory + '/' + name, sha256: hash(bytes), bytes: bytes.length})),
    transformations: [...new Set(changed)].sort().map(name => ({path: name, inputSha256: before.get(name) ?? null, outputSha256: hash(files.get(name))})),
  };
  files.set('.cars-dealer-share.json', Buffer.from(json(receipt)));
  return receipt;
}

export function inspectDealerShareHtml(html, pageUrl) {
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
  const language = html.match(/<html\b[^>]*\blang\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
  const metadata = {}, links = [];
  for (const match of head.matchAll(/<(meta|link)\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi)) {
    const tag = match[0], attrs = Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(attribute => [attribute[1].toLowerCase(), decode(attribute[2] ?? attribute[3])]));
    if (match[1].toLowerCase() === 'link') links.push(attrs);
    else if (attrs.property || attrs.name) (metadata[attrs.property ?? attrs.name] ??= []).push(attrs.content ?? '');
  }
  const canonical = links.filter(link => link.rel === 'canonical').map(link => link.href);
  const favicons = links.filter(link => /^(?:icon|shortcut icon|apple-touch-icon)$/.test(link.rel ?? '')).map(link => ({href: link.href, type: link.type ?? null, sizes: link.sizes ?? null}));
  const problems = [];
  const origin = new URL(pageUrl).origin;
  if (canonical.length !== 1 || canonical.some(value => !value?.startsWith(origin + '/'))) problems.push('missing-duplicate-or-foreign-canonical');
  if (metadata['og:url']?.length !== 1 || metadata['og:url']?.[0] !== canonical[0]) problems.push('og-url-does-not-match-canonical');
  if (!metadata['og:image']?.length) problems.push('missing-og-image');
  if (metadata['og:image']?.some(value => !value.startsWith(origin + '/'))) problems.push('non-absolute-or-foreign-og-image');
  if (!favicons.length) problems.push('missing-favicon');
  return {canonical, favicons, metadata, language: language ? decode(language[1] ?? language[2]) : null, problems};
}
