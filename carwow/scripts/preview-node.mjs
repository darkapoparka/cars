#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const defaultEnvFiles = ['.env.example', '.env.local'];
const envFiles = process.env.DAY_PREVIEW_ENV_FILE
	? process.env.DAY_PREVIEW_ENV_FILE.split(';').filter(Boolean)
	: defaultEnvFiles;

function cleanProcessEnv() {
	return Object.fromEntries(
		Object.entries(process.env).filter(([key, value]) => key && !key.startsWith('=') && value)
	);
}

function parseEnvFile(path) {
	if (!existsSync(path)) {
		return {};
	}

	const entries = {};

	for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;

		const separatorIndex = trimmed.indexOf('=');
		if (separatorIndex === -1) continue;

		const key = trimmed.slice(0, separatorIndex).trim();
		let value = trimmed.slice(separatorIndex + 1).trim();

		if (!key) continue;

		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}

		entries[key] = value;
	}

	return entries;
}

const fileEnv = Object.assign({}, ...envFiles.map((envFile) => parseEnvFile(envFile)));
const child = spawn(process.execPath, ['build'], {
	stdio: 'inherit',
	env: {
		...fileEnv,
		...cleanProcessEnv()
	}
});

child.on('error', (error) => {
	console.error('Failed to start node preview.');
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});

child.on('exit', (code, signal) => {
	if (signal) {
		console.error(`node preview exited from signal ${signal}`);
		process.exitCode = 1;
		return;
	}

	process.exitCode = code ?? 1;
});
