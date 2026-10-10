import {readFileSync, existsSync, statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {dealerSchema, inventorySchema, importInventorySchema} from '../lib/dealer-schema.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const sources = [['lib/dealer.json', dealerSchema], ['lib/dealer-inventory.json', inventorySchema], ['lib/dealer-import-inventory.json', importInventorySchema]];
let failed = false;
for (const [file, schema] of sources) {
  try {
    const result = schema.safeParse(JSON.parse(readFileSync(path.join(root, file), 'utf8')));
    if (!result.success) {
      failed = true;
      for (const issue of result.error.issues) console.error(file + ':' + (issue.path.join('.') || '<root>') + ': ' + issue.message);
      continue;
    }
    const value = result.data;
    const images = file.endsWith('/dealer.json') ? Object.values(value.logo) : value.flatMap(row => {const vehicle = row.vehicle ?? row; return [vehicle.image, ...(vehicle.images ?? [])];});
    for (const image of new Set(images)) if (image.startsWith('/')) {
      const relative = decodeURIComponent(image.split(/[?#]/)[0]).slice(1);
      const target = path.resolve(root, 'public', relative);
      if (!target.startsWith(path.resolve(root, 'public') + path.sep) || !existsSync(target) || !statSync(target).isFile()) {
        failed = true; console.error(file + ': Missing local public asset ' + image);
      }
    }
  } catch (error) {failed = true; console.error(file + ': ' + error.message);}
}
if (failed) process.exitCode = 1;
else console.log('Dealer configuration, stock, imports and configured public assets are valid.');
