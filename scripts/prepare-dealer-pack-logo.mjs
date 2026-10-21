#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {isDeepStrictEqual} from 'node:util';
import {ROOT, sha256, inside, args} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {validPackSlug, safePackPath, encodePackJson, loadDealerPack} from './lib/dealer-pack.mjs';

const assert = (value, message) => {if (!value) throw Error(message);};
const roles = {onLight: 'on-light', onDark: 'on-dark', onAccent: 'on-accent'};
// These are the existing consumer backgrounds. Artwork never sets a palette.
export const PACK_LOGO_BACKGROUNDS = Object.freeze({onLight: ['#ffffff'], onDark: ['#111113', '#101820'], onAccent: ['#09090b', '#17191c', '#c40101']});

function reviewedInputs(source) {
  assert(!(source.reviewedInputs && source.generatedInputs), 'Choose one reviewed original/mixed or generated artwork input set');
  const inputs = source.reviewedInputs ?? source.generatedInputs;
  assert(inputs?.reviewedAt && Number.isFinite(Date.parse(inputs.reviewedAt)) && inputs.surfaceReview?.reviewed === true,
    'Logo creation requires reviewed source artwork and dated provenance');
  const rows = {master: inputs.master, mark: inputs.mark, ...(inputs.markOnDark ? {markOnDark: inputs.markOnDark} : {}),
    ...Object.fromEntries(Object.keys(roles).map(role => [role, inputs.surfaces?.[role]]))};
  return {inputs, rows, retainedAllowed: Boolean(source.reviewedInputs)};
}

function artworkProvenance(row, {slug, sourceSha256, retainedAllowed}) {
  assert(safePackPath(row?.path) && /^branding\//.test(row.path) && /^[a-f0-9]{64}$/.test(row.sha256 ?? ''), 'Use a retained branding raster and its exact hash');
  assert(row.rasterTreatment === undefined || ['solid-black', 'solid-white'].includes(row.rasterTreatment), 'Only explicit black/white alpha-preserving raster exports are supported');
  if (row.generation !== undefined && row.generation !== null) {
    assert(row.rasterTreatment === undefined, 'Solid-ink exports require a dated public original, not a generated-artwork claim');
    assert(row.retainedSource === undefined && typeof row.generation.generationId === 'string' && row.generation.generationId.trim() &&
      ['image_gen', 'image_gen.imagegen'].includes(row.generation.tool), 'Use actual imagegen provenance without a conflicting retained source');
    return {generation: row.generation};
  }
  const original = row.retainedSource;
  assert(retainedAllowed && original?.kind === 'retained-original-raster' && original.sha256 === row.sha256 &&
    typeof original.observedAt === 'string' && /^\d{4}-\d{2}-\d{2}(?:T.*Z)?$/.test(original.observedAt) && Number.isFinite(Date.parse(original.observedAt)),
    'A retained original requires its exact source hash and observation date');
  let url;
  try {url = new URL(original.url);} catch {}
  assert(url && ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password && url.hostname.includes('.') &&
    !/^(?:localhost|127\.|10\.|192\.168\.|169\.254\.)/.test(url.hostname) && ![...url.searchParams.keys()].some(key => /token|secret|signature|api.?key|password|auth/i.test(key)),
    'A retained original requires a public source URL without credentials');
  return {retainedSource: {kind: 'retained-reviewed-raster', reference: 'dealers/' + slug + '/' + row.path, sha256: row.sha256,
    reviewReference: 'dealers/' + slug + '/branding/source.json', reviewSha256: sourceSha256, sourceUrl: url.href, observedAt: original.observedAt,
    ...(row.rasterTreatment ? {exportTreatment: {kind: 'alpha-preserving-solid-ink-v1', ink: row.rasterTreatment, sourceSha256: row.sha256, newGeometry: false}} : {})}};
}

const provenanceFields = row => Object.fromEntries(['generation', 'retainedSource'].filter(key => row?.[key] !== undefined).map(key => [key, row[key]]));

export async function cropTransparentPadding(bytes, sharp, {mark = false, rasterTreatment} = {}) {
  assert(rasterTreatment === undefined || ['solid-black', 'solid-white'].includes(rasterTreatment), 'Unsupported raster treatment');
  const input = await sharp(bytes, {limitInputPixels: 64 * 1024 ** 2}).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  const {width, height, channels} = input.info; assert(channels === 4, 'Logo needs RGBA pixels');
  let x0 = width, x1 = -1, y0 = height, y1 = -1, empty = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const alpha = input.data[(y * width + x) * 4 + 3]; if (alpha === 0) empty++;
    if (alpha >= 24) {x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);}
  }
  assert(x1 >= x0 && empty > width * height * .25, 'Logo requires substantial real transparency and visible artwork');
  const padding = Math.max(2, Math.ceil(Math.max(x1 - x0 + 1, y1 - y0 + 1) * .025));
  const left = Math.max(0, x0 - padding), top = Math.max(0, y0 - padding), right = Math.min(width, x1 + padding + 1), bottom = Math.min(height, y1 + padding + 1);
  // A requested monochrome surface uses exactly the original alpha silhouette.
  // No background removal, new letters, tracing or invented geometry is allowed.
  let prepared = sharp(bytes);
  if (rasterTreatment) {
    const pixels = Buffer.from(input.data), ink = rasterTreatment === 'solid-white' ? 255 : 0;
    for (let at = 0; at < pixels.length; at += 4) pixels.fill(ink, at, at + 3);
    prepared = sharp(pixels, {raw: {width, height, channels: 4}});
  }
  const cropped = prepared.extract({left, top, width: right - left, height: bottom - top});
  const png = await (mark ? cropped.resize(512, 512, {fit: 'contain', background: '#00000000'}) : cropped.resize({width: 1024})).png().toBuffer();
  return {png, operation: 'crop-transparent-padding-and-resize', sourceSha256: sha256(bytes), sha256: sha256(png), crop: {left, top, width: right - left, height: bottom - top},
    ...(rasterTreatment ? {rasterTreatment: {kind: 'alpha-preserving-solid-ink-v1', ink: rasterTreatment, originalAlphaUnchangedBeforeCropAndResize: true, newGeometry: false}} : {})};
}

function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16); header.writeUInt16LE(1, 2); header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({size, png}, i) => {const at = 6 + i * 16; header[at] = size; header[at + 1] = size; header.writeUInt16LE(1, at + 4); header.writeUInt16LE(32, at + 6); header.writeUInt32LE(png.length, at + 8); header.writeUInt32LE(offset, at + 12); offset += png.length;});
  return Buffer.concat([header, ...images.map(row => row.png)]);
}

export async function prepareDealerPackLogo({root = ROOT, slug, persist = true, sourceFiles, sourceDirectory,
  toolPackage = process.env.CARS_DEALER_PACK_TOOL_PACKAGE ?? path.join(root, 'runtime/dealer-pack-tools/package.json')} = {}) {
  assert(validPackSlug(slug), 'Use a bounded dealer pack slug');
  const directory = sourceDirectory ? inside(root, path.relative(root, sourceDirectory), {mustExist: true}) : inside(root, 'dealers/' + slug, {mustExist: true});
  assert(!sourceDirectory || persist === false, 'A source-directory override is only valid for in-memory logo preparation');
  const read = name => sourceFiles?.has(name) ? sourceFiles.get(name) : fs.readFileSync(inside(directory, name, {mustExist: true}));
  const sourceBytes = read('branding/source.json'), source = JSON.parse(sourceBytes), {inputs, rows, retainedAllowed} = reviewedInputs(source);
  const manifestFile = path.join(directory, 'dealer.json'), manifest = sourceFiles?.has('dealer.json') || fs.existsSync(manifestFile) ? JSON.parse(read('dealer.json')) : null;
  const compact = manifest?.pack?.schemaVersion === 2, generatedFiles = new Map();
  const sharp = createRequire(path.resolve(toolPackage))('sharp');
  assert(sharp.versions.sharp === '0.35.5', 'Use sharp 0.35.5 for deterministic logo exports');
  // Validate every original and generation before an export can replace files.
  const artwork = Object.fromEntries(Object.entries(rows).map(([role, row]) => {
    const provenance = artworkProvenance(row, {slug, retainedAllowed, sourceSha256: sha256(sourceBytes)});
    const bytes = read(row.path);
    assert(sha256(bytes) === row.sha256, (provenance.generation ? 'Generated' : 'Retained') + ' source artwork changed: ' + row.path);
    return [role, {bytes, provenance}];
  }));
  const save = (name, bytes) => {
    generatedFiles.set(name, bytes);
    if (persist && (!compact || name.endsWith('.json'))) {const file = inside(directory, name); fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, bytes);}
    return {path: name, sha256: sha256(bytes)};
  };
  const assets = {}, transforms = {}, surfaces = {}, supplemental = {};
  for (const [role, name] of Object.entries(roles)) {
    const row = inputs.surfaces[role], result = await cropTransparentPadding(artwork[role].bytes, sharp, {rasterTreatment: row.rasterTreatment});
    const pngPath = 'branding/logo-' + name + '.png', webpPath = 'dealer-brand/logo-' + name + '.webp';
    save(pngPath, result.png); save('dealer-brand/logo-' + name + '.png', result.png);
    const webp = await sharp(result.png).webp({lossless: true, effort: 6}).toBuffer(); save(webpPath, webp);
    assets[role] = {sourcePath: pngPath, publicPath: '/' + webpPath, sha256: sha256(webp), sourceSha256: sha256(result.png)};
    transforms[role] = {...result, png: undefined, sourcePath: row.path, outputPath: pngPath};
    surfaces[role] = {path: pngPath, sha256: sha256(result.png), ...artwork[role].provenance, sourceReference: 'dealers/' + slug + '/' + row.path};
  }
  const master = await cropTransparentPadding(artwork.master.bytes, sharp, {rasterTreatment: inputs.master.rasterTreatment}), mark = await cropTransparentPadding(artwork.mark.bytes, sharp, {mark: true, rasterTreatment: inputs.mark.rasterTreatment});
  for (const [role, result] of [['master', master], ['mark', mark]]) if (result.rasterTreatment) transforms[role] = {...result, png: undefined, sourcePath: rows[role].path};
  save('branding/logo-master.png', master.png); save('branding/logo-mark.png', mark.png);
  const darkMarkInput = inputs.markOnDark;
  const darkMarkResult = darkMarkInput ? await cropTransparentPadding(artwork.markOnDark.bytes, sharp, {mark: true, rasterTreatment: darkMarkInput.rasterTreatment}) : null;
  const darkMark = darkMarkResult?.png ?? null;
  if (darkMarkResult?.rasterTreatment) transforms.markOnDark = {...darkMarkResult, png: undefined, sourcePath: darkMarkInput.path};
  for (const [name, png] of [['on-light', mark.png], ['on-dark', darkMark ?? mark.png]]) {
    const webp = await sharp(png).webp({lossless: true, effort: 6}).toBuffer();
    const role = name === 'on-dark' && darkMarkInput ? 'markOnDark' : 'mark', input = rows[role];
    supplemental['mark-' + name + '.webp'] = {...save('dealer-brand/mark-' + name + '.webp', webp),
      ...artwork[role].provenance, sourceReference: 'dealers/' + slug + '/' + input.path};
  }
  save('branding/app-icon.png', mark.png);
  supplemental['app-icon.png'] = {...save('dealer-brand/app-icon.png', mark.png),
    ...artwork.mark.provenance, sourceReference: 'dealers/' + slug + '/' + inputs.mark.path};
  const favicon = ico(await Promise.all([16, 32, 48, 64].map(async size => ({size, png: await sharp(mark.png).resize(size, size).png().toBuffer()}))));
  supplemental['favicon.ico'] = {...save('dealer-brand/favicon.ico', favicon),
    ...artwork.mark.provenance, sourceReference: 'dealers/' + slug + '/' + inputs.mark.path};
  const contract = {schemaVersion: 1, dealer: slug, reviewed: true, reviewedAt: inputs.reviewedAt,
    status: Object.values(artwork).every(row => row.provenance.retainedSource) && !Object.values(rows).some(row => row.rasterTreatment) ? 'retained-original-preview-not-dealer-approved' : 'independent-proposal-not-dealer-approved', creationMethod: source.creationMethod,
    assets, surfaceBackgrounds: PACK_LOGO_BACKGROUNDS,
    master: {path: 'branding/logo-master.png', sha256: sha256(master.png), ...artwork.master.provenance},
    mark: {path: 'branding/logo-mark.png', sha256: sha256(mark.png), ...artwork.mark.provenance},
    favicon: {path: 'dealer-brand/favicon.ico', sha256: sha256(favicon)},
    surfaces, transforms, supplemental, markOnDarkReady: Boolean(darkMark), originalArtworkPreserved: true,
    visualReview: {reviewed: true, reviewedAt: inputs.reviewedAt, source: 'branding/source.json', spelling: 'agent-visual-review', dealerApproval: false}};
  if (darkMarkInput) {
    save('branding/logo-mark-on-dark.png', darkMark);
    contract.markOnDark = {path: 'branding/logo-mark-on-dark.png', sha256: sha256(darkMark), ...artwork.markOnDark.provenance};
  }
  save('branding/logo-contract.json', encodePackJson(contract));
  if (manifest) {
    if (manifest.shareIdentity) {
      manifest.shareIdentity.logo = {sourcePath: 'branding/logo-on-light.png', sha256: assets.onLight.sourceSha256,
        faviconSourcePath: 'branding/app-icon.png', faviconSha256: sha256(mark.png)};
      save('dealer.json', encodePackJson(manifest));
    }
  }
  const recipe = {schemaVersion: 1, kind: 'cars-dealer-pack-logo-recipe', dealer: slug, transformVersion: Object.values(rows).some(row => row.rasterTreatment) ? 'transparent-crop-solid-ink-v1' : 'transparent-crop-v1',
    toolchain: {...sharp.versions}, sourceSha256: sha256(sourceBytes), contractSha256: sha256(encodePackJson(contract)),
    outputs: [...generatedFiles].filter(([name]) => /\.(?:png|webp|ico)$/.test(name)).sort(([a], [b]) => a.localeCompare(b, 'en'))
      .map(([name, bytes]) => ({path: name, bytes: bytes.length, sha256: sha256(bytes)}))};
  if (compact) save('branding/logo-recipe.json', encodePackJson(recipe));
  return {dealer: slug, files: 20 + (darkMark ? 1 : 0), status: contract.status, markOnDarkReady: contract.markOnDarkReady,
    ...(persist ? {committedExportPolicy: compact ? 'recipe-and-originals-only' : 'legacy-expanded'} : {generatedFiles, contract, recipe})};
}

/** Hydration never writes into the source pack. Every generated byte must match its retained recipe. */
export async function loadPreparedDealerPack(root = ROOT, slug, options = {}) {
  const pack = loadDealerPack(root, slug, options);
  // Keep the physical committed inventory separate from regenerated assembly inputs.
  pack.sourceFiles = new Map(pack.files);
  if (!pack.logoRecipe) return pack;
  const recipe = pack.logoRecipe;
  assert(recipe.schemaVersion === 1 && recipe.kind === 'cars-dealer-pack-logo-recipe' && recipe.dealer === slug && ['transparent-crop-v1', 'transparent-crop-solid-ink-v1'].includes(recipe.transformVersion) &&
    recipe.sourceSha256 === sha256(pack.files.get('branding/source.json')) && recipe.contractSha256 === sha256(pack.files.get('branding/logo-contract.json')), 'Logo regeneration recipe or retained source changed');
  const generated = await prepareDealerPackLogo({root, slug, toolPackage: options.toolPackage, persist: false, sourceFiles: pack.files});
  assert(isDeepStrictEqual(recipe.toolchain, generated.recipe.toolchain), 'Logo recipe requires its exact retained sharp/libvips toolchain');
  assert(recipe.transformVersion === generated.recipe.transformVersion && isDeepStrictEqual(recipe.outputs, generated.recipe.outputs), 'Deterministic logo regeneration differs from its reviewed byte inventory');
  assert(generated.generatedFiles.get('branding/logo-contract.json').equals(pack.files.get('branding/logo-contract.json')), 'Regenerated logo provenance differs from the retained contract');
  for (const row of recipe.outputs) {
    const bytes = generated.generatedFiles.get(row.path);
    assert(bytes && bytes.length === row.bytes && sha256(bytes) === row.sha256, 'Regenerated logo export changed: ' + row.path);
    if (pack.files.has(row.path)) assert(pack.files.get(row.path).equals(bytes), 'Retained duplicate logo export differs: ' + row.path);
    pack.files.set(row.path, bytes);
  }
  return {...pack, hydratedFiles: pack.files.size, hydratedBytes: [...pack.files.values()].reduce((sum, bytes) => sum + bytes.length, 0), logoRegeneration: {verified: true, files: recipe.outputs.length, sourceUnchanged: true}};
}

export function readPackBranding(pack) {
  const contract = pack.branding, get = row => {const bytes = pack.files.get(row.path); assert(bytes && sha256(bytes) === row.sha256, 'Prepared logo changed: ' + row.path); return bytes;};
  assert(contract?.markOnDarkReady, 'Prepare the reviewed dark compact mark before building');
  const sourceBytes = pack.files.get('branding/source.json'); assert(sourceBytes, 'Prepared logo source provenance is missing');
  const {rows, retainedAllowed} = reviewedInputs(JSON.parse(sourceBytes)), slug = contract.dealer;
  const proofs = Object.fromEntries(Object.entries(rows).map(([role, row]) => {
    const proof = artworkProvenance(row, {slug, retainedAllowed, sourceSha256: sha256(sourceBytes)}), bytes = pack.files.get(row.path);
    assert(bytes && sha256(bytes) === row.sha256, 'Prepared source artwork changed: ' + row.path); return [role, proof];
  }));
  for (const role of ['master', 'mark', 'markOnDark']) assert(isDeepStrictEqual(provenanceFields(contract[role]), proofs[role]), 'Prepared logo provenance missing or changed: ' + role);
  const surfaces = Object.fromEntries(Object.entries(contract.surfaces).map(([role, row]) => {
    assert(isDeepStrictEqual(provenanceFields(row), proofs[role]), 'Prepared logo provenance missing or changed: ' + role);
    return [role, {png: get(row), sha256: row.sha256, ...proofs[role], sourceReference: row.sourceReference}];
  }));
  // The maintained reviewed pack supports supplemental rasters under its
  // retained/mixed mode; each generated supplemental asset keeps its real ID.
  const supplemental = {};
  for (const [name, role] of [['mark-on-light.webp', 'mark'], ['mark-on-dark.webp', 'markOnDark'], ['app-icon.png', 'mark'], ['favicon.ico', 'mark']]) {
    const row = contract.supplemental?.[name];
    assert(row?.path === 'dealer-brand/' + name && isDeepStrictEqual(provenanceFields(row), proofs[role]), 'Prepared supplemental logo provenance missing or changed: ' + name);
    const bytes = get(row);
    supplemental[name] = {bytes, sha256: row.sha256, ...proofs[role], sourceReference: row.sourceReference};
  }
  return {master: {png: get(contract.master), sha256: contract.master.sha256, markPng: get(contract.mark), markSha256: contract.mark.sha256},
    reviewedSurfaces: {schemaVersion: 1, reviewed: true, reviewedAt: contract.reviewedAt, sourceMode: 'retained-or-mixed-raster', surfaces, assets: supplemental}};
}

if (isEntrypoint(import.meta.url)) {
  const options = args(process.argv.slice(2), ['slug', 'tool-package']);
  prepareDealerPackLogo({slug: options.slug, toolPackage: options['tool-package']}).then(report => console.log(JSON.stringify(report, null, 2))).catch(error => {console.error(error.message); process.exitCode = 1;});
}
