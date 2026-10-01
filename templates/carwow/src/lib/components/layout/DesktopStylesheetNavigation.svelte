<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { getI18n } from '$lib/locale/context';
	import { DESKTOP_SHELL_MEDIA } from '$lib/config/viewport';
	import { routeParts } from '$lib/locale/core';
	import { loadDesktopStylesheet } from '$lib/client/desktop-stylesheet';
	import homeCss from '$lib/styles/daynight-home-desktop.css?url';
	import detailCss from '$lib/styles/daynight-detail-desktop.css?url';

	const i18n = getI18n();
	onNavigate(({ to }) => {
		if (!to || !window.matchMedia(DESKTOP_SHELL_MEDIA).matches) return;
		const path = routeParts(to.url.pathname).path;
		if (path === '/' || /^\/home1(?:-box)?$/.test(path)) {
			return loadDesktopStylesheet({
				id: 'daynight-home-desktop-css',
				href: i18n.href(homeCss),
				media: DESKTOP_SHELL_MEDIA,
				placement: 'before-component-styles'
			});
		}
		if (/^\/inventory\/[^/]+$/.test(path) && path !== '/inventory/map') {
			return loadDesktopStylesheet({
				id: 'daynight-detail-desktop-css',
				href: i18n.href(detailCss),
				media: DESKTOP_SHELL_MEDIA,
				placement: 'append'
			});
		}
	});
</script>
