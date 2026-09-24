import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'svelte/compiler';
import ts from 'typescript';
import { compileCatalog, normalizeCopy } from './locale-catalog.mjs';

/** Check native source boundaries, not a DOM replacement or translation fallback. */
export function auditSource(source, filename, catalog) {
  const issues = [];
  const invariant = new Set(['VIN', 'URL', 'km', 'km/h', 'kW', 'hp', 'EUR', 'English', 'Български',
    ...Object.keys(catalog.en).filter(k => catalog.en[k] === catalog.bg[k]).map(k => normalizeCopy(catalog.en[k]))]);
  function lookup(kind, value, position) {
    if (typeof value !== 'string') return; // Dynamic data is covered by runtime route/state tests.
    const valid = kind === 'key' ? Object.hasOwn(catalog.en, value) : Object.hasOwn(catalog.sourceKeys, normalizeCopy(value));
    if (!valid) issues.push({ file: filename, line: source.slice(0, position || 0).split('\n').length, kind, value });
  }
  function text(value, position) {
    const normalized = normalizeCopy(value);
    if (/[A-Za-z\u0400-\u04ff]/u.test(normalized) && !invariant.has(normalized))
      issues.push({ file: filename, line: source.slice(0, position || 0).split('\n').length, kind: 'unkeyed-rendered-copy', value: normalized });
  }
  function visit(node, nativeName = false) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(child => visit(child, nativeName)); return; }
    const autonym = nativeName || (node.name === 'option' && node.attributes?.some(a => a.name === 'lang'));
    if (node.type === 'Text' && !autonym) text(node.data, node.start);
    if (node.type === 'CallExpression') inspectCall(node.callee, node.arguments, node.start);
    if (node.type === 'RegularElement') for (const a of node.attributes || []) {
      if (['aria-label', 'placeholder', 'title', 'alt'].includes(a.name))
        for (const v of Array.isArray(a.value) ? a.value : a.value && typeof a.value === 'object' ? [a.value] : []) if (v.type === 'Text') text(v.data, v.start);
    }
    for (const a of node.attributes || []) for (const value of Array.isArray(a.value) ? a.value : a.value && typeof a.value === 'object' ? [a.value] : []) {
      if (value.type !== 'Text') visit(value, autonym);
    }
    for (const [key, value] of Object.entries(node))
      if (!['attributes', 'css', 'loc', 'metadata', 'parent'].includes(key)) visit(value, autonym);
  }
  function inspectCall(callee, args, start) {
    const member = callee?.type === 'MemberExpression' && callee.object?.name === 'i18n';
    if (member && ['t', 'text'].includes(callee.property?.name))
      lookup(callee.property.name === 't' ? 'key' : 'alias', args[0]?.value, start);
    if (callee?.type === 'Identifier' && ['message', 'templateText', 'templateMessage', 'formatTemplate'].includes(callee.name))
      lookup(callee.name === 'message' ? 'key' : 'alias', args[1]?.value, start);
  }
  if (filename.endsWith('.svelte')) visit(parse(source, { modern: true }));
  else {
    const tree = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
    const walk = node => {
      if (ts.isCallExpression(node)) {
        const callee = ts.isPropertyAccessExpression(node.expression)
          ? { type: 'MemberExpression', object: { name: node.expression.expression.getText(tree) }, property: { name: node.expression.name.text } }
          : { type: 'Identifier', name: node.expression.getText(tree) };
        inspectCall(callee, node.arguments.map(a => ({ value: ts.isStringLiteralLike(a) ? a.text : undefined })), node.pos);
      }
      ts.forEachChild(node, walk);
    };
    walk(tree);
  }
  return issues;
}

export function auditApplication(root) {
  const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
  const catalog = compileCatalog(read('localization/common.json'),
    ['catalog', 'template', 'dealer'].flatMap(n => read(`localization/${n}.reviewed.json`)));
  const files = fs.readdirSync(path.join(root, 'src'), { recursive: true })
    .map(p => 'src/' + p.replaceAll('\\', '/'))
    .filter(p => /\.(ts|svelte)$/.test(p) && !p.endsWith('/catalog.ts'));
  const issues = files.flatMap(p => auditSource(fs.readFileSync(path.join(root, p), 'utf8'), p, catalog));
  return { files: files.length, issues };
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.dirname, 'locale-source-audit.mjs')) {
  const result = auditApplication(path.resolve(import.meta.dirname, '..'));
  console.log(JSON.stringify(result, null, 2));
  if (result.issues.length) process.exitCode = 1;
}
