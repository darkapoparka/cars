import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const references = ['24-x3-detail', '25-x3-gallery', '27-create-category', '37-assistant', '80-x6-gallery', '81-x6-viewer', '98-home-categories-return', '99-popular-next', '100-featured-more', '102-home-types-next', '103-popular-eco', '104-featured-ebike', '105-vehicle-types', '106-types-2', '209-dealer-offers', '242-park-options'];
const decode = value => value.replace(/&quot;/g, '\"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

/** Compact, source-attributed review data alongside browser visual evidence. No device access. */
export async function exportReferenceReview(out) {
  const target = path.join(out, 'reference-review');
  await fs.mkdir(target, { recursive: true });
  const report = [];
  for (const name of references) {
    const xml = await fs.readFile('reference/android/' + name + '.xml', 'utf8');
    const nodes = [...xml.matchAll(/<node\s+([^>]+)>/g)].map(match => Object.fromEntries([...match[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a => [a[1], decode(a[2])])));
    report.push({ reference: name, nodes: nodes.filter(n => n.text || n['content-desc']).map(n => ({ text: n.text, description: n['content-desc'], id: n['resource-id'], bounds: n.bounds })) });
  }
  await fs.writeFile(path.join(target, 'native-nodes.json'), JSON.stringify(report, null, 2));
  const resources = '.qa/native-resource-reference/res/drawable';
  const names = await fs.readdir(resources);
  await fs.writeFile(path.join(target, 'drawable-names.json'), JSON.stringify(names.filter(n => /^ic_/.test(n) && /layout|sort|deal|mobee|follow|account|check24|logo|star|placeholder|bullet/.test(n)), null, 2));
  for (const name of ['27-create-category','81-x6-viewer','105-vehicle-types','106-types-2']) {
    const image = await sharp('reference/android/' + name + '.png').extract({ left: 0, top: 168, width: 1280, height: 2616 }).resize(427,872).jpeg({ quality: 65 }).toBuffer();
    await fs.writeFile(path.join(target, name + '.jpg'), image);
    await fs.writeFile(path.join(target, name + '.base64.txt'), image.toString('base64').match(/.{1,1000}/g).join('\n'));
  }
  console.log('REFERENCE_REVIEW', target);
}
