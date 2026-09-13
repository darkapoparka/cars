export interface DesktopStylesheet {
	id: string;
	href: string;
	media: string;
	placement: 'before-component-styles' | 'append';
}

/** Self-contained because the same function runs before hydration in the document head.
 * Keep dependencies in the arguments; bootstrap tests enforce this boundary.
 * Links remain cached across client navigation, with a media query guarding their styles.
 */
export function installDesktopStylesheet(options: DesktopStylesheet): void {
	if (typeof window === 'undefined' || !window.matchMedia(options.media).matches) return;
	const existing = document.getElementById(options.id);
	if (existing) {
		if (existing.getAttribute('href') !== options.href) existing.setAttribute('href', options.href);
		return;
	}
	const link = document.createElement('link');
	link.id = options.id;
	link.rel = 'stylesheet';
	link.href = options.href;
	link.media = options.media;
	const anchor =
		options.placement === 'before-component-styles'
			? document.head.querySelector('style, link[rel="stylesheet"]')
			: null;
	document.head.insertBefore(link, anchor);
}

export function desktopStylesheetBootstrap(options: DesktopStylesheet): string {
	const payload = JSON.stringify(options).replaceAll('<', '\\u003c');
	return '(' + installDesktopStylesheet.toString() + ')(' + payload + ');';
}
