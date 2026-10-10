import type { HTMLLinkAttributes, HTMLMetaAttributes } from 'svelte/elements';

export type AuxeroHeadLink = {
	as?: HTMLLinkAttributes['as'];
	crossorigin?: HTMLLinkAttributes['crossorigin'];
	fetchPriority?: HTMLLinkAttributes['fetchpriority'];
	href: string;
	id: string;
	media?: string;
	referrerpolicy?: HTMLLinkAttributes['referrerpolicy'];
	rel: string;
	sizes?: string;
	type?: string;
};

export type AuxeroHeadMeta = {
	content: string;
	httpEquiv?: HTMLMetaAttributes['http-equiv'];
	id: string;
	name?: string;
	property?: string;
};

export type AuxeroHeadStyle = {
	css: string;
	id: string;
};

export type AuxeroHeadAssets = {
	links: AuxeroHeadLink[];
	meta: AuxeroHeadMeta[];
	styles: AuxeroHeadStyle[];
};

export type AuxeroPageDocument = {
	bodyClass: string;
	bodyHtml: string;
	headAssets: AuxeroHeadAssets;
	headHtml: string;
};

const decodeHeadAttribute = (value: string) =>
	value
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&apos;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');

const parseHeadAttributes = (attributes: string) => {
	const parsed: Record<string, string> = {};
	const attributePattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
	let match: RegExpExecArray | null;

	while ((match = attributePattern.exec(attributes))) {
		const name = (match[1] ?? '').toLowerCase();
		const value = match[2] ?? match[3] ?? match[4] ?? '';

		if (name) parsed[name] = decodeHeadAttribute(value);
	}

	return parsed;
};

const normalizeHeadHref = (href: string) => {
	if (href.startsWith('./')) return `/${href.slice(2)}`;
	if (href.startsWith('assets/')) return `/${href}`;

	return href;
};

const hashHeadValue = (value: string) => {
	let hash = 5381;

	for (let index = 0; index < value.length; index += 1) {
		hash = (hash * 33) ^ value.charCodeAt(index);
	}

	return (hash >>> 0).toString(36);
};

/**
 * Add a `<meta name="description">` to the head assets when the page does not already
 * declare one. Additive and idempotent — never overwrites a template-provided description,
 * so it is safe to call for every route. Fixes the missing meta-description on the
 * dynamic/secondary pages (only the homepage shipped one previously).
 */
export const ensureDescriptionMeta = (
	assets: AuxeroHeadAssets,
	description: string | undefined
): AuxeroHeadAssets => {
	const trimmed = description?.trim();

	if (!trimmed) return assets;
	if (assets.meta.some((item) => item.name?.toLowerCase() === 'description')) return assets;

	return {
		...assets,
		meta: [
			...assets.meta,
			{ content: trimmed, id: `meta:description:${hashHeadValue(trimmed)}`, name: 'description' }
		]
	};
};

export const parseAuxeroHeadAssets = (headHtml: string): AuxeroHeadAssets => {
	const meta: AuxeroHeadMeta[] = [];
	const links: AuxeroHeadLink[] = [];
	const styles: AuxeroHeadStyle[] = [];
	let styleIndex = 0;

	for (const match of headHtml.matchAll(/<meta\b([^>]*)>/gi)) {
		const attributes = parseHeadAttributes(match[1] ?? '');
		const content = attributes.content;
		const name = attributes.name?.toLowerCase();
		const property = attributes.property;
		const httpEquiv = attributes['http-equiv'];

		if (attributes.charset || name === 'viewport' || name === 'text-scale' || !content) {
			continue;
		}

		meta.push({
			content,
			httpEquiv: httpEquiv as AuxeroHeadMeta['httpEquiv'],
			id: `meta:${name ?? property ?? httpEquiv ?? meta.length}:${hashHeadValue(content)}`,
			name: attributes.name,
			property
		});
	}

	for (const match of headHtml.matchAll(/<link\b([^>]*)>/gi)) {
		const attributes = parseHeadAttributes(match[1] ?? '');
		const href = attributes.href;
		const rel = attributes.rel;

		if (!href || !rel) continue;

		const normalizedHref = normalizeHeadHref(href);

		links.push({
			as: attributes.as as AuxeroHeadLink['as'],
			crossorigin: attributes.crossorigin as AuxeroHeadLink['crossorigin'],
			fetchPriority: attributes.fetchpriority as AuxeroHeadLink['fetchPriority'],
			href: normalizedHref,
			id: `link:${rel}:${normalizedHref}:${attributes.as ?? ''}:${attributes.type ?? ''}`,
			media: attributes.media,
			referrerpolicy: attributes.referrerpolicy as AuxeroHeadLink['referrerpolicy'],
			rel,
			sizes: attributes.sizes,
			type: attributes.type
		});
	}

	for (const match of headHtml.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
		const css = match[1] ?? '';

		if (!css.trim()) continue;

		styles.push({
			css,
			id: `style:${styleIndex}:${hashHeadValue(css)}`
		});
		styleIndex += 1;
	}

	return { links, meta, styles };
};
