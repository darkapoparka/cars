<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { localeHref } from './core';
	import { getI18n } from './context';
	const i18n = getI18n();
	let {
		compact = false,
		beforeOpen
	}: { compact?: boolean; beforeOpen?: () => void | HTMLElement | Promise<void | HTMLElement> } =
		$props();
</script>

<a
	data-locale-selector
	aria-label={i18n.t('title')}
	href={localeHref('/locale-settings', i18n.locale, base) +
		'?returnTo=' +
		encodeURIComponent(page.url.pathname + page.url.search)}
	onclick={async (event) => {
		if (
			event.button === 0 &&
			!event.ctrlKey &&
			!event.metaKey &&
			!event.shiftKey &&
			!event.altKey
		) {
			event.preventDefault();
			const originalOpener = event.currentTarget;
			const opener = (await beforeOpen?.()) ?? originalOpener;
			window.dispatchEvent(new CustomEvent('cars:locale-open', { detail: { opener } }));
		}
	}}
	>{compact
		? i18n.locale.toUpperCase()
		: i18n.t('title') + ' · ' + (i18n.locale === 'en' ? 'English' : 'Български')}</a
>

<style>
	a {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 8px;
		color: inherit;
		font-size: 14px;
	}
</style>
