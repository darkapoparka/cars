import {createHash} from 'node:crypto';
import fs from 'node:fs';
import {BRANDING_SCHEMA, PUBLIC_ROOTS} from '../publishing/lead-branding.mjs';

const MARK = 'mark-on-light.webp';
const POLICY = 'dealer-pack-reviewed-mark-v1';
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const assert = (condition, message) => {if (!condition) throw new Error('Dealer pack FAB logo: ' + message);};

export function dealerPackFabPolicy(manifest) {
  return manifest.sourceFormat === 'dealer-pack' && manifest.pack?.schemaVersion === 2 ? 'fleet-design-mark-v1' : POLICY;
}

/** Read the release artwork without editing the switcher or its CSS. */
export function fleetDesignFabHashes() {
  const source = fs.readFileSync(new URL('../publishing/preview-switcher.js', import.meta.url), 'utf8');
  const match = /const templateLogos = (\{[^\n]+\});/.exec(source);
  assert(match, 'missing the retained six-design switcher artwork');
  const images = JSON.parse(match[1]), hashes = {};
  for (const key of Object.keys(PUBLIC_ROOTS)) {
    const encoded = /^data:image\/webp;base64,([A-Za-z0-9+/]+={0,2})$/.exec(images[key] ?? '');
    assert(encoded, 'missing retained design mark: ' + key);
    hashes[key] = sha256(Buffer.from(encoded[1], 'base64'));
  }
  return Object.freeze(hashes);
}

/** M2 restores the live fleet's design mark. M1 retains its original behavior. */
export function dealerPackSwitcherLogo(manifest, sourceFiles) {
  if (manifest.sourceFormat !== 'dealer-pack') return undefined;
  if (dealerPackFabPolicy(manifest) === 'fleet-design-mark-v1') return undefined;
  assert(manifest.repository === 'darkapoparka/cars' && manifest.packaging?.version === '5' &&
    manifest.branding?.required === true && manifest.branding.contract === '.cars-branding.json',
  'requires the Cars six-design reviewed branding contract');
  assert(sourceFiles instanceof Map, 'requires exact source files');
  const contractBytes = sourceFiles.get('.cars-branding.json');
  assert(Buffer.isBuffer(contractBytes), 'missing branding receipt');
  const contract = JSON.parse(contractBytes.toString('utf8'));
  assert(contract.schemaVersion === BRANDING_SCHEMA && contract.dealer === manifest.slug &&
    /^\/dealer-brand\/v2-[a-f0-9]{16}$/.test(contract.publicBase ?? ''), 'dealer or public asset identity changed');
  const name = manifest.shareIdentity?.name;
  assert(typeof name === 'string' && name.trim(), 'missing sourced dealer name');
  const keys = manifest.variants?.map(row => row.key) ?? [];
  assert(keys.length === 6 && new Set(keys).size === 6 && keys.every(key => Object.hasOwn(PUBLIC_ROOTS, key)),
    'requires all six maintained design families');
  const reviewed = contract.reviewedAssets?.filter(row => row.name === MARK) ?? [];
  assert(reviewed.length === 1 && /^[a-f0-9]{64}$/.test(reviewed[0].sha256 ?? ''), 'missing reviewed mark asset');
  const bytes = sourceFiles.get('branding/' + MARK);
  assert(Buffer.isBuffer(bytes) && bytes.length >= 20 && bytes.length <= 256 * 1024 &&
    bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP' &&
    bytes.readUInt32LE(4) + 8 === bytes.length, 'requires one bounded reviewed WebP');
  const digest = sha256(bytes);
  assert(digest === reviewed[0].sha256, 'reviewed mark bytes changed');
  for (const key of keys) {
    const expected = PUBLIC_ROOTS[key] + contract.publicBase.slice(1) + '/' + MARK;
    const rows = contract.assets?.filter(row => row.key === key && row.path?.endsWith('/' + MARK)) ?? [];
    const copy = sourceFiles.get(expected);
    assert(rows.length === 1 && rows[0].path === expected && rows[0].sha256 === digest &&
      Buffer.isBuffer(copy) && copy.equals(bytes), 'reviewed family mark changed or missing: ' + key);
  }
  return {schemaVersion: 1, policy: POLICY, dealer: manifest.slug, name,
    publicBase: contract.publicBase, asset: MARK, sha256: digest,
    src: 'data:image/webp;base64,' + bytes.toString('base64')};
}
