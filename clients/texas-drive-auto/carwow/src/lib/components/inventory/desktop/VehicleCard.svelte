<script lang="ts">
	import { resolve } from '$app/paths';
	import { fromAction } from 'svelte/attachments';
	import { getDayNightVehicleCondition, placeholderImageSlugs } from '$lib/data/daynight-vehicles';
	import type { InventoryListVehicle } from '$lib/types/inventory';
	import VehicleBadge from './VehicleBadge.svelte';
	import VehicleMetaRow from './VehicleMetaRow.svelte';
	import VehiclePriceRow from './VehiclePriceRow.svelte';
	import DesktopVehicleActions from '$lib/components/shared/DesktopVehicleActions.svelte';
	import { daynightImageFallback } from '$lib/utils/daynight-image-fallback';

	let {
		vehicle,
		index,
		extraClass = ''
	}: { vehicle: InventoryListVehicle; index: number; extraClass?: string } = $props();

	const delay = $derived(`0.${(index % 4) + 1}s`);
	const cardClass = $derived(`card-box card-box-style-1${extraClass ? ` ${extraClass}` : ''}`);
	const condition = $derived(getDayNightVehicleCondition(vehicle));
	// A placeholder-only gallery is not a real photo — no count badge for it.
	const hasRealPhotos = $derived(
		!placeholderImageSlugs.has(vehicle.slug) && vehicle.gallery.length > 0
	);
	const imageFallbackAttachment = fromAction(daynightImageFallback);
</script>

<div
	class="{cardClass} wow fadeIn"
	data-wow-delay={delay}
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
		<VehicleBadge {vehicle} {index} />
		<DesktopVehicleActions slug={vehicle.slug} title={vehicle.shortTitle} />
	</div>
	<div class="image">
		<a
			href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
			aria-label={`View ${vehicle.shortTitle} ${vehicle.year}`}
		>
			<img
				class="card--img"
				src={vehicle.image}
				alt={vehicle.shortTitle}
				width="640"
				height="478"
				data-daynight-image-fallback
				loading={index < 5 ? 'eager' : 'lazy'}
				decoding="async"
				{@attach imageFallbackAttachment}
			/>
		</a>
	</div>
	<div class="content">
		<div class="bottom">
			<p class="category text-white">
				<a
					href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
					class="text-xs text-white"
					aria-label={`${vehicle.transmission} - ${vehicle.shortTitle} ${vehicle.year}`}
					>{vehicle.transmission}</a
				>
			</p>
			<div class="flex items-center gap-8">
				{#if hasRealPhotos}
					<p class="category text-white uppercase">
						<img
							src="/assets/icons/picture.svg"
							alt=""
							aria-hidden="true"
							decoding="async"
							loading="lazy"
						/>
						{vehicle.gallery.length}
					</p>
				{/if}
			</div>
		</div>
		<p class="h6 card-box__title mb-8">
			<a
				href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
				title={`${vehicle.shortTitle} ${vehicle.year}`}>{vehicle.shortTitle}</a
			>
		</p>
		<VehicleMetaRow {vehicle} styleClass="style2 mb-10" />
		<VehiclePriceRow {vehicle} />
	</div>
</div>

<style>
	:global(.inventory-template-shell .card-box.card-box-style-1[data-daynight-vehicle-card]) {
		display: flex !important;
		flex-direction: column;
		height: 100%;
		min-height: 0;
		transition: none;
	}

	:global(.inventory-template-shell .card-box.card-box-style-1[data-daynight-vehicle-card]:hover),
	:global(
		.inventory-template-shell .card-box.card-box-style-1[data-daynight-vehicle-card]:focus-within
	) {
		border-color: transparent !important;
		box-shadow: none !important;
		transform: none !important;
	}

	:global(
		.inventory-template-shell
			.card-box.card-box-style-1[data-daynight-vehicle-card]:hover
			.card-box__title
			a
	),
	:global(
		.inventory-template-shell
			.card-box.card-box-style-1[data-daynight-vehicle-card]:focus-within
			.card-box__title
			a
	) {
		color: #b00000 !important;
	}

	:global(
		.inventory-template-shell
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.card-box__title
	) {
		display: block;
		min-height: 27px;
		max-height: 27px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		-webkit-line-clamp: 1;
		line-clamp: 1;
	}

	:global(
		.inventory-template-shell
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.card-box__title
			> a
	) {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global(.inventory-template-shell .card-box.card-box-style-1 .card-box__title.mb-8) {
		margin-bottom: 6px;
	}

	:global(.inventory-template-shell .card-box.card-box-style-1[data-daynight-vehicle-card] .image) {
		aspect-ratio: 1.34 / 1;
		flex: 0 0 auto;
		height: auto;
		overflow: hidden;
	}

	:global(
		.inventory-template-shell .card-box.card-box-style-1[data-daynight-vehicle-card] .content
	) {
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		min-height: 0;
	}

	:global(
		.inventory-template-shell
			.card-box.card-box-style-1[data-daynight-vehicle-card]
			.card-box__price
	) {
		margin-top: 0 !important;
	}

	:global(.inventory-template-shell .card-box.card-box-style-1 .tag.style2.mb-10) {
		margin-bottom: 8px;
	}

	:global(.inventory-template-shell .card-box.card-box-style-1 .card-box__price.mb-15) {
		margin-bottom: 0;
	}

	:global(
		.inventory-template-shell .card-box.card-box-style-1[data-daynight-vehicle-card] .card--img
	) {
		display: block;
		height: 100%;
		object-fit: cover;
		transition: none;
		width: 100%;
	}

	:global(
		.inventory-template-shell
			.card-box.card-box-style-1[data-daynight-vehicle-card]:hover
			.card--img
	),
	:global(
		.inventory-template-shell
			.card-box.card-box-style-1[data-daynight-vehicle-card]:focus-within
			.card--img
	) {
		filter: none;
		transform: none !important;
	}

	:global(.inventory-template-shell .card-box[data-daynight-vehicle-card] .heart),
	:global(.inventory-template-shell .card-box[data-daynight-vehicle-card] .category) {
		backdrop-filter: none !important;
		-webkit-backdrop-filter: none !important;
		box-shadow: none !important;
	}

	@media (hover: none), (pointer: coarse) {
		:global(.inventory-template-shell .card-box.card-box-style-1[data-daynight-vehicle-card]:hover),
		:global(
			.inventory-template-shell .card-box.card-box-style-1[data-daynight-vehicle-card]:focus-within
		) {
			box-shadow: none !important;
		}

		:global(
			.inventory-template-shell
				.card-box.card-box-style-1[data-daynight-vehicle-card]:hover
				.card--img
		),
		:global(
			.inventory-template-shell
				.card-box.card-box-style-1[data-daynight-vehicle-card]:focus-within
				.card--img
		) {
			filter: none !important;
			transform: none !important;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.inventory-template-shell .card-box.card-box-style-1[data-daynight-vehicle-card]),
		:global(
			.inventory-template-shell .card-box.card-box-style-1[data-daynight-vehicle-card] .card--img
		) {
			transition: none;
		}

		:global(.inventory-template-shell .card-box.card-box-style-1[data-daynight-vehicle-card]:hover),
		:global(
			.inventory-template-shell .card-box.card-box-style-1[data-daynight-vehicle-card]:focus-within
		),
		:global(
			.inventory-template-shell
				.card-box.card-box-style-1[data-daynight-vehicle-card]:hover
				.card--img
		),
		:global(
			.inventory-template-shell
				.card-box.card-box-style-1[data-daynight-vehicle-card]:focus-within
				.card--img
		) {
			transform: none;
		}
	}
</style>
