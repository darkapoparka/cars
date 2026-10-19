import fs from 'node:fs';
import path from 'node:path';

/** Packs are source inputs, not deployments. Never add invented hosting rows. */
export function listDealerPacks(root) {
  const directory = path.join(root, 'dealers');
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, {withFileTypes: true}).filter(row => row.isDirectory() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.name)).map(row => {
    const file = path.join(directory, row.name, 'dealer.json');
    const manifest = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
    if (manifest.slug && manifest.slug !== row.name) throw Error('Dealer-pack directory/identity mismatch: ' + row.name);
    return {slug: row.name, dealerId: manifest.dealerId ?? null, sourcePath: 'dealers/' + row.name,
      sourceFormat: 'dealer-pack', repository: 'darkapoparka/cars', deployment: null};
  }).sort((a, b) => a.slug.localeCompare(b.slug, 'en'));
}
