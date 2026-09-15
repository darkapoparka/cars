#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = process.cwd();

const forbiddenNames = [
	'DATABASE_URL',
	'DATABASE_URL_UNPOOLED',
	'BETTER_AUTH_SECRET',
	'CHAT_COOKIE_SECRET',
	'OPENAI_API_KEY',
	'STAFF_NOTIFICATION_WEBHOOK_TOKEN'
];

const escapedForbiddenNames = forbiddenNames
	.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
	.join('|');

const forbiddenPatterns = [
	{
		label: 'server-only environment variable name',
		regex: new RegExp(`\\b(?:${escapedForbiddenNames})\\b`)
	},
	{
		label: 'private environment module import',
		regex: /\$env\/(?:static|dynamic)\/private/
	},
	{
		label: 'postgres connection string',
		regex: /\bpostgres(?:ql)?:\/\/[^\s"'`<>]+/i
	}
];

const sourceRoots = ['src/lib', 'src/routes', 'src/app.html'];
const buildRoots = ['.svelte-kit/output/client', '.vercel/output/static'];
const sourceExtensions = new Set(['.svelte', '.ts', '.js', '.mjs']);
const bundleExtensions = new Set(['.js', '.mjs', '.css', '.html', '.json', '.map']);

function walk(path) {
	if (!existsSync(path)) return [];

	const stats = statSync(path);
	if (stats.isFile()) return [path];

	return readdirSync(path).flatMap((entry) => walk(join(path, entry)));
}

function relativePath(path) {
	return relative(root, path).replaceAll('\\', '/');
}

function isClientExposedSource(path) {
	const relativeFile = relativePath(path);
	const extension = extname(path);

	if (!sourceExtensions.has(extension)) return false;
	if (relativeFile.includes('/server/')) return false;
	if (relativeFile.includes('/__tests__/')) return false;
	if (relativeFile.includes('/test/')) return false;
	if (relativeFile.includes('/tests/')) return false;
	if (relativeFile.includes('/api/')) return false;
	if (relativeFile.endsWith('+server.ts')) return false;
	if (relativeFile.endsWith('+page.server.ts')) return false;
	if (relativeFile.endsWith('+layout.server.ts')) return false;
	if (relativeFile.includes('.server.')) return false;
	if (/\.(spec|test|e2e)\.[cm]?[tj]s$/.test(relativeFile)) return false;

	return true;
}

function isBundleFile(path) {
	return bundleExtensions.has(extname(path));
}

function lineForIndex(content, index) {
	return content.slice(0, index).split(/\r?\n/).length;
}

function scanFile(path, scope, findings) {
	const content = readFileSync(path, 'utf8');

	for (const pattern of forbiddenPatterns) {
		const match = pattern.regex.exec(content);
		if (!match) continue;

		findings.push({
			scope,
			file: relativePath(path),
			label: pattern.label,
			line: lineForIndex(content, match.index)
		});
	}
}

const findings = [];
const sourceFiles = sourceRoots
	.flatMap((path) => walk(join(root, path)))
	.filter(isClientExposedSource);
const buildFiles = buildRoots.flatMap((path) => walk(join(root, path))).filter(isBundleFile);

for (const file of sourceFiles) {
	scanFile(file, 'client source', findings);
}

for (const file of buildFiles) {
	scanFile(file, 'built client', findings);
}

console.log('Backend secret boundary check');
console.log(`Scanned client-exposed source files: ${sourceFiles.length}`);

if (buildFiles.length) {
	console.log(`Scanned built client files: ${buildFiles.length}`);
} else {
	console.log('info no built client output found; run npm run build before relying on bundle scan');
}

if (findings.length) {
	for (const finding of findings) {
		console.error(`fail ${finding.scope}: ${finding.file}:${finding.line} (${finding.label})`);
	}

	console.error(`Backend secret boundary failed with ${findings.length} issue(s).`);
	process.exitCode = 1;
} else {
	console.log('Backend secret boundary passed.');
}
