import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const staticRoot = path.join(root, 'static');
const outputDir = path.join(root, '.tmp', 'template-assets');
const outputFile = path.join(outputDir, 'manifest.json');

const sourceRoots = ['src', 'scripts', 'static'];
const ignoredPathSegments = new Set([
	'.git',
	'.svelte-kit',
	'build',
	'node_modules',
	'_originals',
	'.tmp'
]);
const sourceExtensions = new Set([
	'.svelte',
	'.ts',
	'.js',
	'.mjs',
	'.css',
	'.scss',
	'.html',
	'.json'
]);

function walk(dir, files = []) {
	if (!existsSync(dir)) return files;

	for (const entry of readdirSync(dir)) {
		const fullPath = path.join(dir, entry);
		const relativePath = path.relative(root, fullPath).replaceAll(path.sep, '/');

		if (relativePath.split('/').some((segment) => ignoredPathSegments.has(segment))) {
			continue;
		}

		const fileStat = statSync(fullPath);
		if (fileStat.isDirectory()) {
			walk(fullPath, files);
		} else {
			files.push({ path: fullPath, relative: relativePath, size: fileStat.size });
		}
	}

	return files;
}

function classify(relativePath) {
	const ext = path.extname(relativePath).toLowerCase();
	if (['.css', '.scss'].includes(ext)) return 'style';
	if (['.js', '.mjs'].includes(ext)) return 'script';
	if (['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.gif'].includes(ext)) return 'image';
	if (['.woff', '.woff2', '.ttf', '.otf', '.eot'].includes(ext)) return 'font';
	if (ext === '.html') return 'template-html';
	return 'other';
}

function publicPath(relativePath) {
	return `/${relativePath.replace(/^static\//, '')}`;
}

function sourceCorpus() {
	return sourceRoots
		.flatMap((dir) => walk(path.join(root, dir)))
		.filter((file) => sourceExtensions.has(path.extname(file.relative).toLowerCase()))
		.map((file) => ({
			relative: file.relative,
			text: readFileSync(file.path, 'utf8')
		}));
}

const staticFiles = walk(staticRoot).filter((file) => file.relative.startsWith('static/'));
const corpus = sourceCorpus();

const assets = staticFiles.map((file) => {
	const publicUrl = publicPath(file.relative);
	const barePath = publicUrl.slice(1);
	const references = [];

	for (const source of corpus) {
		if (source.relative === file.relative) continue;
		if (source.text.includes(publicUrl) || source.text.includes(barePath)) {
			references.push(source.relative);
		}
	}

	return {
		path: file.relative,
		publicUrl,
		type: classify(file.relative),
		bytes: file.size,
		references
	};
});

const summary = {
	generatedAt: new Date().toISOString(),
	totalAssets: assets.length,
	totalBytes: assets.reduce((sum, asset) => sum + asset.bytes, 0),
	byType: Object.fromEntries(
		[...new Set(assets.map((asset) => asset.type))].map((type) => [
			type,
			{
				count: assets.filter((asset) => asset.type === type).length,
				bytes: assets
					.filter((asset) => asset.type === type)
					.reduce((sum, asset) => sum + asset.bytes, 0)
			}
		])
	)
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFile, `${JSON.stringify({ summary, assets }, null, 2)}\n`);

const topFolders = new Map();
for (const asset of assets) {
	const parts = asset.path.split('/');
	const folder = parts.slice(0, Math.min(parts.length - 1, 4)).join('/');
	const entry = topFolders.get(folder) ?? { count: 0, bytes: 0 };
	entry.count += 1;
	entry.bytes += asset.bytes;
	topFolders.set(folder, entry);
}

function mb(bytes) {
	return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

console.log(`Template asset manifest written to ${path.relative(root, outputFile)}`);
console.log(`Assets: ${summary.totalAssets}, total: ${mb(summary.totalBytes)}`);

console.log('\nLargest static folders:');
for (const [folder, entry] of [...topFolders.entries()]
	.sort((a, b) => b[1].bytes - a[1].bytes)
	.slice(0, 15)) {
	console.log(`  ${mb(entry.bytes).padStart(8)} ${String(entry.count).padStart(4)} ${folder}`);
}

console.log('\nLargest referenced assets:');
for (const asset of [...assets]
	.filter((item) => item.references.length > 0)
	.sort((a, b) => b.bytes - a.bytes)
	.slice(0, 20)) {
	console.log(
		`  ${mb(asset.bytes).padStart(8)} refs=${String(asset.references.length).padStart(2)} ${asset.publicUrl}`
	);
}

console.log('\nLargest unreferenced assets:');
for (const asset of [...assets]
	.filter((item) => item.references.length === 0)
	.sort((a, b) => b.bytes - a.bytes)
	.slice(0, 20)) {
	console.log(`  ${mb(asset.bytes).padStart(8)} ${asset.publicUrl}`);
}
