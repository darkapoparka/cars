<script lang="ts">
	import type { Snippet } from 'svelte';
	let {
		header,
		children,
		class: className = ''
	}: { header?: Snippet; children: Snippet; class?: string } = $props();
</script>

<div class={['desktop-discovery-panel', className]}>
	{#if header}<div class="desktop-discovery-panel__header">{@render header()}</div>{/if}
	<div class="desktop-discovery-panel__body" class:has-header={Boolean(header)}>
		{@render children()}
	</div>
</div>

<style>
	.desktop-discovery-panel {
		width: 100%;
		max-width: var(--bc-desktop-discovery-width);
		margin-inline: auto;
		border: 1px solid var(--desktop-discovery-border, var(--bc-border));
		border-radius: var(--desktop-discovery-radius, var(--bc-radius-section));
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		text-align: start;
		box-shadow: var(--desktop-discovery-shadow, var(--bc-shadow-panel));
	}
	.desktop-discovery-panel__header {
		border-radius: var(--desktop-discovery-radius, var(--bc-radius-section))
			var(--desktop-discovery-radius, var(--bc-radius-section)) 0 0;
		background: var(--bc-control);
	}
	.desktop-discovery-panel__header :global(.mobile-mode-tabs--attached) {
		margin: 0;
		border: 0;
		border-radius: inherit;
		background: transparent;
	}
	.desktop-discovery-panel__header :global(.mobile-mode-tabs--attached button) {
		color: var(--bc-copy);
	}
	.desktop-discovery-panel__header :global(.mobile-mode-tabs--attached button:hover) {
		background: var(--bc-control-hover);
		color: var(--bc-ink);
	}
	.desktop-discovery-panel__header :global(.mobile-mode-tabs--attached button.active) {
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
	}
	.desktop-discovery-panel__body {
		--desktop-discovery-control-radius: var(--bc-radius-pill);
		display: grid;
		align-content: center;
		gap: var(--bc-space-4);
		min-width: 0;
		min-height: var(--bc-desktop-discovery-panel-height);
		padding: var(--desktop-discovery-padding, var(--bc-space-5));
		border-radius: inherit;
	}
	.desktop-discovery-panel__body.has-header {
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
</style>
