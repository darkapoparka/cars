<script lang="ts">
	import DesktopSectionHeading from '$lib/components/shared/DesktopSectionHeading.svelte';
	import DesktopBrowseLink from '$lib/components/shared/DesktopBrowseLink.svelte';
	import { resolve } from '$app/paths';
	import type { HomeDesktopVehicle } from '$lib/types/home';
	import DesktopHomeInventoryCard from './DesktopHomeInventoryCard.svelte';
	import DesktopHomeInventoryTabs from './DesktopHomeInventoryTabs.svelte';
	import { getDesktopHomeInventoryPreview } from './desktop-home-inventory-data';

	let {
		vehicles,
		showHeaderCta = true,
		showHeaderSubtitle = true
	}: {
		vehicles: HomeDesktopVehicle[];
		showHeaderCta?: boolean;
		showHeaderSubtitle?: boolean;
	} = $props();

	const inventoryPreview = $derived(getDesktopHomeInventoryPreview(vehicles));
	const previewVehicles = $derived(inventoryPreview.vehicles);
	const inventoryCount = $derived(inventoryPreview.totalCount);
</script>

<section
	class={`daynight-home-section daynight-home-inventory${showHeaderCta ? '' : ' daynight-home-inventory--centered'}`}
>
	<div class="daynight-home-container home-browse-heading">
		<DesktopSectionHeading
			centered={!showHeaderCta}
			title="Най-нови автомобили"
			href={showHeaderCta ? resolve('/inventory') : undefined}
			label={`Виж всички ${inventoryCount} автомобила`}
			copy={showHeaderSubtitle
				? 'Последно добавени предложения от наличността на Теси Кар.'
				: undefined}
		/>
	</div>
	<div class="daynight-home-inventory__body daynight-home-container">
		<div class="daynight-home-inventory__results">
			<DesktopHomeInventoryTabs />
			<div class="daynight-home-inventory__grid">
				{#each previewVehicles as vehicle (vehicle.slug)}
					<DesktopHomeInventoryCard {vehicle} />
				{/each}
			</div>
			{#if !showHeaderCta}
				<div class="inventory-browse-footer">
					<DesktopBrowseLink
						href={resolve('/inventory')}
						label={`Виж всички ${inventoryCount} автомобила`}
					/>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-inventory) {
		background: var(--discovery-canvas) !important;
	}

	.inventory-browse-footer {
		display: flex;
		justify-content: center;
		margin-top: 24px;
	}
	.home-browse-heading {
		padding-top: 36px;
	}
</style>
