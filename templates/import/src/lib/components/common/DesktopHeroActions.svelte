<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div class="desktop-hero-actions">
	{@render children()}
</div>

<style>
	.desktop-hero-actions {
		width: 100%;
		max-width: var(--bc-desktop-action-panel-width);
		margin-inline: auto;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--bc-space-3);
	}
</style>
