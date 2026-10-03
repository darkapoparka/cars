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
		--action-strong-border: var(--desktop-discovery-border, transparent);
		--bc-border: var(--desktop-discovery-border);
		--bc-control: var(--bc-surface-raised);
		--bc-surface: var(--bc-surface-raised);
		width: 100%;
		max-width: var(--hero-panel-width, var(--bc-desktop-discovery-width));
		margin-inline: auto;
		border: 1px solid var(--desktop-discovery-border, var(--bc-border));
		border-radius: var(--desktop-discovery-radius, var(--bc-radius-section));
		background: var(--desktop-discovery-surface, var(--bc-surface-raised));
		color: var(--desktop-discovery-ink, var(--bc-ink));
		text-align: start;
		box-shadow: var(--desktop-discovery-shadow, var(--bc-shadow-panel));
	}
	.desktop-discovery-panel__header {
		border-radius: var(--desktop-discovery-radius, var(--bc-radius-section))
			var(--desktop-discovery-radius, var(--bc-radius-section)) 0 0;
		padding: var(--bc-space-3) var(--bc-space-5) 0;
		background: inherit;
	}
	.desktop-discovery-panel__body {
		--desktop-discovery-control-radius: var(--bc-desktop-control-radius);
		display: grid;
		align-content: center;
		gap: var(--bc-space-4);
		min-width: 0;
		min-height: var(--bc-desktop-discovery-panel-height);
		padding: var(--desktop-discovery-padding, var(--bc-space-5));
		border-radius: inherit;
	}
	.desktop-discovery-panel__body.has-header {
		min-height: calc(var(--bc-desktop-discovery-panel-height) - var(--bc-space-2));
		padding-top: var(--bc-space-3);
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
</style>
