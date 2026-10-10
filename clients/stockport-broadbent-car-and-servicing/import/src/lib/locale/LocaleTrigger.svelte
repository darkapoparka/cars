<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { localeHref } from './core';
	import { getI18n } from './context';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Globe2 from '@lucide/svelte/icons/globe-2';
	const i18n = getI18n();
	let {
		compact = false,
		variant = 'text',
		beforeOpen
	}: {
		compact?: boolean;
		variant?: 'text' | 'button';
		beforeOpen?: () => void | HTMLElement | Promise<void | HTMLElement>;
	} = $props();
</script>

<a
	data-locale-selector
	class:locale-trigger--button={variant === 'button'}
	aria-label={compact
		? i18n.locale.toUpperCase() + ' · ' + i18n.t('title')
		: i18n.t('title') + ' · ' + (i18n.locale === 'en' ? 'English' : 'Български')}
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
	>{#if variant === 'button'}
		<Globe2 size={22} strokeWidth={1.8} aria-hidden="true" />
		<span class="locale-trigger__copy">
			<strong>{i18n.t('title')}</strong>
			<span>{i18n.locale === 'en' ? 'English' : 'Български'}</span>
		</span>
		<ChevronRight size={18} aria-hidden="true" />
	{:else}{compact
			? i18n.locale.toUpperCase()
			: i18n.t('title') + ' · ' + (i18n.locale === 'en' ? 'English' : 'Български')}{/if}</a
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
	.locale-trigger--button {
		display: grid;
		grid-template-columns: 22px minmax(0, 1fr) 18px;
		gap: 12px;
		width: 100%;
		min-height: 64px;
		padding: 12px;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-control);
		background: #fff;
		color: var(--bc-ink);
		text-decoration: none;
	}
	.locale-trigger--button:hover {
		background: var(--bc-surface);
	}
	@media (min-width: 768px) {
		.locale-trigger--button {
			border-color: transparent;
		}
		.locale-trigger--button:hover {
			border-color: transparent;
			background: var(--bc-control-hover);
		}
	}
	.locale-trigger__copy {
		display: grid;
		gap: 3px;
		text-align: left;
	}
	.locale-trigger__copy strong {
		font-size: 16px;
		line-height: 20px;
		font-weight: var(--bc-weight-control);
	}
	.locale-trigger__copy > span {
		color: var(--bc-muted);
		font-size: 14px;
		line-height: 18px;
	}
</style>
