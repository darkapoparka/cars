import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { copySource } from './copy-source.mjs';
import { verifyTemplate } from './template-release.mjs';
import { packageDealer } from './package-dealer.mjs';
import { verifyPackage } from './export-dealer.mjs';
import { loadDealerProfile } from './lib/client-refresh-normalize.mjs';
import { applyRefreshAdapter } from './lib/client-refresh-adapters.mjs';
import { assertTemplatePresentation } from './lib/client-refresh-presentation.mjs';
import { applyDealerLogoContract } from './lib/client-logo-contract.mjs';
import { copyDealerDirectories, copyReferencedAssets } from './refresh-client.mjs';
import { dealerGuidance } from './lib/dealer-guidance.mjs';
import { ROOT, args, git, json, validateManifest, writeJson, sha256, fingerprint } from './lib/workflow.mjs';

const exists = (file) => fs.existsSync(file);
const skip = new Set(['.git', 'node_modules', '.vercel', '.next', '.svelte-kit', '.turbo', 'build', 'dist', 'runtime', 'coverage', 'test-results', 'playwright-report']);
const rootFiles = ['.gitignore', 'README.md', 'CLIENT.md', 'DEPLOYMENT.md', 'business-facts.json', 'stock.json', 'FACTS-AND-INVENTORY.json'];

function copyTree(source, target) {
  const stat = fs.lstatSync(source);
  if (stat.isSymbolicLink()) throw new Error(`Refusing source symlink: ${source}`);
  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
      if (skip.has(entry.name) || entry.name.startsWith('.env')) continue;
      copyTree(path.join(source, entry.name), path.join(target, entry.name));
    }
    return;
  }
  if (!stat.isFile()) throw new Error(`Unsupported source entry: ${source}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function required(value, label, pattern) {
  const result = String(value || '').trim();
  if (!result || (pattern && !pattern.test(result))) throw new Error(`Missing or invalid ${label}`);
  return result;
}

function normalizeManifest(oldManifest, profile, releases, slug, repository) {
  const country = required(profile.business.countryCode, `${slug} country code`, /^[A-Z]{2}$/);
  const currency = required(profile.business.currency, `${slug} inventory currency`, /^[A-Z]{3}$/);
  const defaultLocale = country === 'BG' ? 'bg' : 'en';
  const manifest = structuredClone(oldManifest);
  manifest.schemaVersion = 1;
  manifest.slug = slug;
  manifest.dealerId = manifest.dealerId || slug;
  manifest.repository = repository;
  manifest.defaultBranch = 'main';
  manifest.language = defaultLocale;
  manifest.packaging = { version: '2' };
  manifest.localization = {
    schemaVersion: 1,
    dealerId: manifest.dealerId,
    defaultLocale,
    enabledLocales: ['en', 'bg'],
    dealerCountry: country,
    inventoryCurrency: currency
  };
  manifest.switcher = {
    ...(manifest.switcher || {}),
    language: defaultLocale,
    accent: /^#[0-9a-f]{6}$/i.test(profile.business.accent || '') ? profile.business.accent : (manifest.switcher?.accent || '#2563eb')
  };
  manifest.templateRevisions = Object.fromEntries(manifest.variants.map(({ key }) => [key, releases[key].commit]));
  return validateManifest(manifest);
}

async function build({ clientRoot, slug, output, repository }) {
  const source = fs.realpathSync(clientRoot);
  const dealerFile = path.join(source, 'dealer.json');
  if (!exists(dealerFile)) throw new Error(`Missing dealer manifest: ${dealerFile}`);
  const oldManifest = validateManifest(json(dealerFile));
  if (oldManifest.slug !== slug) throw new Error(`Dealer manifest slug differs: ${oldManifest.slug}`);
  if (oldManifest.repository !== repository) throw new Error(`Dealer repository differs: ${oldManifest.repository}`);
  if (!Array.isArray(oldManifest.variants) || oldManifest.variants.length !== 3) throw new Error('Expected the registered three-design package');

  const profile = loadDealerProfile(source, slug);
  const releases = Object.fromEntries(oldManifest.variants.map(({ key }) => [key, verifyTemplate(ROOT, key)]));
  const manifest = normalizeManifest(oldManifest, profile, releases, slug, repository);
  const carsCommit = required(git(ROOT, ['rev-parse', 'HEAD']), 'Cars source commit', /^[a-f0-9]{40}$/);
  const area = fs.mkdtempSync(path.join(os.tmpdir(), `cars-localization-${slug}-`));
  const seed = path.join(area, 'source');
  const destination = path.resolve(output);
  fs.mkdirSync(seed, { recursive: true });

  try {
    const variants = [];
    for (const variant of manifest.variants) {
      const key = variant.key;
      const oldVariant = path.join(source, key);
      if (!exists(oldVariant)) throw new Error(`${slug}: missing existing ${key} source`);
      const snapshot = path.join(ROOT, releases[key].snapshotPath);
      const candidate = path.join(seed, key);
      await copySource(snapshot, candidate, { key });
      const changed = applyRefreshAdapter({ key, oldVariant, candidate, profile });
      changed.push(...copyDealerDirectories(oldVariant, candidate, key, slug));
      changed.push(...copyReferencedAssets(oldVariant, candidate, key, changed));
      changed.push(...applyDealerLogoContract({ key, oldVariant, candidate, profile }));
      assertTemplatePresentation({ key, template: snapshot, candidate, profile });
      variants.push({
        key,
        commit: releases[key].commit,
        digest: releases[key].digest,
        changed: [...new Set(changed)].sort()
      });
    }

    for (const name of rootFiles) {
      const from = path.join(source, name);
      if (exists(from)) copyTree(from, path.join(seed, name));
    }
    for (const relative of manifest.extraAssets || []) {
      const from = path.join(source, relative);
      if (!exists(from)) throw new Error(`${slug}: declared extra asset is missing: ${relative}`);
      copyTree(from, path.join(seed, relative));
    }
    writeJson(path.join(seed, 'dealer.json'), manifest);

    fs.rmSync(destination, { recursive: true, force: true });
    await packageDealer({
      source: seed,
      destination,
      manifest,
      sourceCommit: carsCommit,
      nativeReleases: releases,
      guidance: dealerGuidance({ slug, variants: manifest.variants, workflowCommit: carsCommit })
    });
    const verified = verifyPackage(destination);
    const adoptionFile = path.join(destination, 'localization/adoption.json');
    const contractFile = path.join(destination, 'localization/contract.json');
    if (!exists(adoptionFile) || !exists(contractFile)) throw new Error(`${slug}: native localization receipts were not packaged`);
    const adoption = json(adoptionFile);
    if (adoption.dealerAcceptance !== 'requires-dealer-build-and-public-journeys') throw new Error(`${slug}: unexpected native adoption state`);
    const report = {
      schemaVersion: 1,
      slug,
      repository,
      carsCommit,
      sourceCommit: process.env.GITHUB_SHA || null,
      packageDigest: verified.digest,
      contractSha256: sha256(fs.readFileSync(contractFile)),
      adoptionSha256: sha256(fs.readFileSync(adoptionFile)),
      outputFingerprint: fingerprint(destination),
      localization: manifest.localization,
      variants
    };
    console.log(JSON.stringify(report, null, 2));
    return report;
  } finally {
    fs.rmSync(area, { recursive: true, force: true });
  }
}

async function main() {
  const options = args(process.argv.slice(2), ['client-root', 'slug', 'output', 'repository']);
  await build({
    clientRoot: path.resolve(required(options['client-root'], '--client-root')),
    slug: required(options.slug, '--slug', /^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    output: path.resolve(required(options.output, '--output')),
    repository: required(options.repository, '--repository', /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/)
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}

export { build as buildLocalizedClient };
