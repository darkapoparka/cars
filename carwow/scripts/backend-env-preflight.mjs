#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';

const failClosedMode = process.env.BACKEND_ENV_PREFLIGHT_MODE === 'fail-closed';
const envFilePaths = (process.env.BACKEND_ENV_FILE ?? '.env.local,.env')
	.split(',')
	.map((path) => path.trim())
	.filter(Boolean);
const templateMode = failClosedMode && envFilePaths.some((path) => path.endsWith('.env.example'));

const removedProviderName = 'SUPA' + 'BASE';
const publicNamePattern = new RegExp(
	`(DATABASE_URL|POSTGRES|${removedProviderName}|SECRET|TOKEN|KEY)`,
	'i'
);
const publicValuePattern = /(postgres(?:ql)?:\/\/|secret|token|key)/i;
const safePublicNames = new Set(['PUBLIC_SITE_URL', 'PUBLIC_BASE_URL', 'PUBLIC_APP_ENV']);

function parseEnvLine(line) {
	const trimmed = line.trim();
	if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return null;

	const [rawKey, ...rawValueParts] = trimmed.split('=');
	const key = rawKey.trim();
	let value = rawValueParts.join('=').trim();

	if (
		(value.startsWith('"') && value.endsWith('"')) ||
		(value.startsWith("'") && value.endsWith("'"))
	) {
		value = value.slice(1, -1);
	}

	return key ? [key, value] : null;
}

function loadEnvFiles(paths) {
	const loaded = {};
	const found = [];

	for (const path of paths) {
		if (!existsSync(path)) continue;
		found.push(path);

		const content = readFileSync(path, 'utf8');
		for (const line of content.split(/\r?\n/)) {
			const parsed = parseEnvLine(line);
			if (!parsed) continue;
			const [key, value] = parsed;
			if (!(key in loaded)) {
				loaded[key] = value;
			}
		}
	}

	return { loaded, found };
}

function envValue(envFiles, key) {
	const processValue = process.env[key];
	if (typeof processValue === 'string' && processValue.length > 0) {
		return processValue;
	}

	return envFiles.loaded[key] ?? '';
}

function isPlaceholder(value) {
	const trimmed = value.trim();
	return !trimmed || trimmed.includes('<') || trimmed.includes('>') || trimmed === '""';
}

function assertCheck(condition, message, failures) {
	if (!condition) {
		failures.push(message);
		console.error(`fail ${message}`);
		return;
	}

	console.log(`ok ${message}`);
}

function assertRequiredValue(value, name, failures) {
	if (templateMode && isPlaceholder(value)) {
		console.log(`ok ${name} placeholder is allowed in .env.example fail-closed mode`);
		return;
	}

	assertCheck(!isPlaceholder(value), `${name} is configured`, failures);
}

function assertSecretLength(value, name, failures) {
	if (templateMode && isPlaceholder(value)) {
		console.log(`ok ${name} placeholder is allowed in .env.example fail-closed mode`);
		return;
	}

	assertCheck(
		value.length >= 32 && !isPlaceholder(value),
		`${name} has at least 32 characters`,
		failures
	);
}

function assertPostgresUrl(value, name, failures) {
	if (templateMode && isPlaceholder(value)) {
		console.log(`ok ${name} placeholder is allowed in .env.example fail-closed mode`);
		return;
	}

	assertCheck(
		/^(postgresql|postgres):\/\//.test(value),
		`${name} starts with postgres:// or postgresql://`,
		failures
	);
}

function findUnsafePublicEnv(envFiles) {
	return Object.entries({ ...envFiles.loaded, ...process.env })
		.filter(([key]) => key.startsWith('PUBLIC_') && !safePublicNames.has(key))
		.filter(([key, value]) => publicNamePattern.test(key) || publicValuePattern.test(String(value)))
		.map(([key]) => key)
		.sort();
}

const envFiles = loadEnvFiles(envFilePaths);
const failures = [];

console.log('Backend env preflight');
console.log(
	envFiles.found.length
		? `Loaded env file names only: ${envFiles.found.join(', ')}`
		: 'Loaded env file names only: none'
);
console.log(failClosedMode ? 'Mode: fail-closed local preview' : 'Mode: production write smoke');

const databaseUrl = envValue(envFiles, 'DATABASE_URL').trim();
const betterAuthSecret = envValue(envFiles, 'BETTER_AUTH_SECRET').trim();
const chatCookieSecret = envValue(envFiles, 'CHAT_COOKIE_SECRET').trim();
const defaultDealerSlug = envValue(envFiles, 'DEFAULT_DEALER_SLUG').trim();
const unsafePublicEnv = findUnsafePublicEnv(envFiles);

assertPostgresUrl(databaseUrl, 'DATABASE_URL', failures);
assertSecretLength(betterAuthSecret, 'BETTER_AUTH_SECRET', failures);
assertSecretLength(chatCookieSecret, 'CHAT_COOKIE_SECRET', failures);
assertRequiredValue(defaultDealerSlug, 'DEFAULT_DEALER_SLUG', failures);
assertCheck(
	unsafePublicEnv.length === 0,
	'no unsafe PUBLIC_* backend variables are configured',
	failures
);

if (unsafePublicEnv.length) {
	console.error(`Unsafe PUBLIC_* variables: ${unsafePublicEnv.join(', ')}`);
}

if (failures.length) {
	console.error(`Backend env preflight failed with ${failures.length} issue(s).`);
	process.exitCode = 1;
} else {
	console.log('Backend env preflight passed.');
}
