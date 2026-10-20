import fs from 'node:fs';
import path from 'node:path';

/** Packs are source inputs, not deployments. Never add invented hosting rows. */
export function listDealerPacks(root, {onDiagnostic} = {}) {
  const directory = path.join(root, 'dealers');
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, {withFileTypes: true}).filter(row => row.isDirectory() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.name)).map(row => {
    const file = path.join(directory, row.name, 'dealer.json');
    let manifest = {}, diagnostic = null;
    try {
      if (!fs.existsSync(file)) throw Error('Missing dealer.json');
      if (fs.lstatSync(file).isSymbolicLink() || !fs.statSync(file).isFile() || fs.statSync(file).size > 1024 ** 2) throw Error('Unsafe or oversized dealer.json');
      manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw Error('Expected a dealer manifest object');
      if (manifest.slug !== row.name) throw Error('Dealer-pack directory/identity mismatch');
      if (typeof manifest.dealerId !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.dealerId)) throw Error('Missing or invalid dealerId');
    } catch (error) {
      diagnostic = {code: 'INVALID_DEALER_PACK', path: 'dealers/' + row.name + '/dealer.json', reason: error.message};
      onDiagnostic?.(diagnostic);
      if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) manifest = {};
    }
    return {slug: row.name, dealerId: typeof manifest.dealerId === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.dealerId) ? manifest.dealerId : null, sourcePath: 'dealers/' + row.name,
      sourceFormat: 'dealer-pack', repository: 'darkapoparka/cars', deployment: null,
      ...(manifest.pack?.benchmarkOnly === true ? {benchmarkOnly: true} : {}),
      valid: diagnostic === null, ...(diagnostic ? {diagnostics: [diagnostic], reservationOnly: true} : {})};
  }).sort((a, b) => a.slug.localeCompare(b.slug, 'en'));
}
