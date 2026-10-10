import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourceRoot = path.join(root, 'src');
const leadSiteConfig = path.normalize('src/lib/config/lead-site.ts');
const tokenFile = path.normalize('src/lib/styles/tokens.css');
const files = [];
const errors = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(absolute);
    else if (/\.(?:css|svelte|ts|js)$/.test(entry.name)) files.push(absolute);
  }
}

function withoutComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '');
}

function styleSource(relative, source) {
  if (!relative.endsWith('.svelte')) return source;
  return [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(([, css]) => css).join('\n');
}

await walk(sourceRoot);
for (const absolute of files) {
  const relative = path.normalize(path.relative(root, absolute));
  const source = await readFile(absolute, 'utf8');
  const css = withoutComments(styleSource(relative, source));

  if (relative.endsWith('.css') && /:global\(/.test(css)) {
    errors.push(`${relative}: standalone CSS is already global; use plain selectors instead of Svelte :global(...).`);
  }

  if (/\[class\s*[*^$|~]?=/.test(css)) {
    errors.push(`${relative}: class-substring selectors are forbidden; use an explicit class, data slot or variant.`);
  }
  if (/:(?:nth-child|nth-of-type|first-child|last-child)(?:\s*\(|\b)/.test(css)) {
    errors.push(`${relative}: positional selectors are forbidden for component semantics; use an explicit slot or variant.`);
  }

  if (relative !== leadSiteConfig && /\/assets\/images\/lead\//.test(source)) {
    errors.push(`${relative}: dealer/lead artwork paths belong in ${leadSiteConfig}.`);
  }

  if (relative !== leadSiteConfig && relative !== tokenFile) {
    const dealerPalette = /#(?:c40101|a90000|a90f1c|b80024|78000f)\b|rgba?\(\s*196\s*,\s*1\s*,\s*1\b/i;
    if (dealerPalette.test(source)) {
      errors.push(`${relative}: dealer palette literals belong in ${leadSiteConfig}; consume semantic variables instead.`);
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`CSS policy check passed across ${files.length} source files: semantic selectors and centralized dealer theme assets/colors.`);
