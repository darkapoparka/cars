/** Source/data checks only. Does not compile Svelte templates, build, or render a browser. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { createHash } = require('node:crypto');
const root = path.resolve(process.argv[2] || path.join(__dirname, '../auto-best'));
const appRequire = createRequire(path.join(root, 'package.json'));
const ts = appRequire('typescript');
const files = {
  videos: 'src/lib/data/videos.ts',
  video: 'src/lib/components/home/VideoSection.svelte',
  footer: 'src/lib/components/layout/Footer.svelte',
};
const texts = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, fs.readFileSync(path.join(root, file), 'utf8')]));
const checks = [];
function check(name, fn) { fn(); checks.push(name); }
function compile(source) {
  const result = ts.transpileModule(source, { reportDiagnostics: true, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const errors = (result.diagnostics || []).filter(item => item.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, errors.map(item => ts.flattenDiagnosticMessageText(item.messageText, '\n')).join('\n'));
  return result.outputText;
}
function script(source) { const match = source.match(/<script lang="ts">([\s\S]*?)<\/script>/); assert(match); return match[1]; }
check('video data TypeScript syntax', () => compile(texts.videos));
check('video script TypeScript syntax (not Svelte markup)', () => compile(script(texts.video)));
check('footer script TypeScript syntax (not Svelte markup)', () => compile(script(texts.footer)));
check('no inherited dealer videos are offered', () => {
  const context = { exports: {} };
  vm.runInNewContext(compile(texts.videos), context, { timeout: 1000 });
  assert(Array.isArray(context.exports.featuredVideos));
  assert.equal(context.exports.featuredVideos.length, 0);
});
check('source personality and retired video IDs removed from video consumers', () => {
  for (const value of ['Кристиан Кирилов', '6S3dLIgeAT8', 'zG6rjLpT4u8', 'w_XaGmIWJFM']) assert(!(texts.videos + texts.video).includes(value), value);
});
check('both channel links have explicit configuration guards', () => {
  assert.equal((texts.video.match(/\{#if brand\.youtubeUrl\}/g) || []).length, 2);
  assert.equal((texts.video.match(/href=\{brand\.youtubeUrl\}/g) || []).length, 2);
});
check('video playback, focus return, and existing grid retained in source', () => {
  for (const value of ['function play(', 'async function stop()', 'await tick();', 'trigger?.focus();', 'activeVideo === video.id', 'class="dn-videos__grid"', 'youtube-nocookie.com/embed/']) assert(texts.video.includes(value), value);
});
check('unavailable video state preserves section and offers a real call, not delivery success', () => {
  for (const value of ['<section class="dn-videos"', '{#if hasVideos}', 'class="dn-videos__empty"', 'href={brand.phoneHref}', 'Тази страница не изпраща запитване.']) assert(texts.video.includes(value), value);
});
check('four footer action routes and original icon choices retained', () => {
  const source = script(texts.footer).replace(/^\s*import [^\n]+;\s*$/gm, '') + '\n;globalThis.result = actions;';
  const context = { brand: { city: 'София', phoneHref: 'tel:+359878842409' }, $props: () => ({}) };
  vm.runInNewContext(compile(source), context, { timeout: 1000 });
  assert.deepEqual(JSON.parse(JSON.stringify(context.result.map(item => [item.href, item.icon]))), [
    ['/listing-grid', 'car'], ['/contact?topic=inspection', 'contact'], ['/contact?topic=leasing', 'finance'], ['/contact?topic=import', 'value'],
  ]);
});
check('footer says bank financing without inherited in-house or premium claims', () => {
  assert(texts.footer.includes('Банково финансиране'));
  assert(!/собствен лизинг|премиум автомобили/i.test(texts.footer));
});
const inputs = Object.fromEntries(Object.entries(files).map(([key, file]) => {
  const bytes = Buffer.from(texts[key]);
  return [file, createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex')];
}));
console.log(JSON.stringify({ scope: 'Source/data contract only; not Svelte check, build, browser, or full-app QA', runtime: process.version, typescript: ts.version, passed: checks.length, failed: 0, checks, inputGitBlobs: inputs }, null, 2));
