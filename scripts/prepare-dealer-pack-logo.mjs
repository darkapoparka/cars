#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {ROOT, sha256, inside, args, writeJson} from './lib/workflow.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {validPackSlug, safePackPath} from './lib/dealer-pack.mjs';

const assert = (value, message) => {if (!value) throw Error(message);};
const roles = {onLight: 'on-light', onDark: 'on-dark', onAccent: 'on-accent'};
// These are the existing consumer backgrounds. Artwork never sets a palette.
export const PACK_LOGO_BACKGROUNDS = Object.freeze({onLight: ['#ffffff'], onDark: ['#111113', '#101820'], onAccent: ['#09090b', '#17191c', '#c40101']});

export async function cropTransparentPadding(bytes, sharp, {mark = false} = {}) {
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
  const cropped = sharp(bytes).extract({left, top, width: right - left, height: bottom - top});
  const png = await (mark ? cropped.resize(512, 512, {fit: 'contain', background: '#00000000'}) : cropped.resize({width: 1024})).png().toBuffer();
  return {png, operation: 'crop-transparent-padding-and-resize', sourceSha256: sha256(bytes), sha256: sha256(png), crop: {left, top, width: right - left, height: bottom - top}};
}

function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16); header.writeUInt16LE(1, 2); header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({size, png}, i) => {const at = 6 + i * 16; header[at] = size; header[at + 1] = size; header.writeUInt16LE(1, at + 4); header.writeUInt16LE(32, at + 6); header.writeUInt32LE(png.length, at + 8); header.writeUInt32LE(offset, at + 12); offset += png.length;});
  return Buffer.concat([header, ...images.map(row => row.png)]);
}

export async function prepareDealerPackLogo({root = ROOT, slug, toolPackage = process.env.CARS_DEALER_PACK_TOOL_PACKAGE ?? path.join(root, 'runtime/dealer-pack-tools/package.json')} = {}) {
  assert(validPackSlug(slug), 'Use a bounded dealer pack slug');
  const directory = inside(root, 'dealers/' + slug, {mustExist: true}), sourceFile = path.join(directory, 'branding/source.json');
  const source = JSON.parse(fs.readFileSync(sourceFile, 'utf8')), inputs = source.generatedInputs;
  assert(inputs?.reviewedAt && inputs.surfaceReview?.reviewed === true, 'Logo creation requires reviewed source artwork and actual image-generation provenance');
  const sharp = createRequire(path.resolve(toolPackage))('sharp');
  assert(sharp.versions.sharp === '0.35.5', 'Use sharp 0.35.5 for deterministic logo exports');
  const read = row => {
    assert(safePackPath(row?.path) && /^branding\//.test(row.path) && row.generation?.generationId && ['image_gen', 'image_gen.imagegen'].includes(row.generation.tool), 'Use retained artwork with actual imagegen provenance');
    const bytes = fs.readFileSync(inside(directory, row.path, {mustExist: true}));
    assert(sha256(bytes) === row.sha256, 'Generated source artwork changed: ' + row.path); return bytes;
  };
  const save = (name, bytes) => {const file = inside(directory, name); fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, bytes); return {path: name, sha256: sha256(bytes)};};
  const assets = {}, transforms = {}, surfaces = {}, supplemental = {};
  for (const [role, name] of Object.entries(roles)) {
    const row = inputs.surfaces[role], result = await cropTransparentPadding(read(row), sharp);
    const pngPath = 'branding/logo-' + name + '.png', webpPath = 'dealer-brand/logo-' + name + '.webp';
    save(pngPath, result.png); save('dealer-brand/logo-' + name + '.png', result.png);
    const webp = await sharp(result.png).webp({lossless: true, effort: 6}).toBuffer(); save(webpPath, webp);
    assets[role] = {sourcePath: pngPath, publicPath: '/' + webpPath, sha256: sha256(webp), sourceSha256: sha256(result.png)};
    transforms[role] = {...result, png: undefined, sourcePath: row.path, outputPath: pngPath};
    surfaces[role] = {path: pngPath, sha256: sha256(result.png), generation: row.generation, sourceReference: 'dealers/' + slug + '/' + row.path};
  }
  const master = await cropTransparentPadding(read(inputs.master), sharp), mark = await cropTransparentPadding(read(inputs.mark), sharp, {mark: true});
  save('branding/logo-master.png', master.png); save('branding/logo-mark.png', mark.png);
  const darkMarkInput = inputs.markOnDark;
  const darkMark = darkMarkInput ? (await cropTransparentPadding(read(darkMarkInput), sharp, {mark: true})).png : null;
  for (const [name, png] of [['on-light', mark.png], ['on-dark', darkMark ?? mark.png]]) {
    const webp = await sharp(png).webp({lossless: true, effort: 6}).toBuffer();
    const input = name === 'on-dark' && darkMarkInput ? darkMarkInput : inputs.mark;
    supplemental['mark-' + name + '.webp'] = {...save('dealer-brand/mark-' + name + '.webp', webp),
      generation: input.generation, sourceReference: 'dealers/' + slug + '/' + input.path};
  }
  save('branding/app-icon.png', mark.png);
  supplemental['app-icon.png'] = {...save('dealer-brand/app-icon.png', mark.png),
    generation: inputs.mark.generation, sourceReference: 'dealers/' + slug + '/' + inputs.mark.path};
  const favicon = ico(await Promise.all([16, 32, 48, 64].map(async size => ({size, png: await sharp(mark.png).resize(size, size).png().toBuffer()}))));
  supplemental['favicon.ico'] = {...save('dealer-brand/favicon.ico', favicon),
    generation: inputs.mark.generation, sourceReference: 'dealers/' + slug + '/' + inputs.mark.path};
  const contract = {schemaVersion: 1, dealer: slug, reviewed: true, reviewedAt: inputs.reviewedAt,
    status: 'independent-proposal-not-dealer-approved', creationMethod: source.creationMethod,
    assets, surfaceBackgrounds: PACK_LOGO_BACKGROUNDS,
    master: {path: 'branding/logo-master.png', sha256: sha256(master.png), generation: inputs.master.generation},
    mark: {path: 'branding/logo-mark.png', sha256: sha256(mark.png), generation: inputs.mark.generation},
    favicon: {path: 'dealer-brand/favicon.ico', sha256: sha256(favicon)},
    surfaces, transforms, supplemental, markOnDarkReady: Boolean(darkMark), originalArtworkPreserved: true,
    visualReview: {reviewed: true, reviewedAt: inputs.reviewedAt, source: 'branding/source.json', spelling: 'human-visual-review', dealerApproval: false}};
  if (darkMarkInput) {
    save('branding/logo-mark-on-dark.png', darkMark);
    contract.markOnDark = {path: 'branding/logo-mark-on-dark.png', sha256: sha256(darkMark), generation: darkMarkInput.generation};
  }
  writeJson(path.join(directory, 'branding/logo-contract.json'), contract);
  const manifestFile = path.join(directory, 'dealer.json');
  if (fs.existsSync(manifestFile)) {
    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
    if (manifest.shareIdentity) {
      manifest.shareIdentity.logo = {sourcePath: 'branding/logo-on-light.png', sha256: assets.onLight.sourceSha256,
        faviconSourcePath: 'branding/app-icon.png', faviconSha256: sha256(mark.png)};
      writeJson(manifestFile, manifest);
    }
  }
  return {dealer: slug, files: 20 + (darkMark ? 1 : 0), status: contract.status, markOnDarkReady: contract.markOnDarkReady};
}

export function readPackBranding(pack) {
  const contract = pack.branding, get = row => {const bytes = pack.files.get(row.path); assert(bytes && sha256(bytes) === row.sha256, 'Prepared logo changed: ' + row.path); return bytes;};
  assert(contract?.markOnDarkReady, 'Prepare the reviewed dark compact mark before building');
  const surfaces = Object.fromEntries(Object.entries(contract.surfaces).map(([role, row]) => [role, {png: get(row), sha256: row.sha256, generation: row.generation, sourceReference: row.sourceReference}]));
  // The maintained reviewed pack supports supplemental rasters under its
  // retained/mixed mode; each generated supplemental asset keeps its real ID.
  const supplemental = {};
  for (const [name, generated] of [['mark-on-light.webp', contract.mark], ['mark-on-dark.webp', contract.markOnDark], ['app-icon.png', contract.mark], ['favicon.ico', contract.mark]]) {
    const row = contract.supplemental?.[name];
    assert(row?.path === 'dealer-brand/' + name && row.generation?.generationId === generated.generation.generationId &&
      row.generation?.tool === generated.generation.tool, 'Prepared supplemental logo provenance missing or changed: ' + name);
    const bytes = get(row);
    supplemental[name] = {bytes, sha256: row.sha256, generation: row.generation, sourceReference: row.sourceReference};
  }
  return {master: {png: get(contract.master), sha256: contract.master.sha256, markPng: get(contract.mark), markSha256: contract.mark.sha256},
    reviewedSurfaces: {schemaVersion: 1, reviewed: true, reviewedAt: contract.reviewedAt, sourceMode: 'retained-or-mixed-raster', surfaces, assets: supplemental}};
}

if (isEntrypoint(import.meta.url)) {
  const options = args(process.argv.slice(2), ['slug', 'tool-package']);
  prepareDealerPackLogo({slug: options.slug, toolPackage: options['tool-package']}).then(report => console.log(JSON.stringify(report, null, 2))).catch(error => {console.error(error.message); process.exitCode = 1;});
}
