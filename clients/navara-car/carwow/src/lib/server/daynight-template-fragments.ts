const legacyTrailingChromeIds = [
	'CardModal',
	'LoginModal',
	'ForgotPasswordModal',
	'SearchModal',
	'SignUpModal',
	'NewsletterModal',
	'CompareModal',
	'TeamModal',
	'VideoModal',
	'QuickViewModal',
	'ShoppingCartModal',
	'СравниModal'
] as const;

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

function removeElementById(html: string, id: string) {
	const idPattern = new RegExp(`<div\\b(?=[^>]*\\bid=(["'])${escapeRegExp(id)}\\1)[^>]*>`, 'i');
	let output = html;

	while (true) {
		const match = idPattern.exec(output);
		if (!match) {
			return output;
		}

		const openEndIndex = match.index + match[0].length;
		const closeIndex = findClosingDivIndex(output, openEndIndex);
		if (closeIndex === -1) {
			return output;
		}

		const closeEndIndex = output.indexOf('>', closeIndex) + 1;
		output = `${output.slice(0, match.index)}${output.slice(closeEndIndex)}`;
	}
}

export function stripLegacyTemplateTrailingChrome(html: string) {
	const withoutLegacyElements = legacyTrailingChromeIds.reduce(removeElementById, html);

	return withoutLegacyElements.replace(/<!--[\s\S]*?-->/g, '').trim();
}
