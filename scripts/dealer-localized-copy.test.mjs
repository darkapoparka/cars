import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { dealerLocalizedCopy } from './lib/dealer-localized-copy.mjs';
import { loadDealerProfile } from './lib/client-refresh-normalize.mjs';

const root = path.resolve(import.meta.dirname, '..');
const dealers = [
  'al-basma-motors', 'al-hamoor-al-thahabi', 'asko-96', 'astracar', 'autolife',
  'automarket-varna', 'avangard-auto', 'champion-auto-pro', 'eliqauto',
  'elit-auto-import', 'excellent-cars', 'f1rst-motors', 'ivo-auto', 'kg-team-auto',
  'legend-auto', 'navara-car', 'outletcars-varna', 'perfect-auto-varna', 'priselci',
  'promosale-varna', 'texas-drive-auto', 'the-dealers-point'
];

test('registered rollout dealers have complete bounded EN/BG dealer copy', () => {
  for (const slug of dealers) {
    const profile = loadDealerProfile(path.join(root, 'clients', slug), slug);
    const copy = dealerLocalizedCopy(profile);
    for (const locale of ['en', 'bg']) {
      for (const field of ['name', 'city', 'country', 'region', 'addressLine', 'address', 'locationShort', 'appointment', 'tagline']) {
        assert.equal(typeof copy[locale][field], 'string', `${slug} ${locale}.${field}`);
        assert.ok(copy[locale][field].trim(), `${slug} ${locale}.${field}`);
      }
    }
    if (profile.business.countryCode === 'BG') {
      assert.doesNotMatch(copy.en.city, /[\u0400-\u04ff]/, `${slug} English city`);
      assert.doesNotMatch(copy.en.address, /[\u0400-\u04ff]/, `${slug} English address`);
      assert.doesNotMatch(copy.en.appointment, /[\u0400-\u04ff]/, `${slug} English appointment`);
    }
  }
});

test('explicit reviewed dealer copy overrides deterministic fallbacks', () => {
  const profile = loadDealerProfile(path.join(root, 'clients', 'navara-car'), 'navara-car');
  profile.business.raw.localizedCopy = {
    en: { address: 'Reviewed English address' },
    bg: { tagline: 'Проверен български текст' }
  };
  const copy = dealerLocalizedCopy(profile);
  assert.equal(copy.en.address, 'Reviewed English address');
  assert.equal(copy.bg.tagline, 'Проверен български текст');
  assert.equal(copy.en.city, 'Varna');
});
