<script lang="ts">
	let { slugs, onRemove }: { slugs: string[]; onRemove: (slug: string) => void } = $props();
</script>

{#if slugs.length}
	<aside class="garage-unavailable" aria-label="Недостъпни обяви">
		<p>
			{slugs.length === 1
				? 'Една от избраните обяви вече не е налична.'
				: `${slugs.length} от избраните обяви вече не са налични.`} Запазеният избор не е изтрит автоматично.
		</p>
		<button type="button" onclick={() => slugs.forEach(onRemove)}
			>Премахни недостъпните ({slugs.length})</button
		>
	</aside>
{/if}

<style>
	.garage-unavailable {
		padding: var(--sa-mobile-gap-lg);
		border: 1px solid var(--sa-line);
		border-radius: var(--sa-r-md);
		background: var(--sa-fill);
		color: var(--sa-ink);
	}
	p {
		margin: 0 0 var(--sa-mobile-gap-sm);
		font-size: var(--sa-type-body);
		line-height: var(--sa-leading-body);
	}
	button {
		min-height: var(--sa-mobile-action-h);
		padding: 0 var(--sa-mobile-gap-md);
		border: 0;
		border-radius: var(--sa-r-sm);
		background: var(--sa-ink);
		color: var(--sa-surface);
		font: inherit;
		cursor: pointer;
	}
	button:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 3px;
	}
</style>
