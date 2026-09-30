// Delivery copies only: keep the reviewed source artwork and its alpha/crop intact.
// Run with the retained Node runtime and npm dependencies.
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sources = [
	'/assets/images/card/card-48.jpg',
	'/assets/images/card/card-38.jpg',
	'/assets/images/card/card-3.jpg',
	'/assets/daynight/megamenu/inventory-bmw-x5-cutout.webp',
	'/assets/daynight/megamenu/inventory-bmw-x4m-cutout-v2.webp',
	'/assets/daynight/megamenu/inventory-audi-sq5-cutout.webp',
	'/assets/daynight/megamenu/inventory-audi-a7-cutout.webp'
];
const output = '/assets/daynight/delivery/vehicles';
await mkdir(resolve(root, 'static' + output), { recursive: true });
const manifest = {};
for (const source of sources) {
	const name = source
		.split('/')
		.at(-1)
		.replace(/\.[^.]+$/, '');
	manifest[source] = [];
	for (const width of [400, 800]) {
		const path = `${output}/${name}-${width}.webp`;
		const info = await sharp(resolve(root, 'static' + source))
			.resize({ width, withoutEnlargement: true })
			.webp({ quality: 88, alphaQuality: 100, effort: 6 })
			.toFile(resolve(root, 'static' + path));
		manifest[source].push({ path, width: info.width });
	}
}
await writeFile(
	resolve(root, 'src/lib/data/vehicle-image-delivery.json'),
	JSON.stringify(manifest, null, 2) + '\n'
);
console.log(`Prepared delivery renditions for ${sources.length} retained vehicle images.`);
