<script lang="ts">
	import type { AuxeroInventoryDesktopData } from '$lib/auxero/inventory-desktop';
	import { X } from '@lucide/svelte';

	let {
		activeFilters,
		modifierClass = '',
		compactLabels = false
	}: {
		activeFilters: NonNullable<AuxeroInventoryDesktopData['activeFilters']>;
		modifierClass?: string;
		compactLabels?: boolean;
	} = $props();

	const className = $derived(
		['daynight-inventory-active-filters', modifierClass].filter(Boolean).join(' ')
	);
	const linkHref = (href: string) => ({ href });
</script>

<div class={className} aria-label="Active inventory filters">
	<p class="daynight-inventory-active-filters__summary">{activeFilters.summary}</p>
	<div class="daynight-inventory-active-filters__chips">
		{#each activeFilters.chips as chip (chip.label)}
			<a
				class="daynight-active-filter"
				{...linkHref(chip.href)}
				aria-label={`Remove ${chip.label} filter`}
			>
				{compactLabels ? chip.label.replace(/^(Марка|Brand):\s*/i, '') : chip.label}
				<X size={13} strokeWidth={2.5} aria-hidden="true" />
			</a>
		{/each}
		<a
			class="daynight-active-filter daynight-active-filter--clear"
			{...linkHref(activeFilters.clearHref)}
		>
			{activeFilters.clearLabel}
			{#if !compactLabels}<X size={13} strokeWidth={2.5} aria-hidden="true" />{/if}
		</a>
	</div>
</div>
