import {readFile, writeFile} from 'node:fs/promises';
const source = await readFile('reference/2026-09-26-parity/public-fortuner.html', 'utf8');
const marker = 'window.__PRELOADED_STATE__';
const markerIndex = source.indexOf(marker), start = source.indexOf('{', markerIndex);
if (markerIndex < 0 || start < 0) throw Error('Reference state missing');
let depth = 0, quoted = false, escaped = false, end = -1;
for (let index = start; index < source.length; index++) {
  const character = source[index];
  if (quoted) {if (escaped) escaped = false; else if (character === '\\') escaped = true; else if (character === '"') quoted = false; continue;}
  if (character === '"') quoted = true;
  else if (character === '{' || character === '[') depth++;
  else if (character === '}' || character === ']') {depth--; if (!depth) {end = index + 1; break;}}
}
if (end < 0) throw Error('Incomplete reference JSON');
const state = JSON.parse(source.slice(start, end));
console.log('STATE KEYS', Object.keys(state));
const selected = Object.fromEntries(Object.entries(state).filter(([key]) => /detail|listing|vehicle|pricing|finance|warranty|inspection/i.test(key)));
await writeFile('reference/2026-09-26-continuation/fortuner-detail-state.json', JSON.stringify(selected, null, 2));
const assets = [];
function walk(value, path = '') {
  if (typeof value === 'string' && /^https?:/.test(value) && /\.(svg|png|jpg|webp)/i.test(value)) assets.push({path, url: value});
  else if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) walk(item, `${path}.${key}`);
}
walk(selected);
await writeFile('reference/2026-09-26-continuation/fortuner-detail-assets.json', JSON.stringify(assets, null, 2));
console.log('SELECTED', Object.entries(selected).map(([key, value]) => [key, Object.keys(value ?? {})]));
console.log('ASSETS', JSON.stringify(assets.filter(item => !/mainImage|gallery|helloAR|standardised/.test(item.url)).slice(0, 60)));
