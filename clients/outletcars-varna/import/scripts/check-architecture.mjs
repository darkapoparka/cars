import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const walk = (dir) =>
	fs
		.readdirSync(dir, { withFileTypes: true })
		.flatMap((entry) =>
			entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]
		);
const relative = (file) => path.relative(root, file).split(path.sep).join('/');
const source = walk(path.join(root, 'src'));
const resolveImport = (from, specifier) => {
	if (!specifier.startsWith('.') && !specifier.startsWith('$lib/')) return null;
	const bare = specifier.split('?')[0];
	const base = bare.startsWith('$lib/')
		? path.join(root, 'src/lib', bare.slice(5))
		: path.resolve(path.dirname(from), bare);
	const alternatives = [
		base,
		base.replace(/\.js$/, '.ts'),
		base + '.ts',
		base + '.svelte',
		path.join(base, 'index.ts')
	];
	return (
		alternatives.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ??
		null
	);
};
const imports = (file) => {
	const text = fs.readFileSync(file, 'utf8');
	const scripts = file.endsWith('.svelte')
		? [...text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map((match) => match[1]).join('\n')
		: text;
	const ast = ts.createSourceFile(file, scripts, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
	const found = [];
	const visit = (node) => {
		if (
			ts.isImportDeclaration(node) &&
			!node.importClause?.isTypeOnly &&
			ts.isStringLiteral(node.moduleSpecifier)
		)
			found.push(node.moduleSpecifier.text);
		if (
			ts.isExportDeclaration(node) &&
			!node.isTypeOnly &&
			node.moduleSpecifier &&
			ts.isStringLiteral(node.moduleSpecifier)
		)
			found.push(node.moduleSpecifier.text);
		if (
			ts.isCallExpression(node) &&
			node.expression.kind === ts.SyntaxKind.ImportKeyword &&
			node.arguments[0] &&
			ts.isStringLiteral(node.arguments[0])
		)
			found.push(node.arguments[0].text);
		ts.forEachChild(node, visit);
	};
	visit(ast);
	return found
		.map((spec) => resolveImport(file, spec))
		.filter((file) => file && /\.(ts|js|svelte)$/.test(file));
};
const blocked = new Set([
	'src/lib/server/auxero-template.ts',
	'src/lib/server/auxero-page.ts',
	'src/lib/server/auxero-public-shell.ts',
	'src/lib/components/layout/AuxeroRuntimeScripts.svelte'
]);
const entries = source.filter(
	(file) => relative(file).startsWith('src/routes/(site)/') && /\+.*\.(ts|svelte)$/.test(file)
);
const checked = new Set();
const problems = [];
const inspect = (file, chain = []) => {
	if (checked.has(file)) return;
	checked.add(file);
	const name = relative(file);
	if (blocked.has(name)) problems.push([...chain, name].join(' -> '));
	for (const dependency of imports(file)) inspect(dependency, [...chain, name]);
};
for (const file of entries) inspect(file);
for (const file of source.filter(
	(file) => file.endsWith('.css') && relative(file) !== 'src/lib/styles/app.css'
)) {
	if (/@import\s+['"]tailwindcss/.test(fs.readFileSync(file, 'utf8')))
		problems.push(relative(file) + ': duplicate Tailwind generation entry');
}
if (problems.length) {
	console.error(problems.join('\n'));
	process.exitCode = 1;
} else
	console.log(
		'Architecture checks passed: ' +
			entries.length +
			' native route modules, ' +
			checked.size +
			' reachable modules, one Tailwind generation entry.'
	);
