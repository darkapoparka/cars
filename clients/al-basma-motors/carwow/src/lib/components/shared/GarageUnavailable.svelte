<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	let { slugs, onRemove }: { slugs: string[]; onRemove: (slug: string) => void } = $props();
</script>

{#if slugs.length}
	<aside class="garage-unavailable" aria-label={i18n.t('copy.8f2bae53d2a6')}>
		<p>
			{slugs.length === 1
				? i18n.t('copy.9ecc445a515d')
				: i18n.t('pattern.bd45345b7bd9', { v0: slugs.length })}
			{i18n.t('copy.e48b2f10684f')}
		</p>
		<button type="button" onclick={() => slugs.forEach(onRemove)}
			>{i18n.t('copy.aca42cd2a807')}{slugs.length})</button
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
