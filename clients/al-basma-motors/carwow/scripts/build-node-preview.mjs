#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const viteBin = fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url));
const cleanEnv = Object.fromEntries(
	Object.entries(process.env).filter(([key, value]) => key && !key.startsWith('=') && value)
);
const child = spawn(process.execPath, [viteBin, 'build'], {
	stdio: 'inherit',
	env: {
		...cleanEnv,
		DAY_PREVIEW_ADAPTER: 'node'
	}
});

child.on('error', (error) => {
	console.error('Failed to start node-preview build.');
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});

child.on('exit', (code, signal) => {
	if (signal) {
		console.error(`node-preview build exited from signal ${signal}`);
		process.exitCode = 1;
		return;
	}

	process.exitCode = code ?? 1;
});
