<script lang="ts">
	import type { Snippet } from 'svelte';
	let { title, children }: { title: string; children: Snippet } = $props();
</script>

<section class="vehicle-information-section">
	<h2>{title}</h2>
	{@render children()}
</section>

<style>
	.vehicle-information-section {
		min-width: 0;
	}
	h2 {
		margin: 0 0 var(--bc-space-5);
		font: var(--bc-weight-heading) var(--bc-text-h5) / var(--bc-leading-h5) var(--bc-font-body);
	}
</style>
