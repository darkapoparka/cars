import test from 'node:test';
import assert from 'node:assert/strict';
import { desktopPopoverPosition as place } from '../.qa/domain/desktop-popover.mjs';
const viewport = { width: 1440, height: 1000 };
const popup = { width: 880, height: 387 };

test('a hero picker opens directly below its search box', () => {
  assert.deepEqual(place({ top: 244, bottom: 312, left: 272 }, popup, viewport), {
    top: 320, left: 272, maxHeight: 664,
  });
});

test('a picker near the viewport bottom opens above its anchor', () => {
  assert.deepEqual(place({ top: 820, bottom: 880, left: 272 }, popup, viewport), {
    top: 425, left: 272, maxHeight: 796,
  });
});

test('right and left edge anchors keep the editor inside the viewport', () => {
  assert.equal(place({ top: 244, bottom: 312, left: 1380 }, popup, viewport).left, 544);
  assert.equal(place({ top: 244, bottom: 312, left: -60 }, popup, viewport).left, 16);
});

test('a short viewport constrains the editor height without moving it offscreen', () => {
  const position = place({ top: 180, bottom: 248, left: 160 }, popup, {width:1280,height:400});
  assert.deepEqual(position, { top:16, left:160, maxHeight:156 });
  assert.ok(position.top + Math.min(popup.height,position.maxHeight) <= 384);
});

test('an editor remains reachable while its anchor scrolls out of view', () => {
  const position = place({ top:-120,bottom:-52,left:272 }, popup, viewport);
  assert.deepEqual(position, {top:16,left:272,maxHeight:968});
});

test('a very short viewport still contains the minimum editor height', () => {
  const position = place({top:80,bottom:140,left:272},popup,{width:1440,height:180});
  assert.deepEqual(position,{top:16,left:272,maxHeight:120});
  assert.ok(position.top + position.maxHeight <= 164);
});
