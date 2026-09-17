import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const argv = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : '';
};
const slug = valueAfter('--client');
if (!slug) throw new Error('Usage: node scripts/enforce-client-logo-surfaces.mjs --client <slug>');

const client = path.join(root, 'clients', slug);
const sourceDir = path.join(client, 'assets', 'brand');
const logoOnLight = '/assets/brand/logo-on-light.webp';
const logoOnDark = '/assets/brand/logo-on-dark.webp';
const required = ['logo-on-light.png', 'logo-on-light.webp', 'logo-on-dark.png', 'logo-on-dark.webp'];
for (const name of required) {
  if (!fs.existsSync(path.join(sourceDir, name))) throw new Error(`${slug}: missing canonical logo asset ${name}`);
}

const variants = [
  { key: 'auto-best', publicRoot: 'static' },
  { key: 'modern', publicRoot: 'apps/web/public' },
  { key: 'carwow', publicRoot: 'static' },
  { key: 'import', publicRoot: 'static' }
].filter(({ key }) => fs.existsSync(path.join(client, key)));

function copyAssets(variant) {
  const destination = path.join(client, variant.key, variant.publicRoot, 'assets', 'brand');
  fs.mkdirSync(destination, { recursive: true });
  for (const name of required) fs.copyFileSync(path.join(sourceDir, name), path.join(destination, name));
}

function replaceScalar(file, key, value) {
  if (!fs.existsSync(file)) throw new Error(`${slug}: expected logo config ${path.relative(root, file)}`);
  const before = fs.readFileSync(file, 'utf8');
  const pattern = new RegExp(`(^\\s*${key}\\s*:\\s*)["'][^"']*["']`, 'm');
  if (!pattern.test(before)) throw new Error(`${slug}: cannot locate ${key} in ${path.relative(root, file)}`);
  const after = before.replace(pattern, `$1${JSON.stringify(value)}`);
  fs.writeFileSync(file, after.replace(/\r?\n/g, '\n'));
}

for (const variant of variants) {
  copyAssets(variant);
  if (variant.key === 'auto-best') {
    const file = path.join(client, variant.key, 'src/lib/config/brand.ts');
    replaceScalar(file, 'logo', logoOnLight);
    replaceScalar(file, 'logoOnDark', logoOnDark);
  } else if (variant.key === 'modern') {
    const file = path.join(client, variant.key, 'packages/marketplace/lead-site.ts');
    // Modern's shared desktop/mobile chrome is charcoal, so its single logo slot
    // must use the all-white transparent surface asset.
    replaceScalar(file, 'logoPath', logoOnDark);
  } else if (variant.key === 'carwow') {
    const file = path.join(client, variant.key, 'src/lib/data/daynight-site.ts');
    // Carwow uses logoDark on white/yellow surfaces and logoLight on dark/red ones.
    replaceScalar(file, 'logoDark', logoOnLight);
    replaceScalar(file, 'logoLight', logoOnDark);
  } else if (variant.key === 'import') {
    const file = path.join(client, variant.key, 'src/lib/data/daynight.ts');
    // Import's clean header is charcoal and reads daynightAssets.logoDark.
    replaceScalar(file, 'logoDark', logoOnDark);
    replaceScalar(file, 'logoLight', logoOnLight);
  }
}

const checks = [];
for (const variant of variants) {
  const publicRoot = path.join(client, variant.key, variant.publicRoot);
  for (const publicPath of [logoOnLight, logoOnDark]) {
    const target = path.join(publicRoot, publicPath.slice(1));
    if (!fs.existsSync(target)) throw new Error(`${slug}/${variant.key}: copied logo missing ${publicPath}`);
  }
  checks.push(variant.key);
}

console.log(JSON.stringify({ client: slug, variants: checks, logoOnLight, logoOnDark }, null, 2));
