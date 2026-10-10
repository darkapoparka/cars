import assert from 'node:assert/strict';
import {readFileSync, readdirSync, existsSync, statSync} from 'node:fs';
import path from 'node:path';
import {it} from 'node:test';
import ts from 'typescript';

const root = process.cwd();
const files = directory => readdirSync(directory, {recursive: true}).filter(file => /\.tsx?$/.test(file)).map(file => (directory + '/' + file).replaceAll('\\', '/'));
function imports(file) {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const dependencies = [];
  function visit(node) {
    let specifier;
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const typeOnly = ts.isImportDeclaration(node) ? node.importClause?.isTypeOnly : node.isTypeOnly;
      if (!typeOnly) specifier = node.moduleSpecifier.text;
    }
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && ts.isStringLiteral(node.arguments[0])) specifier = node.arguments[0].text;
    if (specifier && (specifier.startsWith('@/') || specifier.startsWith('.'))) {
      const base = specifier.startsWith('@/') ? specifier.slice(2) : path.relative(root, path.resolve(path.dirname(file), specifier)).replaceAll('\\', '/');
      const resolved = ['', '.ts', '.tsx', '.json', '/index.ts', '/index.tsx'].map(suffix => base + suffix).find(candidate => existsSync(candidate) && statSync(candidate).isFile());
      assert.ok(resolved, `Unresolved local import ${specifier} in ${file}`);
      dependencies.push(resolved);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  const client = source.statements.some(statement => ts.isExpressionStatement(statement) && ts.isStringLiteral(statement.expression) && statement.expression.text === 'use client');
  return {dependencies, client};
}

it('keeps server snapshots, validators and request APIs outside all client import graphs', () => {
  const visited = new Set();
  const reachable = new Set();
  function visit(file, client = false) {
    const key = `${client}:${file}`;
    if (visited.has(key)) return;
    visited.add(key); reachable.add(file);
    if (client) assert.ok(!/(?:\.server\.ts|locale-server\.ts|dealer-schema\.ts|captured-vehicle-details\.json)$/.test(file), `Server-only data reached by a client: ${file}`);
    if (!/\.tsx?$/.test(file)) return;
    const parsed = imports(file);
    for (const dependency of parsed.dependencies) visit(dependency, client || parsed.client);
  }
  for (const entry of [...files('app'), 'proxy.ts']) visit(entry);
  const unused = files('components').filter(file => !file.endsWith('.stylex.ts') && !reachable.has(file));
  assert.deepEqual(unused, [], 'Remove unreachable legacy components or connect them to a real route.');
});

it('validates the public dealer configuration and inventory identity boundary', () => {
  const dealer = JSON.parse(readFileSync('lib/dealer.json', 'utf8'));
  assert.ok(['template', 'dealer'].includes(dealer.mode));
  assert.ok(typeof dealer.id === 'string' && dealer.id.trim());
  assert.ok(Array.isArray(dealer.enabledLocales) && dealer.enabledLocales.length);
  assert.ok(dealer.enabledLocales.every(locale => ['en', 'bg'].includes(locale)));
  assert.ok(dealer.enabledLocales.includes(dealer.defaultLocale));
  assert.match(dealer.currency, /^[A-Z]{3}$/);
  for (const [key, value] of Object.entries(dealer.logo)) assert.ok(typeof value === 'string' && (/^\/(?!\/)/.test(value) || /^https:\/\//.test(value)), `Invalid logo ${key}`);
  for (const key of ['website', 'mapsUrl', 'whatsappUrl']) if (dealer[key]) {
    const url = new URL(dealer[key]);
    assert.equal(url.protocol, 'https:', `Unsafe public contact destination: ${key}`);
    assert.equal(url.username + url.password, '', `Credentials cannot be embedded in ${key}`);
  }
  if (dealer.phoneE164) assert.match(dealer.phoneE164, /^\+[1-9]\d{6,14}$/);
  for (const file of ['lib/dealer-inventory.json', 'lib/dealer-import-inventory.json']) {
    const rows = JSON.parse(readFileSync(file, 'utf8'));
    assert.ok(Array.isArray(rows));
    const slugs = rows.map(row => (row.vehicle || row).slug);
    assert.ok(slugs.every(slug => typeof slug === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(slug)), `Invalid vehicle slug in ${file}`);
    assert.equal(new Set(slugs).size, slugs.length, `Duplicate vehicle slugs in ${file}`);
  }
});

it('keeps UI markup and demo catalogues out of the matching engine', () => {
  const dependencies = imports('lib/inventory-filters.ts').dependencies;
  assert.ok(!dependencies.some(file => file.includes('components/') || /(?:data|captured-inventory|inventory-options)\.ts$/.test(file)));
});
