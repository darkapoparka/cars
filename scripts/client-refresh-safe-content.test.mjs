import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { applyCarwowSafeContent } from './lib/client-refresh-safe-content.mjs';
import {readRegisteredPersonalization,originalListingIdRecorded} from './lib/client-refresh-normalize.mjs';
import {tinyArea,writeFixture} from './test-fixtures/fleet-single-worker.mjs';

const profile = (countryCode) => ({
  business: {
    countryCode,
    shortName: 'Fixture Auto',
    name: 'Fixture Auto',
    phoneDisplay: '+359 88 000 0000',
    email: 'fixture@example.com',
    observedAt: '2026-09-21',
    city: 'Sofia',
    address: 'Fixture Street 1',
    inventoryNotice: 'Confirm current inventory.',
    previewNotice: 'Independent demonstration.'
  }
});

for (const countryCode of ['BG', 'AE']) {
  test('Carwow safe review copy is catalog-backed for ' + countryCode, () => {
    const candidate = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-safe-copy-'));
    applyCarwowSafeContent({ candidate, profile: profile(countryCode), logo: '/dealer-brand/logo.webp' });
    const generated = fs.readFileSync(path.join(candidate, 'src/lib/data/daynight-reviews.ts'), 'utf8');
    assert.match(generated, /Демонстрационни отзиви и оценки. Не са потвърдени клиентски мнения./);
    assert.doesNotMatch(generated, /No verified customer reviews are included in this independent preview/);
    assert.doesNotMatch(generated, /В този независим преглед не са включени потвърдени клиентски отзиви/);
  });
}

test('ordinary profile reads require no registered overlay and unsafe overlay paths fail closed',t=>{
 const root=tinyArea(t);writeFixture(path.join(root,'business-facts.json'),{business:{name:'Original',unknown:null}});
 assert.equal(readRegisteredPersonalization(root,'retained'),null);
 writeFixture(path.join(root,'dealer.json'),{slug:'retained'});assert.equal(readRegisteredPersonalization(root,'retained'),null);
 writeFixture(path.join(root,'dealer.json'),{slug:'retained',registeredSourceAdoption:{receipt:{path:'../outside.json',sha256:'1'.repeat(64)},personalization:{path:'.client/registered-personalization.json',sha256:'2'.repeat(64)}}});
 assert.throws(()=>readRegisteredPersonalization(root,'retained'),/exact bounded path\/hash/);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,'business-facts.json'))),{business:{name:'Original',unknown:null}});
});
test('listing provenance requires the exact recorded ID field, never a substring in copy',()=>{
 assert.equal(originalListingIdRecorded(Buffer.from('{"id":"12345","description":"123"}'),'123'),false);
 assert.equal(originalListingIdRecorded(Buffer.from('{"id":"123"}'),'123'),true);
 assert.equal(originalListingIdRecorded(Buffer.from("{sourceId: '12.3'}"),'12.3'),true);
 assert.equal(originalListingIdRecorded(Buffer.from('{"id":"12x3"}'),'12.3'),false);
});
