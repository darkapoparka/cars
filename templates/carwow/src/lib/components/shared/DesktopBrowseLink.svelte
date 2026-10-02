<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	let {
		href,
		label,
		tone = 'brand'
	}: { href: string; label: string; tone?: 'brand' | 'dark' } = $props();
</script>

<a
	href={i18n.href(href)}
	class="desktop-browse-link"
	class:desktop-browse-link--dark={tone === 'dark'}
>
	<span>{label}</span><ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
</a>

<style>
	.desktop-browse-link {
		align-items: center;
		background: var(--sa-yellow);
		border: 1px solid var(--sa-yellow);
		border-radius: 8px;
		box-shadow: none;
		box-sizing: border-box;
		color: var(--desktop-action);
		display: inline-flex;
		flex: 0 0 auto;
		font: var(--sa-weight-semibold) var(--sa-text-base)/1.3 var(--sa-font);
		gap: 12px;
		justify-content: center;
		min-height: 44px;
		padding: 11px 16px;
		text-decoration: none;
		transition:
			background-color 120ms ease,
			border-color 120ms ease;
		white-space: nowrap;
	}
	.desktop-browse-link:hover {
		background: color-mix(in srgb, var(--sa-yellow) 92%, var(--desktop-action));
		border-color: color-mix(in srgb, var(--sa-yellow) 92%, var(--desktop-action));
		color: var(--desktop-action);
	}
	.desktop-browse-link--dark {
		background: var(--desktop-action);
		border-color: var(--desktop-action);
		color: var(--desktop-action-text);
	}
	.desktop-browse-link--dark:hover {
		background: var(--desktop-action-hover);
		border-color: var(--desktop-action-hover);
		color: var(--desktop-action-text);
	}
	.desktop-browse-link:focus-visible {
		outline: 2px solid var(--desktop-focus);
		outline-offset: 3px;
	}
	.desktop-browse-link :global(svg) {
		flex-shrink: 0;
		color: inherit;
	}
	.desktop-browse-link span {
		font: inherit !important;
		color: inherit !important;
	}
</style>
