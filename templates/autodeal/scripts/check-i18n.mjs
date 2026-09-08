import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultLocale, locales } from '../i18n/config.mjs';
import { defaultLocale as projectDefaultLocale, enabledLocales } from '../i18n/site-config.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const requiredLocales = ['en', 'bg', 'de', 'el', 'ro', 'sr', 'ru', 'uk', 'tr'];
const allowedPreserveCategories = new Set([
	'asset-label', 'placeholder-copy', 'person-or-business-name', 'vehicle-brand-or-model',
	'vehicle-inventory-fact', 'vehicle-specification', 'address', 'contact-data',
	'date-or-time-fact', 'numeric-or-specification', 'identifier-or-model', 'punctuation'
]);

const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
const sourceCatalog = await readJson('i18n/source-catalog.json');
const preserve = (await readJson('i18n/preserve.json')).entries;
const sourceEntries = sourceCatalog.entries;
const sourceKeys = sourceEntries.map((entry) => entry.source);
const sourceSet = new Set(sourceKeys);
const errors = [];

function assert(condition, message) {
	if (!condition) errors.push(message);
}

function placeholders(value) {
	return [...String(value).matchAll(/\{\{?\s*[\w.-]+\s*\}?\}|%[sd]|\$\{[^}]+\}/gu)].map((match) => match[0]).sort();
}

assert(sourceCatalog.sourceLocale === 'en', `source catalog sourceLocale must be en, got ${sourceCatalog.sourceLocale}`);
assert(sourceCatalog.routeCount === 150, `source catalog routeCount must be 150, got ${sourceCatalog.routeCount}`);
assert(sourceKeys.length === sourceSet.size, 'source catalog contains duplicate source keys.');
assert(JSON.stringify([...locales].sort()) === JSON.stringify([...requiredLocales].sort()), 'i18n/config.mjs locale set is not exactly the required nine locales.');
assert(JSON.stringify([...enabledLocales].sort()) === JSON.stringify([...requiredLocales].sort()), 'site-config.mjs enabledLocales is not exactly the required nine locales.');
assert(defaultLocale === 'bg' && projectDefaultLocale === 'bg', 'Bulgarian must remain the project default locale.');
assert(new Set(enabledLocales).size === enabledLocales.length, 'site-config.mjs contains duplicate locales.');

for (const [source, reason] of Object.entries(preserve)) {
	assert(sourceSet.has(source), `preserve.json contains a source not present in source-catalog.json: ${source}`);
	assert(reason && allowedPreserveCategories.has(reason.category), `Unsupported preserve category for ${source}: ${reason?.category}`);
	assert(typeof reason.reason === 'string' && reason.reason.trim(), `Missing preserve reason for ${source}`);
}

const preserveKeys = Object.keys(preserve).sort();
const reports = [];
for (const locale of requiredLocales) {
	let catalog;
	try {
		catalog = await readJson(`i18n/catalogs/${locale}.json`);
	} catch (error) {
		errors.push(`Missing or malformed catalog ${locale}.json: ${error instanceof Error ? error.message : error}`);
		continue;
	}
	assert(catalog.locale === locale, `${locale}.json declares locale ${catalog.locale}`);
	assert(catalog.sourceLocale === 'en', `${locale}.json sourceLocale must be en.`);
	assert(catalog.messages && typeof catalog.messages === 'object', `${locale}.json messages must be an object.`);
	assert(catalog.compact && typeof catalog.compact === 'object', `${locale}.json compact must be an object.`);
	assert(catalog.preserved && typeof catalog.preserved === 'object', `${locale}.json preserved must be an object.`);
	assert(JSON.stringify(Object.keys(catalog.preserved).sort()) === JSON.stringify(preserveKeys), `${locale}.json preserved metadata does not match preserve.json.`);

	const catalogKeys = Object.keys(catalog.messages || {}).sort();
	assert(JSON.stringify(catalogKeys) === JSON.stringify([...sourceKeys].sort()), `${locale}.json messages do not exactly cover the source catalog.`);
	for (const entry of sourceEntries) {
		const target = catalog.messages?.[entry.source];
		assert(typeof target === 'string' && target.trim(), `${locale}: blank or missing target for ${entry.source}`);
		if (typeof target !== 'string') continue;
		assert(JSON.stringify(placeholders(entry.source)) === JSON.stringify(placeholders(target)), `${locale}: placeholder mismatch for ${entry.source}`);
		assert(!/<\/?script\b/iu.test(target), `${locale}: unsafe script marker in translation for ${entry.source}`);
		if (locale === 'en') {
			assert(target === entry.source, `en catalog changed source text: ${entry.source}`);
		} else if (!preserve[entry.source]) {
			assert(target !== entry.source, `${locale}: English identity without an allowlisted reason: ${entry.source}`);
		}
	}
	for (const [source, target] of Object.entries(catalog.compact || {})) {
		assert(sourceSet.has(source), `${locale}: compact catalog contains an unknown source: ${source}`);
		assert(typeof target === 'string' && target.trim(), `${locale}: blank compact translation for ${source}`);
	}
	for (const entry of sourceEntries.filter((item) => item.contexts.includes('compact'))) {
		assert(Object.prototype.hasOwnProperty.call(catalog.compact, entry.source), `${locale}: compact source missing: ${entry.source}`);
	}

	const translated = locale === 'en' ? sourceEntries.length : sourceEntries.length - preserveKeys.length;
	reports.push(`${locale}: ${translated} translated, ${preserveKeys.length} preserved, ${Object.keys(catalog.compact || {}).length} compact`);
}

const scriptExpectations = {
	bg: /[А-Яа-я]/u,
	el: /[Α-Ωα-ω]/u,
	sr: /[А-Яа-я]/u,
	ru: /[А-Яа-я]/u,
	uk: /[А-Яа-яІіЇїЄє]/u,
	ro: /[ăâîșțĂÂÎȘȚ]/u,
	tr: /[çğıİöşüÇĞÖŞÜ]/u
};
for (const [locale, pattern] of Object.entries(scriptExpectations)) {
	const catalog = await readJson(`i18n/catalogs/${locale}.json`);
	assert(pattern.test(catalog.messages.Acceleration), `${locale}: representative translation lacks expected locale characters.`);
}

if (errors.length) {
	console.error(`i18n validation failed with ${errors.length} error(s):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exitCode = 1;
} else {
	console.log(`i18n verified: ${sourceEntries.length} source strings, ${preserveKeys.length} explicit preserves, ${requiredLocales.length} locale catalogs.`);
	for (const report of reports) console.log(report);
}
