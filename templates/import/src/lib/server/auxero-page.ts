import { error } from '@sveltejs/kit';
import { parseAuxeroHeadAssets, type AuxeroPageDocument } from '$lib/auxero/page-document';
import { localizeAuxeroPageDocument, resolveLocale } from '$lib/i18n/messages';
import type { AuxeroRenderOptions } from './auxero-listing-data';
import { renderAuxeroTemplate } from './auxero-template';

export type AuxeroBodySlot = {
	afterHtml: string;
	beforeHtml: string;
	sectionHtml: string;
};

type AuxeroPageSlotOptions = {
	marker: string;
	slotError: string;
	tagName?: string;
	templateError: string;
};

const tagContents = (html: string, tagName: 'body' | 'head') => {
	const match = html.match(new RegExp(`<${tagName}([^>]*)>([\\s\\S]*?)<\\/${tagName}>`, 'i'));

	if (!match) {
		throw new Error(`Expected Auxero document to include <${tagName}>`);
	}

	return {
		attributes: match[1] ?? '',
		content: match[2] ?? ''
	};
};

const attributeValue = (attributes: string, name: string) => {
	const match = attributes.match(new RegExp(`${name}=(["'])(.*?)\\1`, 'i'));

	return match?.[2] ?? '';
};

const injectedBodyClass = (bodyHtml: string) =>
	Array.from(
		bodyHtml.matchAll(/document\.body\.classList\.add\((["'])(.*?)\1\)/g),
		(match) => match[2] ?? ''
	)
		.filter(Boolean)
		.join(' ');

type AuxeroBodyScriptTag = {
	attributes: string;
	content: string;
	html: string;
	src: string;
};

const bodyScriptTags = (bodyHtml: string): AuxeroBodyScriptTag[] =>
	Array.from(bodyHtml.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi), (match) => ({
		attributes: match[1] ?? '',
		content: match[2] ?? '',
		html: match[0] ?? '',
		src: attributeValue(match[1] ?? '', 'src')
	}));

const serializedScriptPayload = (scripts: { attributes: string; content: string }[]) =>
	JSON.stringify(scripts).replace(/</g, '\\u003c');

export const extractAuxeroBodyScriptsHtml = (bodyHtml: string) => {
	const scripts = bodyScriptTags(bodyHtml)
		.filter(
			(script) =>
				!script.content.includes('__DAYNIGHT_RUNTIME__') &&
				!script.content.includes('document.body.classList.add')
		)
		.map(({ attributes, content }) => ({ attributes, content }));

	if (!scripts.length) return '';

	const optionalBodyScriptSources = scripts
		.map(({ attributes }) => attributeValue(attributes, 'src'))
		.filter((src) => src.includes('code.jquery.com/ui/1.13.2/jquery-ui.min.js'));

	return `<script>{
	window.__DAYNIGHT_AUXERO_BODY_LOADER_EXECUTED__ = (window.__DAYNIGHT_AUXERO_BODY_LOADER_EXECUTED__ || 0) + 1;
	try {
		window.localStorage.setItem('suggest_subscribe', window.localStorage.getItem('suggest_subscribe') || 'false');
	} catch (error) {}
	const daynightBodyScripts = ${serializedScriptPayload(scripts)};
	const daynightOptionalBodyScriptSources = ${JSON.stringify(optionalBodyScriptSources).replace(/</g, '\\u003c')};
	let daynightBodyScriptsStarted = false;

	const loadDayNightBodyScript = (definition) =>
		new Promise((resolve, reject) => {
			const script = document.createElement('script');
			const template = document.createElement('template');
			template.innerHTML = '<script' + definition.attributes + '></' + 'script>';
			const source = template.content.firstElementChild;

			if (source) {
				Array.from(source.attributes).forEach((attribute) => {
					script.setAttribute(attribute.name, attribute.value);
				});
			}

			if (definition.content) {
				script.textContent = definition.content;
			}

			script.addEventListener('load', resolve, { once: true });
			script.addEventListener(
				'error',
				() => {
					const source = script.src || 'inline';
					if (daynightOptionalBodyScriptSources.some((optionalSource) => source.includes(optionalSource))) {
						resolve();
						return;
					}

					reject(new Error('Failed to load Auxero script: ' + source));
				},
				{ once: true }
			);

			document.body.appendChild(script);

			if (!script.src) {
				resolve();
			}
		});

	const startDayNightBodyScripts = async () => {
		if (daynightBodyScriptsStarted) return;
		daynightBodyScriptsStarted = true;

		for (const definition of daynightBodyScripts) {
			await loadDayNightBodyScript(definition);
		}

		window.__DAYNIGHT_BODY_SCRIPTS_LOADED__ = true;
		window.dispatchEvent(new Event('daynight:scripts-loaded'));
	};

	const startDayNightBodyScriptsAfterLoad = () => {
		// The load event can fire before SvelteKit finishes hydrating, and body
		// scripts mutate Svelte-rendered DOM (menu, carousels, image fallbacks).
		// Wait for the layout's hydration signal; the timeout keeps scripts
		// loading if the Svelte runtime never hydrates.
		if (document.documentElement.hasAttribute('data-daynight-hydrated')) {
			requestAnimationFrame(() => requestAnimationFrame(startDayNightBodyScripts));
			return;
		}

		window.addEventListener('daynight:hydrated', () => startDayNightBodyScripts(), { once: true });
		window.setTimeout(startDayNightBodyScripts, 2500);
	};
	window.addEventListener('daynight:svelte-mounted', startDayNightBodyScripts, { once: true });
	if (document.readyState === 'complete') {
		startDayNightBodyScriptsAfterLoad();
	} else {
		window.addEventListener('load', startDayNightBodyScriptsAfterLoad, { once: true });
	}
}</script>`;
};

export const extractAuxeroRuntimeHtml = (
	bodyHtml: string,
	options: { waitForBodyScripts?: boolean } = {}
) => {
	const runtimeScript = bodyScriptTags(bodyHtml)
		.filter(
			(script) =>
				!/\bsrc\s*=/i.test(script.attributes) && script.content.includes('__DAYNIGHT_RUNTIME__')
		)
		.at(-1);

	if (!runtimeScript) return '';

	const waitForBodyScripts = options.waitForBodyScripts ?? true;

	return `<script${runtimeScript.attributes}>{
	const setDayNightEarlyFormStatus = (form, message) => {
		let status = form.querySelector('.auxero-form-status');
		if (!status) {
			status = document.createElement('p');
			status.className = 'auxero-form-status text-highlight font-weight-600 mt-12';
			status.setAttribute('aria-live', 'polite');
			form.appendChild(status);
		}
		status.textContent = message;
	};
	const daynightEarlyFormConfig = (form) => {
		if (form.matches('.daynight-contact-form')) {
			return {
				source: 'daynight-contact-form',
				status: 'Съобщението е подготвено локално за Day Night Auto',
				url: '/api/inquiries'
			};
		}

		if (form.matches('.daynight-blog-comment-form')) {
			return {
				source: 'daynight-blog-comment-form',
				status: 'Коментарът е запазен локално за преглед от Day Night Auto',
				url: '/api/messages'
			};
		}

		if (form.matches('.daynight-sell-form')) {
			return {
				source: 'sell-your-car',
				status: 'Заявката е подготвена. Day Night Auto ще се свърже с вас.',
				url: '/api/inventory/submissions'
			};
		}

		if (form.matches('.daynight-service-form')) {
			return {
				source: 'daynight-service-form',
				status: 'Заявката за услуга е подготвена локално за Day Night Auto',
				url: '/api/inquiries'
			};
		}

		return undefined;
	};
	document.addEventListener('submit', (event) => {
		const form = event.target;
		if (!(form instanceof HTMLFormElement)) return;

		const config = daynightEarlyFormConfig(form);
		if (!config) return;

		event.preventDefault();
		event.stopImmediatePropagation();
		try {
			const payload = Object.fromEntries([...new FormData(form).entries()].map(([key, value]) => [
				key,
				typeof value === 'string' ? value : value.name
			]));
			fetch(config.url, {
				body: JSON.stringify({
					...payload,
					routePath: window.location.pathname,
					source: config.source
				}),
				credentials: 'same-origin',
				headers: { 'content-type': 'application/json' },
				method: 'POST'
			}).catch(() => undefined);
		} catch (_error) {}
		setDayNightEarlyFormStatus(form, config.status);
	}, true);
	let daynightRuntimeStarted = false;
	const daynightRuntimeWaitsForBodyScripts = ${JSON.stringify(waitForBodyScripts)};
	const startDayNightRuntime = () => {
		if (daynightRuntimeStarted) return;
		daynightRuntimeStarted = true;
${runtimeScript.content}
	};
	const startDayNightRuntimeWhenScriptsLoad = () => {
		if (!daynightRuntimeWaitsForBodyScripts) {
			startDayNightRuntime();
			return;
		}

		if (window.__DAYNIGHT_BODY_SCRIPTS_LOADED__) {
			startDayNightRuntime();
			return;
		}

		window.addEventListener('daynight:scripts-loaded', startDayNightRuntime, { once: true });
	};
	const startDayNightRuntimeWhenSafe = () => {
		// Same hydration guard as the body-script loader: the runtime swaps
		// vehicle image sources and garage state inside Svelte-rendered DOM.
		if (document.documentElement.hasAttribute('data-daynight-hydrated')) {
			startDayNightRuntimeWhenScriptsLoad();
			return;
		}

		window.addEventListener('daynight:hydrated', startDayNightRuntimeWhenScriptsLoad, { once: true });
		window.setTimeout(startDayNightRuntimeWhenScriptsLoad, 2500);
	};
	window.addEventListener('daynight:svelte-mounted', startDayNightRuntimeWhenScriptsLoad, { once: true });
	if (document.readyState === 'complete') {
		startDayNightRuntimeWhenSafe();
	} else {
		window.addEventListener('load', startDayNightRuntimeWhenSafe, { once: true });
	}
}</script>`;
};

export function splitAuxeroDocument(html: string): AuxeroPageDocument {
	const head = tagContents(html, 'head');
	const body = tagContents(html, 'body');
	const bodyClasses = [attributeValue(body.attributes, 'class'), injectedBodyClass(body.content)]
		.filter(Boolean)
		.join(' ');

	return {
		bodyClass: bodyClasses,
		bodyHtml: body.content,
		headAssets: parseAuxeroHeadAssets(head.content),
		headHtml: head.content
	};
}

export function renderAuxeroPageDocument(
	templateFile: string,
	options: AuxeroRenderOptions,
	templateError: string
) {
	const html = renderAuxeroTemplate(templateFile, options);

	if (!html) {
		error(500, templateError);
	}

	return localizeAuxeroPageDocument(
		splitAuxeroDocument(html),
		options.searchParams ? resolveLocale(options.searchParams.get('lang')) : 'en'
	);
}

export function splitAuxeroBodySection(bodyHtml: string, startComment: string, endComment: string) {
	const start = bodyHtml.indexOf(startComment);
	const end = bodyHtml.indexOf(endComment, start + startComment.length);

	if (start < 0 || end < 0) {
		return undefined;
	}

	const afterStart = end + endComment.length;

	return {
		afterHtml: bodyHtml.slice(afterStart),
		beforeHtml: bodyHtml.slice(0, start),
		sectionHtml: bodyHtml.slice(start, afterStart)
	};
}

export const removeAuxeroScriptTags = (html: string) =>
	html
		.replace(/<script\b[\s\S]*?<\/script>\s*/gi, '')
		.replace(/<!--(?:(?!-->)[\s\S])*?\.js(?:(?!-->)[\s\S])*?-->\s*/gi, '');

export const removeAuxeroSlotScriptTags = (slot: AuxeroBodySlot): AuxeroBodySlot => ({
	afterHtml: removeAuxeroScriptTags(slot.afterHtml),
	beforeHtml: removeAuxeroScriptTags(slot.beforeHtml),
	sectionHtml: removeAuxeroScriptTags(slot.sectionHtml)
});

export const removeAuxeroPageDocumentBodyHtml = (
	pageDocument: AuxeroPageDocument
): AuxeroPageDocument => ({
	...pageDocument,
	bodyHtml: ''
});

export function removeAuxeroBreadcrumb(html: string) {
	return html.replace(
		/<!-- breadcrumb -->\s*<section class="background-light mb-32">[\s\S]*?<\/section>\s*<!-- breadcrumb -->\s*/i,
		''
	);
}

const findClosingTagIndex = (html: string, openTagIndex: number, tagName: string) => {
	const pattern = new RegExp(`</?${tagName}\\b[^>]*>`, 'gi');
	pattern.lastIndex = openTagIndex;
	let depth = 0;
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(html))) {
		if (match[0].startsWith(`</${tagName}`)) {
			depth -= 1;
		} else {
			depth += 1;
		}

		if (depth === 0) return match.index + match[0].length;
	}

	return -1;
};

export function splitAuxeroElementBlockByMarker(bodyHtml: string, marker: string, tagName: string) {
	const markerIndex = bodyHtml.indexOf(marker);

	if (markerIndex < 0) {
		return undefined;
	}

	const start = bodyHtml.lastIndexOf(`<${tagName}`, markerIndex);

	if (start < 0) {
		return undefined;
	}

	const end = findClosingTagIndex(bodyHtml, start, tagName);

	if (end < 0) {
		return undefined;
	}

	return {
		afterHtml: bodyHtml.slice(end),
		beforeHtml: bodyHtml.slice(0, start),
		sectionHtml: bodyHtml.slice(start, end)
	};
}

export function splitAuxeroDivBlockByMarker(bodyHtml: string, marker: string) {
	return splitAuxeroElementBlockByMarker(bodyHtml, marker, 'div');
}

export function renderAuxeroPageSlot(
	templateFile: string,
	options: AuxeroRenderOptions,
	{ marker, slotError, tagName = 'div', templateError }: AuxeroPageSlotOptions
) {
	const pageDocument = renderAuxeroPageDocument(templateFile, options, templateError);
	const slot = splitAuxeroElementBlockByMarker(pageDocument.bodyHtml, marker, tagName);

	if (!slot) {
		error(500, slotError);
	}

	return { pageDocument, slot };
}
