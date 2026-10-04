<script lang="ts">
	import type { Snippet } from 'svelte';
	import DesktopDiscoveryPanel from './DesktopDiscoveryPanel.svelte';
	let { children, secondaryActions }: { children: Snippet; secondaryActions?: Snippet } = $props();
</script>

<div class="desktop-hero-action-panel">
	<DesktopDiscoveryPanel>
		<div class="desktop-hero-actions">{@render children()}</div>
		{#if secondaryActions}
			<div class="desktop-hero-actions__secondary">{@render secondaryActions()}</div>
		{/if}
	</DesktopDiscoveryPanel>
</div>

<style>
	.desktop-hero-action-panel {
		--hero-panel-width: var(--bc-desktop-action-panel-width);
		--bc-desktop-discovery-panel-height: 0px;
		width: 100%;
		max-width: var(--bc-desktop-action-panel-width);
		margin-inline: auto;
	}
	.desktop-hero-actions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--bc-space-3);
	}
	.desktop-hero-actions__secondary {
		display: grid;
		justify-items: center;
	}
</style>
