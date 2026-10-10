// Converts every static/**/*.png into a .webp sibling (same dimensions, alpha
// preserved). PNGs are intentionally kept as a fallback. Re-running is cheap:
// a png is skipped when its .webp is already newer. Usage: `node scripts/convert-png-to-webp.mjs`
import sharp from 'sharp';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = 'static';
const QUALITY = 80;

function walk(dir, acc = []) {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		const s = statSync(p);
		if (s.isDirectory()) walk(p, acc);
		else if (extname(name).toLowerCase() === '.png') acc.push(p);
	}
	return acc;
}

const pngs = walk(ROOT);
let converted = 0;
let skipped = 0;
let pngBytes = 0;
let webpBytes = 0;
const failed = [];

for (const png of pngs) {
	const webp = png.slice(0, -4) + '.webp';
	const pngStat = statSync(png);
	pngBytes += pngStat.size;
	if (existsSync(webp) && statSync(webp).mtimeMs >= pngStat.mtimeMs) {
		webpBytes += statSync(webp).size;
		skipped++;
		continue;
	}
	try {
		await sharp(png).webp({ quality: QUALITY, effort: 4 }).toFile(webp);
		webpBytes += statSync(webp).size;
		converted++;
	} catch (err) {
		failed.push(`${png}: ${err.message}`);
	}
}

console.log(
	JSON.stringify(
		{
			totalPng: pngs.length,
			converted,
			skipped,
			pngMB: (pngBytes / 1048576).toFixed(1),
			webpMB: (webpBytes / 1048576).toFixed(1),
			savedPct: pngBytes ? Math.round((1 - webpBytes / pngBytes) * 100) : 0,
			failed
		},
		null,
		2
	)
);
