import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { independentGuidance, resolveIndependentTarget } from './create-independent-dealer.mjs';

test('independent guidance names one editable repository and preserves identity/layout boundaries', () => {
  const text = independentGuidance('example-cars', 'fixture/cars-example');
  assert.match(text, /ONLY editable source/);
  assert.match(text, /main/);
  assert.match(text, /Do not redesign heroes/);
  assert.match(text, /PNG\/WebP/);
  assert.match(text, /check-dealer/);
  assert.doesNotMatch(text, /Canonical dealer source lives under clients/);
});
test('independent target rejects traversal and occupied sources', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-independent-test-'));
  assert.equal(resolveIndependentTarget(root, 'example-cars'), path.join(root, 'example-cars'));
  for (const slug of ['../escape', '/absolute', 'a/b', 'Mixed Name']) assert.throws(() => resolveIndependentTarget(root, slug));
  fs.mkdirSync(path.join(root, 'example-cars'));
  assert.throws(() => resolveIndependentTarget(root, 'example-cars'), /Existing/);
});
