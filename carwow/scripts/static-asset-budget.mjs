import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';

const ROOT = process.cwd();
const STATIC_DIR = resolve(ROOT, 'static');
const STRICT = process.argv.includes('--strict');

const MAX_REFERENCED_PHOTO_BYTES = 450 * 1024;
const MAX_UNREFERENCED_PHOTO_BYTES = 2.5 * 1024 * 1024;

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const SOURCE_EXTENSIONS = new Set(['.svelte', '.ts', '.js', '.css', '.html', '.mjs']);
const SKIPPED_DIRECTORIES = new Set([
	'.git',
	'.svelte-kit',
	'build',
	'node_modules',
	'playwright-report',
	'test-results'
]);

const ALLOWLIST = new Set([
	'static/assets/images/admin/cms-login-banner.png',
	'static/assets/images/body-type/body-types-sheet-v1.png'
]);

function toPortablePath(path) {
	return path.replaceAll(sep, '/');
}

function sizeLabel(bytes) {
	if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
	return `${(bytes / 1024).toFixed(1)} KB`;
}

function sourceTokens(relativePath) {
	const publicPath = `/${relativePath.replace(/^static\//, '')}`;
	return [publicPath, publicPath.slice(1)];
}

function countToken(text, token) {
	if (!token) return 0;

	let index = 0;
	let count = 0;

	while ((index = text.indexOf(token, index)) !== -1) {
		count += 1;
		index += token.length;
	}

	return count;
}

async function walk(dir, files = []) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		if (entry.isDirectory() && SKIPPED_DIRECTORIES.has(entry.name)) continue;

		const full = resolve(dir, entry.name);
		if (entry.isDirectory()) {
			if (full.includes(`${sep}static${sep}_originals`)) continue;
			await walk(full, files);
			continue;
		}

		files.push(full);
	}

	return files;
}

async function sourceCorpus() {
	const files = await walk(ROOT);
	const parts = [];

	for (const file of files) {
		if (!SOURCE_EXTENSIONS.has(extname(file).toLowerCase())) continue;
		parts.push(await readFile(file, 'utf8').catch(() => ''));
	}

	return parts.join('\n');
}

const corpus = await sourceCorpus();
const images = (await walk(STATIC_DIR)).filter((file) =>
	IMAGE_EXTENSIONS.has(extname(file).toLowerCase())
);
const failures = [];

for (const file of images) {
	const rel = toPortablePath(relative(ROOT, file));
	const [publicPath, barePath] = sourceTokens(rel);
	const size = (await stat(file)).size;
	const referenceCount = countToken(corpus, publicPath) + countToken(corpus, barePath);
	const max = referenceCount > 0 ? MAX_REFERENCED_PHOTO_BYTES : MAX_UNREFERENCED_PHOTO_BYTES;
	const allowed = ALLOWLIST.has(rel);

	if (!allowed && size > max) {
		failures.push({ rel, publicPath, referenceCount, size, max });
	}
}

for (const item of failures.sort((a, b) => b.size - a.size)) {
	console.log(
		`${sizeLabel(item.size)} > ${sizeLabel(item.max)} refs=${item.referenceCount} ${item.rel}`
	);
	console.log(
		`  action: convert, allowlist intentionally, or move unused originals under static/_originals/`
	);
}

if (failures.length > 0 && STRICT) {
	console.error(`\nAsset budget failed: ${failures.length} oversized public images.`);
	process.exit(1);
}

console.log(`Asset budget ${failures.length === 0 ? 'ok' : `warnings: ${failures.length}`}`);
