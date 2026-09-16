from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file = Path(path)
    text = file.read_text(encoding="utf-8")
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected one match, found {count}")
    file.write_text(text.replace(old, new), encoding="utf-8")


adapter = "scripts/lib/client-refresh-adapters.mjs"
replace_once(
    adapter,
    """const findScalar = (text, key) =>
  text.match(new RegExp(`${key}\\\\s*:\\\\s*['\"]([^'\"]+)['\"]`))?.[1] || '';

function publicAssetExists""",
    """const findScalar = (text, key) =>
  text.match(new RegExp(`${key}\\\\s*:\\\\s*['\"]([^'\"]+)['\"]`))?.[1] || '';
const RASTER_LOGO_EXTENSION = /\\.(?:png|webp)$/i;
const isRasterLogo = (value) => typeof value === 'string' &&
  RASTER_LOGO_EXTENSION.test(value.split(/[?#]/, 1)[0]);
function requireRasterLogo(value, key, surface) {
  if (!isRasterLogo(value)) {
    throw new Error(`${key}: missing committed PNG/WebP logo for ${surface}; SVG, CSS and text fallbacks are not accepted.`);
  }
  return value;
}

function publicAssetExists""",
)

replace_once(
    adapter,
    """  for (const candidate of candidates) {
    if (dealerAssetExists(oldVariant, key, candidate)) return candidate;
  }
  const root = publicRoot(key, oldVariant);
  const preferred = dark
    ? ['wordmark-light.svg', 'logo-on-dark.svg', 'logo-on-dark.png', 'logo-light.png', 'logo.png']
    : ['wordmark.svg', 'logo-on-light.svg', 'logo-on-light.png', 'logo.png'];""",
    """  for (const candidate of candidates) {
    if (isRasterLogo(candidate) && dealerAssetExists(oldVariant, key, candidate)) return candidate;
  }
  const root = publicRoot(key, oldVariant);
  const preferred = dark
    ? ['logo-on-dark.webp', 'logo-on-dark.png', 'logo-dark.webp', 'logo-dark.png', 'logo-light.webp', 'logo-light.png', 'logo.webp', 'logo.png']
    : ['logo-on-light.webp', 'logo-on-light.png', 'logo-light.webp', 'logo-light.png', 'logo.webp', 'logo.png'];""",
)

replace_once(
    adapter,
    """  const logo = pickLogo(oldVariant, 'auto-best', b, false) || findScalar(freshBrand, 'logo');
  const logoDark = pickLogo(oldVariant, 'auto-best', b, true) || logo;""",
    """  const logo = requireRasterLogo(pickLogo(oldVariant, 'auto-best', b, false), 'auto-best', 'light surfaces');
  const logoDark = requireRasterLogo(pickLogo(oldVariant, 'auto-best', b, true) || logo, 'auto-best', 'dark surfaces');""",
)

replace_once(
    adapter,
    """  patchAutoBestMap(candidate, profile);
  const heroFile = patchAutoBestHero(candidate);
  const identityFile = patchAutoBestIdentity(candidate);""",
    """  patchAutoBestMap(candidate, profile);
  const identityFile = patchAutoBestIdentity(candidate);""",
)

replace_once(
    adapter,
    """    'src/lib/components/company/ShowroomMap.svelte (address adapter)',
    ...(heroFile ? [heroFile] : []),
    identityFile""",
    """    'src/lib/components/company/ShowroomMap.svelte (address adapter)',
    identityFile""",
)

replace_once(
    adapter,
    """  const logo = pickLogo(oldVariant, 'modern', b, false) || findScalar(text, 'logoPath');""",
    """  const logo = requireRasterLogo(pickLogo(oldVariant, 'modern', b, false), 'modern', 'primary surfaces');""",
)

replace_once(
    adapter,
    """  const logoLight = pickLogo(oldVariant, 'carwow', b, false) ||
    findScalar(old, 'logoLight') || '/brand/daynight-logo.webp';
  const logoDark = pickLogo(oldVariant, 'carwow', b, true) ||
    findScalar(old, 'logoDark') || logoLight;""",
    """  const logoLight = requireRasterLogo(pickLogo(oldVariant, 'carwow', b, false), 'carwow', 'light surfaces');
  const logoDark = requireRasterLogo(pickLogo(oldVariant, 'carwow', b, true) || logoLight, 'carwow', 'dark surfaces');""",
)

replace_once(
    adapter,
    """  const logoDark = pickLogo(oldVariant, 'import', b, true) ||
    findScalar(freshText, 'logoDark');
  const logoLight = pickLogo(oldVariant, 'import', b, false) ||
    findScalar(freshText, 'logoLight') || logoDark;""",
    """  const logoDark = requireRasterLogo(pickLogo(oldVariant, 'import', b, true), 'import', 'dark surfaces');
  const logoLight = requireRasterLogo(pickLogo(oldVariant, 'import', b, false) || logoDark, 'import', 'light surfaces');""",
)

replace_once(
    adapter,
    """  importListingFeed,
  pickLogo,
  replaceModernListings""",
    """  importListingFeed,
  pickLogo,
  isRasterLogo,
  requireRasterLogo,
  replaceModernListings""",
)

refresh = "scripts/refresh-client.mjs"
replace_once(
    refresh,
    """import { applyRefreshAdapter } from './lib/client-refresh-adapters.mjs';""",
    """import { applyRefreshAdapter } from './lib/client-refresh-adapters.mjs';
import { assertTemplatePresentation } from './lib/client-refresh-presentation.mjs';""",
)
replace_once(
    refresh,
    """overlay.push(...copyReferencedAssets(oldVariant,candidate,key,overlay));resetProjectMetadata""",
    """overlay.push(...copyReferencedAssets(oldVariant,candidate,key,overlay));assertTemplatePresentation({key,template:path.join(root,release.snapshotPath),candidate});resetProjectMetadata""",
)

test_file = "scripts/refresh-client.test.mjs"
replace_once(
    test_file,
    """  const autoBestHero = fs.readFileSync(path.join(root, 'src/lib/components/home/Hero.svelte'), 'utf8');
  assert.doesNotMatch(autoBestHero, /Студентски град/);""",
    """  assert.equal(
    hash(path.join(root, 'src/lib/components/home/Hero.svelte')),
    hash(path.join(template, 'src/lib/components/home/Hero.svelte')),
    'dealer refresh must not modify the template-owned hero component'
  );
  const autoBestHero = fs.readFileSync(path.join(root, 'src/lib/components/home/Hero.svelte'), 'utf8');
  assert.doesNotMatch(autoBestHero, /Студентски град/);""",
)

Path("scripts/lib/client-refresh-presentation.mjs").write_text(
    """import fs from 'node:fs';
import path from 'node:path';

const EXACT_PROTECTED_PATHS = {
  'auto-best': [
    'src/lib/data/home.ts',
    'src/lib/data/feature-artwork.ts',
    'src/lib/data/service-artwork.ts',
    'src/lib/data/vehicle-artwork.ts'
  ],
  modern: ['apps/web/public/lead-hero.jpg'],
  carwow: ['src/lib/components/home/desktop/DesktopHomeHero.svelte'],
  import: ['static/assets/daynight/hero/home-05-showroom-exterior.webp']
};
const STYLE_EXTENSION = /\\.(?:css|pcss|scss|sass)$/i;
const HERO_ASSET = /(?:^|[\\/_.-])(?:hero|banner|masthead)(?:[\\/_.-]|$)/i;
const MEDIA_EXTENSION = /\\.(?:avif|jpe?g|png|webp)$/i;

function walkFiles(root, current = root, result = []) {
  if (!fs.existsSync(current)) return result;
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    const target = path.join(current, entry.name);
    if (entry.isDirectory()) walkFiles(root, target, result);
    else if (entry.isFile()) result.push(path.relative(root, target).replaceAll('\\\\', '/'));
  }
  return result;
}

export function protectedPresentationPaths({ key, template, candidate }) {
  const templateFiles = walkFiles(template);
  const candidateFiles = walkFiles(candidate);
  const paths = new Set(EXACT_PROTECTED_PATHS[key] || []);
  for (const relative of [...templateFiles, ...candidateFiles]) {
    if (STYLE_EXTENSION.test(relative)) paths.add(relative);
    if (MEDIA_EXTENSION.test(relative) && HERO_ASSET.test(relative)) paths.add(relative);
    if (key === 'auto-best' && relative.startsWith('src/lib/components/home/') && relative.endsWith('.svelte')) paths.add(relative);
  }
  return [...paths].sort();
}

export function assertTemplatePresentation({ key, template, candidate }) {
  const changed = [];
  for (const relative of protectedPresentationPaths({ key, template, candidate })) {
    const expected = path.join(template, relative);
    const actual = path.join(candidate, relative);
    if (!fs.existsSync(expected) || !fs.existsSync(actual)) {
      changed.push(`${relative} (missing or added)`);
      continue;
    }
    if (!fs.readFileSync(expected).equals(fs.readFileSync(actual))) changed.push(relative);
  }
  if (changed.length) {
    throw new Error(`${key}: dealer overlay changed template-owned presentation: ${changed.join(', ')}`);
  }
  return true;
}
""",
    encoding="utf-8",
)

Path("scripts/client-refresh-presentation.test.mjs").write_text(
    """import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { refreshAdapterInternals } from './lib/client-refresh-adapters.mjs';
import { assertTemplatePresentation } from './lib/client-refresh-presentation.mjs';

const write = (root, relative, content) => {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

test('dealer logos must be committed PNG or WebP assets', () => {
  assert.equal(refreshAdapterInternals.isRasterLogo('/dealer/logo.png'), true);
  assert.equal(refreshAdapterInternals.isRasterLogo('/dealer/logo.WEBP?rev=2'), true);
  assert.equal(refreshAdapterInternals.isRasterLogo('/dealer/logo.svg'), false);
  assert.equal(refreshAdapterInternals.isRasterLogo(''), false);
});

test('dealer refresh rejects CSS and hero composition changes', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-presentation-'));
  const template = path.join(root, 'template');
  const candidate = path.join(root, 'candidate');
  for (const base of [template, candidate]) {
    write(base, 'src/lib/components/home/Hero.svelte', '<section>hero</section>');
    write(base, 'src/lib/styles/tokens.css', ':root { --accent: red; }');
    write(base, 'static/assets/home-hero.webp', 'same-image');
  }
  assert.equal(assertTemplatePresentation({ key: 'auto-best', template, candidate }), true);
  write(candidate, 'src/lib/styles/tokens.css', ':root { --accent: blue; }');
  assert.throws(
    () => assertTemplatePresentation({ key: 'auto-best', template, candidate }),
    /template-owned presentation/
  );
  fs.rmSync(root, { recursive: true, force: true });
});
""",
    encoding="utf-8",
)
