import { readdir, readFile } from 'node:fs/promises';

const tokenPath = 'src/lib/styles/tokens.css';
const errors = [];
let checked = 0;

function withoutComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '');
}

function styleSource(file, source) {
  if (!file.endsWith('.svelte')) return source;
  return [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(([, css]) => css).join('\n');
}

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) {
      await visit(file);
      continue;
    }
    if (!/\.(?:css|svelte|ts|js)$/.test(file)) continue;

    const source = await readFile(file, 'utf8');
    const cleanSource = withoutComments(source);
    const css = withoutComments(styleSource(file, source));

    if (/font-weight\s*:\s*(?:550|650)(?:\D|$)|font-\[(?:550|650)\]|fontWeight\s*(?:=|:)\s*['"]?(?:550|650)\b/.test(cleanSource)) {
      errors.push(`${file}: unsupported 550/650 font weight detected; use an established weight token.`);
    }

    for (const match of css.matchAll(/(?:^|[;{])\s*(font(?:-[\w-]+)?|line-height|letter-spacing|text-(?:transform|decoration(?:-[\w-]+)?|align)|white-space)\s*:\s*([^;}]+)/g)) {
      if (/!important\b/i.test(match[2])) {
        errors.push(`${file}: ${match[1]} must not use !important; fix style ownership or specificity.`);
      }
    }

    if (file === tokenPath) continue;
    for (const match of css.matchAll(/(?:^|[;{])\s*(font(?:-size|-weight|-family)?|line-height|letter-spacing)\s*:\s*([^;}]+)/g)) {
      checked++;
      if (!/^(?:var\(--dn-[\w-]+\)|inherit|initial|unset|revert)$/.test(match[2].trim())) {
        errors.push(`${file}: ${match[1]}: ${match[2]} must use a shared typography token.`);
      }
    }
    if (file.endsWith('.svelte') && /\sstyle(?:=|:)[^>]*(?:font-size|font-weight|font-family|line-height|letter-spacing)/.test(source.replace(/<style[^>]*>[\s\S]*?<\/style>/g, ''))) {
      errors.push(`${file}: inline typography must move to its style owner and use shared tokens.`);
    }
  }
}

await visit('src');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Typography check passed: ${checked} declarations use shared tokens or inheritance; no unsupported weights or typography !important rules.`);
