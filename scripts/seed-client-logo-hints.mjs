import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const argv = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : '';
};
const slug = valueAfter('--client');
if (!slug) throw new Error('Usage: node scripts/seed-client-logo-hints.mjs --client <slug>');

const client = path.join(root, 'clients', slug);
const factsFile = path.join(client, 'business-facts.json');
const raw = JSON.parse(fs.readFileSync(factsFile, 'utf8').replace(/^\uFEFF/, ''));
const business = raw.business && typeof raw.business === 'object' ? raw.business : raw;
const inherited = /(?:daynight|day-night|template|placeholder|default-logo|logo-white\.png|logo\.svg$)/i;

function valuesFrom(file, keys) {
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, 'utf8');
  const values = [];
  for (const key of keys) {
    const expression = new RegExp(`(?:^|\\n)\\s*${key}\\s*:\\s*["'\\x60]([^"'\\x60]+)["'\\x60]`, 'g');
    for (const match of text.matchAll(expression)) values.push(match[1]);
  }
  return values;
}

function pathCandidates(publicPath) {
  const clean = String(publicPath || '').replace(/^https?:\/\/[^/]+/i, '').replace(/^\/+/, '');
  const withoutAssets = clean.replace(/^assets\//, '');
  const result = [
    path.join(client, clean),
    path.join(client, 'assets', withoutAssets),
    path.join(client, 'assets', path.basename(clean))
  ];
  for (const key of ['auto-best', 'carwow', 'import']) {
    result.push(path.join(client, key, 'static', clean));
    result.push(path.join(client, key, 'static', withoutAssets));
  }
  result.push(path.join(client, 'modern', 'apps', 'web', 'public', clean));
  result.push(path.join(client, 'modern', 'apps', 'web', 'public', withoutAssets));
  return result;
}

const configured = [
  ...valuesFrom(path.join(client, 'auto-best/src/lib/config/brand.ts'), ['logo', 'logoOnDark']),
  ...valuesFrom(path.join(client, 'carwow/src/lib/data/daynight-site.ts'), ['logoDark', 'logoLight']),
  ...valuesFrom(path.join(client, 'modern/packages/marketplace/lead-site.ts'), ['logoPath']),
  ...valuesFrom(path.join(client, 'import/src/lib/data/daynight.ts'), ['logoDark', 'logoLight'])
];
const published = [
  business.branding?.logoOnLight,
  business.branding?.logoOnDark,
  business.logoOnLight,
  business.logoOnDark,
  business.logo,
  business.logoLight,
  business.logoDark,
  business.workingLogoPath,
  raw.logo,
  raw.workingLogoPath
].filter(Boolean);

const candidates = [...published, ...configured]
  .map((value) => String(value).trim())
  .filter((value, index, all) => value && all.indexOf(value) === index)
  .filter((value) => !inherited.test(value));

let selected = '';
for (const publicPath of candidates) {
  if (pathCandidates(publicPath).some((target) => fs.existsSync(target))) {
    selected = publicPath;
    break;
  }
}

if (selected) {
  business.logo = selected;
  business.workingLogoPath = selected.replace(/^\/+/, '');
}
fs.writeFileSync(factsFile, `${JSON.stringify(raw, null, 2)}\n`);
console.log(JSON.stringify({ client: slug, selected: selected || null, considered: candidates }, null, 2));
