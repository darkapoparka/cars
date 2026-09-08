import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const mirrorRoot = path.join(root, 'mirror');
const pagesRoot = path.join(mirrorRoot, 'pages');
const manifestPath = path.join(mirrorRoot, 'manifest.json');
const outputPath = path.join(root, 'i18n', 'source-catalog.json');

const ignoredTags = new Set(['script', 'style', 'noscript', 'svg', 'path', 'code', 'pre', 'textarea', 'template']);
const compactTags = new Set(['a', 'button', 'input', 'select', 'option', 'summary', 'label']);
const supportedMeta = new Map([
	['description', 'meta-description'],
	['og:title', 'meta-og-title'],
	['og:description', 'meta-og-description'],
	['twitter:title', 'meta-twitter-title'],
	['twitter:description', 'meta-twitter-description']
]);

const namedEntities = new Map([
	['amp', '&'], ['apos', "'"], ['gt', '>'], ['lt', '<'], ['nbsp', ' '], ['quot', '"'],
	['ndash', '–'], ['mdash', '—'], ['hellip', '…'], ['laquo', '«'], ['raquo', '»'],
	['ldquo', '“'], ['rdquo', '”'], ['lsquo', '‘'], ['rsquo', '’'], ['euro', '€'],
	['copy', '©'], ['reg', '®'], ['trade', '™'], ['times', '×'], ['bull', '•']
]);

function decodeEntities(value) {
	return value.replace(/&(#x[\da-f]+|#\d+|[a-z][\w]+);/giu, (whole, entity) => {
		if (entity[0] === '#') {
			const code = entity[1].toLowerCase() === 'x' ? Number.parseInt(entity.slice(2), 16) : Number.parseInt(entity.slice(1), 10);
			return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
		}
		return namedEntities.get(entity.toLowerCase()) ?? whole;
	});
}

function normalize(value) {
	return decodeEntities(value).replace(/[\u0000-\u001f\u007f]+/gu, ' ').replace(/\s+/gu, ' ').trim();
}

function parseAttributes(raw) {
	const attributes = {};
	const attributePattern = /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/gu;
	let match;
	while ((match = attributePattern.exec(raw))) {
		const name = match[1].toLowerCase();
		if (name === raw.trim().split(/\s+/u)[0].toLowerCase()) continue;
		attributes[name] = normalize(match[2] ?? match[3] ?? match[4] ?? '');
	}
	return attributes;
}

function nextTagEnd(html, start) {
	let quote = '';
	for (let index = start; index < html.length; index += 1) {
		const character = html[index];
		if (quote) {
			if (character === quote) quote = '';
			continue;
		}
		if (character === '"' || character === "'") {
			quote = character;
			continue;
		}
		if (character === '>') return index;
	}
	return -1;
}

function placeholders(value) {
	return [...new Set(value.match(/\{\{?\s*[\w.-]+\s*\}?\}|%[sd]|:[A-Za-z][\w.-]*/gu) ?? [])].sort();
}

function routeForPage(fileName) {
	const key = fileName.replace(/\.html$/u, '');
	if (key === 'index') return '/';
	return `/${key.replaceAll('__', '/')}`;
}

function contextFor(tagName, attributes, kind) {
	const className = attributes.class ?? '';
	const compact = compactTags.has(tagName) || /(?:btn|button|tab|nav|menu|badge|pill|action|search|sort|filter)/iu.test(className);
	return { kind, compact, tag: tagName };
}

function addEntry(entries, source, occurrence) {
	if (!source) return;
	let entry = entries.get(source);
	if (!entry) {
		entry = {
			source,
			placeholders: placeholders(source),
			kinds: new Set(),
			contexts: new Set(),
			routes: new Set(),
			occurrences: []
		};
		entries.set(source, entry);
	}
	entry.kinds.add(occurrence.kind);
	entry.routes.add(occurrence.route);
	entry.contexts.add(occurrence.compact ? 'compact' : 'normal');
	const occurrenceKey = `${occurrence.route}|${occurrence.kind}|${occurrence.tag}`;
	if (!entry.occurrences.some((item) => item.key === occurrenceKey)) {
		entry.occurrences.push({ key: occurrenceKey, route: occurrence.route, kind: occurrence.kind, tag: occurrence.tag, compact: occurrence.compact });
	}
}

function extractPage(html, route, entries) {
	const stack = [];
	let cursor = 0;
	const lowerHtml = html.toLowerCase();

	const isIgnored = () => stack.some((item) => item.ignored);
	const addText = (raw, tagName = stack.at(-1)?.tag ?? 'body') => {
		if (isIgnored()) return;
		const source = normalize(raw);
		if (!source) return;
		const attributes = stack.at(-1)?.attributes ?? {};
		addEntry(entries, source, { route, kind: tagName === 'title' ? 'title' : 'text', tag: tagName, compact: compactTags.has(tagName) || /(?:btn|button|tab|nav|menu|badge|pill|action|search|sort|filter)/iu.test(attributes.class ?? '') });
	};

	while (cursor < html.length) {
		const ignoredRoot = stack.at(-1);
		if (ignoredRoot && ignoredTags.has(ignoredRoot.tag)) {
			const closingStart = lowerHtml.indexOf(`</${ignoredRoot.tag}`, cursor);
			if (closingStart === -1) break;
			const closingEnd = nextTagEnd(html, closingStart + 2);
			stack.pop();
			cursor = closingEnd === -1 ? html.length : closingEnd + 1;
			continue;
		}
		const start = html.indexOf('<', cursor);
		if (start === -1) {
			addText(html.slice(cursor));
			break;
		}
		if (start > cursor) addText(html.slice(cursor, start));
		if (html.startsWith('<!--', start)) {
			const commentEnd = html.indexOf('-->', start + 4);
			cursor = commentEnd === -1 ? html.length : commentEnd + 3;
			continue;
		}
		const end = nextTagEnd(html, start + 1);
		if (end === -1) break;
		const rawTag = html.slice(start + 1, end).trim();
		if (!rawTag || rawTag.startsWith('!') || rawTag.startsWith('?')) {
			cursor = end + 1;
			continue;
		}
		const closing = rawTag.startsWith('/');
		const normalizedTag = (closing ? rawTag.slice(1) : rawTag).trim();
		const tagMatch = normalizedTag.match(/^([:\w-]+)/u);
		if (!tagMatch) {
			cursor = end + 1;
			continue;
		}
		const tagName = tagMatch[1].toLowerCase();
		if (closing) {
			const index = stack.map((item) => item.tag).lastIndexOf(tagName);
			if (index !== -1) stack.splice(index);
			cursor = end + 1;
			continue;
		}

		const attributes = parseAttributes(normalizedTag.slice(tagMatch[0].length));
		const hidden = Object.hasOwn(attributes, 'hidden') || attributes['aria-hidden'] === 'true' || attributes.inert !== undefined;
		const ignored = isIgnored() || ignoredTags.has(tagName) || hidden;
		const compact = contextFor(tagName, attributes, 'text').compact;

		if (!ignored) {
			if (tagName === 'meta') {
				const metaKey = (attributes.name ?? attributes.property ?? '').toLowerCase();
				const kind = supportedMeta.get(metaKey);
				if (kind) addEntry(entries, attributes.content, { route, kind, tag: tagName, compact: false });
			}
			for (const [attribute, kind] of [['placeholder', 'placeholder'], ['aria-label', 'aria-label'], ['title', 'title-attribute'], ['alt', 'alt']]) {
				const value = attributes[attribute];
				if (!value || (attribute === 'alt' && !value.replace(/[.\-_\s]+/gu, ''))) continue;
				addEntry(entries, value, { route, kind, tag: tagName, compact: compact || attribute === 'aria-label' || attribute === 'placeholder' });
			}
			if ((tagName === 'button' || tagName === 'input') && ['button', 'submit', 'reset'].includes((attributes.type ?? '').toLowerCase()) && attributes.value) {
				addEntry(entries, attributes.value, { route, kind: 'value', tag: tagName, compact: true });
			}
		}

		const selfClosing = /\/\s*$/u.test(normalizedTag) || ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(tagName);
		if (!selfClosing) stack.push({ tag: tagName, attributes, ignored });
		cursor = end + 1;
	}
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const pageFiles = new Set((await readdir(pagesRoot)).filter((fileName) => fileName.endsWith('.html')));
const entries = new Map();
const requestedRoute = process.argv.find((argument) => argument.startsWith('--route='))?.slice('--route='.length);
const routes = requestedRoute ? manifest.routes.filter((route) => route === requestedRoute) : manifest.routes;
if (requestedRoute && routes.length !== 1) throw new Error(`Unknown route: ${requestedRoute}`);

for (const route of routes) {
	const key = route === '/' ? 'index' : route.replace(/^\//u, '').replaceAll('/', '__');
	const fileName = `${key}.html`;
	if (!pageFiles.has(fileName)) throw new Error(`Cannot extract ${route}: missing ${fileName}`);
	const html = await readFile(path.join(pagesRoot, fileName), 'utf8');
	extractPage(html, route, entries);
	if (requestedRoute) console.log(`Extracted ${entries.size} entries from ${route}.`);
}

const output = {
	version: 1,
	sourceLocale: 'en',
	generatedBy: 'scripts/extract-i18n-catalog.mjs',
	routeCount: manifest.routes.length,
	entries: [...entries.values()]
		.map((entry) => ({
			source: entry.source,
			placeholders: entry.placeholders,
			kinds: [...entry.kinds].sort(),
			contexts: [...entry.contexts].sort(),
			routes: [...entry.routes].sort(),
			occurrences: entry.occurrences.sort((left, right) => left.key.localeCompare(right.key))
		}))
		.sort((left, right) => left.source < right.source ? -1 : left.source > right.source ? 1 : 0)
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, '\t')}\n`, 'utf8');

const compactCount = output.entries.filter((entry) => entry.contexts.includes('compact')).length;
console.log(`Extracted ${output.entries.length} unique source strings from ${output.routeCount} routes (${compactCount} with compact UI context).`);
