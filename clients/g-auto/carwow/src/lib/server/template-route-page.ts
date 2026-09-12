import { normalizeTemplateRoutePath, resolveTemplateFile } from '$lib/data/template-routes';
import type { RawTemplatePageData } from '$lib/types/template-page';
import { loadRenderedTemplatePage } from './rendered-template-page';
import type { DayNightTemplateContentContext } from './daynight-template-content';

type ElementRange = {
	openStart: number;
	openEnd: number;
	closeStart: number;
	closeEnd: number;
	innerHtml: string;
	outerHtml: string;
};

function findClosingTagRange(html: string, tagName: string, openEndIndex: number) {
	const tagPattern = new RegExp(`<\\/?${tagName}\\b[^>]*>`, 'gi');
	tagPattern.lastIndex = openEndIndex;
	let depth = 1;
	let match: RegExpExecArray | null;

	while ((match = tagPattern.exec(html))) {
		if (match[0].startsWith('</')) {
			depth -= 1;
			if (depth === 0) {
				return {
					closeStart: match.index,
					closeEnd: tagPattern.lastIndex
				};
			}
		} else if (!match[0].endsWith('/>')) {
			depth += 1;
		}
	}

	return undefined;
}

function getClassTokens(openTag: string) {
	const classMatch = /\bclass=(["'])(.*?)\1/i.exec(openTag);
	return new Set(classMatch?.[2].trim().split(/\s+/).filter(Boolean) ?? []);
}

function findElementByClasses(
	html: string,
	tagName: string,
	requiredClasses: string[],
	startIndex = 0
): ElementRange | undefined {
	const openTagPattern = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
	openTagPattern.lastIndex = startIndex;
	let match: RegExpExecArray | null;

	while ((match = openTagPattern.exec(html))) {
		const classTokens = getClassTokens(match[0]);
		if (!requiredClasses.every((className) => classTokens.has(className))) {
			continue;
		}

		const openStart = match.index;
		const openEnd = openTagPattern.lastIndex;
		const closing = findClosingTagRange(html, tagName, openEnd);

		if (!closing) {
			return undefined;
		}

		return {
			openStart,
			openEnd,
			closeStart: closing.closeStart,
			closeEnd: closing.closeEnd,
			innerHtml: html.slice(openEnd, closing.closeStart).trim(),
			outerHtml: html.slice(openStart, closing.closeEnd).trim()
		};
	}

	return undefined;
}

function extractDashboardContentInnerHtml(mainHtml: string) {
	return findElementByClasses(mainHtml, 'div', ['dashboard-content--inner'])?.outerHtml ?? '';
}

function isDashboardAccountRoute(routePath: string) {
	return routePath === 'dashboard' || routePath.startsWith('dashboard/');
}

export async function loadTemplateRoutePage(
	routePath: string,
	contentContext?: DayNightTemplateContentContext
): Promise<RawTemplatePageData | undefined> {
	const normalizedRoutePath = normalizeTemplateRoutePath(routePath);
	const templateFile = resolveTemplateFile(normalizedRoutePath);

	if (!templateFile) {
		return undefined;
	}

	const page = await loadRenderedTemplatePage(templateFile, normalizedRoutePath, contentContext);
	const dashboardContentInnerHtml = isDashboardAccountRoute(normalizedRoutePath)
		? extractDashboardContentInnerHtml(page.mainHtml)
		: undefined;

	return {
		kind: 'raw',
		templateFile,
		routePath: normalizedRoutePath,
		title: page.title,
		bodyClasses: page.bodyClasses,
		headStyles: page.headStyles,
		scriptSrcs: page.scriptSrcs,
		headerHtml: page.headerHtml,
		mainHtml: page.mainHtml,
		dashboardContentInnerHtml,
		footerHtml: page.footerHtml,
		trailingHtml: page.trailingHtml
	};
}
