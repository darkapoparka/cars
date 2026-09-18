import fs from 'node:fs/promises';
import sharp from 'sharp';
import { mobileImageVariants } from '../src/lib/data/mobile-media.ts';

// Keep source artwork intact. This command deterministically rebuilds mobile derivatives.
for (const item of mobileImageVariants) {
	const source = `static${item.source}`;
	const output = `static${item.output}`;
	await sharp(source)
		.resize({ width: item.width, withoutEnlargement: true })
		.webp({ quality: item.quality, alphaQuality: 100, effort: 6 })
		.toFile(output);
	const before = (await fs.stat(source)).size;
	const after = (await fs.stat(output)).size;
	console.log(`${item.source}: ${before} -> ${after} bytes`);
}
