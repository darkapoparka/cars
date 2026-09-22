import assert from 'node:assert/strict';
import test from 'node:test';
import { nativeBuildPlan } from './publishing/build-native-service.mjs';

test('native Vercel builds install complete service dependencies before compilation', () => {
  for (const key of ['auto-best', 'import', 'carwow']) {
    assert.deepEqual(nativeBuildPlan(key).steps[0], ['npm', 'ci', '--include=dev']);
  }
  const modern = nativeBuildPlan('modern');
  assert.deepEqual(modern.steps[0].slice(0, 5), [
    'npx', '--yes', '--package=node@22.23.2', '--package=pnpm@11.4.0', '-c'
  ]);
  assert.equal(modern.steps[0][5], 'pnpm install --frozen-lockfile --prod=false');
  assert.match(modern.steps[1][5], /pnpm --filter @repo\/database build/);
});
