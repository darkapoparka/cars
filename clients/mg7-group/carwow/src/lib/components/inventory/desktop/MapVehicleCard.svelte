<script lang="ts">
	import { resolve } from '$app/paths';
	import { getDayNightVehicleCondition } from '$lib/data/daynight-vehicles';
	import { getOptionalGarageContext } from '$lib/state/garage.svelte';
	import type { InventoryListVehicle } from '$lib/types/inventory';
	import VehicleMetaRow from './VehicleMetaRow.svelte';

	let { vehicle, index }: { vehicle: InventoryListVehicle; index: number } = $props();

	const condition = $derived(getDayNightVehicleCondition(vehicle));
	const garage = getOptionalGarageContext();
	const isCompared = $derived(garage.isCompared(vehicle.slug));
	const isFavorite = $derived(garage.isFavorite(vehicle.slug));
	const displayPrice = $derived(vehicle.priceEur.replace(/\s*EUR\b/, ' €'));
	const fallbackBadge = $derived(index % 5 === 1 ? 'Добра цена' : '');
	const badge = $derived(
		vehicle.badges.find((value) => normalizeBadgeLabel(value) !== 'vip') ??
			vehicle.badges[0] ??
			fallbackBadge
	);
	const badgeClass = $derived(
		normalizeBadgeLabel(badge) === normalizeBadgeLabel(fallbackBadge) ? 'bg-green' : 'bg-primary-2'
	);

	function normalizeBadgeLabel(value: string) {
		return value.trim().toLocaleLowerCase('bg-BG');
	}
</script>

<div
	class="card-box card-box-style-9"
	data-daynight-vehicle-card
	data-daynight-slug={vehicle.slug}
	data-daynight-brand={vehicle.brand}
	data-daynight-model={vehicle.model}
	data-daynight-body={vehicle.body}
	data-daynight-fuel={vehicle.fuel}
	data-daynight-transmission={vehicle.transmission}
	data-daynight-price={vehicle.price}
	data-daynight-mileage={vehicle.mileageValue}
	data-daynight-condition={condition}
	data-daynight-features={vehicle.features.join(' | ')}
	data-daynight-title={vehicle.title}
	data-daynight-year={vehicle.year}
>
	<div class="top">
		{#if badge}
			<p class="{badgeClass} highlight text-white">{badge}</p>
		{:else}
			<p></p>
		{/if}
		<div class="daynight-card-tools">
			<button
				type="button"
				class={['daynight-card-compare', { 'is-active': isCompared }]}
				aria-pressed={isCompared}
				aria-label={isCompared
					? `Премахни ${vehicle.shortTitle} от сравнение`
					: `Добави ${vehicle.shortTitle} за сравнение`}
				title={isCompared ? 'Премахни от сравнение' : 'Добави за сравнение'}
				onclick={() => garage.toggleCompare(vehicle.slug)}
			>
				<svg
					aria-hidden="true"
					focusable="false"
					width="17"
					height="17"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M10 3.75V16.25"
						stroke="currentColor"
						stroke-width="1.7"
						stroke-linecap="round"
					/>
					<path
						d="M3.75 10H16.25"
						stroke="currentColor"
						stroke-width="1.7"
						stroke-linecap="round"
					/>
				</svg>
			</button>
			<button
				type="button"
				class={['heart', { 'is-active': isFavorite }]}
				aria-pressed={isFavorite}
				aria-label={isFavorite
					? `Премахни ${vehicle.shortTitle} от любими`
					: `Добави ${vehicle.shortTitle} в любими`}
				title={isFavorite ? 'Премахни от любими' : 'Добави в любими'}
				onclick={() => garage.toggleFavorite(vehicle.slug)}
			>
				<svg
					aria-hidden="true"
					focusable="false"
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g clip-path="url(#clip0_13399_19510)">
						<path
							d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 4.62145 2.48851 3.98851C3.12145 3.35558 3.97989 3 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C12.0201 3 12.8785 3.35558 13.5115 3.98851C14.1444 4.62145 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z"
							fill={isFavorite ? '#d51024' : 'none'}
							stroke={isFavorite ? '#d51024' : 'white'}
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</g>
				</svg>
			</button>
		</div>
	</div>
	<div class="bottom">
		<p class="category text-white">
			<a href={resolve('/inventory/[slug]', { slug: vehicle.slug })} class="text-xs text-white">
				{vehicle.transmission}</a
			>
		</p>
		<div class="flex items-center gap-[8px]">
			<p class="category text-white uppercase">
				<img src="/assets/icons/picture.svg" alt="" aria-hidden="true" />
				8
			</p>
			<p class="category text-white uppercase">
				<img src="/assets/icons/play.svg" alt="" aria-hidden="true" />
				1
			</p>
		</div>
	</div>
	<div class="image">
		<a href={resolve('/inventory/[slug]', { slug: vehicle.slug })}>
			<img
				class="card--img"
				src={vehicle.image}
				alt={vehicle.shortTitle}
				loading="lazy"
				decoding="async"
			/>
		</a>
	</div>
	<div class="content">
		<p class="h6 card-box__title mb-[4px]">
			<a href={resolve('/inventory/[slug]', { slug: vehicle.slug })}>{vehicle.title}</a>
		</p>
		<p class="text-secondary clamp-1 clamp mb-[8px]">{vehicle.conditionLine}</p>
		<VehicleMetaRow {vehicle} styleClass="style3 mb-[14px]" />
		<p class="h6 card-box__price mb-[10px] flex items-center justify-between gap-[8px]">
			<span class="daynight-card-price__value">{displayPrice}{#if vehicle.taxLabel}<small style="display:block;font-size:12px;font-weight:400;white-space:normal">{vehicle.taxLabel}</small>{/if}</span>
		</p>
	</div>
</div>

<style>
	.daynight-card-tools {
		align-items: center;
		display: flex;
		gap: 8px;
		margin-left: auto;
	}

	.daynight-card-compare {
		align-items: center !important;
		appearance: none;
		background: rgba(17, 24, 39, 0.62) !important;
		border: 1px solid rgba(255, 255, 255, 0.42) !important;
		border-radius: 999px !important;
		box-shadow: none !important;
		color: #fff !important;
		cursor: pointer;
		display: inline-flex !important;
		height: 32px !important;
		justify-content: center !important;
		padding: 0 !important;
		transition:
			background-color 120ms ease-out,
			border-color 120ms ease-out,
			color 120ms ease-out !important;
		width: 32px !important;
	}

	.daynight-card-compare:hover,
	.daynight-card-compare:focus-visible,
	.daynight-card-compare.is-active {
		background: #d51024 !important;
		border-color: #d51024 !important;
		outline: none;
	}

	.daynight-card-compare:active {
		background: #b90f1f !important;
		border-color: #b90f1f !important;
	}

	.daynight-card-compare :global(svg),
	.daynight-card-compare :global(path) {
		color: #fff !important;
		stroke: #fff !important;
	}

	.heart {
		appearance: none;
		background: transparent;
		border: 0;
		cursor: pointer;
		line-height: 0;
		margin: 0;
		padding: 0;
	}

	.heart.is-active {
		color: #d51024;
	}

	:global(.inventory-map-template-shell .card-box[data-daynight-vehicle-card] .heart),
	:global(.inventory-map-template-shell .card-box[data-daynight-vehicle-card] .category),
	:global(.inventory-template-shell .card-box[data-daynight-vehicle-card] .heart),
	:global(.inventory-template-shell .card-box[data-daynight-vehicle-card] .category) {
		backdrop-filter: none !important;
		-webkit-backdrop-filter: none !important;
		box-shadow: none !important;
	}
</style>
