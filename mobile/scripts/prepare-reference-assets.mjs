import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

// Bounded native-vector conversion. Committed outputs let builds run without the local APK resources.
export const referenceSymbols = {
  refresh: 'ic_refresh',
  bellOn: 'ic_notifications_on',
  userAdd: 'ic_user_add',
  userRemove: 'ic_user_remove',
  brandMark: 'mobile_logo_small',
  calculator: 'ic_service_financing',
  layoutCard: 'ic_layout_card',
  sortAscending: 'ic_sort_asc',
  sortDescending: 'ic_sort_desc',
  ratingStar: 'ic_rating_star_full_18dp',
  electricCar: 'ic_vehicle_car_electric',
  mobeeLogo: 'ic_mobee_logo',
};
const root = '.qa/native-resource-reference/res/drawable';
const output = 'public/icons/native-vector';
const attributes = text => Object.fromEntries([...text.matchAll(/(?:android:)?([\w-]+)="([^"]*)"/g)].map(m => [m[1],m[2]]));
export async function prepareReferenceAssets() {
  await fs.mkdir(output, { recursive: true });
  for (const [name, resource] of Object.entries(referenceSymbols)) {
    const destination = path.join(output, name + '.svg');
    try { await fs.access(destination); continue; } catch { /* Generate only missing explicit assets. */ }
    const xml = await fs.readFile(path.join(root, resource + '.xml'), 'utf8');
    if (/<group|<clip-path/.test(xml)) throw Error('Unimplemented vector transform: ' + resource);
    const vector = attributes(xml.match(/<vector\s+([^>]+)>/)?.[1] || '');
    if (!vector.viewportWidth || !vector.viewportHeight) throw Error('Invalid vector: ' + resource);
    const paths = [...xml.matchAll(/<path\s+([^>]+)\/>/g)].map(m => {
      const p = attributes(m[1]);
      if (!p.pathData) throw Error('Missing path: ' + resource);
      return `<path d="${p.pathData}" fill="#fff" fill-opacity="${p.fillAlpha || 1}" fill-rule="${p.fillType === 'evenOdd' ? 'evenodd' : 'nonzero'}"/>`;
    });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vector.viewportWidth} ${vector.viewportHeight}">${paths.join('')}</svg>\n`;
    await sharp(Buffer.from(svg)).resize(72,72).png().toBuffer();
    await fs.writeFile(destination, svg);
    console.log('Prepared reference symbol', name, createHash('sha256').update(svg).digest('hex'));
  }
}
