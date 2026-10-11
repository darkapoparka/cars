import fs from 'node:fs';
import path from 'node:path';
import { sha256 } from './workflow.mjs';
import { replaceCandidateFile } from '../dealer-updates/three-way-upgrade.mjs';

const PALETTE_CONFIGS = {
  modern: { path: 'packages/marketplace/lead-site.ts', export: 'leadSite', fields: ['accent'] },
  import: { path: 'src/lib/config/dealer.ts', export: 'dealerTheme', fields: ['accent', 'accentHover', 'accentContrast'] }
};

// Inspect the exported literal object without executing dealer or template code.
function paletteFields(source, contract, key) {
  const starts = [...source.matchAll(new RegExp(`\\bexport\\s+const\\s+${contract.export}\\b[^\\n=]*=\\s*\\{`, 'g'))];
  if (starts.length !== 1) throw new Error(`${key}: expected one exported ${contract.export} palette boundary`);
  const start = starts[0].index + starts[0][0].length - 1, fields = new Map();
  let depth = 0, nested = 0, quote = '', lineComment = false, blockComment = false, closed = false;
  for (let i = start; i < source.length; i++) {
    const ch = source[i], next = source[i + 1];
    if (lineComment) { if (ch === '\n') lineComment = false; continue; }
    if (blockComment) { if (ch === '*' && next === '/') { blockComment = false; i++; } continue; }
    if (quote) { if (ch === '\\') i++; else if (ch === quote) quote = ''; continue; }
    if (ch === '/' && next === '/') { lineComment = true; i++; continue; }
    if (ch === '/' && next === '*') { blockComment = true; i++; continue; }
    if (depth === 1 && nested === 0 && source.startsWith('...', i)) throw new Error(`${key}: spread palette boundary requires review`);
    if (depth === 1 && nested === 0 && ch === '[' && /[{,]$/.test(source.slice(start, i).trimEnd())) throw new Error(`${key}: computed palette boundary requires review`);
    if (depth === 1 && nested === 0 && /["']/.test(ch) && new RegExp(`^(["'])(${contract.fields.join('|')})\\1\\s*:`).test(source.slice(i))) throw new Error(`${key}: quoted palette declaration requires review`);
    if (depth === 1 && nested === 0 && /[A-Za-z_$]/.test(ch) && !/[\w$]/.test(source[i - 1] || '')) {
      const name = /^[A-Za-z_$][\w$]*/.exec(source.slice(i))?.[0];
      if (contract.fields.includes(name)) {
        if (fields.has(name)) throw new Error(`${key}: duplicate palette field ${name}`);
        const literal = /^\s*:\s*(["'])(#[a-f0-9]{6})\1(?=\s*[,}])/i.exec(source.slice(i + name.length));
        if (!literal) throw new Error(`${key}: palette field ${name} requires one literal hex colour`);
        const valueStart = i + name.length + literal[0].indexOf(literal[1]);
        fields.set(name, { value: literal[2], literal: literal[1] + literal[2] + literal[1], start: valueStart, end: valueStart + literal[2].length + 2 });
      }
    }
    if ('\'"`'.includes(ch)) { quote = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') { if (--depth === 0) { closed = true; break; } }
    else if (ch === '(' || ch === '[') nested++;
    else if (ch === ')' || ch === ']') nested--;
  }
  if (!closed || contract.fields.some(name => !fields.has(name))) throw new Error(`${key}: missing or malformed template palette fields`);
  return fields;
}

export function templatePaletteConfigPath(key) {
  return PALETTE_CONFIGS[key]?.path ?? null;
}

function paletteComparison({ key, template, templateConfigBuffer, candidate }) {
  const contract = PALETTE_CONFIGS[key];
  if (!contract) return null;
  if (templateConfigBuffer !== undefined && (template !== undefined || !Buffer.isBuffer(templateConfigBuffer))) {
    throw new Error(`${key}: supply one template path or exact template config buffer`);
  }
  if (templateConfigBuffer === undefined && typeof template !== 'string') throw new Error(`${key}: template palette source is required`);
  const templateFile = templateConfigBuffer === undefined ? path.join(template, contract.path) : null;
  const candidateFile = path.join(candidate, contract.path);
  if (![templateFile, candidateFile].filter(Boolean).every(file => fs.existsSync(file) && fs.lstatSync(file).isFile() && !fs.lstatSync(file).isSymbolicLink())) {
    throw new Error(`${key}: missing or linked template palette configuration`);
  }
  const expected = templateFile ? fs.readFileSync(templateFile) : Buffer.from(templateConfigBuffer), actual = fs.readFileSync(candidateFile);
  if (![expected, actual].every(bytes => Buffer.from(bytes.toString('utf8')).equals(bytes))) throw new Error(`${key}: palette configuration requires valid UTF-8`);
  return { contract, templateFile, candidateFile, expected, actual,
    templateFields: paletteFields(expected.toString('utf8'), contract, key),
    candidateFields: paletteFields(actual.toString('utf8'), contract, key) };
}

/** Explicit owner-selected correction. Copy only exact template palette literals. */
export function restoreTemplatePalette({ key, template, templateConfigBuffer, candidate }) {
  const comparison = paletteComparison({ key, template, templateConfigBuffer, candidate });
  if (!comparison) return { key, changed: false, fields: [] };
  const { contract, templateFile, candidateFile, expected, actual, templateFields, candidateFields } = comparison;
  if (templateFile && fs.realpathSync(templateFile).toLowerCase() === fs.realpathSync(candidateFile).toLowerCase()) throw new Error(`${key}: palette correction must target a derived candidate`);
  const changes = contract.fields.filter(name => candidateFields.get(name).value !== templateFields.get(name).value);
  let restored = actual.toString('utf8');
  for (const name of changes.sort((a, b) => candidateFields.get(b).start - candidateFields.get(a).start)) {
    const field = candidateFields.get(name);
    restored = restored.slice(0, field.start) + templateFields.get(name).literal + restored.slice(field.end);
  }
  if (changes.length) {
    if (templateFile && !fs.readFileSync(templateFile).equals(expected)) throw new Error(`${key}: template palette changed during correction`);
    replaceCandidateFile(candidateFile, Buffer.from(restored), { expectedPreviousSha256: sha256(actual) });
  }
  return { key, path: contract.path, changed: changes.length > 0,
    templateConfigSha256: sha256(expected), beforeSha256: sha256(actual), afterSha256: sha256(Buffer.from(restored)),
    fields: contract.fields.map(name => ({ name, before: candidateFields.get(name).value, after: templateFields.get(name).value })) };
}

const EXACT_PROTECTED_PATHS = {
  'auto-best': [
    'src/lib/data/home.ts',
    'src/lib/data/feature-artwork.ts',
    'src/lib/data/service-artwork.ts',
    'src/lib/data/vehicle-artwork.ts'
  ],
  modern: [
    'apps/web/public/lead-hero.jpg'
  ],
  carwow: [
    'src/lib/components/home/desktop/DesktopHomeHero.svelte',
    'src/lib/components/home/desktop/DesktopHomeBrandStrip.svelte',
    'src/lib/components/home/desktop/DesktopHomeInventoryPreview.svelte',
    'src/lib/components/home/desktop/DesktopHomeVehicleCategories.svelte',
    'src/lib/components/home/desktop/DesktopHomeWhyDayNight.svelte'
  ],
  import: [
    'src/lib/components/home/HomeFiveHero.svelte',
    'static/assets/daynight/hero/home-05-showroom-exterior.webp'
  ]
};
const STYLE_EXTENSION = /\.(?:css|pcss|scss|sass)$/i;
const HERO_ASSET = /(?:^|[\/_.-])(?:hero|banner|masthead)(?:[\/_.-]|$)/i;
const MEDIA_EXTENSION = /\.(?:avif|jpe?g|png|webp)$/i;
const OMITTED_PRESENTATION_DIRS = new Set(['node_modules', '.git', '.svelte-kit', '.next', '.turbo', 'build', 'dist', 'runtime', 'coverage', 'playwright-report', 'test-results']);

function walkFiles(root, current = root, result = []) {
  if (!fs.existsSync(current)) return result;
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    const target = path.join(current, entry.name);
    if (entry.isDirectory()) {
      if (OMITTED_PRESENTATION_DIRS.has(entry.name) || entry.name.startsWith('.next')) continue;
      walkFiles(root, target, result);
    }
    else if (entry.isFile()) result.push(path.relative(root, target).replaceAll('\\', '/'));
  }
  return result;
}

function normalizedPresentation(key, relative, buffer, profile) {
  if (key !== 'import' || relative !== 'src/lib/components/home/HomeFiveHero.svelte') {
    return buffer;
  }
  // The Import adapter may bind the existing map/phone actions to dealer data.
  // Normalize only those values; every class, style, element and surrounding
  // component line must remain byte-equivalent to the approved template.
  return Buffer.from(
    [profile?.business?.shortName, profile?.business?.name].filter(Boolean).sort((a,b)=>b.length-a.length).reduce((text,name)=>text.split(name).join('Day Night Auto'), buffer.toString('utf8'))
      .replace(/\{isEnglish \? 'Plovdiv, South Industrial Zone' : 'Пловдив, Индустриална зона - Юг'\}/g, '{__DEALER_ADDRESS__}')
      .replace(/\{isEnglish\s*\? 'Plovdiv, South Industrial Zone'\s*: 'Пловдив, Южна Индустриална зона'\}/g, '{__DEALER_ADDRESS__}')
      .replaceAll('{daynightContact.addressLabel}', '{__DEALER_ADDRESS__}')
      .replace("\n\timport { daynightContact } from '$lib/data/daynight';", '')
      .replace(
        /\tconst mobileShowroomMapHref\s*=\s*(?:'[^']*'|`[^`]*`);/,
        '\tconst mobileShowroomMapHref =\n\t\t__DEALER_MAP_HREF__;'
      )
      .replace(
        /\tconst mobileShowroomPhoneHref = (?:'[^']*'|daynightContact\.primaryPhoneHref);/,
        '\tconst mobileShowroomPhoneHref = __DEALER_PHONE_HREF__;'
      )
  );
}

export function protectedPresentationPaths({ key, template, candidate }) {
  const templateFiles = walkFiles(template);
  const candidateFiles = walkFiles(candidate);
  const templateSet = new Set(templateFiles);
  const paths = new Set(EXACT_PROTECTED_PATHS[key] || []);
  for (const relative of [...templateFiles, ...candidateFiles]) {
    if (STYLE_EXTENSION.test(relative)) paths.add(relative);
    // Protect the approved template's own hero/banner media. Dealer inventory
    // folders may contain files with "hero" in their names, but those additions
    // are harmless unless template-owned components or data start referencing them.
    if (templateSet.has(relative) && MEDIA_EXTENSION.test(relative) && HERO_ASSET.test(relative)) {
      paths.add(relative);
    }
    if (key === 'auto-best' && relative.startsWith('src/lib/components/home/') && relative.endsWith('.svelte')) {
      paths.add(relative);
    }
  }
  return [...paths].sort();
}

export function assertTemplatePresentation({ key, template, candidate, profile }) {
  const changed = [];
  const palette = paletteComparison({ key, template, candidate });
  if (palette) for (const name of palette.contract.fields) {
    if (palette.templateFields.get(name).value !== palette.candidateFields.get(name).value) changed.push(`${palette.contract.path} (${name})`);
  }
  for (const relative of protectedPresentationPaths({ key, template, candidate })) {
    const expected = path.join(template, relative);
    const actual = path.join(candidate, relative);
    if (!fs.existsSync(expected) || !fs.existsSync(actual)) {
      changed.push(`${relative} (missing or added)`);
      continue;
    }
    const expectedBuffer = normalizedPresentation(key, relative, fs.readFileSync(expected), profile);
    const actualBuffer = normalizedPresentation(key, relative, fs.readFileSync(actual), profile);
    if (!expectedBuffer.equals(actualBuffer)) changed.push(relative);
  }
  if (changed.length) {
    throw new Error(`${key}: dealer overlay changed template-owned presentation: ${changed.join(', ')}`);
  }
  return true;
}
