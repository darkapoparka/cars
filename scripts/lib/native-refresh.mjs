import fs from 'node:fs';
import path from 'node:path';
import { packageDealer, validatePackagingManifest } from '../package-dealer.mjs';
import { verifyPackage } from '../export-dealer.mjs';
import { verifyTemplate, selectedTemplateSource } from '../template-release.mjs';
import { materializeTemplateSource } from './template-source.mjs';
import { ROOT, git, inside, json, writeJson, filesAt, sha256, normalized, fingerprint } from './workflow.mjs';
import { normalizeDealerLocale } from './dealer-locale.mjs';
import { nativePath, nativeReleaseReadiness, auditNativeCatalogs } from './native-localization.mjs';

const skipped = new Set(['.git', 'node_modules', '.vercel', '.svelte-kit', '.next', '.turbo', 'dist', 'build', 'runtime', '.audit']);
const sourceFiles = directory => filesAt(directory, { filter: name => !name.split('/').some(part => skipped.has(part) || part.startsWith('.env') || part.startsWith('.next-')) });
const sourceState = directory => sourceFiles(directory).map(name => ({ path: name, sha256: sha256(fs.readFileSync(path.join(directory, name))) }));
const digest = value => sha256(JSON.stringify(value));
const workflowState = root => digest(sourceState(path.join(root, 'scripts')));
const readMap = directory => new Map(sourceFiles(directory).map(name => [name, fs.readFileSync(path.join(directory, name))]));
const publicAsset = name => /^(?:modern\/apps\/web\/public|(?:auto-best|import|carwow)\/static)\/.+\.(?:png|webp|jpe?g|avif|svg|ico|woff2?|mp4|webm|pdf)$/i.test(name);
const overlayBoundary = name => nativePath(name) && (
  /^(?:auto-best|import|carwow)\/src\/lib\/(?:config|content|data)\/.+\.(?:ts|json)$/.test(name) ||
  /^modern\/packages\/(?:marketplace\/lead-site\.ts|marketplace-domain\/testing\/.+\.(?:ts|json))$/.test(name) ||
  /^(?:auto-best|modern|import|carwow)\/localization\/.+\.json$/.test(name)
);
const same = (a, b) => a && b && normalized(a).equals(normalized(b));
function writeMap(directory, files) {
  fs.mkdirSync(directory, { recursive: true });
  for (const [name, bytes] of files) {
    if (!nativePath(name)) throw new Error(`Invalid refresh file: ${name}`);
    const file = path.join(directory, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes);
  }
}
function applyOverlay({ files, prior, overlay, manifest, releases, client }) {
  if (overlay.schemaVersion !== 1 || overlay.dealerId !== manifest.localization.dealerId || digest(overlay.templateRevisions) !== digest(manifest.templateRevisions)) throw new Error('Dealer overlay identity or exact template revisions differ');
  if (overlay.review?.status !== 'passed' || !/^[a-f0-9]{64}$/.test(overlay.review.evidenceSha256 || '') || JSON.stringify([...(overlay.review.locales || [])].sort()) !== '["bg","en"]') throw new Error('Native refresh requires reviewed EN/BG dealer-owned copy, not a country-selected monolingual overlay');
  const used = new Set(), decisions = new Map((overlay.assets || []).map(item => [item.path, item]));
  if (decisions.size !== (overlay.assets || []).length) throw new Error('Duplicate asset decision');
  for (const [name, bytes] of prior) {
    if (!publicAsset(name)) continue;
    const candidate = files.get(name);
    if (!candidate || candidate.equals(bytes)) { files.set(name, bytes); continue; }
    const decision = decisions.get(name);
    if (!decision || decision.beforeSha256 !== sha256(bytes) || decision.templateSha256 !== sha256(candidate) || !decision.reason?.trim() || !['dealer', 'template'].includes(decision.keep)) throw new Error(`Unreviewed dealer/template asset conflict: ${name}`);
    if (decision.keep === 'dealer') {
      if (/(?:hero|banner|background|showroom)/i.test(name)) throw new Error(`Template artwork cannot be overridden by a dealer asset decision: ${name}`);
      files.set(name, bytes);
    }
    decisions.delete(name);
  }
  if (decisions.size) throw new Error('Stale or extraneous asset decision');
  for (const item of overlay.files || []) {
    if (!overlayBoundary(item.path) || used.has(item.path) || !nativePath(item.source) || !item.source.startsWith('localization/dealer-files/')) throw new Error(`Unsupported or duplicate native dealer overlay: ${item.path}`);
    used.add(item.path);
    const key = item.path.split('/')[0];
    if (!releases[key] || !item.reason?.trim()) throw new Error('Overlay must describe a selected design and review reason');
    const bytes = fs.readFileSync(inside(client, item.source, { mustExist: true }));
    if (sha256(bytes) !== item.sha256 || (files.has(item.path) ? sha256(files.get(item.path)) : null) !== item.templateSha256) throw new Error(`Dealer overlay source or template changed: ${item.path}`);
    files.set(item.path, bytes);
  }
  for (const { key } of manifest.variants) {
    if (!used.size || ![...used].some(name => name.startsWith(key + '/'))) throw new Error(`${key}: missing reviewed dealer data overlay`);
    auditNativeCatalogs(files, key, overlay.catalogs?.[key]);
  }
}
export async function planNativeClientRefresh({ root = ROOT, slug, localeConfig, overlayFile, readGit = git }) {
  const client = inside(root, `clients/${slug}`, { mustExist: true });
  const oldManifest = json(path.join(client, 'dealer.json'));
  const registryPath = path.join(root, 'docs/DEPLOYMENT-INVENTORY.json');
  const registryBytes = fs.readFileSync(registryPath), registry = JSON.parse(registryBytes);
  const record = registry.dealers?.find(item => item.slug === slug);
  if (!record || record.sourceOwnership !== 'cars-canonical' || oldManifest.sourceOwnership === 'independent-repository' || record.repository !== oldManifest.repository || oldManifest.slug !== slug) throw new Error('Native refresh requires the exact registered Cars-canonical source/repository; independent and legacy CLI sources remain separate');
  if (readGit(root, ['branch', '--show-current']) !== 'main') throw new Error('Native refresh uses the saved Cars main checkout');
  const workflowCommit = readGit(root, ['rev-parse', 'HEAD']);
  if (!/^[a-f0-9]{40}$/.test(workflowCommit)) throw new Error('Missing immutable Cars source');
  const workflowDigest = workflowState(root);
  const before = sourceState(client), prior = readMap(client), releases = {};
  const manifest = structuredClone(oldManifest);
  manifest.localization = normalizeDealerLocale(localeConfig || manifest.localization, manifest.dealerId || slug);
  manifest.packaging = { ...manifest.packaging, version: '2' };
  manifest.language = manifest.localization.defaultLocale;
  manifest.templateRevisions = {};
  manifest.templateSources = {};
  const sourceRefs = {};
  for (const { key } of manifest.variants) {
    releases[key] = verifyTemplate(root, key);
    sourceRefs[key] = selectedTemplateSource(releases[key]);
    manifest.templateRevisions[key] = sourceRefs[key].revision;
    manifest.templateSources[key] = sourceRefs[key];
  }
  validatePackagingManifest(manifest);
  const readiness = nativeReleaseReadiness(manifest.variants, releases);
  if (!readiness.ready) throw new Error(readiness.blockers.join('\n'));
  const overlayPath = inside(client, overlayFile || 'localization/dealer-overlay.json', { mustExist: true });
  const overlayBytes = fs.readFileSync(overlayPath), overlay = JSON.parse(overlayBytes);
  const parent = inside(root, `runtime/client-refresh/${slug}`); fs.mkdirSync(parent, { recursive: true });
  const runDir = fs.mkdtempSync(path.join(parent, 'native-'));
  const files = new Map([...prior].filter(([name]) => !manifest.variants.some(v => name.startsWith(v.key + '/'))));
  for (const { key } of manifest.variants) {
    const directory = path.join(runDir, 'templates', key);
    await materializeTemplateSource({ root, key, release: releases[key], source: sourceRefs[key], destination: directory });
    for (const item of fingerprint(directory).files) files.set(`${key}/${item.path}`, fs.readFileSync(path.join(directory, item.path)));
  }
  applyOverlay({ files, prior, overlay, manifest, releases, client });
  files.set('dealer.json', Buffer.from(JSON.stringify(manifest, null, 2) + '\n'));
  const seed = path.join(runDir, 'source'), candidate = path.join(runDir, 'candidate');
  writeMap(seed, files);
  await packageDealer({ source: seed, destination: candidate, manifest, sourceCommit: workflowCommit, nativeReleases: releases,
    guidance: prior.get('AGENTS.md')?.toString('utf8') });
  const prepared = verifyPackage(candidate), candidateMap = readMap(candidate);
  const controlled = new Set([...candidateMap.keys(), ...[...prior.keys()].filter(name => manifest.variants.some(v => name.startsWith(v.key + '/')))]);
  const changes = [...controlled].filter(name => !same(prior.get(name), candidateMap.get(name))).sort().map(name => ({
    path: name, before: prior.has(name) ? sha256(prior.get(name)) : null,
    after: candidateMap.has(name) ? sha256(candidateMap.get(name)) : null
  }));
  const report = { schemaVersion: 1, mode: 'native-reviewed-overlay', slug, repository: manifest.repository, workflowCommit, workflowDigest,
    source: client, before, sourceDigest: digest(before), manifest, runDir, candidate,
    publicationIdentity: { projectId: record.delivery?.projectId, publicAlias: record.delivery?.url ? new URL(record.delivery.url).href : null },
    candidateDigest: prepared.digest, changes, releases, registrySha256: sha256(registryBytes),
    overlayPath, overlaySha256: sha256(overlayBytes), needsDealerQA: true, readyToPublish: false };
  assertInputs(report, root, readGit);
  writeJson(path.join(runDir, 'proposal.json'), report);
  return report;
}
function assertInputs(plan, root, readGit) {
  if (workflowState(root) !== plan.workflowDigest) throw new Error('Cars workflow changed during native refresh');
  if (readGit(root, ['rev-parse', 'HEAD']) !== plan.workflowCommit || readGit(root, ['branch', '--show-current']) !== 'main') throw new Error('Cars main changed during native refresh');
  if (digest(sourceState(plan.source)) !== plan.sourceDigest) throw new Error('Dealer source changed during native refresh; preserve the other writer');
  if (sha256(fs.readFileSync(path.join(root, 'docs/DEPLOYMENT-INVENTORY.json'))) !== plan.registrySha256 || sha256(fs.readFileSync(plan.overlayPath)) !== plan.overlaySha256) throw new Error('Registry or dealer overlay changed during native refresh');
  for (const [key, release] of Object.entries(plan.releases)) if (digest(verifyTemplate(root, key)) !== digest(release)) throw new Error(`Template release changed during native refresh: ${key}`);
  if (verifyPackage(plan.candidate).digest !== plan.candidateDigest) throw new Error('Native refresh candidate changed after review');
}
export async function refreshNativeClient(options) {
  const { root = ROOT, slug, write = false, readGit = git, beforeInstall, afterWrite } = options;
  const dirty = () => readGit(root, ['status', '--porcelain=v1', '--untracked-files=all', '--', `clients/${slug}`]).trim();
  if (write && readGit(root, ['status', '--porcelain=v1', '--untracked-files=all', '--', 'scripts']).trim()) throw new Error('Cars workflow inputs are uncommitted; commit the reviewed integration before refreshing a dealer');
  if (write && dirty()) throw new Error('Dealer source is dirty before native refresh; preserve and reconcile it first');
  const plan = await planNativeClientRefresh({ ...options, root, readGit });
  if (!write) return plan;
  const rollback = verifiedRollback(options.rollbackReceipt, plan);
  const lock = inside(root, `runtime/client-refresh/${slug}/.native-write-lock`);
  fs.mkdirSync(lock); // A colliding writer is never displaced or treated as stale automatically.
  const applied = [], rollbackConflicts = [];
  try {
    if (beforeInstall) await beforeInstall(plan);
    assertInputs(plan, root, readGit);
    if (dirty()) throw new Error('Dealer source became dirty during native refresh');
    const backup = path.join(plan.runDir, 'rollback');
    writeJson(path.join(plan.runDir, 'rollback.json'), { repository: plan.repository, sourceCommit: plan.workflowCommit,
      sourceDigest: plan.sourceDigest, files: plan.before, candidateDigest: plan.candidateDigest,
      deployment: verifiedRollback(rollback, plan), assets: plan.before.filter(item => publicAsset(item.path)),
      publication: 'No publication here. Use this exact rollback source/deployment if subsequent dealer acceptance fails.' });
    for (const change of plan.changes) {
      const target = inside(plan.source, change.path), saved = path.join(backup, change.path);
      const current = fs.existsSync(target) ? sha256(fs.readFileSync(target)) : null;
      if (current !== change.before) throw new Error(`Concurrent native source write: ${change.path}`);
      if (change.before !== null) { fs.mkdirSync(path.dirname(saved), { recursive: true }); fs.copyFileSync(target, saved); }
      if (change.after === null) fs.unlinkSync(target);
      else {
        const candidateFile = inside(plan.candidate, change.path, { mustExist: true }), bytes = fs.readFileSync(candidateFile);
        if (sha256(bytes) !== change.after) throw new Error(`Native candidate changed during installation: ${change.path}`);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, bytes, { flag: change.before === null ? 'wx' : 'w' });
      }
      applied.push(change);
      if (afterWrite) afterWrite(change);
    }
    const expected = new Map(plan.before.map(item => [item.path, item.sha256]));
    for (const change of plan.changes) { if (change.after === null) expected.delete(change.path); else expected.set(change.path, change.after); }
    const actual = new Map(sourceState(plan.source).map(item => [item.path, item.sha256]));
    if (expected.size !== actual.size || [...expected].some(([name, hash]) => actual.get(name) !== hash)) throw new Error('Dealer source changed during native installation');
    for (const [key, release] of Object.entries(plan.releases)) if (digest(verifyTemplate(root, key)) !== digest(release)) throw new Error('Template release changed during installation');
    if (readGit(root, ['rev-parse', 'HEAD']) !== plan.workflowCommit || sha256(fs.readFileSync(path.join(root, 'docs/DEPLOYMENT-INVENTORY.json'))) !== plan.registrySha256) throw new Error('Cars source or publication registry changed during installation');
    if (workflowState(root) !== plan.workflowDigest) throw new Error('Cars workflow changed during native installation');
    const result = { ...plan, written: true, noOp: plan.changes.length === 0, sourceAfter: digest(sourceState(plan.source)), state: 'needs-dealer-build-and-public-QA' };
    writeJson(path.join(plan.runDir, 'refresh.json'), result);
    return result;
  } catch (error) {
    for (const change of applied.reverse()) {
      const target = path.join(plan.source, change.path);
      const current = fs.existsSync(target) ? sha256(fs.readFileSync(target)) : null;
      if (current !== change.after) { rollbackConflicts.push(change.path); continue; }
      if (change.before === null) fs.unlinkSync(target);
      else { fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(path.join(plan.runDir, 'rollback', change.path), target); }
    }
    writeJson(path.join(plan.runDir, 'failure.json'), { error: error.message, rollbackConflicts, sourceAfter: digest(sourceState(plan.source)) });
    if (rollbackConflicts.length) error.message += `; preserved competing writes at ${rollbackConflicts.join(', ')}`;
    throw error;
  } finally { fs.rmdirSync(lock); }
}

function verifiedRollback(receipt, plan) {
  const value = receipt && structuredClone(receipt), expected = plan.publicationIdentity;
  if (!value || value.schemaVersion !== 1 || value.repository !== plan.repository || value.state !== 'READY' ||
      !/^[a-f0-9]{40}$/.test(value.sourceCommit || '') || !/^dpl_[A-Za-z0-9]+$/.test(value.deploymentId || '') ||
      !/^prj_[A-Za-z0-9]+$/.test(value.projectId || '') || !/^[a-f0-9]{64}$/.test(value.evidenceSha256 || '')) {
    throw new Error('Native write requires an exact verified rollback source/deployment receipt');
  }
  const age = Date.now() - Date.parse(value.verifiedAt);
  if (!Number.isFinite(age) || age < -60_000 || age > 3_600_000) throw new Error('Refresh the rollback deployment/public alias verification before writing');
  let alias;
  try { alias = new URL(value.publicAlias); } catch { throw new Error('Invalid rollback public alias'); }
  if (alias.protocol !== 'https:' || alias.username || alias.password || alias.pathname !== '/' || alias.search || alias.hash ||
      value.projectId !== expected?.projectId || alias.href !== expected?.publicAlias) throw new Error('Rollback project or public alias differs from the registered dealer');
  return value;
}
