<script lang="ts">
	import type { Snippet } from 'svelte';
	let { title, meta, children }: { title: string; meta?: string; children: Snippet } = $props();
</script>

<section class="vehicle-information-section">
	<header>
		<h2>{title}</h2>
		{#if meta}<span>{meta}</span>{/if}
	</header>
	<div class="vehicle-information-section__body">{@render children()}</div>
</section>

<style>
	.vehicle-information-section {
		min-width: 0;
		border: 1px solid var(--bc-border-strong);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface-raised);
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-3);
		padding: var(--bc-space-4) var(--bc-space-6);
		border-bottom: 1px solid var(--bc-border);
		border-radius: calc(var(--bc-radius-panel) - 1px) calc(var(--bc-radius-panel) - 1px) 0 0;
		background: var(--bc-surface-hover);
	}
	h2 {
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-text-h5) / var(--bc-leading-h5) var(--bc-font-body);
	}
	header span {
		flex-shrink: 0;
		color: var(--bc-muted);
		font-size: var(--bc-text-meta);
	}
	.vehicle-information-section__body {
		padding: var(--bc-space-5) var(--bc-space-6);
	}
</style>
