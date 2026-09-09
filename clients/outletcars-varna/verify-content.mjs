import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = import.meta.dirname;
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const facts = read('business-facts.json');
const stock = read('stock.json');
assert(stock.length > 0, 'A dealership must have sourced listing samples');
assert.equal(new Set(stock.map(car => car.id)).size, stock.length, 'Duplicate listing IDs');
assert(facts.phoneE164.startsWith('+359'), 'Expected a Bulgarian business phone');
const variants = ['auto-best', 'carwow', 'import'];
let logoHash;
let imageChecks = 0;
for (const variant of variants) {
  const app = path.join(root, variant);
  const manifest = read(`${variant}/package.json`);
  const lock = read(`${variant}/package-lock.json`);
  assert.equal(manifest.name, lock.name, 'Manifest/lock identity differs');
  assert.equal(lock.packages[''].name, manifest.name);
  const localStock = read(`${variant}/src/lib/data/dealer-stock.json`);
  assert.deepEqual(localStock, stock, `${variant}: canonical stock drift`);
  const localFacts = read(`${variant}/src/lib/data/dealer.json`);
  assert.equal(localFacts.phoneE164, facts.phoneE164);
  assert.equal(localFacts.sourceLogoUrl, facts.sourceLogoUrl);
  const bytes = fs.readFileSync(path.join(app, 'static/dealer/logo.png'));
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (logoHash) assert.equal(hash, logoHash, 'Logo identity differs between designs');
  logoHash = hash;
  const adapter = variant === 'auto-best' ? 'inventory.ts' : variant === 'carwow' ? 'daynight-current-inventory.ts' : 'daynight-listings.json';
  const source = fs.readFileSync(path.join(app, 'src/lib/data', adapter), 'utf8');
  for (const car of stock) {
    assert(source.includes(car.id), `${variant}: listing ${car.id} is absent from the real adapter`);
    assert(source.includes(car.sourceUrl), `${variant}: missing listing provenance`);
    assert(Number.isFinite(car.priceEur) && car.priceEur > 0, 'Do not turn an unknown price into zero');
    assert(car.sourceUrl.startsWith(facts.sourceUrl.replace(/\/$/, '')), 'Listing belongs to another account');
    assert(car.images.includes(car.image), 'Lead image is absent from its own gallery');
    for (const image of car.images) {
      assert(image.startsWith('/dealer/inventory/'), 'Critical vehicle media must be local');
      assert(!image.includes('..'), 'Unsafe media path');
      assert(fs.statSync(path.join(app, 'static', image)).size > 100, 'Empty vehicle image');
      imageChecks++;
    }
  }
  for (const icon of ['favicon.png','apple-touch-icon.png']) {
    assert(fs.statSync(path.join(app, 'static/dealer', icon)).size > 0, `Missing ${icon}`);
  }
}
console.log(JSON.stringify({dealer:facts.name,variants:variants.length,listings:stock.length,imageChecks,logoSha256:logoHash,passed:true}, null, 2));
