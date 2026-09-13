import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

export function sourceImports(file, text) {
	const code = file.endsWith('.svelte')
		? [...text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1]).join('\n')
		: text;
	const imports = ts.preProcessFile(code, true, true).importedFiles.map((item) => item.fileName);
	for (const match of text.matchAll(/@import\s+(?:url\()?['"]([^'"]+)['"]/g))
		imports.push(match[1]);
	return [...new Set(imports)];
}

export function resolveSourceImport(from, specifier, files) {
	const spec = specifier.split('?')[0];
	const base = spec.startsWith('$lib/')
		? 'src/lib/' + spec.slice(5)
		: spec.startsWith('.')
			? path.posix.normalize(path.posix.join(path.posix.dirname(from), spec))
			: null;
	if (!base) return null;
	const candidates = [
		base,
		base.replace(/\.js$/, '.ts'),
		base + '.ts',
		base + '.js',
		base + '.svelte',
		base + '.svelte.ts',
		base + '/index.ts',
		base + '/index.js'
	];
	return candidates.find((file) => files.has(file)) ?? null;
}

function walk(directory) {
	return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const file = path.join(directory, entry.name);
		return entry.isDirectory() ? walk(file) : [file];
	});
}

export function buildSourceGraph(root, extraEntries = []) {
	const files = walk(path.join(root, 'src'))
		.filter((file) => /\.(?:svelte|[cm]?[jt]s|css)$/.test(file))
		.map((file) => path.relative(root, file).replaceAll(path.sep, '/'));
	const known = new Set(files);
	const unresolved = [];
	const records = files.map((file) => {
		const text = fs.readFileSync(path.join(root, file), 'utf8');
		const dependencies = sourceImports(file, text).flatMap((specifier) => {
			const resolved = resolveSourceImport(file, specifier, known);
			if (resolved) return [resolved];
			const local = specifier.startsWith('$lib/') || specifier.startsWith('.');
			if (
				local &&
				!specifier.endsWith('/$types') &&
				!/\.(?:svg|png|webp|woff2?)(?:\?|$)/.test(specifier)
			) {
				unresolved.push({ file, specifier });
			}
			return [];
		});
		return { file, dependencies, lines: text.split('\n').length };
	});
	const byFile = new Map(records.map((record) => [record.file, record]));
	const reachable = new Set();
	const visit = (file) => {
		if (reachable.has(file)) return;
		reachable.add(file);
		for (const dependency of byFile.get(file)?.dependencies ?? []) visit(dependency);
	};
	const entries = files.filter(
		(file) =>
			file.startsWith('src/routes/') ||
			/^src\/(?:app|hooks|service-worker)/.test(file) ||
			/\.(?:test|spec)\.[jt]s$/.test(file)
	);
	for (const file of [...entries, ...extraEntries]) visit(file);
	return {
		records,
		unresolved,
		unreachable: records.filter((record) => !reachable.has(record.file))
	};
}
