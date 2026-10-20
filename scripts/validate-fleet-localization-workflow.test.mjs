import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import { selectPinnedRevisions } from './dealer-updates/three-way-upgrade.mjs';
import { isCarsTemplateSource } from './lib/template-source.mjs';
import { planSixDesignSelection, SIX_DESIGN_KEYS } from './lib/six-design-release.mjs';
import { POLICY } from './lib/workflow.mjs';

const workflow = fs.readFileSync(new URL('../.github/workflows/validate-fleet-localization-rollout.yml', import.meta.url), 'utf8').replaceAll('\r\n', '\n');
const checkouts = workflow.split(/^      - /m).filter(step => step.startsWith('uses: actions/checkout@v4\n'));
const matrixScript = workflow.match(/          node <<'NODE'\n([\s\S]*?)^          NODE$/m)?.[1].replace(/^          /gm, '');
const manifestScript = workflow.match(/          node <<'MANIFEST'\n([\s\S]*?)^          MANIFEST$/m)?.[1].replace(/^          /gm, '');
const cohort = [...matrixScript.match(/const cohort = new Set\(\[([\s\S]*?)\]\);/)[1].matchAll(/'([a-z0-9-]+)'/g)].map(match => match[1]);
const fixture = () => cohort.map(slug => ({ slug, repository: 'fixture/cars-' + slug, delivery: { projectId: null, url: null } }));
const trio = middle => [
  { key: 'auto-best', base: '', entry: '/' },
  { key: middle, base: '/variant-2', entry: middle === 'modern' ? '/variant-2/cars' : '/variant-2/' },
  { key: 'carwow', base: '/variant-3', entry: '/variant-3/' },
];

function resolveDealers(selection, dealers = fixture(), format = 'legacy-three-design-v1') {
  let output = '';
  vm.runInNewContext(matrixScript, {
    require(name) {
      assert.equal(name, 'node:fs');
      return {
        readFileSync(file) { assert.equal(file, 'docs/DEPLOYMENT-INVENTORY.json'); return JSON.stringify({ dealers }); },
        appendFileSync(file, value) { assert.equal(file, 'fixture-output'); output += value; },
      };
    },
    process: { env: { GITHUB_OUTPUT: 'fixture-output', DEALER_SELECTION: selection, PACKAGE_FORMAT: format } },
    console: { log() {} },
  });
  assert.match(output, /^dealers=\{.*\}\n$/);
  return JSON.parse(output.slice('dealers='.length)).include;
}

function preflight(manifest) {
  let report;
  vm.runInNewContext(manifestScript, {
    require(name) {
      assert.equal(name, 'node:fs');
      return { readFileSync(file) { assert.equal(file, 'client/dealer.json'); return JSON.stringify(manifest); } };
    },
    process: { env: { DEALER_SLUG: 'isauto-varna', DEALER_REPOSITORY: 'fixture/cars-isauto-varna' } },
    console: { log(value) { report = JSON.parse(value); } },
  });
  return report;
}

test('lock changes automatically run current six-family contracts; legacy packaging requires explicit dispatch', () => {
  assert.match(workflow, /- 'templates\.lock\.json'/);
  assert.match(workflow, /name: Validate current six-family pins and legacy workflow boundaries[\s\S]*?scripts\/six-design-release\.test\.mjs/);
  assert.match(workflow, /name: Exercise maintained six-family source acceptance contracts without compiling applications[\s\S]*?scripts\/existing-fleet-cloudflare\.test\.mjs/);
  assert.match(workflow, /^  matrix:\n    if: github\.event_name == 'workflow_dispatch'\n    needs: contracts$/m);
  assert.match(workflow, /package_format:[\s\S]*?options: \[legacy-three-design-v1\]/);
  assert.equal(checkouts.length, 4);
  assert.match(checkouts[0], /sparse-checkout: \|\n\s+\/\.github\/workflows\/validate-fleet-localization-rollout\.yml\n\s+\/scripts\/\n\s+\/templates\.lock\.json/);
  assert.doesNotMatch(checkouts[0], /fetch-depth: 0|\/clients\/|\/templates\//);
});

test('the actual lock supplies all six immutable Cars source tuples through the maintained pin selector', t => {
  const lock = JSON.parse(fs.readFileSync(new URL('../templates.lock.json', import.meta.url), 'utf8'));
  const variants = planSixDesignSelection(trio('modern')).variants;
  const manifest = {
    variants,
    templateRevisions: Object.fromEntries(SIX_DESIGN_KEYS.map(key => [key, lock.templates[key]?.commit])),
    templateSources: Object.fromEntries(SIX_DESIGN_KEYS.map(key => [key, lock.templates[key]?.source])),
  };
  const pins = selectPinnedRevisions(manifest, lock);
  assert.deepEqual(Object.keys(pins).sort(), [...SIX_DESIGN_KEYS].sort());
  for (const key of SIX_DESIGN_KEYS) {
    const release = lock.templates[key], source = pins[key].targetSource;
    assert(isCarsTemplateSource(source), key + ': exact Cars subtree source required');
    assert.equal(release.exportPolicy, POLICY);
    assert.equal(release.snapshotPath, 'templates/' + key);
    assert.equal(source.revision, release.commit);
    assert.equal(source.digest, release.digest);
    assert.equal(source.path, release.snapshotPath);
  }
  const invalid = structuredClone(lock); invalid.templates.mobile.commit = 'main'; invalid.templates.mobile.source.revision = 'main';
  assert.throws(() => selectPinnedRevisions(manifest, invalid), /exact approved target pin/);
  const omitted = structuredClone(lock); delete omitted.templates['karento-best'];
  assert.throws(() => selectPinnedRevisions(manifest, omitted), /exact approved target pin/);
  t.diagnostic(JSON.stringify({ contract: 'six-family-source-pins', families: Object.keys(pins), exactSourceBytesVerified: false, compiled: false, hosted: false }));
});

test('matrix checkout hydrates only the registry, without persisted credentials', () => {
  assert.match(checkouts[1], /persist-credentials: false/);
  assert.match(checkouts[1], /sparse-checkout-cone-mode: false/);
  assert.match(checkouts[1], /sparse-checkout: \/docs\/DEPLOYMENT-INVENTORY\.json\s*$/);
  assert.doesNotMatch(checkouts[1], /fetch-depth: 0/);
});

test('source checkout retains authenticated ancestry for exact release pins while excluding fleet blobs', () => {
  const source = checkouts[3];
  assert.match(source, /path: cars/);
  assert.match(source, /ref: \$\{\{ github\.sha \}\}/);
  assert.match(source, /fetch-depth: 0/);
  assert.match(source, /sparse-checkout-cone-mode: false/);
  assert.match(source, /persist-credentials: true/);
  assert.deepEqual(source.split('sparse-checkout: |\n')[1].trim().split('\n').map(line => line.trim()), [
    '/.github/workflows/validate-fleet-localization-rollout.yml', '/templates.lock.json', '/scripts/',
    '/docs/releases/**/*.json', '/templates/auto-best/', '/templates/modern/', '/templates/import/', '/templates/carwow/',
  ]);
  // checkout v4 requests blob:none automatically with sparse-checkout. Shallow
  // source history would break verifyTemplate's historical merge-base guard.
  assert.doesNotMatch(source, /\/clients\/|\/runtime\/|^\s*\/docs\/\s*$/m);
  assert.match(workflow, /if: always\(\) && steps\.source_checkout\.outcome == 'success'/);
  assert(workflow.indexOf('git -C cars config --local --unset-all http.https://github.com/.extraheader') < workflow.indexOf('uses: actions/upload-artifact@v4'));
});

test('private checkout requires explicit read access and checks format before historical Cars checkout', () => {
  const client = checkouts[2];
  assert.match(client, /repository: \$\{\{ matrix\.repository \}\}/);
  assert.match(client, /token: \$\{\{ secrets\.DEALER_REPOSITORIES_READ_TOKEN \}\}/);
  assert.match(client, /persist-credentials: false/);
  assert.match(client, /fetch-depth: 1/);
  const guard = workflow.indexOf('name: Require read access to private dealer repositories');
  const format = workflow.indexOf('name: Reject incompatible dealer formats');
  assert(guard > 0 && guard < workflow.indexOf('path: client') && format < workflow.indexOf('path: cars'));
  assert.match(workflow, /if \[ -z "\$DEALER_REPOSITORIES_READ_TOKEN" \]; then[\s\S]*?::error::Configure DEALER_REPOSITORIES_READ_TOKEN[\s\S]*?exit 1/);
});

test('legacy preflight accepts either historical trio and rejects four/six families without alteration', () => {
  for (const middle of ['modern', 'import']) for (const version of ['1', '2']) {
    const manifest = { schemaVersion: 1, slug: 'isauto-varna', repository: 'fixture/cars-isauto-varna', packaging: { version }, variants: trio(middle) };
    const before = JSON.stringify(manifest), report = preflight(manifest);
    assert.equal(report.contract, 'legacy-three-design-v1');
    assert.equal(report.compiled, false);
    assert.equal(JSON.stringify(manifest), before);
    const four = { ...manifest, packaging: { version: '3' }, variants: [...manifest.variants, { key: 'app', base: '/variant-4', entry: '/variant-4/' }] };
    const six = { ...manifest, packaging: { version: '5' }, variants: planSixDesignSelection(four.variants).variants };
    for (const current of [four, six]) assert.throws(() => preflight(current), /exactly three designs.*existing-fleet-source\.yml and existing-fleet-cloudflare\.yml/);
    assert.throws(() => preflight({ ...manifest, slug: 'other' }), /identity differs/);
    const wrong = structuredClone(manifest); wrong.variants[2].key = 'app';
    assert.throws(() => preflight(wrong), /trio mounts or families differ/);
  }
});

test('manual selection requires an explicit legacy version and resolves exactly the registered cohort', () => {
  assert.equal(cohort.length, 25);
  assert.equal(resolveDealers('all').length, 25);
  assert.deepEqual(resolveDealers('isauto-varna').map(row => row.slug), ['isauto-varna']);
  assert.throws(() => resolveDealers('isauto-varna', fixture(), ''), /explicit legacy-three-design-v1/);
  assert.throws(() => resolveDealers('unregistered-dealer'), /registered fleet slug/);
  assert.throws(() => resolveDealers('isauto-varna', []), /Missing=isauto-varna/);
  assert.throws(() => resolveDealers('isauto-varna', [{ slug: 'isauto-varna', repository: 'missing-owner-separator' }]), /invalid=isauto-varna/);
  assert.equal(resolveDealers('isauto-varna', [{ slug: 'isauto-varna', delivery: { gitRepository: 'fixture/cars-isauto-varna' } }])[0].repository, 'fixture/cars-isauto-varna');
});

test('validation has read-only permissions and uploads reports without provider publication', () => {
  assert.match(workflow, /^permissions:\n  contents: read$/m);
  assert.match(workflow, /uses: actions\/upload-artifact@v4/);
  assert.doesNotMatch(workflow, /contents: write|git push|wrangler|VERCEL_TOKEN|CLOUDFLARE_API_TOKEN|workflow_run:|pull_request_target:/);
});

