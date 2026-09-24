import { readdir, readFile } from 'node:fs/promises';

const tokenPath = 'src/lib/styles/tokens.css';
const errors = [];
const files = [];

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) { await visit(file); continue; }
    if (/\.(css|svelte|ts)$/.test(file)) files.push(file);
  }
}

function withoutComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '');
}

function declarations(source) {
  return [...withoutComments(source).matchAll(/(--dn-[\w-]+)\s*:\s*([^;}]+);/g)]
    .map(([, name, value]) => ({ name, value: value.trim() }));
}

function references(source) {
  return [...withoutComments(source).matchAll(/var\(\s*(--dn-[\w-]+)(\s*,)?/g)]
    .map(([, name, fallback]) => ({ name, hasFallback: Boolean(fallback) }));
}
const tokenSource = await readFile(tokenPath, 'utf8');
const tokenDeclarations = declarations(tokenSource);
const globalTokens = new Map();
for (const token of tokenDeclarations) {
  if (globalTokens.has(token.name)) errors.push(`${tokenPath}: duplicate declaration for ${token.name}.`);
  globalTokens.set(token.name, token.value);
}

const expectedControlScale = new Map([
  ['--dn-control-height-compact', '40px'],
  ['--dn-control-height-default', '44px'],
  ['--dn-control-icon-size', '18px'],
  ['--dn-entry-action-icon-size', '15px']
]);
for (const [name, value] of expectedControlScale) {
  if (globalTokens.get(name) !== value) errors.push(`${tokenPath}: ${name} must remain ${value}.`);
}

const expectedAliases = new Map([
  ['--dn-compact-control-visual-height', 'var(--dn-control-height-compact)'],
  ['--dn-compact-control-inset', 'calc((var(--dn-control-height-default) - var(--dn-compact-control-visual-height)) / 2)'],
  ['--dn-control-height-editor', 'var(--dn-control-height-default)'],
  ['--dn-overlay-control-height-compact', 'var(--dn-control-height-default)'],
  ['--dn-overlay-control-height-expanded', 'var(--dn-control-height-editor)'],
  ['--dn-overlay-control-height', 'var(--dn-overlay-control-height-compact)'],
  ['--dn-overlay-field-font', 'var(--dn-entry-font)'],
  ['--dn-overlay-option-font', 'var(--dn-control-font)'],
  ['--dn-overlay-action-font', 'var(--dn-cta-font)'],
  ['--dn-entry-height', 'var(--dn-control-height-editor)'],
  ['--dn-control-hit-height', 'var(--dn-control-height-default)'],
  ['--dn-segment-height', 'var(--dn-control-height-compact)'],
  ['--dn-entry-action-height', 'var(--dn-control-height-default)'],
  ['--dn-compact-control-font', 'var(--dn-control-font)'],
  ['--dn-entry-action-gap', 'var(--dn-space-2)'],
  ['--dn-entry-icon-gap', 'var(--dn-space-3)'],
  ['--dn-compact-control-padding-inline', 'var(--dn-space-4)'],
  ['--dn-entry-action-padding-inline', 'var(--dn-space-5)'],
  ['--dn-mobile-canvas', 'var(--dn-surface-canvas)'],
  ['--dn-mobile-surface', 'var(--dn-surface-raised)'],
  ['--dn-home-panel', 'var(--dn-surface-panel)'],
  ['--dn-entry-line', 'var(--dn-line-strong)']
]);
for (const [name, value] of expectedAliases) {
  if (globalTokens.get(name) !== value) errors.push(`${tokenPath}: ${name} must alias ${value}.`);
}

const graph = new Map();
for (const [name, value] of globalTokens) {
  const refs = references(value).map(reference => reference.name);
  graph.set(name, refs);
  for (const ref of refs) if (!globalTokens.has(ref)) errors.push(`${tokenPath}: ${name} references undeclared ${ref}.`);
}
const state = new Map();
function inspect(name, stack = []) {
  if (state.get(name) === 2) return;
  if (state.get(name) === 1) {
    const start = stack.indexOf(name);
    errors.push(`${tokenPath}: token reference cycle ${[...stack.slice(start), name].join(' -> ')}.`);
    return;
  }
  state.set(name, 1);
  for (const ref of graph.get(name) ?? []) inspect(ref, [...stack, name]);
  state.set(name, 2);
}
for (const name of globalTokens.keys()) inspect(name);

await visit('src');
const declaredAnywhere = new Set(globalTokens.keys());
const sourceByFile = new Map();
for (const file of files) {
  const source = await readFile(file, 'utf8');
  sourceByFile.set(file, source);
  for (const token of declarations(source)) declaredAnywhere.add(token.name);
  for (const match of source.matchAll(/setProperty\(\s*['"](--dn-[\w-]+)['"]/g)) declaredAnywhere.add(match[1]);
  for (const match of source.matchAll(/style:(--dn-[\w-]+)/g)) declaredAnywhere.add(match[1]);
}

let usageCount = 0;
for (const [file, source] of sourceByFile) {
  for (const reference of references(source)) {
    usageCount++;
    if (!reference.hasFallback && !declaredAnywhere.has(reference.name)) errors.push(`${file}: ${reference.name} is used without a declaration or fallback.`);
  }
}
const governedControlTokens = new Set([
  '--dn-entry-height',
  '--dn-control-hit-height',
  '--dn-segment-height',
  '--dn-entry-action-height'
]);
const controlAlias = /^var\(--dn-control-height-(?:compact|default|editor)\)$/;
for (const [file, source] of sourceByFile) {
  if (file === tokenPath) continue;
  for (const token of declarations(source)) {
    if (governedControlTokens.has(token.name) && !controlAlias.test(token.value)) {
      errors.push(`${file}: ${token.name} must reference a shared control-height token, not ${token.value}.`);
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Token check passed: ${globalTokens.size} global tokens, ${usageCount} source references, no unresolved aliases or cycles.`);
