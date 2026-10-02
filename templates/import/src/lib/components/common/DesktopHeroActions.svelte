<script lang="ts">
	import type { Snippet } from 'svelte';
	import DesktopDiscoveryPanel from './DesktopDiscoveryPanel.svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div class="desktop-hero-actions">
	<DesktopDiscoveryPanel>
		<div class="desktop-hero-actions__row">{@render children()}</div>
	</DesktopDiscoveryPanel>
</div>

<style>
	.desktop-hero-actions {
		--bc-desktop-discovery-width: var(--bc-desktop-action-panel-width);
		--bc-desktop-discovery-panel-height: 0px;
		width: 100%;
	}
	.desktop-hero-actions__row {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--bc-space-3);
	}
</style>
