// Delivery copies preserve the reviewed artwork and crop; originals remain reusable.
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sources = [
	'/assets/daynight/services/premium-cars-banner-generated.webp',
	'/assets/daynight/services/evaluate-link-service.webp',
	'/assets/daynight/services/sell-car-service.webp',
	'/assets/daynight/footer-premium-request-v2.webp',
	'/assets/daynight/hero/home-05-showroom-exterior.webp',
	'/assets/daynight/cta/premium-cars-banner-v2.webp',
	'/assets/daynight/proof-studio-import-handoff.webp'
];
const output = '/assets/daynight/delivery/services';
await mkdir(resolve(root, 'static' + output), { recursive: true });
const manifest = {};
for (const source of sources) {
	const name = source
		.split('/')
		.at(-1)
		.replace(/\.[^.]+$/, '');
	manifest[source] = [];
	for (const width of [400, 800, 1200]) {
		const path = `${output}/${name}-${width}.webp`;
		const info = await sharp(resolve(root, 'static' + source))
			.resize({ width, withoutEnlargement: true })
			.webp({ quality: 88, alphaQuality: 100, effort: 6 })
			.toFile(resolve(root, 'static' + path));
		manifest[source].push({ path, width: info.width });
	}
}
await writeFile(
	resolve(root, 'src/lib/data/service-image-delivery.json'),
	JSON.stringify(manifest, null, 2) + '\n'
);
console.log(
	`Prepared delivery renditions for ${sources.length} retained service and contact images.`
);
