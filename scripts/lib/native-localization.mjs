import { normalized, sha256 } from './workflow.mjs';
import { readTypeScriptCatalog } from './catalog-literal.mjs';
import { normalizeDealerLocale, LocalePackagingError } from './dealer-locale.mjs';

export const NATIVE_PACKAGING_VERSION = '2';
export const ADOPTION_FILE = 'localization/adoption.json';
export const NATIVE_CHECKS = Object.freeze([
  'catalog-completeness', 'hardcoded-ui', 'native-routing', 'standalone-journeys',
  'mounted-journeys', 'public-journeys', 'preferences-no-js', 'preferences-storage-disabled',
  'preferences-races', 'request-isolation', 'security-write-blocking', 'assets-preserved'
]);
const hashPattern = /^[a-f0-9]{64}$/;
const commitPattern = /^[a-f0-9]{40}$/;
export const nativePath = name => typeof name === 'string' &&
  /^(?:[\w@.()+\[\] -]+\/)*[\w@.()+\[\] -]+$/.test(name) &&
  !name.split('/').some(part => ['.', '..', '.git', 'node_modules'].includes(part) || part.startsWith('.env'));
export const nativeText = (files, name) => {
  if (!nativePath(name) || !files.has(name)) throw new Error(`Missing native source: ${name}`);
  return new TextDecoder('utf-8', { fatal: true }).decode(normalized(files.get(name)));
};
export const nativeWrite = (files, name, text) => files.set(name, Buffer.from(text));
const stableHash = value => sha256(JSON.stringify(value));

// Parse catalog JSON without executing TypeScript, getters or supplied JavaScript.
// Duplicate keys are errors, including escaped duplicates JSON.parse would discard.
export function parseCatalogJson(text, { prefix = false } = {}) {
  let at = 0;
  const fail = reason => { throw new Error(`Invalid catalog JSON at ${at}: ${reason}`); };
  const white = () => { while (at < text.length && /[ \t\r\n]/.test(text[at])) at++; };
  const token = /"(?:[^"\\\u0000-\u001f]|\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4}))*"|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null/y;
  const value = (depth = 0) => {
    if (depth > 64) fail('excessive nesting');
    white();
    if (text[at] === '{' || text[at] === '[') {
      const object = text[at++] === '{', close = object ? '}' : ']';
      const result = object ? Object.create(null) : [], keys = new Set();
      white();
      if (text[at] === close) { at++; return result; }
      while (at < text.length) {
        if (object) {
          white(); token.lastIndex = at; const keyToken = token.exec(text);
          if (!keyToken || keyToken[0][0] !== '"') fail('expected a quoted key');
          const key = JSON.parse(keyToken[0]); at = token.lastIndex; white();
          if (text[at++] !== ':') fail('expected colon');
          if (keys.has(key)) fail(`duplicate key ${key}`);
          keys.add(key); result[key] = value(depth + 1);
        } else result.push(value(depth + 1));
        white(); const next = text[at++];
        if (next === close) return result;
        if (next !== ',') fail('expected separator');
      }
      fail('unterminated object or array');
    }
    token.lastIndex = at; const match = token.exec(text);
    if (!match) fail('expected a JSON value');
    at = token.lastIndex; return JSON.parse(match[0]);
  };
  if (typeof text !== 'string' || text.length > 16 * 1024 * 1024) fail('invalid size');
  const parsed = value(); white();
  if (!prefix && at !== text.length) fail('trailing input');
  return prefix ? { value: parsed, end: at } : parsed;
}
function catalogObject(files, name, exported) {
  const text = nativeText(files, name);
  if (!exported) return parseCatalogJson(text);
  if (!['en', 'bg'].includes(exported)) throw new Error('Unsupported catalog export');
  const matches = [...text.matchAll(new RegExp(`^export const ${exported}\\s*=\\s*`, 'gm'))];
  if (matches.length !== 1) throw new Error(`Expected one JSON catalog export ${exported}: ${name}`);
  return parseCatalogJson(text.slice(matches[0].index + matches[0][0].length), { prefix: true }).value;
}
function catalogLeaves(value, prefix = '', result = new Map()) {
  if (typeof value === 'string') {
    if (!value.trim() || /TODO|TRANSLATE_ME|MISSING_TRANSLATION/.test(value)) throw new Error(`Missing catalog text: ${prefix}`);
    result.set(prefix, value);
  } else if (value && typeof value === 'object' && Object.keys(value).length) {
    for (const [key, child] of Object.entries(value)) catalogLeaves(child, `${prefix}/${JSON.stringify(key)}`, result);
  } else throw new Error(`Invalid or empty catalog node: ${prefix}`);
  return result;
}
const parameters = text => [...new Set([...text.matchAll(/\{([A-Za-z][A-Za-z0-9_]*)(?:\}|,)/g)].map(m => m[1]))].sort();
export function auditNativeCatalogs(files, key, descriptors) {
  if (!Array.isArray(descriptors) || !descriptors.length) throw new Error(`${key}: no reviewed catalogs`);
  const seen = new Set(), report = [];
  for (const item of descriptors) {
    const pair = item.format === 'esm-json-pair'
      ? ['en', 'bg'].map(locale => ({ name: item.path, exported: locale }))
      : item.format === 'json-pair' ? ['en', 'bg'].map(locale => ({ name: item[locale] }))
      : ['typescript-pair', 'typescript-rows', 'typescript-locale-object', 'typescript-source-map'].includes(item.format)
        ? ['en', 'bg'].map(locale => ({ name: item.path, exported: item.format === 'typescript-pair' ? item[locale] : item.export, typescript: true, shape: item.format, locale })) : null;
    if (!pair || pair.some(p => !nativePath(p.name))) throw new Error(`${key}: invalid catalog descriptor`);
    const identity = JSON.stringify(pair);
    if (seen.has(identity)) throw new Error(`${key}: duplicate catalog descriptor`);
    seen.add(identity);
    const catalogs = pair.map(p => {
      let data = p.typescript ? readTypeScriptCatalog(nativeText(files, `${key}/${p.name}`), p.exported) : catalogObject(files, `${key}/${p.name}`, p.exported);
      if (p.shape === 'typescript-locale-object') data = data[p.locale];
      if (p.shape === 'typescript-rows') data = Object.fromEntries(Object.entries(data).map(([name, row]) => [name, row[p.locale]]));
      if (p.shape === 'typescript-source-map') data = Object.fromEntries(Object.entries(data).map(([name, translated]) => [name, p.locale === 'en' ? translated : name]));
      return catalogLeaves(data);
    });
    const keys = [...catalogs[0].keys()].sort();
    if (JSON.stringify(keys) !== JSON.stringify([...catalogs[1].keys()].sort())) throw new Error(`${key}: EN/BG catalog keys differ`);
    for (const name of keys) {
      if (JSON.stringify(parameters(catalogs[0].get(name))) !== JSON.stringify(parameters(catalogs[1].get(name)))) {
        throw new Error(`${key}: catalog interpolation differs at ${name}`);
      }
    }
    report.push({ descriptor: item, keys: keys.length, contentDigest: stableHash(catalogs.map(c => [...c])) });
  }
  return { catalogs: report, declaredCatalogParityPassed: true, linguisticAcceptance: 'requires-reviewed-evidence-not-key-counts' };
}
export function validateNativeRelease(key, release) {
  const review = release?.qa?.nativeLocalization;
  const fail = reason => { throw new LocalePackagingError([`${key}: ${reason}`]); };
  const source = release?.source;
  const carsSourceValid = source?.repository === 'darkapoparka/cars' && source.repository === release?.repository && source.path === `templates/${key}` && source.path === release?.snapshotPath && source.revision === release?.commit && commitPattern.test(source.revision || '') && source.digest === release?.digest && commitPattern.test(source.tree || '');
  const standaloneSource = !source && release?.repository === `darkapoparka/cars-template-${key}`;
  const selectedRepository = carsSourceValid ? source.repository : release?.repository;
  const selectedRevision = carsSourceValid ? source.revision : release?.commit;
  if (release?.status !== 'approved' || !(carsSourceValid || standaloneSource) || !commitPattern.test(release.commit || '') || !hashPattern.test(release.digest || '')) fail('invalid selected release');
  if (!review || review.schemaVersion !== 1 || review.adapter !== 'native-v1' || review.commit !== selectedRevision || review.repository !== selectedRepository || (carsSourceValid && (review.sourcePath !== source.path || review.sourceTree !== source.tree))) fail('no exact-commit native acceptance');
  if (JSON.stringify([...(review.locales || [])].sort()) !== '["bg","en"]' || ![320, 390, 1440].every(w => review.widths?.includes(w))) fail('missing EN/BG viewport acceptance');
  if (!hashPattern.test(review.evidenceSha256 || '') || !Number.isFinite(Date.parse(review.verifiedAt))) fail('missing hashed acceptance evidence');
  const checks = new Map((review.checks || []).map(c => [c.name, c]));
  if (checks.size !== review.checks?.length || NATIVE_CHECKS.some(name => checks.get(name)?.status !== 'passed' || !hashPattern.test(checks.get(name)?.evidenceSha256 || ''))) fail('failing, missing or unhashed native check');
  const deployment = review.deployment;
  if (review.sourceDigest !== release.digest || !deployment || deployment.state !== 'READY' || deployment.sourceCommit !== selectedRevision || !/^dpl_[A-Za-z0-9]+$/.test(deployment.id || '') || !/^prj_[A-Za-z0-9]+$/.test(deployment.projectId || '')) fail('missing exact-source deployed release verification');
  try {
    const alias = new URL(deployment.publicAlias);
    if (alias.protocol !== 'https:' || alias.username || alias.password || alias.pathname !== '/' || alias.search || alias.hash) fail('invalid verified public alias');
  } catch { fail('invalid verified public alias'); }
  if (!Array.isArray(review.catalogs) || !review.catalogs.length) fail('missing complete catalog descriptors');
  return review;
}
export function nativeReleaseReadiness(variants, releases) {
  const blockers = [];
  for (const { key } of variants) {
    try { validateNativeRelease(key, releases?.[key]); }
    catch (error) { blockers.push(error.message); }
  }
  return { ready: blockers.length === 0, blockers };
}
export function nativeContract(manifest) {
  if (manifest.packaging?.version !== NATIVE_PACKAGING_VERSION) throw new Error('Native localization requires packaging version 2');
  const contract = normalizeDealerLocale(manifest.localization, manifest.dealerId || manifest.slug);
  if (JSON.stringify([...contract.enabledLocales].sort()) !== '["bg","en"]') throw new Error('Native v2 adoption requires complete EN/BG; additional languages stay hidden');
  if (!manifest.templateRevisions || manifest.variants.some(v => !commitPattern.test(manifest.templateRevisions[v.key] || ''))) throw new Error('Native adoption requires exact template revisions');
  if (manifest.templateSources && manifest.variants.some(({ key }) => {
    const source = manifest.templateSources[key];
    return !source || !/^[\w.-]+\/[\w.-]+$/.test(source.repository || '') || !commitPattern.test(source.revision || '') || source.revision !== manifest.templateRevisions[key] || typeof source.path !== 'string' || source.path.includes('..') || !hashPattern.test(source.digest || '') || (source.tree !== null && source.tree !== undefined && !commitPattern.test(source.tree));
  })) throw new Error('Native adoption has an invalid exact template source locator');
  return contract;
}
export function nativeInputDigest(files, manifest) {
  const prefixes = manifest.variants.map(v => `${v.key}/`);
  const inputs = [...files].filter(([name]) => prefixes.some(p => name.startsWith(p)) && name !== 'auto-best/static/preview-switcher.js')
    .map(([name, bytes]) => ({ path: name, sha256: sha256(normalized(bytes)) })).sort((a, b) => a.path.localeCompare(b.path, 'en'));
  return { digest: stableHash(inputs), files: inputs.length };
}
export function sealNativeAdoption(files, manifest, releases) {
  const contract = nativeContract(manifest);
  const selected = {};
  for (const { key } of manifest.variants) {
    const release = releases[key], review = validateNativeRelease(key, release);
    const selectedRevision = release.source?.revision || release.commit;
    if (selectedRevision !== manifest.templateRevisions[key]) throw new Error(`${key}: native release differs from selected revision`);
    if (release.source && JSON.stringify(manifest.templateSources?.[key]) !== JSON.stringify(release.source)) throw new Error(`${key}: native source locator differs from selected release`);
    auditNativeCatalogs(files, key, review.catalogs);
    selected[key] = { status: 'approved', repository: release.repository, commit: release.commit, digest: release.digest,
      ...(release.source ? { source: release.source, snapshotPath: release.snapshotPath } : {}),
      qa: { nativeLocalization: {
        schemaVersion: 1, adapter: review.adapter, repository: review.repository, commit: review.commit,
        ...(review.sourcePath ? { sourcePath: review.sourcePath } : {}), ...(review.sourceTree ? { sourceTree: review.sourceTree } : {}),
        locales: review.locales, widths: review.widths, verifiedAt: review.verifiedAt,
        evidenceSha256: review.evidenceSha256, catalogs: review.catalogs, sourceDigest: review.sourceDigest,
        deployment: Object.fromEntries(['id', 'projectId', 'state', 'sourceCommit', 'publicAlias'].map(name => [name, review.deployment[name]])),
        checks: review.checks.map(({ name, status, evidenceSha256 }) => ({ name, status, evidenceSha256 }))
      } } };
  }
  nativeWrite(files, 'localization/contract.json', JSON.stringify(contract, null, 2) + '\n');
  const receipt = { schemaVersion: 1, packagingVersion: NATIVE_PACKAGING_VERSION,
    dealerId: contract.dealerId, contractDigest: stableHash(contract), releases: selected,
    input: nativeInputDigest(files, manifest), dealerAcceptance: 'requires-dealer-build-and-public-journeys' };
  nativeWrite(files, ADOPTION_FILE, JSON.stringify(receipt, null, 2) + '\n');
  return receipt;
}
export function assertNativeAdoption(files, manifest) {
  const contract = nativeContract(manifest);
  const receipt = parseCatalogJson(nativeText(files, ADOPTION_FILE));
  if (receipt.schemaVersion !== 1 || receipt.packagingVersion !== NATIVE_PACKAGING_VERSION || receipt.dealerId !== contract.dealerId || receipt.contractDigest !== stableHash(contract)) throw new Error('Native adoption identity/contract mismatch');
  const stored = normalizeDealerLocale(parseCatalogJson(nativeText(files, 'localization/contract.json')), contract.dealerId);
  if (stableHash(stored) !== stableHash(contract)) throw new Error('Native contract changed after adoption');
  if (JSON.stringify(Object.keys(receipt.releases || {}).sort()) !== JSON.stringify(manifest.variants.map(v => v.key).sort())) throw new Error('Native release set differs from the dealer trio');
  for (const { key } of manifest.variants) {
    const release = receipt.releases[key], review = validateNativeRelease(key, release);
    const selectedRevision = release.source?.revision || release.commit;
    if (selectedRevision !== manifest.templateRevisions[key]) throw new Error(`${key}: stale native revision`);
    if (release.source && JSON.stringify(manifest.templateSources?.[key]) !== JSON.stringify(release.source)) throw new Error(`${key}: stale native source locator`);
    auditNativeCatalogs(files, key, review.catalogs);
  }
  const actual = nativeInputDigest(files, manifest);
  if (!hashPattern.test(receipt.input?.digest || '') || receipt.input.digest !== actual.digest || receipt.input.files !== actual.files) {
    throw new Error('Native source changed after adoption; regenerate and review the candidate, never bypass this seal');
  }
  return receipt;
}
