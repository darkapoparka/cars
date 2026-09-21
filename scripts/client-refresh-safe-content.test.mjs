import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { applyCarwowSafeContent } from './lib/client-refresh-safe-content.mjs';

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
