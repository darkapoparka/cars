<script lang="ts">
	import { nativeMessage } from '$lib/i18n/native';
	import { page } from '$app/state';
	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import { Popover } from 'bits-ui';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { linkHref } from '$lib/utils/links';
	let {
		label,
		href,
		active,
		links = []
	}: {
		label: string;
		href: string;
		active: boolean;
		links?: { label: string; href: string }[];
	} = $props();
	let open = $state(false);
	let anchor = $state<HTMLElement | null>(null);
</script>

<div class="site-nav-item" class:active bind:this={anchor}>
	<a href={linkHref(href)} aria-current={active ? 'page' : undefined}>{label}</a>
	{#if links.length}
		<Popover.Root bind:open>
			<Popover.Trigger class="site-nav-toggle" aria-label={label + nt('ui138')}
				><ChevronDown size={14} aria-hidden="true" /></Popover.Trigger
			>
			<Popover.Portal
				><Popover.Content
					class="site-nav-popover"
					sideOffset={12}
					align="start"
					customAnchor={anchor}
				>
					<nav aria-label={label}>
						{#each links as link (link.href)}<a
								href={linkHref(link.href)}
								onclick={() => (open = false)}>{link.label}</a
							>{/each}
					</nav>
				</Popover.Content></Popover.Portal
			>
		</Popover.Root>
	{:else}
		<span class="site-nav-slot" aria-hidden="true"></span>
	{/if}
</div>

<style>
	.site-nav-item {
		display: flex;
		align-items: center;
		gap: 2px;
		position: relative;
		min-height: var(--bc-control-height-standard);
	}
	.site-nav-item > a {
		display: inline-flex;
		align-items: center;
		min-height: var(--bc-control-height-standard);
		padding-block: var(--bc-space-2);
		color: var(--bc-dark-muted);
		font-size: var(--bc-text-navigation);
		font-weight: var(--bc-weight-control);
		line-height: 1.35;
		text-decoration: none;
		white-space: nowrap;
	}
	.site-nav-item.active > a {
		color: var(--bc-white);
	}
	.site-nav-item > a:hover {
		color: var(--bc-white);
	}
	.site-nav-slot {
		width: 28px;
		flex: 0 0 28px;
	}
	:global(.site-nav-toggle) {
		display: grid;
		place-items: center;
		width: 28px;
		min-height: var(--bc-control-height-standard);
		border: 0;
		background: transparent;
		color: var(--bc-dark-muted);
		padding: 0;
	}
	:global(.site-nav-popover) {
		z-index: var(--bc-z-popover);
		min-width: 240px;
		max-height: var(--bits-popover-content-available-height);
		overflow: auto;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface-raised);
		padding: var(--bc-space-2);
		box-shadow: var(--bc-shadow-panel);
	}
	nav {
		display: grid;
		gap: var(--bc-space-1);
	}
	nav a {
		display: flex;
		min-height: var(--bc-control-height-standard);
		align-items: center;
		padding: var(--bc-space-2) var(--bc-space-3);
		border-radius: var(--bc-radius-md);
		color: var(--bc-ink);
		text-decoration: none;
	}
	nav a:hover {
		background: var(--bc-surface);
	}
	.site-nav-item.active::after {
		position: absolute;
		content: '';
		inset-inline: 0;
		bottom: 0;
		height: 2px;
		background: var(--bc-accent);
		pointer-events: none;
	}
	nav a {
		font-size: var(--bc-text-body-lg);
	}
</style>
