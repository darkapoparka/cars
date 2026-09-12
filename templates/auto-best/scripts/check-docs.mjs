import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
const docs = [];
async function collect(directory, recursive) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory() && recursive && entry.name !== 'audits') await collect(filename, true);
    else if (entry.isFile() && entry.name.endsWith('.md')) docs.push(filename);
  }
}
await collect(root, false);
for (const directory of ['docs', 'src', 'scripts']) await collect(path.join(root, directory), true);
const errors = [];
for (const filename of docs) {
  const source = await readFile(filename, 'utf8');
  if (source.includes('\uFFFD')) errors.push(`${filename}: invalid UTF-8 replacement character`);
  for (const match of source.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const link = match[1];
    if (/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(link)) continue;
    const target = path.resolve(path.dirname(filename), decodeURIComponent(link.split('#')[0]));
    try { await access(target); } catch { errors.push(`${path.relative(root, filename)}: missing link ${link}`); }
  }
  for (const match of source.matchAll(/npm run ([a-z][a-z0-9:-]*)/g)) {
    if (!(match[1] in packageJson.scripts)) errors.push(`${path.relative(root, filename)}: unknown package command ${match[1]}`);
  }
}
for (const [name, command] of Object.entries(packageJson.scripts)) {
  for (const match of command.matchAll(/node (scripts\/[\w.-]+\.mjs)/g)) {
    try { await access(match[1]); } catch { errors.push(`package script ${name}: missing ${match[1]}`); }
  }
}
const manifest = JSON.parse(await readFile('.template/template.json', 'utf8'));
for (const filename of manifest.brandFiles) {
  try { await access(filename); } catch { errors.push(`Template personalization owner missing: ${filename}`); }
}
assert.equal(errors.length, 0, errors.join('\n'));
console.log(`Documentation check passed: ${docs.length} active documents, links, package commands and personalization owners.`);
