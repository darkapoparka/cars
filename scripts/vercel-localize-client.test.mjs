import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scripts = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(scripts, 'vercel-localize-client.mjs'), 'utf8');

test('Vercel localization bootstrap uses a filtered sparse checkout', () => {
  assert.match(source, /run\('git', \['config', 'core\.sparseCheckout', 'true'\]/);
  assert.match(source, /'\/scripts\/\\n\/templates\/\\n\/docs\/\\n\/\*\.json\\n'/);
  assert.match(source, /\['fetch', '--no-tags', '--filter=blob:none', '--depth', '1', 'origin', carsCommit\]/);
  assert.doesNotMatch(source, /\['fetch', '--depth', '1', 'origin', carsCommit\]/);
});
