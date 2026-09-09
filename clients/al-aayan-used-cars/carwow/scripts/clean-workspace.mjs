import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

const directories = [
	'.audit',
	'.audit-shots',
	'.claude',
	'.codex-logs',
	'.playwright-mcp',
	'.svelte-kit',
	'.tmp',
	'.vercel/output',
	'audit',
	'docs/audit',
	'static/_originals',
	'test-results',
	'tmp'
];

const rootFilePatterns = [
	/^\.codex-.+\.(?:err\.log|out\.log|log|png|txt)$/i,
	/^audit-.+\.(?:png|jpe?g|webp|html|txt)$/i,
	/^[^/\\]+\.(?:err\.log|out\.log|log|png|jpe?g|webp|html|txt)$/i
];

function assertInsideWorkspace(target) {
	const absolute = path.resolve(root, target);
	const relative = path.relative(root, absolute);

	if (relative === '' || relative.startsWith('..') || path.isAbsolute(relative)) {
		throw new Error(`Refusing to remove path outside workspace: ${target}`);
	}

	return absolute;
}

async function statOptional(target) {
	try {
		return await fs.lstat(target);
	} catch (error) {
		if (error.code === 'ENOENT') return null;
		throw error;
	}
}

function isLockedFileError(error) {
	return ['EBUSY', 'EPERM', 'ENOTEMPTY'].includes(error.code);
}

async function removePath(absolute, relativePath) {
	const stat = await statOptional(absolute);

	if (!stat) return { bytes: 0, count: 0, skipped: [] };

	if (stat.isDirectory() && !stat.isSymbolicLink()) {
		const summary = { bytes: 0, count: 0, skipped: [] };
		let entries;

		try {
			entries = await fs.readdir(absolute, { withFileTypes: true });
		} catch (error) {
			if (isLockedFileError(error)) {
				return { bytes: 0, count: 0, skipped: [{ relativePath, reason: error.code }] };
			}

			throw error;
		}

		for (const entry of entries) {
			const childAbsolute = path.join(absolute, entry.name);
			const childRelative = path.join(relativePath, entry.name).replaceAll(path.sep, '/');
			const childSummary = await removePath(childAbsolute, childRelative);
			summary.bytes += childSummary.bytes;
			summary.count += childSummary.count;
			summary.skipped.push(...childSummary.skipped);
		}

		try {
			await fs.rmdir(absolute);
			summary.count += 1;
		} catch (error) {
			if (!isLockedFileError(error) && error.code !== 'ENOENT') {
				throw error;
			}

			if (error.code !== 'ENOENT') {
				summary.skipped.push({ relativePath, reason: error.code });
			}
		}

		return summary;
	}

	try {
		await fs.rm(absolute, { force: true });
		return { bytes: stat.size, count: 1, skipped: [] };
	} catch (error) {
		if (isLockedFileError(error)) {
			return { bytes: 0, count: 0, skipped: [{ relativePath, reason: error.code }] };
		}

		throw error;
	}
}

async function removeTarget(relativePath) {
	const absolute = assertInsideWorkspace(relativePath);
	const summary = await removePath(absolute, relativePath);

	return summary.count > 0 || summary.skipped.length > 0 ? { relativePath, ...summary } : null;
}

async function rootGeneratedFiles() {
	const entries = await fs.readdir(root, { withFileTypes: true });

	return entries
		.filter((entry) => entry.isFile())
		.map((entry) => entry.name)
		.filter((name) => rootFilePatterns.some((pattern) => pattern.test(name)));
}

function formatBytes(bytes) {
	if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
	if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${bytes} B`;
}

const removed = [];

for (const directory of directories) {
	const result = await removeTarget(directory);
	if (result) removed.push(result);
}

for (const file of await rootGeneratedFiles()) {
	const result = await removeTarget(file);
	if (result) removed.push(result);
}

const totalBytes = removed.reduce((sum, item) => sum + item.bytes, 0);
const totalCount = removed.reduce((sum, item) => sum + item.count, 0);
const skipped = removed.flatMap((item) => item.skipped);

if (removed.length === 0) {
	console.log('Workspace already clean.');
} else {
	for (const item of removed) {
		if (item.count > 0) {
			console.log(
				`Removed ${item.relativePath} (${formatBytes(item.bytes)}, ${item.count} item(s))`
			);
		}
	}

	if (skipped.length > 0) {
		console.warn(`Skipped ${skipped.length} locked item(s):`);

		for (const item of skipped.slice(0, 12)) {
			console.warn(`  ${item.relativePath} (${item.reason})`);
		}

		if (skipped.length > 12) {
			console.warn(`  ...and ${skipped.length - 12} more`);
		}
	}

	console.log(`Removed ${totalCount} generated item(s), ${formatBytes(totalBytes)} total.`);
}
