import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// Compile the actual dependency-free browser helpers; importing them requires no DOM.
async function sourceModule(name) {
  const source = await readFile(new URL(`../src/lib/ui/${name}.ts`, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const { appendEnquiryPhotos, removeEnquiryPhoto, releaseEnquiryPhotos } = await sourceModule('enquiry-photos');
const { shareEnquiry } = await sourceModule('enquiry-share');
const file = (name, properties = {}) => ({ name, type: 'image/jpeg', size: 100, lastModified: 123, ...properties });
function objectUrls(failAt = Infinity) {
  const created = [], revoked = [];
  return { created, revoked,
    createObjectURL(file) { if (created.length === failAt) throw new Error('Allocation failed'); const url = `blob:${created.length}`; created.push({ file, url }); return url; },
    revokeObjectURL(url) { revoked.push(url); }
  };
}

test('accepted photos keep order, deduplicate file identity and do not mutate source state', () => {
  const urls = objectUrls();
  const source = Object.freeze([]);
  const first = file('a.jpg');
  const result = appendEnquiryPhotos(source, [first, first, file('b.png', { type: 'image/png' }), file('c.webp', { type: 'image/webp' })], urls);
  assert.equal(result.error, '');
  assert.deepEqual(result.photos.map(photo => photo.file.name), ['a.jpg', 'b.png', 'c.webp']);
  assert.equal(source.length, 0);
  assert.equal(urls.created.length, 3);
  const duplicate = appendEnquiryPhotos(result.photos, [file('a.jpg')], urls);
  assert.deepEqual(duplicate.photos, result.photos);
  assert.equal(urls.created.length, 3);
  assert.notEqual(duplicate.photos, result.photos);
});

test('photo type and size rejection precede allocation; 10 MiB is accepted exactly', () => {
  const urls = objectUrls();
  const maximum = 10 * 1024 * 1024;
  const result = appendEnquiryPhotos([], [file('invalid.gif', { type: 'image/gif' }), file('large.jpg', { size: maximum + 1 }), file('boundary.jpg', { size: maximum })], urls);
  assert.equal(result.error, 'size');
  assert.deepEqual(result.photos.map(photo => photo.file.name), ['boundary.jpg']);
  assert.equal(urls.created.length, 1);
  assert.equal(appendEnquiryPhotos([], [file('unknown', { type: '' })], urls).error, 'type');
});

test('six-photo cap preserves existing files and ignores duplicates before checking the cap', () => {
  const urls = objectUrls();
  const result = appendEnquiryPhotos([], Array.from({ length: 8 }, (_, i) => file(`${i}.jpg`)), urls);
  assert.equal(result.photos.length, 6);
  assert.equal(result.error, 'limit');
  assert.equal(urls.created.length, 6);
  assert.equal(appendEnquiryPhotos(result.photos, [file('0.jpg')], urls).error, '');
  assert.equal(appendEnquiryPhotos(result.photos, [file('new.jpg')], urls).error, 'limit');
  assert.equal(urls.created.length, 6);
});

test('file removal and owner disposal release only owned object URLs', () => {
  const urls = objectUrls();
  const { photos } = appendEnquiryPhotos([], [file('a.jpg'), file('b.jpg')], urls);
  const remaining = removeEnquiryPhoto(photos, photos[0].url, urls);
  assert.equal(photos.length, 2);
  assert.deepEqual(urls.revoked, ['blob:0']);
  assert.deepEqual(removeEnquiryPhoto(remaining, 'blob:0', urls), remaining);
  assert.deepEqual(urls.revoked, ['blob:0']);
  releaseEnquiryPhotos(remaining, urls);
  assert.deepEqual(urls.revoked, ['blob:0', 'blob:1']);
});

test('an allocation failure rolls back new previews without revoking existing ones', () => {
  const urls = objectUrls(2);
  const initial = appendEnquiryPhotos([], [file('existing.jpg')], urls).photos;
  assert.throws(() => appendEnquiryPhotos(initial, [file('new.jpg'), file('fails.jpg')], urls), /Allocation failed/);
  assert.deepEqual(urls.revoked, ['blob:1']);
  assert.equal(initial.length, 1);
  assert.equal(initial[0].url, 'blob:0');
});

test('text sharing invokes the native API before yielding, with its browser receiver', async () => {
  const data = { title: 'Enquiry', text: 'User-owned text' };
  let called = false;
  const browser = { share(value) { assert.equal(this, browser); assert.equal(value, data); called = true; return Promise.resolve(); } };
  const pending = shareEnquiry(data, browser);
  assert(called, 'Transient activation must not be deferred by an earlier await');
  assert.equal(await pending, 'shared');
});

test('files are never silently omitted; unsupported sharing asks for the existing manual fallback', async () => {
  const data = { text: 'Enquiry', files: [file('a.jpg')] };
  let shared = false;
  assert.equal(await shareEnquiry(data, { share() { shared = true; } }), 'unsupported-files');
  assert.equal(await shareEnquiry(data, { canShare: () => false, share() { shared = true; } }), 'unsupported-files');
  assert.equal(shared, false);
  const browser = { canShare(value) { assert.equal(this, browser); assert.deepEqual(value, { files: data.files }); return true; }, share(value) { assert.equal(value, data); return Promise.resolve(); } };
  assert.equal(await shareEnquiry(data, browser), 'shared');
  assert.equal(await shareEnquiry({ text: 'text only' }, {}), 'copy');
});

test('cancellation and capability/API failures remain distinct from successful sharing', async () => {
  const data = { text: 'Enquiry' };
  for (const error of [new DOMException('Cancelled', 'AbortError'), { name: 'AbortError' }]) {
    assert.equal(await shareEnquiry(data, { share() { return Promise.reject(error); } }), 'cancelled');
  }
  assert.equal(await shareEnquiry(data, { share() { throw new Error('Denied'); } }), 'failed');
  assert.equal(await shareEnquiry({ ...data, files: [file('a.jpg')] }, { canShare() { throw new Error('Denied'); } }), 'failed');
});
