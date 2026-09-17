import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const schemaPath = path.join(root, 'src/lib/server/db/schema.ts');
const migrationsDir = path.join(root, 'db/neon/migrations');

const helperColumns = new Map([
	['createdAt', 'created_at'],
	['updatedAt', 'updated_at'],
	['appCreatedAt', 'created_at'],
	['appUpdatedAt', 'updated_at']
]);

const ignoredSqlTables = new Set(['schema_migrations']);

function readText(filePath) {
	return fs.readFileSync(filePath, 'utf8');
}

function readMigrations() {
	return fs
		.readdirSync(migrationsDir)
		.filter((file) => file.endsWith('.sql'))
		.sort()
		.map((file) => readText(path.join(migrationsDir, file)))
		.join('\n\n');
}

function findBalancedClose(source, openIndex, openChar, closeChar) {
	let depth = 0;
	let quote = '';
	let escaping = false;

	for (let index = openIndex; index < source.length; index += 1) {
		const char = source[index];
		const previous = source[index - 1];

		if (quote) {
			if (quote === '`' && char === '$' && source[index + 1] === '{') {
				index += 1;
				continue;
			}

			if (char === quote && !escaping) {
				quote = '';
			}

			escaping = char === '\\' && !escaping;
			if (char !== '\\') escaping = false;
			continue;
		}

		if (char === "'" || char === '"' || char === '`') {
			quote = char;
			continue;
		}

		if (char === openChar) {
			depth += 1;
			continue;
		}

		if (char === closeChar) {
			depth -= 1;
			if (depth === 0) return index;
		}

		if (previous === '$' && char === '$') {
			const closeDollar = source.indexOf('$$', index + 1);
			if (closeDollar !== -1) index = closeDollar + 1;
		}
	}

	return -1;
}

function splitTopLevel(source, delimiter) {
	const parts = [];
	let start = 0;
	let depth = 0;
	let quote = '';
	let escaping = false;

	for (let index = 0; index < source.length; index += 1) {
		const char = source[index];

		if (quote) {
			if (char === quote && !escaping) quote = '';
			escaping = char === '\\' && !escaping;
			if (char !== '\\') escaping = false;
			continue;
		}

		if (char === "'" || char === '"' || char === '`') {
			quote = char;
			continue;
		}

		if (char === '(' || char === '{' || char === '[') depth += 1;
		if (char === ')' || char === '}' || char === ']') depth -= 1;

		if (char === delimiter && depth === 0) {
			parts.push(source.slice(start, index));
			start = index + 1;
		}
	}

	parts.push(source.slice(start));
	return parts;
}

function extractTsEnums(schemaText) {
	const enums = new Map();
	const enumRegex = /export const \w+ = pgEnum\(\s*['"]([^'"]+)['"]\s*,\s*\[([\s\S]*?)\]\s*\)/g;
	let match;

	while ((match = enumRegex.exec(schemaText))) {
		const values = [...match[2].matchAll(/['"]([^'"]+)['"]/g)].map((valueMatch) => valueMatch[1]);
		enums.set(match[1], values);
	}

	return enums;
}

function extractTsColumnName(entry) {
	const keyMatch = entry.match(/^\s*([A-Za-z_$][\w$]*)\s*:/);
	if (!keyMatch) return null;

	const key = keyMatch[1];
	const expression = entry.slice(keyMatch[0].length).trim();
	const quotedColumn = expression.match(/\b[A-Za-z_$][\w$]*\(\s*['"]([^'"]+)['"]/);

	if (quotedColumn) return quotedColumn[1];

	for (const [helper, column] of helperColumns) {
		if (expression.startsWith(`${helper}()`)) return column;
	}

	return key;
}

function extractTsTables(schemaText) {
	const tables = new Map();
	const tableRegex = /export const\s+\w+\s*=\s*pgTable\(\s*['"]([^'"]+)['"]\s*,\s*\{/g;
	let match;

	while ((match = tableRegex.exec(schemaText))) {
		const tableName = match[1];
		const openBraceIndex = tableRegex.lastIndex - 1;
		const closeBraceIndex = findBalancedClose(schemaText, openBraceIndex, '{', '}');

		if (closeBraceIndex === -1) {
			throw new Error(`Could not parse Drizzle table ${tableName}.`);
		}

		const columnBody = schemaText.slice(openBraceIndex + 1, closeBraceIndex);
		const columns = splitTopLevel(columnBody, ',')
			.map((entry) => extractTsColumnName(entry.trim()))
			.filter(Boolean)
			.sort();

		tables.set(tableName, columns);
		tableRegex.lastIndex = closeBraceIndex + 1;
	}

	return tables;
}

function extractSqlEnums(sqlText) {
	const enums = new Map();
	const enumRegex = /create type public\.("?[\w]+"?) as enum\s*\(([\s\S]*?)\)/gi;
	let match;

	while ((match = enumRegex.exec(sqlText))) {
		const enumName = match[1].replaceAll('"', '');
		const values = [...match[2].matchAll(/'([^']+)'/g)].map((valueMatch) => valueMatch[1]);
		enums.set(enumName, values);
	}

	return enums;
}

function extractSqlTables(sqlText) {
	const tables = new Map();
	const tableRegex = /create table if not exists public\.("?[\w]+"?)\s*\(/gi;
	let match;

	while ((match = tableRegex.exec(sqlText))) {
		const tableName = match[1].replaceAll('"', '');
		const openParenIndex = tableRegex.lastIndex - 1;
		const closeParenIndex = findBalancedClose(sqlText, openParenIndex, '(', ')');

		if (closeParenIndex === -1) {
			throw new Error(`Could not parse SQL table ${tableName}.`);
		}

		if (ignoredSqlTables.has(tableName)) {
			tableRegex.lastIndex = closeParenIndex + 1;
			continue;
		}

		const body = sqlText.slice(openParenIndex + 1, closeParenIndex);
		const columns = splitTopLevel(body, ',')
			.map((entry) => entry.trim())
			.filter(Boolean)
			.map((entry) => {
				const firstToken = entry.match(/^"?([A-Za-z_][\w]*)"?\s+/)?.[1];
				const keyword = firstToken?.toLowerCase();
				if (
					!firstToken ||
					['constraint', 'unique', 'primary', 'foreign', 'check', 'exclude'].includes(keyword)
				) {
					return null;
				}

				return firstToken;
			})
			.filter(Boolean)
			.sort();

		tables.set(tableName, columns);
		tableRegex.lastIndex = closeParenIndex + 1;
	}

	return tables;
}

function diffSets(label, expected, actual) {
	const errors = [];
	const expectedKeys = [...expected.keys()].sort();
	const actualKeys = [...actual.keys()].sort();
	const missing = expectedKeys.filter((key) => !actual.has(key));
	const extra = actualKeys.filter((key) => !expected.has(key));

	if (missing.length) errors.push(`${label} missing from SQL: ${missing.join(', ')}`);
	if (extra.length) errors.push(`${label} present only in SQL: ${extra.join(', ')}`);

	for (const key of expectedKeys.filter((name) => actual.has(name))) {
		const expectedValues = expected.get(key);
		const actualValues = actual.get(key);
		const missingValues = expectedValues.filter((value) => !actualValues.includes(value));
		const extraValues = actualValues.filter((value) => !expectedValues.includes(value));

		if (missingValues.length) {
			errors.push(`${label} ${key} values missing from SQL: ${missingValues.join(', ')}`);
		}

		if (extraValues.length) {
			errors.push(`${label} ${key} values present only in SQL: ${extraValues.join(', ')}`);
		}
	}

	return errors;
}

const schemaText = readText(schemaPath);
const sqlText = readMigrations();
const errors = [
	...diffSets('enum', extractTsEnums(schemaText), extractSqlEnums(sqlText)),
	...diffSets('table', extractTsTables(schemaText), extractSqlTables(sqlText))
];

if (errors.length) {
	console.error('Neon schema drift check failed.');
	for (const error of errors) console.error(`- ${error}`);
	process.exitCode = 1;
} else {
	console.log('Neon schema drift check passed.');
}
