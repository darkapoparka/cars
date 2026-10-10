<script lang="ts">
	import type { Snippet } from 'svelte';
	import DesktopDiscoveryPanel from './DesktopDiscoveryPanel.svelte';
	let {
		children,
		description,
		descriptionContent,
		secondaryActions
	}: {
		children: Snippet;
		description?: string;
		descriptionContent?: Snippet;
		secondaryActions?: Snippet;
	} = $props();
</script>

<div class="desktop-hero-action-panel">
	<DesktopDiscoveryPanel {description} {descriptionContent}>
		<div class="desktop-hero-actions">
			{@render children()}
		</div>
		{#if secondaryActions}
			<div class="desktop-hero-actions__secondary">{@render secondaryActions()}</div>
		{/if}
	</DesktopDiscoveryPanel>
</div>

<style>
	.desktop-hero-action-panel {
		--desktop-discovery-gap: var(--bc-space-3);
		--bc-desktop-discovery-panel-height: 0px;
		width: 100%;
		max-width: var(--bc-desktop-discovery-width);
		margin-inline: auto;
	}
	.desktop-hero-actions {
		width: min(100%, var(--bc-desktop-action-panel-width));
		justify-self: center;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--bc-space-3);
	}
	.desktop-hero-actions__secondary {
		display: grid;
		min-height: var(--bc-control-height-primary);
		align-content: center;
		justify-items: center;
	}
	@media (min-width: 768px) {
		.desktop-hero-action-panel {
			--bc-desktop-hero-quiet-surface: var(--bc-desktop-control-surface);
		}
	}
</style>
