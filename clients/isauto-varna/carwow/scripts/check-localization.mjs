import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'svelte/compiler';
import { compileCatalog } from './locale-catalog.mjs';
const read = (file) => fs.readFileSync(file, 'utf8');
const files = (dir) =>
	fs
		.readdirSync(dir, { withFileTypes: true })
		.flatMap((entry) =>
			entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]
		);
const common = JSON.parse(read('localization/common.json'));
const rows = ['catalog', 'template', 'dealer'].flatMap((kind) =>
	JSON.parse(read(`localization/${kind}.reviewed.json`))
);
const catalog = compileCatalog(common, rows);
const problems = [],
	uses = [];
const copyAttributes = new Set([
	'title',
	'alt',
	'placeholder',
	'aria-label',
	'label',
	'heading',
	'description',
	'subtitle',
	'eyebrow',
	'emptyMessage',
	'primaryLabel',
	'secondaryLabel',
	'ctaLabel',
	'copy',
	'submitLabel'
]);
function visit(node, callback, parent) {
	if (!node || typeof node !== 'object') return;
	if (node.type && callback(node, parent) === false) return;
	for (const [key, value] of Object.entries(node)) {
		if (['loc', 'metadata', 'comments'].includes(key)) continue;
		if (Array.isArray(value)) value.forEach((child) => visit(child, callback, node));
		else if (value && typeof value === 'object') visit(value, callback, node);
	}
}
for (const file of files('src').filter(
	(file) => file.endsWith('.svelte') && !/[\\/](admin|ui)[\\/]/.test(file)
)) {
	const source = read(file),
		ast = parse(source, { modern: true });
	const report = (node, value, kind) => {
		if (
			value === 'Български' &&
			(file.includes('locale-settings') || file.includes('LocalePreferences'))
		)
			return;
		if (/[А-Яа-я]/.test(value))
			problems.push({ file, line: source.slice(0, node.start).split('\n').length, kind, value });
	};
	visit(ast.fragment, (node, parent) => {
		if (node.type === 'Text' && parent?.type !== 'Attribute')
			report(node, node.data.trim(), 'literal text');
		if (node.type === 'Attribute' && copyAttributes.has(node.name) && Array.isArray(node.value)) {
			for (const value of node.value)
				if (value.type === 'Text') report(node, value.data, node.name);
		}
	});
	visit(ast, (node) => {
		if (
			node.type !== 'CallExpression' ||
			node.callee.object?.name !== 'i18n' ||
			node.callee.property?.name !== 't'
		)
			return;
		const key = node.arguments[0]?.value;
		if (typeof key === 'string') {
			uses.push({ file, key });
			if (!(key in catalog.en)) problems.push({ file, key, kind: 'missing key' });
		}
	});
}
for (const row of rows) {
	if (/Al Reef|Sharjah|UAE|AED|Auto Best/.test(row.en + row.bg))
		problems.push({ key: row.key, kind: 'foreign dealer copy' });
}
const result = {
	status: problems.length ? 'fail' : 'pass',
	nativeKeyUses: uses.length,
	scope:
		'Literal public Svelte copy, native key existence, catalog parity and dealer isolation. Dynamic copy and runtime interactions require browser evidence.',
	exclusions: ['Admin is English-only and separate', 'UI primitives have caller-owned labels'],
	problems
};
fs.mkdirSync('.audit/localization', { recursive: true });
fs.writeFileSync('.audit/localization/catalog-coverage.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
if (problems.length) process.exitCode = 1;
