import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { applyMounts } from './publishing/mounts.mjs';
import { git, gitFiles } from './lib/workflow.mjs';
import { dealerGuidance } from './lib/dealer-guidance.mjs';

export const PACKAGING_VERSION = '1';
const ROOT = path.resolve(import.meta.dirname, '..');
const OMITTED = new Set(['node_modules', '.git', '.vercel', '.agency-os', '.codex', '.claude', '.agents', '.auth', '.template', '.svelte-kit', '.turbo', '.cache', '.pnpm-store', 'build', 'dist', 'runtime', 'artifacts', 'audits', 'qa', 'qa-final', 'evidence', 'test-results', 'playwright-report', 'coverage']);
const ROOT_FILES = new Set(['.gitignore', 'AGENTS.md', 'CLIENT.md', 'README.md', 'DEPLOYMENT.md', 'business-facts.json', 'stock.json', 'FACTS-AND-INVENTORY.json']);
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const normalized = (bytes) => {
  if (bytes.includes(0)) return bytes;
  const text = bytes.toString('utf8');
  return Buffer.from(text).equals(bytes) ? Buffer.from(text.replaceAll('\r\n', '\n')) : bytes;
};
const exists = (file) => fs.lstat(file).then(() => true, (error) => {
  if (error.code === 'ENOENT') return false;
  throw error;
});

function contained(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function safeRelative(value, label) {
  if (typeof value !== 'string' || !value || value.includes('\\') || value.includes(':') || value.includes('\0') || value.startsWith('/') || value.split('/').some((part) => !part || part === '.' || part === '..')) {
    throw new Error(`Invalid ${label}: ${value}`);
  }
  return value;
}

export function validatePackagingManifest(manifest) {
  if (manifest?.schemaVersion !== 1 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.slug ?? '')) throw new Error('Invalid dealer manifest schemaVersion or slug');
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(manifest.repository ?? '')) throw new Error('Manifest repository must be owner/name');
  if (manifest.packaging?.version !== PACKAGING_VERSION) throw new Error(`Unsupported packaging version: ${manifest.packaging?.version}`);
  const variants = manifest.variants;
  const middle = variants?.[1]?.key;
  if (!Array.isArray(variants) || variants.length !== 3 || variants[0].key !== 'auto-best' || !['modern', 'import'].includes(middle) || variants[2].key !== 'carwow') throw new Error('Packaging v1 requires auto-best + modern/import + carwow in that order');
  const required = [{ base: '', entry: '/' }, { base: '/variant-2', entry: middle === 'modern' ? '/variant-2/cars' : '/variant-2/' }, { base: '/variant-3', entry: '/variant-3/' }];
  for (const [index, variant] of variants.entries()) {
    if (variant.base !== required[index].base || variant.entry !== required[index].entry) throw new Error(`Unsupported ${variant.key} mount or entry`);
  }
  if (manifest.extraAssets !== undefined && !Array.isArray(manifest.extraAssets)) throw new Error('extraAssets must be an array of relative paths');
  for (const asset of manifest.extraAssets ?? []) {
    safeRelative(asset, 'extra asset');
    if (asset.split('/').some((part) => OMITTED.has(part) || part.startsWith('.env') || part.startsWith('.next')) || variants.some(({ key }) => asset === key || asset.startsWith(`${key}/`)) || ['scripts', 'dealer.json', 'vercel.json', '.cars-package.json', 'AGENTS.md'].includes(asset.split('/')[0])) {
      throw new Error(`Protected or redundant extra asset path: ${asset}`);
    }
  }
  return manifest;
}

function omitted(name, relative) {
  if (OMITTED.has(name) || name.startsWith('.next') || name.startsWith('.env')) return true;
  if (/\.(?:log|tsbuildinfo|pem|key|pfx|p12|pid)$/i.test(name)) return true;
  if (/(?:credentials|service-account|license-certificate|purchase-code)/i.test(name) && !/\.(?:[cm]?[jt]sx?|svelte|vue|py|sh|ps1)$/i.test(name)) return true;
  if (/^(?:AGENTS(?:\.override)?|CLAUDE)\.md$/i.test(name) && relative !== 'AGENTS.md') return true;
  if (relative.split('/').includes('.client') && name !== '.client' && name !== 'project.json') return true;
  return false;
}

async function collectSource(source, manifest) {
  const files = new Map();
  async function walk(relative) {
    const absolute = path.join(source, relative);
    const stat = await fs.lstat(absolute);
    const name = path.basename(relative);
    if (omitted(name, relative)) return;
    if (stat.isSymbolicLink()) throw new Error(`Source link requires review: ${relative}`);
    if (stat.isDirectory()) {
      for (const entry of (await fs.readdir(absolute)).sort()) await walk(`${relative}/${entry}`);
    } else if (stat.isFile()) {
      if (stat.size >= 100 * 1024 * 1024) throw new Error(`File exceeds GitHub's 100 MB limit: ${relative}`);
      files.set(relative, await fs.readFile(absolute));
    } else throw new Error(`Unsupported source entry: ${relative}`);
  }
  for (const { key } of manifest.variants) {
    if (!(await exists(path.join(source, key, 'package.json')))) throw new Error(`Missing variant package.json: ${key}`);
    await walk(key);
  }
  for (const entry of (await fs.readdir(source, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    if (ROOT_FILES.has(entry.name) || /^(?:LICEN[CS]E|COPYING|NOTICE|PROVENANCE)(?:\.[\w-]+)?$/i.test(entry.name) || entry.name === 'scripts' || entry.name === '.client') await walk(entry.name);
  }
  for (const asset of manifest.extraAssets ?? []) {
    if (!(await exists(path.join(source, asset)))) throw new Error(`Declared extra asset is missing: ${asset}`);
    await walk(asset);
  }
  return files;
}

// Use the same inclusion rules for both trees: a deleted tracked file is drift too.
function retainedAtCommit(relative, manifest) {
  const parts = relative.split('/');
  if (parts.some((name, index) => omitted(name, parts.slice(0, index + 1).join('/')))) return false;
  const first = parts[0];
  return relative === 'dealer.json' || manifest.variants.some(v => v.key === first)
    || ROOT_FILES.has(first) || /^(?:LICEN[CS]E|COPYING|NOTICE|PROVENANCE)(?:\.[\w-]+)?$/i.test(first)
    || ['scripts', '.client'].includes(first)
    || (manifest.extraAssets ?? []).some(p => relative === p || relative.startsWith(p + '/'));
}

function vercelConfiguration(manifest) {
  const middle = manifest.variants[1].key;
  const middleService = middle === 'modern' ? 'modern' : 'importer';
  return {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    services: {
      autobest: { root: 'auto-best', framework: 'sveltekit', installCommand: 'npm ci', buildCommand: 'npm run build && node ../scripts/fix-svelte-service-output.mjs' },
      [middleService]: middle === 'modern' ? {
        root: 'modern/apps/web', framework: 'nextjs',
        installCommand: 'cd ../.. && npx --yes --package=node@22.23.2 --package=pnpm@11.4.0 -c "pnpm install --frozen-lockfile"',
        buildCommand: 'cd ../.. && npx --yes --package=node@22.23.2 --package=pnpm@11.4.0 -c "pnpm --filter @repo/database build && pnpm --filter web build"',
      } : { root: 'import', framework: 'sveltekit', installCommand: 'npm ci', buildCommand: 'npm run build && node ../scripts/fix-svelte-service-output.mjs /variant-2' },
      carwow: { root: 'carwow', framework: 'sveltekit', installCommand: 'npm ci', buildCommand: 'npm run build && node ../scripts/fix-svelte-service-output.mjs /variant-3' },
    },
    headers: [{ source: '/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }],
    redirects: [{ source: '/variant-2', destination: manifest.variants[1].entry, permanent: false }, { source: '/variant-3', destination: '/variant-3/', permanent: false }],
    rewrites: [{ source: '/variant-2/(.*)', destination: { service: middleService } }, { source: '/variant-3/(.*)', destination: { service: 'carwow' } }, { source: '/(.*)', destination: { service: 'autobest' } }],
  };
}

function switcherConfiguration(manifest) {
  const language = manifest.switcher?.language ?? manifest.language ?? 'bg';
  const words = {
    bg: { design: 'Дизайн', choose: 'Избор на дизайн', title: 'Изберете визия за сайта' },
    en: { design: 'Design', choose: 'Choose a design', title: 'Choose a design for the site' },
  };
  const labels = manifest.switcher?.labels ?? words[language.split('-')[0]];
  if (!labels || !['design', 'choose', 'title'].every((key) => typeof labels[key] === 'string' && labels[key].length > 0)) throw new Error(`Provide switcher labels for language: ${language}`);
  const accent = manifest.switcher?.accent;
  if (accent !== undefined && !/^#[\da-f]{6}$/i.test(accent)) throw new Error('Switcher accent must be a six-digit hex color');
  return { language, labels, ...(accent ? { accent } : {}), variants: manifest.variants.map(({ key, base, entry }) => ({ key, base, entry })) };
}

function fallbackGuidance(manifest) {
  return `# ${manifest.slug} dealer package\n\nThis repository is a derived deployment package. Canonical dealer source lives under clients/${manifest.slug} in the Cars repository. Read dealer.json and .cars-package.json for identity and provenance. Make source changes in Cars and regenerate the package; do not silently edit generated mounting code or template masters.\n\nAll three designs share one Vercel project. Preserve retained lockfiles, source layouts, licensing and provenance. Run each app's documented checks and test every mounted entry, inventory, detail, contact and enquiry destination at 390 and 1440 px. Check the design switcher at 320 px, including Escape and focus return. A build is not public-preview proof. Publishing does not authorize outreach.\n`;
}

async function prepare({ source, manifest, sourceCommit, guidance }) {
  validatePackagingManifest(manifest);
  if (!/^[a-f\d]{40}(?:[a-f\d]{24})?$/i.test(sourceCommit ?? '')) throw new Error('sourceCommit must be the full source Git commit SHA');
  const resolvedSource = await fs.realpath(path.resolve(source));
  const files = await collectSource(resolvedSource, manifest);
  await applyMounts(files, manifest);
  files.set('vercel.json', Buffer.from(json(vercelConfiguration(manifest))));
  files.set('.vercelignore', Buffer.from('.git\n**/node_modules\n**/.next*\n**/.svelte-kit\n**/.vercel\n**/.turbo\n**/.env*\n**/*.log\n**/*.tsbuildinfo\n**/build\n**/dist\nruntime\nqa\nqa-final\nevidence\n'));
  files.set('scripts/fix-svelte-service-output.mjs', await fs.readFile(new URL('./publishing/fix-svelte-service-output.mjs', import.meta.url)));
  const switcher = await fs.readFile(new URL('./publishing/preview-switcher.js', import.meta.url), 'utf8');
  files.set('auto-best/static/preview-switcher.js', Buffer.from(switcher.replace('__CARS_SWITCHER_CONFIG__', () => JSON.stringify(switcherConfiguration(manifest)).replace(/</g, '\\u003c'))));
  files.set('dealer.json', Buffer.from(json(manifest)));
  if (guidance !== undefined && (typeof guidance !== 'string' || !guidance.trim())) throw new Error('guidance must be nonempty portable Markdown');
  if (guidance !== undefined || !files.has('AGENTS.md')) files.set('AGENTS.md', Buffer.from(guidance ?? fallbackGuidance(manifest)));
  const hashes = () => [...files].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([name, content]) => ({ path: name, sha256: sha256(normalized(content)) }));
  const payload = hashes();
  const payloadDigest = sha256(JSON.stringify(payload));
  files.set('.cars-package.json', Buffer.from(json({ schemaVersion: 1, manifest, sourceCommit, packagingVersion: PACKAGING_VERSION, payloadDigest, payload })));
  const digest = sha256(JSON.stringify(hashes()));
  return { resolvedSource, files, digest, packagingVersion: PACKAGING_VERSION };
}

async function validateDestination(source, destination) {
  const resolved = path.resolve(destination);
  if (contained(source, resolved) || contained(resolved, source)) throw new Error('Package destination must be separate from canonical source');
  if (await exists(resolved)) throw new Error(`Package destination already exists: ${resolved}`);
  let existing = path.dirname(resolved);
  while (!(await exists(existing))) existing = path.dirname(existing);
  const realParent = await fs.realpath(existing);
  if (path.normalize(realParent).toLowerCase() !== path.normalize(existing).toLowerCase()) throw new Error('Package destination parent uses a symlink or junction; use its real path');
  return resolved;
}

/** Prepare source without writing, staging, changing refs, or starting a runtime. */
export async function planDealerPackage(options) {
  const prepared = await prepare(options);
  const destination = await validateDestination(prepared.resolvedSource, options.destination);
  return { destination, files: [...prepared.files.keys()].sort(), digest: prepared.digest, packagingVersion: prepared.packagingVersion };
}

/** Create one fresh derived directory. No source file, Git index or ref is modified. */
export async function packageDealer(options) {
  const prepared = await prepare(options);
  const destination = await validateDestination(prepared.resolvedSource, options.destination);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  // Exclusive mkdir also closes the race after the existence check.
  await fs.mkdir(destination);
  for (const [name, content] of [...prepared.files].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) {
    const target = path.join(destination, name);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content, { flag: 'wx' });
  }
  return { destination, files: [...prepared.files.keys()].sort(), digest: prepared.digest, packagingVersion: prepared.packagingVersion };
}

async function main(args) {
  const options = {};
  let write = false;
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    if (flag === '--write') write = true;
    else if (flag === '--dry-run') write = false;
    else if (['--client', '--out', '--source-commit'].includes(flag)) {
      if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error(`Missing value for ${flag}`);
      options[flag.slice(2)] = args[++index];
    } else if (flag === '--help') {
      console.log('Usage: node scripts/package-dealer.mjs --client SLUG --out runtime/dealer-packages/SLUG [--source-commit SHA] [--write] (dry-run by default; retained source must match the commit)');
      return;
    } else throw new Error(`Unknown argument: ${flag}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(options.client ?? '') || !options.out) throw new Error('Use --client SLUG --out runtime/dealer-packages/SLUG [--write]');
  const source = path.join(ROOT, 'clients', options.client);
  const destination = path.resolve(ROOT, options.out);
  const packagesRoot = path.join(ROOT, 'runtime', 'dealer-packages');
  if (!contained(packagesRoot, destination) || destination === packagesRoot) throw new Error('--out must be a new directory under runtime/dealer-packages');
  const manifest = JSON.parse(await fs.readFile(path.join(source, 'dealer.json'), 'utf8'));
  if (manifest.slug !== options.client) throw new Error('Requested client does not match dealer.json');
  const revision = spawnSync('git', ['-C', ROOT, 'rev-parse', 'HEAD'], { encoding: 'utf8', windowsHide: true });
  if (revision.status !== 0) throw new Error(revision.stderr || 'Cannot read Cars source commit');
  const sourceCommit = options['source-commit'] || revision.stdout.trim();
  const retained = await collectSource(source, manifest);
  const tracked = new Map(gitFiles(ROOT, sourceCommit, {prefix:`clients/${options.client}`, filter:p=>retainedAtCommit(p,manifest)}).map(f=>[f.path,f]));
  const mismatches=[];
  for (const [name,content] of [...retained,['dealer.json',Buffer.from(json(manifest))]]) {
    const entry=tracked.get(name);
    if(!entry){mismatches.push(name);continue;}
    const bytes=normalized(content);
    const hash=createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    // Git's object hash is stable across CRLF-normalized source text.
    const blob=entry.blob;
    if(hash!==blob){const original=git(ROOT,['cat-file','blob',blob],{encoding:null});if(!normalized(content).equals(normalized(original)))mismatches.push(name);}
  }
  for (const name of tracked.keys()) if (name !== 'dealer.json' && !retained.has(name)) mismatches.push(name + ' (deleted)');
  if(mismatches.length)throw new Error(`Retained canonical source differs from ${sourceCommit}: ${mismatches.slice(0,8).join(', ')} (${mismatches.length} paths). Commit the scoped source first or select its exact --source-commit.`);
  const result = await (write ? packageDealer : planDealerPackage)({ source, destination, manifest, sourceCommit, guidance:dealerGuidance({slug:manifest.slug,variants:manifest.variants,workflowCommit:sourceCommit}) });
  console.log(json({ mode: write ? 'write' : 'dry-run', ...result, fileCount: result.files.length, files: undefined }).trim());
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch((error) => { console.error(error.message); process.exitCode = 1; });
}
