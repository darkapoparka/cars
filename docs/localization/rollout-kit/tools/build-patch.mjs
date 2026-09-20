import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Produces a review artifact only. Never opens a remote checkout or runs git apply.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const sha = content => createHash('sha256').update(content).digest('hex');
const original = read('evidence/original-core.ts');
const candidate = read('candidate/alreef-core.ts');
const expectedOriginalSha256 = '9b6d9abc2fc7d5019e275cf6082e2e58d5814f118e45ee0460e4c3abd3e2581d';
if (sha(original) !== expectedOriginalSha256) throw new Error('Recorded production source changed');
if (!original.endsWith('\n') || !candidate.endsWith('\n')) throw new Error('Expected LF-terminated source');
const before = original.slice(0, -1).split('\n');
const after = candidate.slice(0, -1).split('\n');
const patch = [
  'diff --git a/localization/core.ts b/localization/core.ts',
  '--- a/localization/core.ts',
  '+++ b/localization/core.ts',
  `@@ -1,${before.length} +1,${after.length} @@`,
  ...before.map(line => '-' + line), ...after.map(line => '+' + line), ''
].join('\n');
fs.writeFileSync(path.join(root, 'candidate/alreef-core.patch'), patch);
fs.writeFileSync(path.join(root, 'candidate/change-manifest.json'), JSON.stringify({
  status: 'candidate-not-applied', repository: 'darkapoparka/cars-alreefusedcars', branch: 'main',
  baseCommit: '41ddc34893a8cfcf0219d80a248aead5fbc0c435', target: 'localization/core.ts',
  expectedOriginalSha256, candidateSha256: sha(candidate), patchSha256: sha(patch),
  enabledLocales: ['en', 'bg'],
  additionalLanguages: 'metadata only; no completed additional translations or RTL acceptance',
  requires: [
    'review exact diff and current source ownership',
    'integrate authored policy/configuration/emitter, not only its generated output',
    'npm run locales:sync to update all three native mirrors and FAB outputs',
    'npm run check and npm test',
    'all three application typechecks and production builds',
    'local and production locale/browser/branding acceptance',
    'scoped main commit, existing Git deployment, exact alias verification'
  ]
}, null, 2) + '\n');
console.log(JSON.stringify({ status: 'review-artifacts-generated', installed: false, candidateSha256: sha(candidate) }));
