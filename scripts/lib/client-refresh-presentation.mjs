import fs from 'node:fs';
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
const STYLE_EXTENSION = /\.(?:css|pcss|scss|sass)$/i;
const HERO_ASSET = /(?:^|[\/_.-])(?:hero|banner|masthead)(?:[\/_.-]|$)/i;
const MEDIA_EXTENSION = /\.(?:avif|jpe?g|png|webp)$/i;

function walkFiles(root, current = root, result = []) {
  if (!fs.existsSync(current)) return result;
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    const target = path.join(current, entry.name);
    if (entry.isDirectory()) walkFiles(root, target, result);
    else if (entry.isFile()) result.push(path.relative(root, target).replaceAll('\\', '/'));
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
