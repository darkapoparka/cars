import { readdir, readFile } from 'node:fs/promises';

// Keep the scale in tokens.css, including responsive sizes and font shorthands.
// Check source rather than compiled CSS, whose variable values are resolved.
const errors = [];
let checked = 0;
async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) { await visit(file); continue; }
    if (!/\.(css|svelte)$/.test(file) || file === 'src/lib/styles/tokens.css') continue;
    const source = await readFile(file, 'utf8');
    const css = file.endsWith('.svelte') ? source.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] || '' : source;
    for (const match of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(?:^|[;{])\s*(font(?:-size|-weight|-family)?|line-height|letter-spacing)\s*:\s*([^;}]+)/g)) {
      checked++;
      if (!/^(?:var\(--dn-[\w-]+\)|inherit|initial|unset|revert)(?:\s*!important)?$/.test(match[2].trim())) errors.push(`${file}: ${match[1]}: ${match[2]} must use a shared typography token.`);
    }
    if (file.endsWith('.svelte') && /\sstyle(?:=|:)[^>]*(?:font-size|font-weight|font-family|line-height|letter-spacing)/.test(source.replace(/<style[^>]*>[\s\S]*?<\/style>/g, ''))) errors.push(`${file}: inline typography must move to its style owner and use shared tokens.`);
  }
}
await visit('src');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Typography check passed: ${checked} declarations use shared tokens or CSS inheritance.`);
