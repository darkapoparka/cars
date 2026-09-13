import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { desktopStylesheetBootstrap, type DesktopStylesheet } from './desktop-stylesheet';

const options: DesktopStylesheet = {
	id: 'desktop-test',
	href: '/desktop.css',
	media: '(min-width: 992px)',
	placement: 'before-component-styles'
};
function browser(matches: boolean) {
	const links: Record<string, unknown>[] = [];
	const anchor = { tagName: 'STYLE' };
	const placements: unknown[] = [];
	const document = {
		getElementById: (id: string) => links.find((link) => link.id === id),
		createElement: () => {
			const link: Record<string, unknown> = {};
			link.getAttribute = (key: string) => link[key];
			link.setAttribute = (key: string, value: string) => {
				link[key] = value;
			};
			return link;
		},
		head: {
			querySelector: () => anchor,
			insertBefore: (link: Record<string, unknown>, before: unknown) => {
				links.push(link);
				placements.push(before);
			}
		}
	};
	return { document, window: { matchMedia: () => ({ matches }) }, links, placements, anchor };
}

describe('desktop-only CSS lifecycle', () => {
	it('runs before hydration with no module closures', () => {
		const context = browser(true);
		runInNewContext(desktopStylesheetBootstrap(options), context);
		expect(context.links[0]).toMatchObject({
			id: options.id,
			href: options.href,
			media: options.media,
			rel: 'stylesheet'
		});
		expect(context.placements[0]).toBe(context.anchor);
	});
	it('does not insert a desktop request into a mobile document', () => {
		const context = browser(false);
		runInNewContext(desktopStylesheetBootstrap(options), context);
		expect(context.links).toEqual([]);
	});
	it('preserves append placement for the vehicle page', () => {
		const context = browser(true);
		runInNewContext(desktopStylesheetBootstrap({ ...options, placement: 'append' }), context);
		expect(context.placements).toEqual([null]);
	});
	it('deduplicates navigation and refreshes an updated stylesheet URL', () => {
		const context = browser(true);
		runInNewContext(desktopStylesheetBootstrap(options), context);
		runInNewContext(desktopStylesheetBootstrap({ ...options, href: '/updated.css' }), context);
		expect(context.links).toHaveLength(1);
		expect(context.links[0].href).toBe('/updated.css');
	});
	it('cannot terminate its containing script with a serialized argument', () => {
		const context = browser(true);
		const href = '/style.css?value=</script><script>';
		const script = desktopStylesheetBootstrap({ ...options, href });
		expect(script).not.toContain('</script>');
		runInNewContext(script, context);
		expect(context.links[0].href).toBe(href);
	});
	it('is inert without a browser', () => {
		expect(() => runInNewContext(desktopStylesheetBootstrap(options), {})).not.toThrow();
	});
});
