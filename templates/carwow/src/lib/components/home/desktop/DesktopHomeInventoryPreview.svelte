<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { daynightSite } from '$lib/data/daynight-site';
	import DesktopSectionHeading from '$lib/components/shared/DesktopSectionHeading.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { resolve } from '$app/paths';
	import type { HomeDesktopVehicle } from '$lib/types/home';
	import DesktopHomeInventoryCard from './DesktopHomeInventoryCard.svelte';
	import DesktopHomeInventoryTabs from './DesktopHomeInventoryTabs.svelte';
	import {
		DESKTOP_HOME_INVENTORY_LIMIT,
		getDesktopHomeInventoryPreview
	} from './desktop-home-inventory-data';

	let {
		vehicles,
		showHeaderSubtitle = true
	}: {
		vehicles: HomeDesktopVehicle[];
		showHeaderSubtitle?: boolean;
	} = $props();

	const inventoryPreview = $derived(getDesktopHomeInventoryPreview(vehicles));
	const previewVehicles = $derived(
		inventoryPreview.vehicles.slice(0, DESKTOP_HOME_INVENTORY_LIMIT - 1)
	);
	const inventoryCount = $derived(inventoryPreview.totalCount);
</script>

<section class="daynight-home-section daynight-home-inventory daynight-home-inventory--centered">
	<div class="daynight-home-container home-browse-heading">
		<DesktopSectionHeading
			centered
			title={i18n.t('copy.db6bde014aa2')}
			copy={showHeaderSubtitle
				? i18n.t('pattern.27fbcd82a4a3', { v0: daynightSite.shortName })
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
				<a
					class="daynight-home-inventory__browse"
					data-daynight-inventory-browse
					href={i18n.href(resolve('/inventory'))}
				>
					<span class="daynight-home-inventory__browse-icon" aria-hidden="true"
						><ArrowRight size={28} /></span
					>
					<span class="daynight-home-inventory__browse-label"
						>{i18n.t('pattern.9c26c426b746', { v0: inventoryCount })}</span
					>
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	:global(body.daynight-home-page .daynight-home-shell--original .daynight-home-inventory) {
		background: var(--discovery-canvas) !important;
	}

	.daynight-home-inventory__browse {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
		min-width: 0;
		padding: 24px;
		border: 1px solid var(--discovery-control-border);
		border-radius: 12px;
		background: #fff;
		color: var(--discovery-ink);
		font: var(--sa-weight-strong) var(--sa-text-xl)/1.3 var(--sa-font);
		text-align: center;
		text-decoration: none;
	}
	.daynight-home-inventory__browse-icon {
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--discovery-muted-surface);
	}
	.daynight-home-inventory__browse-label {
		font: inherit;
	}
	.daynight-home-inventory__browse:hover {
		border-color: var(--discovery-border-hover);
		background: var(--discovery-muted-surface);
	}
	.daynight-home-inventory__browse:focus-visible {
		outline: 2px solid var(--desktop-focus);
		outline-offset: 3px;
	}
	.home-browse-heading {
		padding-top: 36px;
	}
</style>
