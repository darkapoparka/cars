import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import { appendProposalIntroduction } from './proposal-introduction.mjs';
const families = ['auto-best','modern','import','app','mobile','karento-best'];
const makeSelector = keys => `(() => { const embeddedConfig = ${JSON.stringify({variants:keys.map(key=>({key}))})}; globalThis.__CARS_SWITCHER_CONFIG__ = embeddedConfig; })();`;
const selector = makeSelector(families);
const proposal = { dealerId:'avangard-auto', dealerName:'AVANGARD AUTO' };
test('existing selector is preserved and repeated application is idempotent', () => {
  const bundled = appendProposalIntroduction(selector,proposal);
  assert.ok(bundled.startsWith(selector));
  assert.equal(appendProposalIntroduction(bundled,proposal),bundled);
  assert.equal((bundled.match(/START CARS PROPOSAL INTRODUCTION/g)||[]).length,1);
  const images = JSON.parse(bundled.match(/const featureImages = (\[[^\r\n]+\]);/)[1]);
  const names = ['vehicle','enquiries','viewings','editing','analytics','assistant'];
  assert.equal(images.length,names.length);
  images.forEach((image,index) => {
    assert.ok(image.startsWith('data:image/webp;base64,'), 'each feature image is self-contained');
    assert.deepEqual(Buffer.from(image.slice('data:image/webp;base64,'.length), 'base64'), fs.readFileSync(new URL(`./assets/feature-${names[index]}.webp`, import.meta.url)));
  });
  assert.ok(!bundled.includes('__CARS_FEATURE_'));
  assert.doesNotThrow(() => new vm.Script(bundled));
});
test('dealer names are escaped as data', () => {
  const bundled = appendProposalIntroduction(selector,{...proposal,dealerName:'</script><script>alert(1)</script>'});
  assert.ok(!bundled.includes('</script>'));
  assert.ok(bundled.includes('\\u003c/script>'));
  assert.doesNotThrow(() => new vm.Script(bundled));
});
test('incomplete markers and invalid dealer identifiers are rejected', () => {
  assert.throws(() => appendProposalIntroduction(selector+'/* START CARS PROPOSAL INTRODUCTION v1 */',proposal),/Incomplete/);
  assert.throws(() => appendProposalIntroduction(selector,{...proposal,dealerId:'../other'}),/dealerId/);
  assert.throws(() => appendProposalIntroduction('alert(1)',proposal),/selector/);
});

test('legacy and duplicate design families cannot advertise six designs', () => {
  assert.throws(() => appendProposalIntroduction(makeSelector(families.slice(0,4)),proposal),/six-design family/);
  assert.throws(() => appendProposalIntroduction(makeSelector([...families.slice(0,5),'modern']),proposal),/six-design family/);
  assert.throws(() => appendProposalIntroduction('const embeddedConfig = __CARS_SWITCHER_CONFIG__;',proposal),/six-design selector configuration/);
});

test('only the shared admin or a local preview may override the dashboard origin', () => {
  assert.ok(appendProposalIntroduction(selector,{...proposal,adminOrigin:'http://localhost:6794/'}).includes('http://localhost:6794'));
  assert.throws(() => appendProposalIntroduction(selector,{...proposal,adminOrigin:'https://unrelated.example/'}),/trusted adminOrigin/);
  assert.throws(() => appendProposalIntroduction(selector,{...proposal,adminOrigin:'http://user:password@localhost:6794/'}),/trusted adminOrigin/);
  assert.throws(() => appendProposalIntroduction(selector,{...proposal,adminOrigin:'http://localhost:6794/other'}),/trusted adminOrigin/);
});
