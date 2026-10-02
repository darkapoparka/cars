<script lang="ts">
	import type { Snippet } from 'svelte';
	let { title, actions, children }: { title: string; actions?: Snippet; children: Snippet } =
		$props();
</script>

<section class="vehicle-information-section">
	<header>
		<h2>{title}</h2>
		{@render actions?.()}
	</header>
	{@render children()}
</section>

<style>
	.vehicle-information-section {
		min-width: 0;
		padding: var(--bc-space-6);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		background: var(--bc-surface-raised);
	}
	header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-3);
		margin-bottom: var(--bc-space-5);
	}
	h2 {
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-text-h4) / var(--bc-leading-h4) var(--bc-font-heading);
	}
</style>
