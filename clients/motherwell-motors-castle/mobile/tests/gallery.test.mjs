import test from 'node:test';
import assert from 'node:assert/strict';
import { clampPhotoPan } from '../.qa/domain/gallery.mjs';

test('letterboxed landscape photo cannot drift vertically while shorter than its frame', () => {
  const pan = clampPhotoPan({ x: 999, y: 999 }, 2, 427, 852, 1280, 960);
  assert.equal(pan.x, 213.5);
  assert.equal(pan.y, 0);
});
test('zoomed photo pan is bounded by its rendered dimensions', () => {
  const pan = clampPhotoPan({ x: -9999, y: 9999 }, 4, 400, 800, 1200, 900);
  assert.deepEqual(pan, { x: -600, y: 200 });
});
test('zoom reset and invalid image dimensions always center the photo', () => {
  for (const params of [
    [1, 400, 800, 1200, 900],
    [2, 400, 800, 0, 0],
    [NaN, 400, 800, 1200, 900],
  ]) {
    assert.deepEqual(clampPhotoPan({ x: 5, y: 8 }, ...params), { x: 0, y: 0 });
  }
});
test('portrait photos and non-finite pan values stay bounded', () => {
  const portrait = clampPhotoPan({ x: 10000, y: -10000 }, 2, 400, 800, 600, 1800);
  assert.ok(Math.abs(portrait.x - 200 / 3) < 0.0001);
  assert.equal(portrait.y, -400);
  assert.deepEqual(clampPhotoPan({ x: NaN, y: Infinity }, 2, 400, 800, 1200, 900), { x: 0, y: 0 });
});
