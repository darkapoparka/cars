<script lang="ts">
	import DesktopVehicleActions from '$lib/components/shared/DesktopVehicleActions.svelte';
	import { resolve } from '$app/paths';
	import { fromAction } from 'svelte/attachments';
	import { getDayNightVehicleCondition, type DayNightVehicle } from '$lib/data/daynight-vehicles';
	import {
		desktopOnlyImagePlaceholder,
		desktopOnlySizes,
		desktopOnlySrcset
	} from '$lib/utils/desktop-only-assets';
	import { daynightImageFallback } from '$lib/utils/daynight-image-fallback';

	let { vehicle }: { vehicle: DayNightVehicle } = $props();

	const imageFallbackAttachment = fromAction(daynightImageFallback);
	const condition = $derived(getDayNightVehicleCondition(vehicle));
	const featureList = $derived(vehicle.features.join(' | '));
	const visiblePhotoCount = $derived(vehicle.gallery.length > 1 ? vehicle.gallery.length : 0);
</script>

<div
	class="daynight-home-inventory__card"
	data-daynight-vehicle-card=""
	data-daynight-slug={vehicle.slug}
	data-daynight-brand={vehicle.brand}
	data-daynight-model={vehicle.model}
	data-daynight-body={vehicle.body}
	data-daynight-fuel={vehicle.fuel}
	data-daynight-transmission={vehicle.transmission}
	data-daynight-price={vehicle.price}
	data-daynight-mileage={vehicle.mileageValue}
	data-daynight-condition={condition}
	data-daynight-features={featureList}
	data-daynight-title={vehicle.title}
	data-daynight-year={vehicle.year}
>
	<div class="daynight-home-inventory-card__top">
		<p class="daynight-home-inventory-card__status">{vehicle.badges[0] ?? 'VIP'}</p>
		<DesktopVehicleActions slug={vehicle.slug} title={vehicle.shortTitle} />
	</div>
	<div class="daynight-home-inventory-card__media">
		<a
			href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
			aria-label={`Виж ${vehicle.shortTitle}`}
		>
			<img
				class="daynight-home-inventory-card__image"
				src={desktopOnlyImagePlaceholder}
				srcset={desktopOnlySrcset(vehicle.image, 900)}
				sizes={desktopOnlySizes('25vw')}
				alt={vehicle.shortTitle}
				data-daynight-image-fallback
				loading="lazy"
				decoding="async"
				{@attach imageFallbackAttachment}
			/>
		</a>
		<div class="daynight-home-inventory-card__badges">
			<p class="daynight-home-inventory-card__badge">
				<a
					href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
					class="daynight-home-inventory-card__badge-link"
					aria-label={`${vehicle.transmission} - ${vehicle.shortTitle}`}>{vehicle.transmission}</a
				>
			</p>
			{#if visiblePhotoCount}
				<div class="daynight-home-inventory-card__tag-row">
					<p class="daynight-home-inventory-card__badge">
						<img src="/assets/icons/picture.svg" alt="" aria-hidden="true" />
						{visiblePhotoCount}
					</p>
				</div>
			{/if}
		</div>
	</div>
	<div class="daynight-home-inventory-card__content">
		<p class="daynight-home-inventory-card__title">
			<a href={resolve('/inventory/[slug]', { slug: vehicle.slug })} title={vehicle.title}
				>{vehicle.shortTitle}</a
			>
		</p>
		<ul class="daynight-home-inventory-card__specs">
			<li>
				<img src="/assets/icons/icon-gauge.svg" alt="" aria-hidden="true" /><span
					>{vehicle.mileage}</span
				>
			</li>
			<li>
				<img src="/assets/icons/calendar.svg" alt="" aria-hidden="true" /><span>{vehicle.year}</span
				>
			</li>
			<li>
				<img src="/assets/icons/gaspump.svg" alt="" aria-hidden="true" /><span>{vehicle.fuel}</span>
			</li>
		</ul>
		<p class="daynight-home-inventory-card__price">
			<span class="daynight-card-price__value">{vehicle.priceEur}{#if vehicle.taxLabel}<small style="display:block;font-size:12px;font-weight:400;line-height:1.4;white-space:normal">{vehicle.taxLabel}</small>{/if}</span>
			<span class="daynight-card-price__meta"
				><span class="daynight-card-price__monthly">{vehicle.monthly}</span><a
					href={resolve('/financing')}
					class="daynight-card-price__link">Финансиране</a
				></span
			>
		</p>
	</div>
</div>

<style>
	@media (min-width: 992px) {
		:global(body.daynight-home-page .daynight-home-inventory__card) {
			border: 1px solid var(--discovery-control-border) !important;
			border-radius: 12px !important;
			box-shadow: none !important;
			transform: none !important;
			transition:
				border-color 0.16s ease,
				box-shadow 0.16s ease !important;
		}

		:global(body.daynight-home-page .daynight-home-inventory__card:hover),
		:global(body.daynight-home-page .daynight-home-inventory__card:focus-within) {
			border-color: var(--discovery-border-hover) !important;
			box-shadow: none !important;
			transform: none !important;
		}

		:global(body.daynight-home-page .daynight-home-inventory-card__top) {
			left: 12px !important;
			right: 12px !important;
			top: 12px !important;
		}

		:global(body.daynight-home-page .daynight-home-inventory-card__status) {
			border-radius: 7px !important;
			font-size: 12px !important;
			min-height: 28px !important;
			padding: 0 10px !important;
		}

		:global(body.daynight-home-page .daynight-home-inventory-card__media),
		:global(body.daynight-home-page .daynight-home-inventory-card__image) {
			aspect-ratio: 16 / 11 !important;
			border-radius: 11px 11px 0 0 !important;
		}

		:global(body.daynight-home-page .daynight-home-inventory-card__badges) {
			bottom: 12px !important;
			left: 12px !important;
			right: 12px !important;
		}

		:global(body.daynight-home-page .daynight-home-inventory-card__badge) {
			backdrop-filter: none !important;
			background: rgba(17, 24, 39, 0.8) !important;
			border: 1px solid rgba(255, 255, 255, 0.45) !important;
			border-radius: 7px !important;
			box-shadow: none !important;
			font-size: 12px !important;
			min-height: 28px !important;
			padding: 0 9px !important;
		}

		:global(body.daynight-home-page .daynight-home-inventory-card__badge-link) {
			font-size: 12px !important;
		}

		:global(body.daynight-home-page .daynight-home-inventory-card__content) {
			border-radius: 0 0 11px 11px !important;
			gap: 12px !important;
			padding: 16px !important;
		}

		:global(body.daynight-home-page .daynight-home-inventory-card__title),
		:global(body.daynight-home-page .daynight-home-inventory-card__title a) {
			font-size: 18px !important;
			font-weight: 700 !important;
			height: 47px !important;
			line-height: 1.3 !important;
			max-height: 47px !important;
		}

		:global(body.daynight-home-page .daynight-home-inventory-card__title a:focus-visible) {
			border-radius: 4px;
			outline: 2px solid #c91620;
			outline-offset: 2px;
		}

		:global(body.daynight-home-page .daynight-home-inventory-card__specs) {
			align-items: center !important;
			gap: 0 !important;
			min-height: 22px !important;
		}

		:global(body.daynight-home-page .daynight-home-inventory-card__specs li) {
			background: transparent !important;
			border: 0 !important;
			border-radius: 0 !important;
			color: #475467 !important;
			flex: 0 1 auto !important;
			height: 22px !important;
			padding: 0 !important;
		}

		:global(body.daynight-home-page .daynight-home-inventory-card__specs li:not(:first-child)) {
			margin-left: 10px;
		}

		:global(
			body.daynight-home-page .daynight-home-inventory-card__specs li:not(:first-child)::before
		) {
			background: #d8dee8;
			content: '';
			height: 14px;
			margin-right: 10px;
			width: 1px;
		}

		:global(body.daynight-home-page .daynight-home-inventory-card__specs li img) {
			height: 13px !important;
			margin-right: 5px !important;
			opacity: 0.62 !important;
			width: 13px !important;
		}

		:global(body.daynight-home-page .daynight-home-inventory-card__specs li span) {
			color: #475467 !important;
			font-size: 13px !important;
			line-height: 18px !important;
		}

		:global(body.daynight-home-page .daynight-home-inventory-card__price) {
			border-top: 1px solid #eaecf0 !important;
			column-gap: 12px !important;
			margin: 0 !important;
			min-height: 48px !important;
			padding-top: 12px !important;
		}

		:global(body.daynight-home-page .daynight-card-price__value) {
			font-size: 24px !important;
			font-weight: 750 !important;
		}

		:global(body.daynight-home-page .daynight-card-price__monthly),
		:global(body.daynight-home-page .daynight-card-price__link) {
			font-size: 13px !important;
			line-height: 17px !important;
		}
	}
</style>
