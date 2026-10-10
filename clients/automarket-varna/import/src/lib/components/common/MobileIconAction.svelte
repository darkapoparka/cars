<script lang="ts">
	import { linkHref } from '$lib/utils/links';
	import type { Snippet } from 'svelte';

	let {
		label,
		href,
		target,
		rel,
		active = false,
		pressed,
		badge,
		tone = 'light',
		appearance = 'default',
		class: className = '',
		haspopup,
		expanded,
		onclick,
		children
	}: {
		label: string;
		href?: string;
		target?: string;
		rel?: string;
		active?: boolean;
		pressed?: boolean;
		badge?: string | number;
		tone?: 'light' | 'dark';
		appearance?: 'default' | 'overlay';
		class?: string;
		haspopup?: 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | 'true' | 'false';
		expanded?: boolean;
		onclick?: (event: MouseEvent) => void;
		children: Snippet;
	} = $props();

	const hasBadge = $derived(badge !== undefined && badge !== null && String(badge).length > 0);
</script>

{#if href}
	<a
		class={`bc-mobile-icon-action ${className}`.trim()}
		class:active
		class:dark={tone === 'dark'}
		class:overlay={appearance === 'overlay'}
		href={linkHref(href)}
		{target}
		{rel}
		aria-label={label}
		aria-haspopup={haspopup}
		aria-expanded={expanded}
		{onclick}
	>
		{@render children()}
		{#if hasBadge}<span class="bc-mobile-icon-action__badge">{badge}</span>{/if}
	</a>
{:else}
	<button
		type="button"
		class={`bc-mobile-icon-action ${className}`.trim()}
		class:active
		class:dark={tone === 'dark'}
		class:overlay={appearance === 'overlay'}
		aria-label={label}
		aria-pressed={pressed}
		aria-haspopup={haspopup}
		aria-expanded={expanded}
		{onclick}
	>
		{@render children()}
		{#if hasBadge}<span class="bc-mobile-icon-action__badge">{badge}</span>{/if}
	</button>
{/if}

<style>
	.bc-mobile-icon-action {
		--bc-mobile-icon-surface: var(--bc-white);
		--bc-mobile-icon-border: inset 0 0 0 1px rgba(28, 28, 28, 0.12);
		--bc-mobile-icon-ink: var(--bc-ink);
		position: relative;
		display: grid;
		width: var(--bc-mobile-icon-action-hit-size);
		height: var(--bc-mobile-icon-action-hit-size);
		flex: 0 0 var(--bc-mobile-icon-action-hit-size);
		place-items: center;
		border: 0;
		border-radius: var(--bc-radius-pill);
		background: transparent;
		color: var(--bc-mobile-icon-ink);
		cursor: pointer;
		isolation: isolate;
		padding: 0;
		text-decoration: none !important;
	}

	.bc-mobile-icon-action::before {
		position: absolute;
		z-index: -1;
		width: var(--bc-mobile-icon-action-surface-size);
		height: var(--bc-mobile-icon-action-surface-size);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-mobile-icon-surface);
		box-shadow: var(--bc-mobile-icon-border);
		content: '';
		pointer-events: none;
		transition:
			background-color var(--bc-motion-hover),
			box-shadow var(--bc-motion-hover);
	}
	.bc-mobile-icon-action.dark {
		--bc-mobile-icon-surface: var(--bc-ink);
		--bc-mobile-icon-border: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
		--bc-mobile-icon-ink: var(--bc-white);
	}

	.bc-mobile-icon-action.active {
		--bc-mobile-icon-surface: var(--bc-accent);
		--bc-mobile-icon-border: none;
		--bc-mobile-icon-ink: var(--bc-white);
	}

	.bc-mobile-icon-action.overlay {
		--bc-mobile-icon-surface: rgb(255 255 255 / 0.94);
		--bc-mobile-icon-border: 0 2px 8px rgb(0 0 0 / 0.1);
	}

	.bc-mobile-icon-action:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	.bc-mobile-icon-action :global(svg),
	.bc-mobile-icon-action :global(svg *) {
		color: currentColor;
		stroke: currentColor;
	}

	.bc-mobile-icon-action__badge {
		position: absolute;
		top: -1px;
		right: -1px;
		display: grid;
		min-width: 18px;
		height: 18px;
		place-items: center;
		border: 2px solid var(--bc-bg);
		border-radius: var(--bc-radius-pill);
		background: var(--bc-ink);
		color: var(--bc-white);
		font-size: 10px;
		font-weight: var(--bc-weight-emphasis);
		line-height: 1;
		padding: 0 3px;
		font-variant-numeric: tabular-nums;
	}

	@media (hover: hover) and (pointer: fine) {
		.bc-mobile-icon-action:hover::before {
			background: var(--bc-surface-hover);
		}

		.bc-mobile-icon-action.dark:hover::before {
			background: var(--bc-dark-hover);
		}

		.bc-mobile-icon-action.active:hover::before {
			background: var(--bc-accent-hover);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.bc-mobile-icon-action::before {
			transition: none;
		}
	}
	@media (max-width: 767.98px) {
		.bc-mobile-icon-action :global(svg) {
			width: var(--bc-mobile-icon-action-glyph-size);
			height: var(--bc-mobile-icon-action-glyph-size);
			stroke-width: var(--bc-mobile-icon-action-stroke);
		}
	}
	@media (min-width: 768px) and (hover: hover) and (pointer: fine) {
		:global(:where(.site-shell, .site-dialog))
			.bc-mobile-icon-action:not(.dark):not(.active)::before {
			box-shadow: none;
		}
		:global(:where(.site-shell, .site-dialog))
			.bc-mobile-icon-action:not(.dark):not(.active):hover::before {
			background: var(--bc-control-hover);
		}
	}
</style>
