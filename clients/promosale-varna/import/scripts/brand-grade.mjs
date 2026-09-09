// Applies the DayNight "muted olive" grade to generated raster assets.
//
// Why this exists: image-gen models ignore hex codes and love rendering green as
// a glowing light source -> radioactive chartreuse. This is where we actually
// enforce the palette: a gentle filmic split-tone that desaturates the neon and
// pulls shadows toward forest-green, mids toward olive, highlights toward warm
// off-white -- the same tokens used in daynight.css.
//
// Non-destructive: writes <name>-graded.png + <name>-graded.webp next to each
// source. Originals are untouched. Idempotent: a source is skipped when its
// graded sibling is already newer, and *-graded files are never re-graded.
//
// Usage:
//   node scripts/brand-grade.mjs                       # grade the codex-generated tree
//   node scripts/brand-grade.mjs <dir-or-file.png>     # grade a subfolder or one file
//   STRENGTH=0.4 node scripts/brand-grade.mjs <dir>    # dial the grade down (0..1, default 0.6)
import sharp from 'sharp';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const TARGET = process.argv[2] ?? 'static/assets/daynight/codex-generated';
const STRENGTH = clamp(Number(process.env.STRENGTH ?? '0.6'), 0, 1);
const QUALITY = 80;
const SUFFIX = '-graded';

// Brand anchors (sRGB), straight from daynight.css.
const FOREST = { r: 12, g: 22, b: 10 }; // #0c160a — shadow sink
const OLIVE = { r: 176, g: 0, b: 0 }; // #d71920 — mid unify
const WARM = { r: 242, g: 245, b: 239 }; // #f2f5ef — highlight warm

function clamp(n, lo, hi) {
	return Math.min(hi, Math.max(lo, Number.isFinite(n) ? n : lo));
}

function walk(dir, acc = []) {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		const s = statSync(p);
		if (s.isDirectory()) walk(p, acc);
		else if (extname(name).toLowerCase() === '.png' && !basename(name).includes(SUFFIX)) acc.push(p);
	}
	return acc;
}

// A full-canvas solid layer with baked-in alpha, blended via a libvips mode.
function tint(width, height, { r, g, b }, alpha, blend) {
	return { input: { create: { width, height, channels: 4, background: { r, g, b, alpha } } }, blend };
}

async function grade(src) {
	const dstPng = src.slice(0, -4) + SUFFIX + '.png';
	const dstWebp = src.slice(0, -4) + SUFFIX + '.webp';
	const srcStat = statSync(src);
	if (existsSync(dstPng) && statSync(dstPng).mtimeMs >= srcStat.mtimeMs) return 'skipped';

	const { width, height } = await sharp(src).metadata();
	if (!width || !height) throw new Error('no dimensions');

	await sharp(src)
		// 1) kill the neon
		.modulate({ saturation: 1 - 0.28 * STRENGTH })
		// 2) gentle filmic contrast
		.linear(1 + 0.06 * STRENGTH, -6 * STRENGTH)
		// 3) brand split-tone (all soft-light, low alpha = subtle + photo-safe)
		.composite([
			tint(width, height, OLIVE, 0.18 * STRENGTH, 'soft-light'),
			tint(width, height, FOREST, 0.14 * STRENGTH, 'soft-light'),
			tint(width, height, WARM, 0.1 * STRENGTH, 'soft-light')
		])
		.png()
		.toFile(dstPng);

	await sharp(dstPng).webp({ quality: QUALITY, effort: 4 }).toFile(dstWebp);
	return 'graded';
}

const isFile = existsSync(TARGET) && statSync(TARGET).isFile();
const sources = isFile ? [TARGET] : walk(TARGET);
let graded = 0;
let skipped = 0;
const failed = [];

for (const src of sources) {
	try {
		(await grade(src)) === 'graded' ? graded++ : skipped++;
	} catch (err) {
		failed.push(`${src}: ${err.message}`);
	}
}

console.log(JSON.stringify({ target: TARGET, strength: STRENGTH, total: sources.length, graded, skipped, failed }, null, 2));
