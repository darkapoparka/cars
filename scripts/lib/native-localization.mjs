import fs from 'node:fs';
import { ROOT, inside, normalized, sha256 } from './workflow.mjs';
import { validateFileInventory, verifyInventoryBytes } from './uk-cloudflare-artifacts.mjs';
import { readTypeScriptCatalog } from './catalog-literal.mjs';
import { normalizeDealerLocale, LocalePackagingError } from './dealer-locale.mjs';

export const NATIVE_PACKAGING_VERSION = '2';
export const ADOPTION_FILE = 'localization/adoption.json';
export const NATIVE_QUALIFICATION_KIND = 'cars-native-source-qualification';
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
const sameSource = (left, right) => left && right &&
  JSON.stringify(Object.keys(left).sort()) === JSON.stringify(Object.keys(right).sort()) &&
  ['repository','revision','path','tree','digest'].every(field => left[field] === right[field]);
const cloudflareKeys = ['auto-best', 'modern', 'import', 'app', 'mobile', 'karento-best'];
const canonical = value => JSON.stringify(value, (_, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
const cloudflareProofNames = ['artifactManifest', 'singleWorkerReceipt', 'deploymentReceipt', 'hostedReceipt'];
const cloudflareDeploymentFields = ['provider', 'accountId', 'workerName', 'publicAlias', 'deploymentId', 'versionId',
  'versionTraffic', 'liveBindings', 'workerCount', 'applicationCount', 'serviceBindings', 'sourceCommit', 'sourceTree',
  'inputDigest', 'sourceReleases', 'artifactDigest', 'outputDigest', 'sourcePublication', ...cloudflareProofNames];
const nativeAcceptanceFields = ['schemaVersion', 'adapter', 'repository', 'commit', 'sourcePath', 'sourceTree',
  'locales', 'widths', 'verifiedAt', 'evidenceSha256', 'catalogs', 'sourceDigest', 'checks'];
const pick = (value, fields) => Object.fromEntries(fields.map(field => [field, value[field]]));
const uuid = value => typeof value === 'string' && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value);
const passedChecks = (checks, required) => {
  if (!Array.isArray(checks)) return false;
  const entries = new Map(checks.map(check => [check?.name, check]));
  return entries.size === checks.length && required.every(name => entries.get(name)?.status === 'passed' && hashPattern.test(entries.get(name)?.evidenceSha256 || ''));
};

// Original provider receipts stay separate from independently collected hosted acceptance.
// References live with committed release evidence, never in coordinator runtime directories.
function readCloudflareProofs(deployment, root) {
  const references = cloudflareProofNames.map(name => deployment[name]);
  if (references.some(ref => !ref || canonical(Object.keys(ref).sort()) !== canonical(['reference', 'sha256']) ||
      !nativePath(ref.reference) || !ref.reference.startsWith('docs/releases/') || !ref.reference.endsWith('.json') ||
      !hashPattern.test(ref.sha256 || '')) || new Set(references.map(ref => ref.reference)).size !== references.length) {
    throw new Error('Cloudflare proof requires distinct hashed repository-relative docs/releases JSON references');
  }
  return Object.fromEntries(cloudflareProofNames.map((name, index) => {
    const ref = references[index], file = inside(root, ref.reference, { mustExist: true });
    if (fs.realpathSync(file) !== file) throw new Error('Cloudflare proof must use its canonical physical docs/releases path without links');
    const stat = fs.statSync(file);
    if (!stat.isFile() || stat.size <= 0 || stat.size > 8 * 1024 ** 2) throw new Error('Cloudflare proof JSON exceeds the bounded file limit');
    const bytes = fs.readFileSync(file);
    if (bytes.length !== stat.size || sha256(bytes) !== ref.sha256) throw new Error('Cloudflare original proof bytes differ: ' + name);
    return [name, { bytes, value: parseCatalogJson(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) }];
  }));
}

function validateCloudflareNativeDeployment(key, release, review, root) {
  const d = review.deployment, fail = reason => { throw new Error('Cloudflare native deployment: ' + reason); };
  if (!release.source || !cloudflareKeys.includes(key) || ['id', 'projectId', 'state'].some(name => Object.hasOwn(d, name)) ||
      !/^[a-f0-9]{32}$/.test(d.accountId || '') || !/^[a-z0-9][a-z0-9-]{0,62}$/.test(d.workerName || '') ||
      !uuid(d.deploymentId) || !uuid(d.versionId) || !commitPattern.test(d.sourceCommit || '') || !commitPattern.test(d.sourceTree || '') ||
      ['inputDigest', 'artifactDigest', 'outputDigest'].some(name => !hashPattern.test(d[name] || '')) ||
      d.workerCount !== 1 || d.applicationCount !== 6 || canonical(d.serviceBindings) !== '[]' ||
      d.versionTraffic?.length !== 1 || d.versionTraffic[0].version_id !== d.versionId || d.versionTraffic[0].percentage !== 100 ||
      d.liveBindings?.length !== 1 || d.liveBindings[0].type !== 'assets' || d.liveBindings[0].name !== 'ASSETS' ||
      ['service', 'environment', 'entrypoint'].some(name => Object.hasOwn(d.liveBindings[0], name))) fail('invalid singleton identity, active traffic or ASSETS-only bindings');
  if (canonical(Object.keys(d.sourceReleases || {}).sort()) !== canonical([...cloudflareKeys].sort()) || cloudflareKeys.some(name => {
    const source = d.sourceReleases[name];
    return !source || canonical(Object.keys(source).sort()) !== canonical(['digest', 'path', 'repository', 'revision', 'tree']) ||
      source.repository !== 'darkapoparka/cars' || source.path !== 'templates/' + name ||
      !commitPattern.test(source.revision || '') || !commitPattern.test(source.tree || '') || !hashPattern.test(source.digest || '');
  }) || !sameSource(d.sourceReleases[key], release.source)) fail('six exact source release locators differ');
  const publication = d.sourcePublication;
  if (publication?.repository !== 'darkapoparka/cars' || publication.commit !== d.sourceCommit || publication.sourceTree !== d.sourceTree ||
      publication.ref !== 'refs/heads/main' || !Number.isFinite(Date.parse(publication.publishedAt)) ||
      typeof publication.evidence !== 'string' || !publication.evidence.trim() || !commitPattern.test(publication.verifiedMainCommit || '')) fail('compiled dealer source publication differs');
  const proofs = readCloudflareProofs(d, root), inventory = proofs.artifactManifest.value,
    composer = proofs.singleWorkerReceipt.value, deployed = proofs.deploymentReceipt.value, hosted = proofs.hostedReceipt.value;
  validateFileInventory(inventory);
  if (inventory.kind !== 'existing-fleet-cloudflare-single-worker' || inventory.status !== 'passed' || inventory.dealer !== composer.dealer ||
      inventory.digest !== d.artifactDigest) fail('original artifact inventory differs');
  verifyInventoryBytes(inventory, 'single-worker-receipt.json', proofs.singleWorkerReceipt.bytes);
  if (composer.schemaVersion !== 1 || composer.type !== 'cars-existing-fleet-single-worker-provider-package' || composer.hostedVerified !== false ||
      composer.sourceApplicationBytesChanged !== false || composer.compiledApplicationBytesChanged !== true ||
      composer.workerCount !== 1 || composer.applicationCount !== 6 ||
      canonical(composer.composition) !== canonical({ inProcess: cloudflareKeys, serviceBindings: [] }) ||
      canonical(composer.frameworkGlobalScopes) !== canonical(['modern', 'app', 'mobile']) ||
      !/^[1-9][0-9]{0,14}$/.test(String(composer.runId)) || !/^[1-9][0-9]{0,14}$/.test(String(composer.attempt))) fail('original singleton composer receipt differs');
  const pins = composer.artifacts;
  if (canonical(Object.keys(pins || {}).sort()) !== canonical([...cloudflareKeys, 'router'].sort()) || Object.values(pins).some(pin =>
      !hashPattern.test(pin.digest || '') || !hashPattern.test(pin.compiledDigest || ''))) fail('seven original compiled input pins are required');
  if (!Array.isArray(composer.files) || sha256(JSON.stringify(composer.files)) !== d.outputDigest ||
      canonical(inventory.files.filter(row => !['single-worker-receipt.json', 'dealer-composition-review.json', 'delivery-receipt.json'].includes(row.path))) !== canonical(composer.files) ||
      composer.files.some(row => row.path !== 'wrangler.json' && !row.path.startsWith('server/') && !row.path.startsWith('public/'))) fail('original composer payload bindings differ');
  const payloadPaths = new Set(composer.files.map(row => row.path));
  if (['wrangler.json','server/worker.mjs','server/router.mjs',...cloudflareKeys.map(name => 'server/' + name + (['modern','app','mobile'].includes(name) ? '/index.js' : '/index.mjs'))]
      .some(name => !payloadPaths.has(name)) || !composer.files.some(row => row.path.startsWith('public/'))) fail('missing compiled applications, router/config or public assets');
  if (deployed.schemaVersion !== 1 || deployed.type !== 'cars-existing-fleet-single-worker-deployment' || deployed.status !== 'deployed' ||
      deployed.deployments !== 1 || deployed.hostedVerified !== false || deployed.ownerAccepted !== false ||
      deployed.client !== composer.dealer || String(deployed.runId) !== String(composer.runId) || String(deployed.attempt) !== String(composer.attempt) ||
      !Number.isFinite(Date.parse(deployed.finishedAt))) fail('original deployment receipt differs');
  if (hosted.schemaVersion !== 1 || hosted.type !== 'cars-existing-fleet-single-worker-hosted-acceptance' || hosted.status !== 'passed' ||
      hosted.unauthenticated !== true || hosted.client !== deployed.client || !Number.isFinite(Date.parse(hosted.verifiedAt)) ||
      Date.parse(hosted.verifiedAt) < Date.parse(deployed.finishedAt) ||
      ['artifactManifest', 'singleWorkerReceipt', 'deploymentReceipt'].some(name => canonical(hosted[name]) !== canonical(d[name]))) fail('independent hosted acceptance is missing or differs');
  const identityFields = ['accountId', 'workerName', 'sourceCommit', 'sourceTree', 'inputDigest', 'sourceReleases', 'outputDigest', 'workerCount', 'applicationCount'];
  for (const original of [composer, deployed, hosted]) {
    if (original.publicOrigin !== d.publicAlias || identityFields.some(name => canonical(original[name]) !== canonical(d[name]))) fail('linked provider/source identity differs');
  }
  for (const original of [deployed, hosted]) {
    if (['artifactDigest', 'sourcePublication', 'deploymentId', 'versionId', 'versionTraffic', 'liveBindings', 'serviceBindings']
      .some(name => canonical(original[name]) !== canonical(d[name]))) fail('linked active version/artifact differs');
  }
  if (canonical(Object.keys(hosted.applications || {}).sort()) !== canonical([...cloudflareKeys].sort()) || cloudflareKeys.some(name => {
    const application = hosted.applications[name];
    return application?.status !== 'passed' || !sameSource(application.source, d.sourceReleases[name]) ||
      !passedChecks(application.checks, ['mounted-journeys', 'public-journeys', 'assets-preserved']);
  })) fail('all six genuine mounted/public/assets acceptances are required');
  const nativeFamilies = Object.keys(hosted.nativeLocalization || {});
  if (['auto-best', 'modern', 'import'].some(name => !nativeFamilies.includes(name)) || nativeFamilies.some(name => !cloudflareKeys.includes(name) || (() => {
    const acceptance = hosted.nativeLocalization[name], source = d.sourceReleases[name];
    return !acceptance || Object.hasOwn(acceptance, 'deployment') || acceptance.schemaVersion !== 1 || acceptance.adapter !== 'native-v1' ||
      acceptance.repository !== source.repository || acceptance.commit !== source.revision || acceptance.sourcePath !== source.path ||
      acceptance.sourceTree !== source.tree || acceptance.sourceDigest !== source.digest ||
      canonical([...(acceptance.locales || [])].sort()) !== '["bg","en"]' || ![320,390,1440].every(width => acceptance.widths?.includes(width)) ||
      !Array.isArray(acceptance.catalogs) || !acceptance.catalogs.length || !hashPattern.test(acceptance.evidenceSha256 || '') ||
      !Number.isFinite(Date.parse(acceptance.verifiedAt)) || Date.parse(acceptance.verifiedAt) < Date.parse(deployed.finishedAt) ||
      Date.parse(acceptance.verifiedAt) > Date.parse(hosted.verifiedAt) || !passedChecks(acceptance.checks, NATIVE_CHECKS);
  })())) fail('missing or failing exact-source native family acceptance');
  const acceptance = hosted.nativeLocalization?.[key];
  if (!acceptance || Object.hasOwn(acceptance, 'deployment') ||
      canonical(pick(acceptance, nativeAcceptanceFields)) !== canonical(pick(review, nativeAcceptanceFields)) ||
      Date.parse(review.verifiedAt) < Date.parse(deployed.finishedAt) || Date.parse(review.verifiedAt) > Date.parse(hosted.verifiedAt)) fail('hosted exact-template native journeys/evidence differ');
}

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
export function validateNativeRelease(key, release, { root = ROOT } = {}) {
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
  if (review.sourceDigest !== release.digest || !deployment) fail('missing exact-source deployed release verification');
  if (deployment.provider === 'cloudflare') {
    try { validateCloudflareNativeDeployment(key, release, review, root); }
    catch (error) { fail(error.message); }
  } else if ((deployment.provider !== undefined && deployment.provider !== 'vercel') || deployment.state !== 'READY' ||
      deployment.sourceCommit !== selectedRevision || !/^dpl_[A-Za-z0-9]+$/.test(deployment.id || '') || !/^prj_[A-Za-z0-9]+$/.test(deployment.projectId || '')) fail('missing exact-source deployed release verification');
  try {
    const alias = new URL(deployment.publicAlias);
    if (alias.protocol !== 'https:' || alias.username || alias.password || alias.pathname !== '/' || alias.search || alias.hash) fail('invalid verified public alias');
  } catch { fail('invalid verified public alias'); }
  if (!Array.isArray(review.catalogs) || !review.catalogs.length) fail('missing complete catalog descriptors');
  return review;
}
export function nativeReleaseReadiness(variants, releases, options) {
  const blockers = [];
  for (const { key } of variants) {
    try { validateNativeRelease(key, releases?.[key], options); }
    catch (error) { blockers.push(error.message); }
  }
  return { ready: blockers.length === 0, blockers };
}
export function validateNativeQualificationContext(context, {dealer} = {}) {
  if (context?.schemaVersion !== 1 || context.kind !== 'cars-native-source-qualification-context' ||
      !/^[a-z0-9][a-z0-9-]{0,95}$/.test(context.id || '') || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(context.dealer || '') ||
      (dealer && context.dealer !== dealer) || context.scope !== 'existing-dealer-pilot' || context.reviewed !== true ||
      !Number.isFinite(Date.parse(context.reviewedAt)) || !commitPattern.test(context.sourceCommit || '') ||
      context.nativeApproval !== false || context.hostedApproval !== false || context.globalReleaseApproval !== false ||
      !hashPattern.test(context.approvedLockSha256 || '') || !hashPattern.test(context.candidateLockSha256 || '')) {
    throw new Error('Explicit reviewed dealer source qualification context is required; this is not native release approval');
  }
  const delta = context.sourceDeltaReview;
  if (!delta || !nativePath(delta.reference) || !hashPattern.test(delta.sha256 || '') || !Number.isFinite(Date.parse(delta.reviewedAt))) throw new Error('Qualification requires a dated hashed source delta review');
  return context;
}

/** Candidate-only provenance. The old accepted release stays attached to its original source. */
export function validateTemplateQualification(key, release, context, options) {
  validateNativeQualificationContext(context);
  const source = release?.source, qualification = release?.qualification, qa = qualification?.sourceQA;
  if (release?.status !== 'qualification' || release.repository !== 'darkapoparka/cars' || release.commit !== context.sourceCommit ||
      source?.repository !== release.repository || source.revision !== release.commit || source.path !== `templates/${key}` ||
      release.snapshotPath !== source.path || !commitPattern.test(source.tree || '') || !hashPattern.test(source.digest || '') || source.digest !== release.digest ||
      qualification?.contextId !== context.id || release.qa?.nativeLocalization ||
      JSON.stringify(qualification.sourceDeltaReview) !== JSON.stringify(context.sourceDeltaReview)) throw new Error(`${key}: invalid provisional source qualification or false native acceptance`);
  const parent = qa?.approvedRelease;
  if (parent?.status !== 'approved' || !commitPattern.test(parent.commit || '') || !hashPattern.test(parent.digest || '') ||
      !hashPattern.test(qa.releaseSha256 || '') || stableHash(parent) !== qa.releaseSha256 ||
      qa.reference !== parent.qa?.evidence || !nativePath(qa.reference) || !hashPattern.test(qa.sha256 || '') ||
      qa.verifiedAt !== parent.qa?.verifiedAt || !Number.isFinite(Date.parse(qa.verifiedAt))) throw new Error(`${key}: qualification has no exact approved source QA parent`);
  if (['auto-best','modern','import','carwow'].includes(key)) validateNativeRelease(key, parent, options);
  if (JSON.stringify(qualification.catalogs) !== JSON.stringify(parent.qa?.nativeLocalization?.catalogs || [])) throw new Error(`${key}: qualification catalog descriptors differ from the reviewed source QA parent`);
  return qualification;
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
export function sealNativeAdoption(files, manifest, releases, options) {
  const contract = nativeContract(manifest);
  const selected = {};
  for (const { key } of manifest.variants) {
    const release = releases[key], review = validateNativeRelease(key, release, options);
    const selectedRevision = release.source?.revision || release.commit;
    if (selectedRevision !== manifest.templateRevisions[key]) throw new Error(`${key}: native release differs from selected revision`);
    if (release.source && !sameSource(manifest.templateSources?.[key], release.source)) throw new Error(`${key}: native source locator differs from selected release`);
    auditNativeCatalogs(files, key, review.catalogs);
    selected[key] = { status: 'approved', repository: release.repository, commit: release.commit, digest: release.digest,
      ...(release.source ? { source: release.source, snapshotPath: release.snapshotPath } : {}),
      qa: { nativeLocalization: {
        schemaVersion: 1, adapter: review.adapter, repository: review.repository, commit: review.commit,
        ...(review.sourcePath ? { sourcePath: review.sourcePath } : {}), ...(review.sourceTree ? { sourceTree: review.sourceTree } : {}),
        locales: review.locales, widths: review.widths, verifiedAt: review.verifiedAt,
        evidenceSha256: review.evidenceSha256, catalogs: review.catalogs, sourceDigest: review.sourceDigest,
        deployment: review.deployment.provider === 'cloudflare' ? structuredClone(pick(review.deployment, cloudflareDeploymentFields)) :
          Object.fromEntries(['id', 'projectId', 'state', 'sourceCommit', 'publicAlias'].map(name => [name, review.deployment[name]])),
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
export function sealNativeQualification(files, manifest, releases, context, options) {
  validateNativeQualificationContext(context, {dealer:manifest.slug});
  const contract = nativeContract(manifest), selected = {}, catalogs = {};
  for (const {key} of manifest.variants) {
    const release = releases[key];
    const descriptors = release?.status === 'qualification' ? validateTemplateQualification(key,release,context,options).catalogs : validateNativeRelease(key,release,options).catalogs;
    if ((release.source?.revision || release.commit) !== manifest.templateRevisions[key] ||
        (release.source && !sameSource(manifest.templateSources?.[key],release.source))) throw new Error(`${key}: qualification source differs from selected dealer source`);
    catalogs[key] = auditNativeCatalogs(files,key,descriptors);
    selected[key] = structuredClone(release);
  }
  nativeWrite(files,'localization/contract.json',JSON.stringify(contract,null,2)+'\n');
  const receipt = {schemaVersion:2,kind:NATIVE_QUALIFICATION_KIND,packagingVersion:NATIVE_PACKAGING_VERSION,
    dealerId:contract.dealerId,contractDigest:stableHash(contract),context:structuredClone(context),contextDigest:stableHash(context),
    releases:selected,catalogs,input:nativeInputDigest(files,manifest),nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,
    pendingNativeChecks:[...NATIVE_CHECKS],dealerAcceptance:'requires-current-source-build-and-hosted-native-journeys'};
  nativeWrite(files,ADOPTION_FILE,JSON.stringify(receipt,null,2)+'\n');
  return receipt;
}

export function assertNativeQualification(files, manifest, context, options) {
  validateNativeQualificationContext(context,{dealer:manifest.slug});
  const contract = nativeContract(manifest), receipt = parseCatalogJson(nativeText(files,ADOPTION_FILE));
  if (receipt.schemaVersion !== 2 || receipt.kind !== NATIVE_QUALIFICATION_KIND || receipt.packagingVersion !== NATIVE_PACKAGING_VERSION ||
      receipt.dealerId !== contract.dealerId || receipt.contractDigest !== stableHash(contract) || receipt.contextDigest !== stableHash(context) ||
      stableHash(receipt.context) !== stableHash(context) || receipt.nativeApproval !== false || receipt.hostedApproval !== false || receipt.globalReleaseApproval !== false ||
      JSON.stringify(receipt.pendingNativeChecks) !== JSON.stringify(NATIVE_CHECKS)) throw new Error('Native source qualification identity/context changed or falsely claims acceptance');
  const stored = normalizeDealerLocale(parseCatalogJson(nativeText(files,'localization/contract.json')),contract.dealerId);
  if (stableHash(stored) !== stableHash(contract)) throw new Error('Native qualification locale contract changed');
  if (JSON.stringify(Object.keys(receipt.releases || {}).sort()) !== JSON.stringify(manifest.variants.map(v=>v.key).sort())) throw new Error('Native qualification release set differs from dealer source');
  for (const {key} of manifest.variants) {
    const release = receipt.releases[key];
    const descriptors = release?.status === 'qualification' ? validateTemplateQualification(key,release,context,options).catalogs : validateNativeRelease(key,release,options).catalogs;
    if ((release.source?.revision || release.commit) !== manifest.templateRevisions[key] ||
        (release.source && !sameSource(manifest.templateSources?.[key],release.source))) throw new Error(`${key}: stale qualification source locator`);
    if (stableHash(auditNativeCatalogs(files,key,descriptors)) !== stableHash(receipt.catalogs?.[key])) throw new Error(`${key}: qualification catalog audit changed`);
  }
  const actual = nativeInputDigest(files,manifest);
  if (!hashPattern.test(receipt.input?.digest || '') || receipt.input.digest !== actual.digest || receipt.input.files !== actual.files) throw new Error('Native source changed after qualification; reseal and review the candidate');
  return receipt;
}
export function assertNativeAdoption(files, manifest, options) {
  const contract = nativeContract(manifest);
  const receipt = parseCatalogJson(nativeText(files, ADOPTION_FILE));
  if (receipt.kind === NATIVE_QUALIFICATION_KIND || receipt.schemaVersion === 2) throw new Error('Provisional native source qualification is not an approved release; ordinary publication is refused');
  if (receipt.schemaVersion !== 1 || receipt.packagingVersion !== NATIVE_PACKAGING_VERSION || receipt.dealerId !== contract.dealerId || receipt.contractDigest !== stableHash(contract)) throw new Error('Native adoption identity/contract mismatch');
  const stored = normalizeDealerLocale(parseCatalogJson(nativeText(files, 'localization/contract.json')), contract.dealerId);
  if (stableHash(stored) !== stableHash(contract)) throw new Error('Native contract changed after adoption');
  if (JSON.stringify(Object.keys(receipt.releases || {}).sort()) !== JSON.stringify(manifest.variants.map(v => v.key).sort())) throw new Error('Native release set differs from the dealer trio');
  for (const { key } of manifest.variants) {
    const release = receipt.releases[key], review = validateNativeRelease(key, release, options);
    const selectedRevision = release.source?.revision || release.commit;
    if (selectedRevision !== manifest.templateRevisions[key]) throw new Error(`${key}: stale native revision`);
    if (release.source && !sameSource(manifest.templateSources?.[key], release.source)) throw new Error(`${key}: stale native source locator`);
    auditNativeCatalogs(files, key, review.catalogs);
  }
  const actual = nativeInputDigest(files, manifest);
  if (!hashPattern.test(receipt.input?.digest || '') || receipt.input.digest !== actual.digest || receipt.input.files !== actual.files) {
    throw new Error('Native source changed after adoption; regenerate and review the candidate, never bypass this seal');
  }
  return receipt;
}
