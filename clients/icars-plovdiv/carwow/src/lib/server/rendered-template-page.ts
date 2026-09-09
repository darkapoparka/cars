import type { RenderedTemplatePage } from '$lib/types/template-page';
import { getTemplateBodyClasses } from '$lib/data/template-routes';
import { renderDayNightTemplate } from './daynight-template-renderer';
import { stripLegacyTemplateTrailingChrome } from './daynight-template-fragments';
import type { DayNightTemplateContentContext } from './daynight-template-content';
import { filterTemplateScriptSrcs } from './template-asset-policy';

function stripScripts(html: string) {
	return html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
}

function extractHeadStyles(html: string) {
	return Array.from(html.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/gi))
		.map(([style]) => style)
		.join('\n');
}

function normalizeTemplateAssetUrl(src: string) {
	return src
		.replace(/^\.\/assets\//, '/assets/')
		.replace(/^assets\//, '/assets/')
		.replaceAll('&amp;', '&');
}

function extractScriptSrcs(html: string) {
	const srcs = Array.from(html.matchAll(/<script\b[^>]*\bsrc=(["'])(.*?)\1[^>]*>\s*<\/script>/gi))
		.map((match) => normalizeTemplateAssetUrl(match[2]))
		.filter(Boolean);

	return Array.from(new Set(srcs));
}

function extractTitle(html: string) {
	const match = html.match(/<title>([\s\S]*?)<\/title>/i);
	return match?.[1].trim() || 'icars';
}

function extractBody(html: string) {
	const match = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
	if (!match) {
		throw new Error('Could not find template body.');
	}

	return stripScripts(match[1]);
}

function findClosingDivIndex(html: string, openEndIndex: number) {
	const divTagPattern = /<\/?div\b[^>]*>/gi;
	divTagPattern.lastIndex = openEndIndex;
	let depth = 1;
	let match: RegExpExecArray | null;

	while ((match = divTagPattern.exec(html))) {
		if (match[0].startsWith('</')) {
			depth -= 1;
			if (depth === 0) {
				return match.index;
			}
		} else {
			depth += 1;
		}
	}

	return -1;
}

function extractWrapper(body: string) {
	const wrapperMatch = /<div\b[^>]*id=(["'])wrapper\1[^>]*>/i.exec(body);
	if (!wrapperMatch) {
		throw new Error('Could not find template wrapper.');
	}

	const openIndex = wrapperMatch.index;
	const openEndIndex = openIndex + wrapperMatch[0].length;
	const closeIndex = findClosingDivIndex(body, openEndIndex);
	if (closeIndex === -1) {
		throw new Error('Could not find template wrapper closing tag.');
	}

	const closeEndIndex = body.indexOf('>', closeIndex) + 1;

	return {
		wrapperHtml: body.slice(openEndIndex, closeIndex).trim(),
		trailingHtml: stripLegacyTemplateTrailingChrome(body.slice(closeEndIndex))
	};
}

function extractHeaderBlock(wrapperHtml: string) {
	const match = /\s*<!-- Header -->[\s\S]*?\s*<!-- Header -->/.exec(wrapperHtml);

	return {
		html: match?.[0].trim() ?? '',
		endIndex: match ? match.index + match[0].length : 0
	};
}

function splitWrapper(wrapperHtml: string) {
	const header = extractHeaderBlock(wrapperHtml);
	const footerIndex = wrapperHtml.indexOf('<!-- Footer -->', header.endIndex);

	if (footerIndex === -1) {
		return {
			headerHtml: header.html,
			mainHtml: wrapperHtml.slice(header.endIndex).trim(),
			footerHtml: ''
		};
	}

	return {
		headerHtml: header.html,
		mainHtml: wrapperHtml.slice(header.endIndex, footerIndex).trim(),
		footerHtml: wrapperHtml.slice(footerIndex).trim()
	};
}

function isDashboardShell(wrapperHtml: string) {
	return wrapperHtml.includes('dashboard-container') && wrapperHtml.includes('dashboard-sidebar');
}

export async function loadRenderedTemplatePage(
	templateFile: string,
	routePath = '',
	contentContext?: DayNightTemplateContentContext
): Promise<RenderedTemplatePage> {
	const html = await renderDayNightTemplate(templateFile, routePath, contentContext);

	if (!html) {
		throw new Error(`Could not render ${templateFile}.`);
	}

	const body = extractBody(html);
	const { wrapperHtml, trailingHtml } = extractWrapper(body);

	if (isDashboardShell(wrapperHtml)) {
		return {
			title: extractTitle(html),
			bodyClasses: getTemplateBodyClasses(templateFile),
			headStyles: extractHeadStyles(html),
			scriptSrcs: filterTemplateScriptSrcs(templateFile, extractScriptSrcs(html)),
			headerHtml: '',
			mainHtml: wrapperHtml,
			footerHtml: '',
			trailingHtml,
			templateFile,
			routePath
		};
	}

	const { headerHtml, mainHtml, footerHtml } = splitWrapper(wrapperHtml);

	return {
		title: extractTitle(html),
		bodyClasses: getTemplateBodyClasses(templateFile),
		headStyles: extractHeadStyles(html),
		scriptSrcs: filterTemplateScriptSrcs(templateFile, extractScriptSrcs(html)),
		headerHtml,
		mainHtml,
		footerHtml,
		trailingHtml,
		templateFile,
		routePath
	};
}
