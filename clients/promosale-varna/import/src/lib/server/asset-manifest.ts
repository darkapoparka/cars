import { existsSync } from 'node:fs';
import path from 'node:path';

export type RenderedAssetPage = {
	html: string;
	label: string;
};

export type MissingAssetReferences = {
	label: string;
	missing: string[];
};

const assetAttributePattern = /\b(?:src|href|poster|data-src|data-bg|data-image)=("|')([^"']+)\1/gi;
const srcsetAttributePattern = /\bsrcset=("|')([^"']+)\1/gi;
const cssUrlPattern = /url\(\s*("|')?([^"')]+)\1\s*\)/gi;
const ignoredReferencePattern = /^(?:#|data:|https?:|mailto:|tel:|javascript:)/i;

const withoutSuffix = (value: string) => value.split(/[?#]/, 1)[0]?.trim() ?? '';

const decodeReference = (value: string) => {
	try {
		return decodeURI(value);
	} catch {
		return value;
	}
};

export const normalizeLocalAssetReference = (value: string) => {
	const candidate = decodeReference(withoutSuffix(value));

	if (!candidate || ignoredReferencePattern.test(candidate)) return undefined;
	if (candidate.startsWith('/assets/')) return candidate;
	if (candidate.startsWith('./assets/')) return candidate.replace(/^\./, '');
	if (candidate.startsWith('assets/')) return `/${candidate}`;
	if (candidate.startsWith('../assets/')) return candidate.replace(/^(?:\.\.\/)+/, '/');

	return undefined;
};

const srcsetCandidates = (value: string) =>
	value
		.split(',')
		.map((candidate) => candidate.trim().split(/\s+/)[0] ?? '')
		.filter(Boolean);

export const extractLocalAssetReferences = (html: string) => {
	const references = new Set<string>();
	const addReference = (value: string) => {
		const normalized = normalizeLocalAssetReference(value);
		if (normalized) references.add(normalized);
	};

	for (const match of html.matchAll(assetAttributePattern)) {
		addReference(match[2] ?? '');
	}

	for (const match of html.matchAll(srcsetAttributePattern)) {
		for (const candidate of srcsetCandidates(match[2] ?? '')) {
			addReference(candidate);
		}
	}

	for (const match of html.matchAll(cssUrlPattern)) {
		addReference(match[2] ?? '');
	}

	return Array.from(references).sort((left, right) => left.localeCompare(right));
};

export const localAssetFilesystemPath = (reference: string, root = process.cwd()) =>
	path.join(root, 'static', ...reference.replace(/^\/+/, '').split('/'));

export const findMissingLocalAssetReferences = (
	pages: RenderedAssetPage[],
	root = process.cwd()
): MissingAssetReferences[] =>
	pages
		.map(({ html, label }) => ({
			label,
			missing: extractLocalAssetReferences(html).filter(
				(reference) => !existsSync(localAssetFilesystemPath(reference, root))
			)
		}))
		.filter((page) => page.missing.length > 0);
