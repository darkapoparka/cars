import fs from 'node:fs/promises';
import path from 'node:path';

const generatedDirectories = [
	'.svelte-kit',
	'.vercel/output',
	'.tmp',
	'test-results',
	'playwright-report'
];
const auditDirectories = ['.audit', '.audit-shots'];

export function resolveCleanupPath(root, target, trackedFiles = []) {
	const absolute = path.resolve(root, target);
	const relative = path.relative(root, absolute).replaceAll(path.sep, '/');
	if (!relative || relative === '..' || relative.startsWith('../') || path.isAbsolute(relative)) {
		throw new Error(`Refusing a cleanup target outside the workspace: ${target}`);
	}
	if (trackedFiles.some((file) => file === relative || file.startsWith(relative + '/'))) {
		throw new Error(`Refusing to delete tracked source inside ${relative}`);
	}
	return absolute;
}

export async function planWorkspaceCleanup(root, trackedFiles, includeAudits = false) {
	const result = [];
	const canonicalRoot = await fs.realpath(root);
	for (const target of [...generatedDirectories, ...(includeAudits ? auditDirectories : [])]) {
		const absolute = resolveCleanupPath(root, target, trackedFiles);
		const stat = await fs.lstat(absolute).catch((error) => {
			if (error.code === 'ENOENT') return null;
			throw error;
		});
		if (!stat) continue;
		if (stat.isSymbolicLink()) throw new Error(`Refusing to traverse a cleanup symlink: ${target}`);
		if (!stat.isDirectory())
			throw new Error(`Expected a generated directory, not a file: ${target}`);
		const canonicalTarget = await fs.realpath(absolute);
		resolveCleanupPath(canonicalRoot, canonicalTarget); // Reject escaping ancestor junctions too.
		result.push({ target, absolute });
	}
	return result;
}
