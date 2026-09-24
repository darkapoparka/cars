<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { Heart } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import DesktopYellowRouteHero from '$lib/components/layout/DesktopYellowRouteHero.svelte';
	import VehicleCard from '$lib/components/inventory/desktop/VehicleCard.svelte';
	import type { DayNightVehicle } from '$lib/data/daynight-vehicles';
	import { resolveGarageVehicles } from '$lib/utils/garage';
	import GarageUnavailable from '$lib/components/shared/GarageUnavailable.svelte';
	let { catalogue }: { catalogue: DayNightVehicle[] } = $props();
	import { getGarageContext } from '$lib/state/garage.svelte';
	import '$lib/components/inventory/desktop/inventory-desktop.css';

	const garage = getGarageContext();

	const selection = $derived(resolveGarageVehicles(garage.favorites, catalogue));
	const vehicles = $derived(selection.available);
	const suggestedVehicles = $derived(
		catalogue.filter((vehicle) => !garage.favorites.includes(vehicle.slug)).slice(0, 4)
	);
	const countLabel = $derived(
		vehicles.length === 1
			? i18n.text('1 запазен автомобил')
			: i18n.t('pattern.0041639e21e7', { v0: vehicles.length })
	);
</script>

<main id="main-content" tabindex="-1" class="desktop-favorites inventory-template-shell">
	<DesktopYellowRouteHero
		headingId="favorites-title"
		title={i18n.t('copy.2ff1cef08851')}
		copy={vehicles.length
			? i18n.t('pattern.3fb1938f7f16', { v0: countLabel })
			: i18n.t('copy.e79533fe3403')}
		panel="light"
		compact
	>
		<div class="desktop-favorites__hero-actions" aria-label={i18n.t('copy.cad123465b9e')}>
			<a class="sa-cta sa-cta-primary" href={i18n.href(resolve('/inventory'))}
				>{i18n.t('copy.4b5a450faf64')}</a
			>
			<a class="sa-cta sa-cta-ghost" href={i18n.href(resolve('/compare'))}
				>{i18n.t('copy.3c4226f1f842')}</a
			>
		</div>
	</DesktopYellowRouteHero>

	<section class="desktop-favorites__content" aria-label={i18n.t('copy.925606ad84b8')}>
		<GarageUnavailable
			slugs={selection.unavailable}
			onRemove={(slug) => garage.toggleFavorite(slug)}
		/>
		{#if vehicles.length}
			<div class="desktop-favorites__section-heading">
				<div>
					<p class="desktop-favorites__section-kicker">{i18n.t('copy.bc246f59ec57')}</p>
					<h2>{countLabel}</h2>
				</div>
				<p>{i18n.t('copy.d5043cda9f82')}</p>
			</div>
			<div class="desktop-favorites__grid">
				{#each vehicles as vehicle, index (vehicle.slug)}
					<VehicleCard {vehicle} {index} extraClass="desktop-favorites__vehicle" />
				{/each}
			</div>
		{:else}
			<div class="desktop-favorites__empty">
				<div class="desktop-favorites__empty-icon" aria-hidden="true">
					<Heart size={34} strokeWidth={2.2} />
				</div>
				<h2>{i18n.t('copy.8837bdcba905')}</h2>
				<p>{i18n.t('copy.d61f500c9cb8')}</p>
				<a class="sa-cta sa-cta-primary" href={i18n.href(resolve('/inventory'))}>
					{i18n.t('copy.c79b6820c344')}
				</a>
			</div>
		{/if}

		{#if suggestedVehicles.length}
			<div class="desktop-favorites__section-heading desktop-favorites__section-heading--suggested">
				<div>
					<p class="desktop-favorites__section-kicker">{i18n.t('copy.254d3c81a830')}</p>
					<h2>{i18n.t('copy.7b7908c827fa')}</h2>
				</div>
				<a class="sa-cta-compact sa-cta sa-cta-ghost" href={i18n.href(resolve('/inventory'))}>
					{i18n.t('copy.8666797b13d9')}
				</a>
			</div>
			<div class="desktop-favorites__grid">
				{#each suggestedVehicles as vehicle, index (vehicle.slug)}
					<VehicleCard {vehicle} index={index + vehicles.length} />
				{/each}
			</div>
		{/if}
	</section>
</main>

<style>
	.desktop-favorites {
		background: var(--discovery-canvas, #f4f6fa);
		color: var(--sa-ink);
		font-family: var(--sa-font);
		min-height: 720px;
		padding-bottom: var(--sa-desktop-section-y-lg);
	}

	.desktop-favorites__content {
		box-sizing: border-box;
		margin: 0 auto;
		max-width: 1440px;
		padding-left: 15px;
		padding-right: 15px;
		width: 100%;
	}

	.desktop-favorites__section-kicker {
		color: var(--sa-red);
		font-size: var(--sa-text-desktop-dense, var(--sa-text-base));
		font-weight: var(--sa-weight-strong);
		line-height: 1.2;
		margin: 0 0 8px;
	}

	.desktop-favorites h2,
	.desktop-favorites p {
		letter-spacing: 0;
	}

	.desktop-favorites__hero-actions {
		display: grid;
		gap: 10px;
		grid-template-columns: repeat(2, minmax(220px, 1fr));
	}

	.desktop-favorites__content {
		padding-top: 52px;
	}

	.desktop-favorites__section-heading {
		align-items: end;
		display: flex;
		gap: 28px;
		justify-content: space-between;
		margin-bottom: 24px;
	}

	.desktop-favorites__section-heading h2 {
		color: #101828;
		font-size: var(--sa-heading-section);
		font-weight: var(--sa-weight-heading);
		line-height: 1.08;
		margin: 0;
	}

	.desktop-favorites__section-heading > p {
		color: #475467;
		font-size: var(--sa-type-body);
		font-weight: var(--sa-weight-medium);
		line-height: 1.5;
		margin: 0;
		max-width: 520px;
		text-align: right;
	}

	.desktop-favorites__section-heading--suggested {
		border-top: 1px solid #dce5f0;
		margin-top: 56px;
		padding-top: 44px;
	}

	.desktop-favorites__grid {
		display: grid;
		gap: 24px;
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.desktop-favorites__empty {
		align-items: center;
		background: #fff;
		border: 1px solid #dfe7f2;
		border-radius: 8px;
		display: grid;
		gap: 14px;
		justify-items: center;
		min-height: 360px;
		padding: 48px 32px;
		text-align: center;
	}

	.desktop-favorites__empty-icon {
		align-items: center;
		background: #fff1f3;
		border-radius: 999px;
		color: #e11c2a;
		display: inline-flex;
		height: 72px;
		justify-content: center;
		width: 72px;
	}

	.desktop-favorites__empty h2 {
		color: #101828;
		font-size: var(--sa-text-desktop-panel-title, var(--sa-text-panel-title));
		font-weight: var(--sa-weight-heading);
		line-height: 1.15;
		margin: 0;
	}

	.desktop-favorites__empty p {
		color: #475467;
		font-size: var(--sa-type-body);
		line-height: 1.55;
		margin: 0;
		max-width: 560px;
	}

	.desktop-favorites :global(.card-box.card-box-style-1[data-daynight-vehicle-card]) {
		border-radius: 8px;
	}

	.desktop-favorites :global(.card-box.card-box-style-1[data-daynight-vehicle-card] .image) {
		border-radius: 8px 8px 0 0;
	}

	.desktop-favorites :global(.card-box.card-box-style-1[data-daynight-vehicle-card] .content) {
		border-radius: 0 0 8px 8px;
	}

	@media (max-width: 1320px) {
		.desktop-favorites__grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (max-width: 991px) {
		.desktop-favorites {
			display: none;
		}
	}
</style>
