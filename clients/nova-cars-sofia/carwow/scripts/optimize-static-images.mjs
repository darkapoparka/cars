import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
// Archive originals OUTSIDE static/ so they are never copied into the build/deploy.
const originalsRoot = path.join(root, '_originals');

const assets = [
	{
		source: 'static/assets/images/pages/daynight-about-consultation-v1.png',
		output: 'static/assets/images/pages/daynight-about-consultation-v1.webp',
		maxWidth: 1200,
		webp: { quality: 82 }
	},
	{
		source: 'static/assets/images/pages/daynight-services-consultation-v1.png',
		output: 'static/assets/images/pages/daynight-services-consultation-v1.webp',
		maxWidth: 1200,
		webp: { quality: 82 }
	},
	{
		source: 'static/assets/images/pages/daynight-services-inspection-v1.png',
		output: 'static/assets/images/pages/daynight-services-inspection-v1.webp',
		maxWidth: 1200,
		webp: { quality: 82 }
	},
	{
		source: 'static/assets/images/services/support-hero-v1.png',
		output: 'static/assets/images/services/support-hero-v1.webp',
		maxWidth: 1200,
		webp: { quality: 82 }
	},
	{
		source: 'static/assets/images/pages/daynight-about-lot-v1.png',
		output: 'static/assets/images/pages/daynight-about-lot-v1.webp',
		maxWidth: 1200,
		webp: { quality: 82 }
	},
	{
		source: 'static/assets/images/pages/daynight-about-showroom-suv-v1.png',
		output: 'static/assets/images/pages/daynight-about-showroom-suv-v1.webp',
		maxWidth: 1200,
		webp: { quality: 82 }
	},
	...['sales', 'evaluation', 'documents', 'customer'].map((name) => ({
		source: `static/assets/images/pages/daynight-team-${name}-v1.png`,
		output: `static/assets/images/pages/daynight-team-${name}-v1.webp`,
		maxWidth: 1200,
		webp: { quality: 82 }
	})),
	...['sales', 'evaluation', 'documents', 'customer'].map((name) => ({
		source: `static/assets/images/pages/daynight-team-${name}-v1.png`,
		output: `static/assets/images/pages/daynight-team-${name}-v1-thumb.webp`,
		maxWidth: 180,
		webp: { quality: 78 }
	})),
	{
		source: 'static/assets/images/home2/daynight-hero-showroom-v2.png',
		output: 'static/assets/images/home2/daynight-hero-showroom-v2.webp',
		maxWidth: 1600,
		webp: { quality: 82 }
	},
	{
		source: 'static/assets/images/home2/daynight-sell-banner-v2.png',
		output: 'static/assets/images/home2/daynight-sell-banner-v2.webp',
		maxWidth: 1600,
		webp: { quality: 82 }
	},
	{
		source:
			'static/assets/daynight-auto-v3/class-a-cutouts/transparent-png/bmw-x5-dark-grey-right-1x-transparent-2400x1600.png',
		output:
			'static/assets/daynight-auto-v3/class-a-cutouts/transparent-webp/bmw-x5-dark-grey-right-hero-1200.webp',
		maxWidth: 1200,
		webp: { quality: 78, effort: 6 }
	},
	{
		source:
			'static/assets/daynight-auto-v3/class-a-cutouts/transparent-png/audi-q5-silver-left-1x-transparent-2400x1600.png',
		output:
			'static/assets/daynight-auto-v3/class-a-cutouts/transparent-webp/audi-q5-silver-left-hero-1200.webp',
		maxWidth: 1200,
		webp: { quality: 78, effort: 6 }
	},
	{
		source: 'static/assets/images/sell/valuation-trust-v2.png',
		output: 'static/assets/images/sell/valuation-trust-v2.webp',
		maxWidth: 1200,
		webp: { quality: 82 }
	},
	{
		source: 'static/assets/images/sell/trade-in-promo-v1.png',
		output: 'static/assets/images/sell/trade-in-promo-v1.webp',
		maxWidth: 1200,
		webp: { quality: 82 }
	},
	{
		source: 'static/assets/images/card/why-choose-us.png',
		output: 'static/assets/images/card/why-choose-us.webp',
		maxWidth: 1100,
		webp: { quality: 86 }
	},
	{
		source: 'static/assets/images/budget/open-budget-supercar-v2.png',
		output: 'static/assets/images/budget/open-budget-supercar-v2.webp',
		maxWidth: 800,
		webp: { quality: 86 }
	},
	{
		source: 'static/assets/images/card/card-25.jpg',
		output: 'static/assets/images/card/card-25.webp',
		maxWidth: 1000,
		webp: { quality: 82 }
	},
	{
		source: 'static/assets/images/card/card-26.jpg',
		output: 'static/assets/images/card/card-26.webp',
		maxWidth: 1000,
		webp: { quality: 82 }
	},
	{
		source: 'static/assets/images/brand/oem/porsche.png',
		output: 'static/assets/images/brand/oem/porsche.webp',
		maxWidth: 274,
		webp: { quality: 90 }
	},
	...['brand-1', 'brand-2', 'brand-4', 'brand-5'].map((name) => ({
		source: `static/assets/images/brand/${name}.png`,
		output: `static/assets/images/brand/${name}.webp`,
		maxWidth: 160,
		webp: { lossless: true }
	})),
	{
		source: 'static/assets/images/avatar/avatar-3.png',
		output: 'static/assets/images/avatar/avatar-3.webp',
		maxWidth: 120,
		webp: { quality: 86 }
	},
	{
		source: 'static/assets/images/avatar/contact-avatar.png',
		output: 'static/assets/images/avatar/contact-avatar.webp',
		maxWidth: 160,
		webp: { quality: 86 }
	},
	...['coupe', 'hatchback', 'mpv', 'sedan', 'suv', 'wagon'].map((name) => ({
		source: `static/assets/images/body-type/normalized/body-${name}-transparent.png`,
		output: `static/assets/images/body-type/normalized/body-${name}-transparent.webp`,
		maxWidth: 600,
		webp: { quality: 86 }
	})),
	...['coupe', 'hatchback', 'mpv', 'sedan', 'suv', 'wagon'].map((name) => ({
		source: `static/assets/images/body-type/normalized/body-${name}-transparent.png`,
		fallbackSource: `static/assets/images/body-type/normalized/body-${name}-transparent.webp`,
		output: `static/assets/images/body-type/normalized/body-${name}-transparent-mobile.webp`,
		maxWidth: 360,
		webp: { quality: 82 }
	})),
	{
		source: 'static/brand/daynight-wordmark.svg',
		output: 'static/brand/daynight-wordmark.svg',
		maxWidth: 570,
		webp: { lossless: true }
	},
	{
		source: 'static/brand/daynight-wordmark.svg',
		output: 'static/brand/daynight-wordmark.svg',
		maxWidth: 570,
		webp: { lossless: true }
	},
	{
		source: 'static/brand/daynight-wordmark.svg',
		output: 'static/brand/daynight-wordmark.svg',
		maxWidth: 570,
		webp: { lossless: true }
	},
	{
		source: 'static/brand/daynight-wordmark.svg',
		output: 'static/brand/daynight-wordmark.svg',
		maxWidth: 570,
		webp: { lossless: true }
	},
	{
		source: 'static/brand/daynight-hero-search-composed.png',
		output: 'static/brand/daynight-hero-search-composed.webp',
		maxWidth: 2032,
		webp: { quality: 82 }
	},
	{
		source: 'static/brand/daynight-hero-mobile-search-composed.png',
		output: 'static/brand/daynight-hero-mobile-search-composed.webp',
		maxWidth: 1122,
		webp: { quality: 82 }
	},
	{
		source: 'static/brand/daynight-hero-banner-dealership-v1.png',
		output: 'static/brand/daynight-hero-banner-dealership-v1.webp',
		maxWidth: 1600,
		webp: { quality: 82 }
	},
	...['chrysler-300c', 'bmw-i7', 'bmw-520i', 'mercedes-e220d'].map((name) => ({
		source: `static/assets/images/megamenu/${name}.png`,
		output: `static/assets/images/megamenu/${name}.webp`,
		maxWidth: 560,
		webp: { quality: 86 }
	}))
];

function absolute(relativePath) {
	return path.join(root, relativePath);
}

function archivedPath(relativePath) {
	return path.join(originalsRoot, relativePath.replace(/^static[\\/]/, ''));
}

async function fileSize(filePath) {
	const stat = await fs.stat(filePath);
	return stat.size;
}

function kb(bytes) {
	return `${(bytes / 1024).toFixed(1)} KB`;
}

async function exists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function sourcePathFor(asset) {
	const sourceCandidates = [asset.source, asset.fallbackSource].filter(Boolean);

	for (const source of sourceCandidates) {
		const current = absolute(source);
		if (await exists(current)) return current;

		const archived = archivedPath(source);
		if (await exists(archived)) return archived;
	}

	if (await exists(absolute(asset.output))) return null;

	throw new Error(`Missing source and archived original for ${asset.source}`);
}

async function archiveOriginal(asset, sourcePath) {
	const current = absolute(asset.source);
	if (sourcePath !== current) return;

	const archived = archivedPath(asset.source);
	await fs.mkdir(path.dirname(archived), { recursive: true });

	if (await exists(archived)) {
		await fs.rm(current);
		return;
	}

	await fs.rename(current, archived);
}

async function optimize(asset) {
	const input = await sourcePathFor(asset);
	if (!input) {
		return {
			source: asset.source,
			output: asset.output,
			skipped: 'output exists; source original is unavailable'
		};
	}

	const output = absolute(asset.output);
	const before = await fileSize(input);
	const meta = await sharp(input).metadata();

	await fs.mkdir(path.dirname(output), { recursive: true });

	let pipeline = sharp(input).rotate();
	if (asset.maxWidth && meta.width && meta.width > asset.maxWidth) {
		pipeline = pipeline.resize({
			width: asset.maxWidth,
			withoutEnlargement: true,
			fit: 'inside'
		});
	}

	await pipeline.webp(asset.webp).toFile(output);
	await archiveOriginal(asset, input);

	const after = await fileSize(output);
	const outputMeta = await sharp(output).metadata();
	return {
		source: asset.source,
		output: asset.output,
		before,
		after,
		inputWidth: meta.width,
		inputHeight: meta.height,
		outputWidth: outputMeta.width,
		outputHeight: outputMeta.height
	};
}

const results = [];
const filters = process.argv.slice(2).map((filter) => filter.toLowerCase());
const selectedAssets =
	filters.length === 0
		? assets
		: assets.filter((asset) =>
				filters.some((filter) =>
					[asset.source, asset.output, asset.fallbackSource ?? ''].some((value) =>
						value.toLowerCase().includes(filter)
					)
				)
			);

if (selectedAssets.length === 0) {
	throw new Error(`No optimize-static-images assets matched: ${filters.join(', ')}`);
}

for (const asset of selectedAssets) {
	results.push(await optimize(asset));
}

console.log('Optimized static images:');
for (const result of results) {
	if (result.skipped) {
		console.log([result.source, '->', result.output, `skipped (${result.skipped})`].join(' '));
		continue;
	}

	console.log(
		[
			result.source,
			'->',
			result.output,
			`${result.inputWidth}x${result.inputHeight}`,
			'->',
			`${result.outputWidth}x${result.outputHeight}`,
			`${kb(result.before)} -> ${kb(result.after)}`
		].join(' ')
	);
}
