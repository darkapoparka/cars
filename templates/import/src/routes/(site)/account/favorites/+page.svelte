<script lang="ts">
	import { pageDescriptions } from '$lib/content/seo';
	import type { PageProps } from './$types';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import VehicleCard from '$lib/components/inventory/VehicleCard.svelte';
	import MobileVehicleCard from '$lib/components/common/MobileVehicleCard.svelte';
	import Action from '$lib/components/common/Action.svelte';
	let { data }: PageProps = $props();
	const garage = getGarageContext();
	const english = $derived(data.locale === 'en');
	const selected = $derived(data.cards.filter((card) => garage.isFavorite(card.slug)));
</script>

<svelte:head
	><title>{english ? 'Saved cars' : 'Любими автомобили'} — {data.site.identity.name}</title><meta
		name="description"
		content={pageDescriptions.favorites[data.locale === 'en' ? 'en' : 'bg']}
	/></svelte:head
>
<main id="main-content">
	<PageIntro title={english ? 'Saved cars' : 'Любими автомобили'} />
	<div class="site-section site-container site-stack">
		{#if selected.length}<div class="favorites-desktop">
				{#each selected as card (card.slug)}<VehicleCard {card} {english} />{/each}
			</div>
			<div class="favorites-mobile">
				{#each selected as card (card.slug)}<div class="site-stack">
						<MobileVehicleCard {card} /><Action
							variant="quiet"
							onclick={() => garage.toggleFavorite(card.slug)}
							>{english ? 'Remove' : 'Премахни'}</Action
						>
					</div>{/each}
			</div>
		{:else}<div class="site-panel site-stack site-empty-state">
				<h2>{english ? 'No saved cars yet' : 'Все още няма запазени автомобили'}</h2>
				<p>
					{english
						? 'Use the heart on a car to save it on this device.'
						: 'Избери сърцето до автомобил, за да го запазиш на това устройство.'}
				</p>
				<Action href="/inventory" variant="secondary"
					>{english ? 'Browse cars' : 'Разгледай автомобили'}</Action
				>
			</div>{/if}
	</div>
</main>

<style>
	.favorites-desktop {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--bc-space-5);
	}
	.favorites-mobile {
		display: none;
	}
	p {
		margin: 0;
		color: var(--bc-copy);
	}
	@media (max-width: 1100px) {
		.favorites-desktop {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (max-width: 767.98px) {
		.favorites-desktop {
			display: none;
		}
		.favorites-mobile {
			display: grid;
			gap: var(--bc-space-4);
		}
	}
</style>
