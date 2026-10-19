#!/usr/bin/env node
/** Personalize exact Cars subtrees in an ignored workspace using the maintained
 * adapters. No clients/ source, Git refs, release approval or provider is changed. */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {ROOT, git, sha256, inside, args, writeJson} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {loadDealerPack, PACK_KEYS, encodePackJson, safePackPath} from './lib/dealer-pack.mjs';
import {readPinnedTemplateTree} from './dealer-updates/pinned-template-source.mjs';
import {loadDealerProfile} from './lib/client-refresh-normalize.mjs';
import {applyRefreshAdapter} from './lib/client-refresh-adapters.mjs';
import {retainDealerVariantAssets, applyExtendedRefreshAdapter, sealExtendedVariant} from './lib/client-refresh-six.mjs';
import {prepareAppDealer, sealAppDealerSource} from './lib/app-dealer-adapter.mjs';
import {collectSource, packageRetainsPath} from './package-dealer.mjs';
import {regenerateDealerCatalogs} from './dealer-updates/update-dealer-template.mjs';
import {applyLeadBranding, assertLeadBranding} from './publishing/lead-branding.mjs';
import {bindPreparedShareLogo} from './prepare-existing-fleet-source.mjs';
import {readPackBranding} from './prepare-dealer-pack-logo.mjs';
import {adoptNativeQualification} from './publishing/native-mounts.mjs';
import {assertNativeQualification} from './lib/native-localization.mjs';
import {baseNativeManifest, assertAppVariant} from './publishing/app-variant.mjs';
import {assertExtendedVariantSources} from './publishing/six-variant.mjs';
import {resolveShareIdentity} from './publishing/dealer-share.mjs';
import {safeArtifactPath} from './lib/uk-cloudflare-artifacts.mjs';
import {adaptPackImportFacts} from './lib/dealer-pack-import-facts.mjs';
import {applyDealerPackOptionalContact} from './lib/dealer-pack-optional-contact.mjs';
import {validateNewSourceCopyReview, newSourceReviewedCopy} from './prepare-new-dealer-source.mjs';

const assert = (value, message) => {if (!value) throw Error(message);};
const trees = new Map();
// Historical reports/screenshots have no runtime consumer. Licenses and assets
// remain in the exact source, and source integrity is verified BEFORE filtering.
export const retainPackTemplatePath = name => packageRetainsPath(name) && !name.split('/').includes('docs') && !/^(?:README|HANDOFF|SOURCES|DEPLOYMENT|CLIENT)\.md$/i.test(name);

export function writePackSource(directory, files) {
  for (const [name, bytes] of files) {
    assert(safeArtifactPath(name), 'Unsafe generated source path: ' + name);
    const target = inside(directory, name); fs.mkdirSync(path.dirname(target), {recursive: true}); fs.writeFileSync(target, bytes);
  }
}

function readTemplate(root, key, source) {
  const id = fs.realpathSync(root) + ':' + key + ':' + source.tree + ':' + source.digest;
  if (!trees.has(id)) trees.set(id, readPinnedTemplateTree({key, repositoryPath: root, source, expectedDigest: source.digest}).tree);
  return trees.get(id);
}

/** Branding may rebind derived logo URLs, but it cannot silently change the
 * factual profile from which the App inventory was adapted. */
export function bindPackAppBrandingProvenance(files, provenance, branding) {
  const rows = (branding.derivedProfileLogoBindings ?? []).filter(row => row.path === provenance.profile);
  const current = files.get(provenance.profile);
  assert(current, 'Missing adapted App factual profile');
  if (sha256(current) === provenance.profileSha256) return provenance;
  assert(rows.length === 1 && rows[0].factualFieldsUnchanged === true &&
    rows[0].beforeSha256 === provenance.profileSha256 && rows[0].afterSha256 === sha256(current),
  'App profile changed outside the verified derived-logo binding');
  return {...provenance, profileSha256: rows[0].afterSha256,
    derivedProfileLogoBinding: rows[0],
    logoPolicy: 'Reviewed dealer-pack raster proposal, bound without changing non-logo facts.'};
}

export async function assembleDealerPack({root = ROOT, slug, out, materialize = true, toolPackage = process.env.CARS_DEALER_PACK_TOOL_PACKAGE ?? path.join(root, 'runtime/dealer-pack-tools/package.json')} = {}) {
  const started = Date.now(), pack = loadDealerPack(root, slug), manifest = structuredClone(pack.manifest);
  fs.mkdirSync(path.join(root, 'runtime'), {recursive: true});
  const directory = inside(root, path.relative(root, path.resolve(out ?? path.join(root, 'runtime/dealer-packs', slug, 'assembly'))));
  assert(directory.startsWith(path.join(fs.realpathSync(root), 'runtime') + path.sep), 'Assemble only below the ignored runtime directory');
  assert(!fs.existsSync(directory), 'Assembly already exists; use a fresh output to retain previous evidence');
  fs.mkdirSync(directory, {recursive: true});
  const sharp = createRequire(path.resolve(toolPackage))('sharp');
  assert(sharp.versions.sharp === '0.35.5', 'Use the pinned dealer-pack raster toolchain (sharp 0.35.5)');
  const sourceReleases = manifest.templateSources, metadata = {schemaVersion: 1, state: 'personalized-needs-build', readyToPublish: false, publicUrl: null,
    hosting: {provider: 'cloudflare', status: 'not-deployed'}, qa: {desktop: false, mobile: false, identity: false, contactPath: false}};
  let initial = new Map();
  for (const key of PACK_KEYS) {
    const source = sourceReleases[key];
    assert(git(root, ['rev-parse', source.revision + ':' + source.path]) === source.tree, 'Pinned subtree changed: ' + key);
    for (const [name, bytes] of readTemplate(root, key, source)) if (retainPackTemplatePath(name)) initial.set(key + '/' + name, bytes);
    initial.set(key + '/.client/project.json', encodePackJson({...metadata, dealer: slug, template: key, source}));
  }
  for (const [name, bytes] of pack.files) if (!['dealer.json', 'qualification.json', 'identity-review.json', 'missing-facts.json', 'source-evidence.json'].includes(name)) initial.set(name, bytes);
  initial.set('dealer.json', encodePackJson(manifest));
  writePackSource(directory, initial); initial = null;
  const profile = loadDealerProfile(directory, slug);
  profile.factPolicy = 'dealer-pack-optional-v1';
  const copyReview = pack.files.has('copy-review.json') ? validateNewSourceCopyReview(JSON.parse(pack.files.get('copy-review.json')),
    {...manifest, inputs: {stock: {sha256: sha256(pack.files.get('stock.json'))}}}, pack.stock) : null;
  const reviewedModernCopy = newSourceReviewedCopy(profile, copyReview);
  assert(profile.sourceCount === pack.stock.records.length && profile.listings.length === pack.stock.records.length, 'Maintained normalization dropped an authoritative stock record');
  for (const {key} of manifest.variants.slice(0, 3)) {
    const assets = new Map(); retainDealerVariantAssets(assets, key, profile, directory); writePackSource(directory, assets);
    applyRefreshAdapter({key, oldVariant: path.join(directory, key), candidate: path.join(directory, key), profile,
      ...(['modern', 'import'].includes(key) && reviewedModernCopy ? {reviewedModernCopy} : {})});
  }
  let files = await collectSource(directory, manifest);
  applyDealerPackOptionalContact(files, manifest, {profile, typescript: createRequire(path.resolve(toolPackage))('typescript')});
  adaptPackImportFacts(files, profile);
  const app = await prepareAppDealer(directory, manifest, {factPolicy: profile.factPolicy, appFiles: new Map([...files].filter(([name]) => name.startsWith('app/')).map(([name, bytes]) => [name.slice(4), bytes]))});
  for (const [name, bytes] of app.files) files.set('app/' + name, bytes);
  const adaptations = {};
  for (const key of ['mobile', 'karento-best']) adaptations[key] = applyExtendedRefreshAdapter({files, key, profile, client: directory});
  writePackSource(directory, files);
  await regenerateDealerCatalogs(directory, root, PACK_KEYS, {toolPackage});
  files = await collectSource(directory, manifest);
  const branding = readPackBranding(pack);
  const brand = await applyLeadBranding(files, manifest, {...branding, sharp,
    readTemplate: (locator, name, optional) => {
      const bytes = readTemplate(root, locator.path.slice('templates/'.length), locator).get(name);
      if (!bytes && optional) return null; assert(bytes, 'Missing pinned template palette input: ' + name); return bytes.toString('utf8');
    }});
  bindPreparedShareLogo(files, manifest, brand); resolveShareIdentity(files, manifest);
  files = adoptNativeQualification(files, baseNativeManifest(manifest), pack.lock.templates, pack.qualification, {root});
  sealAppDealerSource({files, manifest, provenance: bindPackAppBrandingProvenance(files, app.provenance, brand)});
  for (const key of ['mobile', 'karento-best']) sealExtendedVariant({files, key, manifest, profile, adaptation: adaptations[key]});
  assertNativeQualification(files, baseNativeManifest(manifest), pack.qualification, {root});
  assertLeadBranding(files, manifest); assertAppVariant(files, manifest); assertExtendedVariantSources(files, manifest);
  files.set('dealer.json', encodePackJson(manifest));
  if (materialize) writePackSource(directory, files);
  const report = {schemaVersion: 1, kind: 'cars-dealer-pack-assembly', dealer: slug, packDigest: pack.packDigest,
    sourceCommit: pack.qualification.sourceCommit, sourceTree: git(root, ['rev-parse', pack.qualification.sourceCommit + '^{tree}']), sourceReleases,
    sourceFiles: files.size, sourceBytes: [...files.values()].reduce((sum, bytes) => sum + bytes.length, 0),
    inputFiles: pack.fileCount, inputBytes: pack.bytes, milliseconds: Date.now() - started,
    nativeApproval: false, hostedApproval: false, globalReleaseApproval: false, providerWrites: false};
  writeJson(path.join(directory, 'assembly-report.json'), report);
  return {...report, files, sourceRoot: directory, manifest, qualification: pack.qualification};
}

if (isEntrypoint(import.meta.url)) {
  const options = args(process.argv.slice(2), ['slug', 'out', 'tool-package']);
  assembleDealerPack({slug: options.slug, out: options.out, toolPackage: options['tool-package']}).then(({files, manifest, ...report}) => console.log(JSON.stringify(report, null, 2))).catch(error => {console.error(error.stack); process.exitCode = 1;});
}
