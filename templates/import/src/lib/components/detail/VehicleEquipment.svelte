<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Action from '$lib/components/common/Action.svelte';
	import VehicleInformationSection from './VehicleInformationSection.svelte';
	let {
		title,
		items,
		english = false
	}: { title: string; items: string[]; english?: boolean } = $props();
	const listId = $props.id();
	const previewCount = 6;
	let expanded = $state(false);
	const visibleItems = $derived(expanded ? items : items.slice(0, previewCount));
	const countLabel = $derived(
		`${items.length} ${english ? (items.length === 1 ? 'feature' : 'features') : items.length === 1 ? 'екстра' : 'екстри'}`
	);
</script>

<VehicleInformationSection {title} meta={countLabel}>
	<div class="vehicle-equipment">
		<ul id={listId} class="vehicle-equipment__list">
			{#each visibleItems as item, index (index)}
				<li><Check size={16} strokeWidth={1.6} aria-hidden="true" /><span>{item}</span></li>
			{/each}
		</ul>
		{#if items.length > previewCount}
			<Action
				class="vehicle-equipment__toggle"
				variant="secondary"
				size="compact"
				aria-expanded={expanded}
				aria-controls={listId}
				onclick={() => (expanded = !expanded)}
			>
				{expanded
					? english
						? 'Show fewer'
						: 'Покажи по-малко'
					: english
						? `View all ${items.length} features`
						: `Виж всички ${items.length} екстри`}
				<ChevronDown size={16} aria-hidden="true" class={expanded ? 'is-expanded' : ''} />
			</Action>
		{/if}
	</div>
</VehicleInformationSection>

<style>
	.vehicle-equipment {
		container: vehicle-equipment / inline-size;
	}
	.vehicle-equipment__list {
		display: grid;
		gap: var(--bc-space-3) var(--bc-space-6);
		padding: 0;
		margin: 0;
		list-style: none;
		font-size: var(--bc-text-label);
		line-height: var(--bc-leading-h7);
	}
	li {
		display: flex;
		align-items: baseline;
		gap: var(--bc-space-2);
		min-width: 0;
		overflow-wrap: anywhere;
	}
	li :global(svg) {
		align-self: flex-start;
		flex-shrink: 0;
		margin-top: var(--bc-space-1);
		color: var(--bc-muted);
	}
	.vehicle-equipment :global(.vehicle-equipment__toggle) {
		min-height: var(--bc-control-height-compact);
		margin-top: var(--bc-space-5);
		font-size: var(--bc-text-label);
	}
	.vehicle-equipment :global(.is-expanded) {
		transform: rotate(180deg);
	}
	@container vehicle-equipment (min-width: 40rem) {
		.vehicle-equipment__list {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
