import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import ts from 'typescript';

// Exercise the real helper implementation without requiring a running web server.
const output = path.resolve('artifacts/overlay-unit');
await mkdir(output, { recursive: true });
for (const name of ['focus', 'overlay', 'dialog-viewport']) {
  const source = await readFile(`src/lib/ui/${name}.ts`, 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022
  } }).outputText.replace("from './focus'", "from './focus.mjs'");
  await writeFile(path.join(output, `${name}.mjs`), code);
}
const { lockPageScroll, preserveScrollOffset } = await import(pathToFileURL(path.join(output, 'overlay.mjs')));
const { dialogViewport } = await import(pathToFileURL(path.join(output, 'dialog-viewport.mjs')));
class Style {
  values = new Map();
  setProperty(key, value, priority = '') { this.values.set(key, { value, priority }); }
  getPropertyValue(key) { return this.values.get(key)?.value ?? ''; }
  getPropertyPriority(key) { return this.values.get(key)?.priority ?? ''; }
  removeProperty(key) { const value = this.getPropertyValue(key); this.values.delete(key); return value; }
}
const results = [];
try {
  for (const [value, priority] of [['', ''], ['auto', 'important'], ['scroll', '']]) {
    for (const order of [[0,1,2], [0,2,1], [1,0,2], [1,2,0], [2,0,1], [2,1,0]]) {
      const style = new Style();
      if (value) style.setProperty('overflow', value, priority);
      globalThis.document = { body: { style } };
      const releases = [lockPageScroll(), lockPageScroll(), lockPageScroll()];
      for (const [position, owner] of order.entries()) {
        releases[owner](); releases[owner](); // Unmount and close can both attempt cleanup.
        assert.equal(style.getPropertyValue('overflow'), position === 2 ? value : 'hidden');
      }
      assert.equal(style.getPropertyPriority('overflow'), priority);
      const releaseAgain = lockPageScroll(); releaseAgain();
      assert.equal(style.getPropertyValue('overflow'), value);
      results.push({ name: `scroll owners ${order} restore ${value || 'unset'} ${priority}`, passed: true });
    }
  }
  for (const restore of [true, false]) {
    const style = new Style(), calls = [];
    style.setProperty('--test-offset', '-12px');
    globalThis.document = { body: { style } };
    globalThis.window = { scrollY: 375, scrollTo: options => calls.push(options) };
    const release = preserveScrollOffset('--test-offset');
    assert.equal(style.getPropertyValue('--test-offset'), '-375px');
    release(restore); release(restore);
    assert.equal(style.getPropertyValue('--test-offset'), '-12px');
    assert.deepEqual(calls, restore ? [{ top: 375, behavior: 'instant' }] : []);
    results.push({ name: `offset restoration ${restore}`, passed: true });
  }
  const viewport = Object.assign(new EventTarget(), { height: 844, offsetTop: 0 });
  globalThis.window = { visualViewport: viewport };
  const first = { style: new Style() };
  const releaseFirst = dialogViewport(first);
  assert.equal(first.style.getPropertyValue('--dn-dialog-viewport-height'), '844px');
  assert.equal(first.style.getPropertyValue('--dn-dialog-viewport-top'), '0px');
  results.push({ name: 'dialog starts within the visible viewport', passed: true });

  viewport.height = 410;
  viewport.dispatchEvent(new Event('resize'));
  assert.equal(first.style.getPropertyValue('--dn-dialog-viewport-height'), '410px');
  results.push({ name: 'dialog follows keyboard viewport resize', passed: true });

  viewport.offsetTop = 32;
  viewport.dispatchEvent(new Event('scroll'));
  assert.equal(first.style.getPropertyValue('--dn-dialog-viewport-top'), '32px');
  results.push({ name: 'dialog follows viewport panning', passed: true });

  const nested = { style: new Style() };
  const releaseNested = dialogViewport(nested);
  releaseFirst();
  viewport.height = 844;
  viewport.offsetTop = 0;
  viewport.dispatchEvent(new Event('resize'));
  assert.equal(first.style.getPropertyValue('--dn-dialog-viewport-height'), '');
  assert.equal(nested.style.getPropertyValue('--dn-dialog-viewport-height'), '844px');
  assert.equal(nested.style.getPropertyValue('--dn-dialog-viewport-top'), '0px');
  results.push({ name: 'nested dialog retains independent viewport ownership', passed: true });

  releaseNested();
  viewport.dispatchEvent(new Event('resize'));
  viewport.dispatchEvent(new Event('scroll'));
  assert.equal(nested.style.getPropertyValue('--dn-dialog-viewport-height'), '');
  assert.equal(nested.style.getPropertyValue('--dn-dialog-viewport-top'), '');
  results.push({ name: 'dialog unmount releases viewport listeners and styles', passed: true });

  globalThis.window = { visualViewport: null };
  const fallback = { style: new Style() };
  assert.equal(dialogViewport(fallback), undefined);
  assert.equal(fallback.style.getPropertyValue('--dn-dialog-viewport-height'), '');
  results.push({ name: 'missing visual viewport preserves CSS fallback', passed: true });
} finally { delete globalThis.document; delete globalThis.window; }
await writeFile(path.join(output, 'report.json'), JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
console.log(`PASS ${results.length} scroll ownership, restoration and dialog viewport checks`);
