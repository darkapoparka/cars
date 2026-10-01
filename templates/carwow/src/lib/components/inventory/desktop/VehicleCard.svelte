<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { fromAction } from 'svelte/attachments';
	import { getDayNightVehicleCondition, placeholderImageSlugs } from '$lib/data/daynight-vehicles';
	import type { InventoryListVehicle } from '$lib/types/inventory';
	import VehicleBadge from './VehicleBadge.svelte';
	import DesktopVehicleCardDetails from '$lib/components/shared/DesktopVehicleCardDetails.svelte';
	import DesktopVehicleActions from '$lib/components/shared/DesktopVehicleActions.svelte';
	import { daynightImageFallback } from '$lib/utils/daynight-image-fallback';
	import { desktopVehicleImage, desktopVehicleImageSrcset } from '$lib/utils/desktop-vehicle-image';
	import { desktopOnlyImagePlaceholder } from '$lib/utils/desktop-only-assets';

	let {
		vehicle,
		index,
		extraClass = ''
	}: { vehicle: InventoryListVehicle; index: number; extraClass?: string } = $props();

	const delay = $derived(`0.${(index % 4) + 1}s`);
	const cardClass = $derived(
		`card-box card-box-style-1 desktop-catalogue-card${extraClass ? ` ${extraClass}` : ''}`
	);
	const condition = $derived(getDayNightVehicleCondition(vehicle));
	const image = $derived(desktopVehicleImage(vehicle.image));
	let desktopMounted = $state(false);
	onMount(() => {
		// Keep SSR/mobile source guards, then use photographic candidates on desktop.
		// WebKit can retain the transparent SVG candidate at the 992px boundary.
		desktopMounted = window.innerWidth >= 992;
	});
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
		<VehicleBadge {vehicle} />
		<DesktopVehicleActions slug={vehicle.slug} title={vehicle.shortTitle} />
	</div>
	<div class="image">
		<a
			href={i18n.href(resolve('/inventory/[slug]', { slug: vehicle.slug }))}
			aria-label={i18n.t('pattern.502146f2983d', { v0: vehicle.shortTitle, v1: vehicle.year })}
		>
			<img
				class="card--img"
				src={i18n.asset(image.width && !desktopMounted ? desktopOnlyImagePlaceholder : image.src)}
				srcset={desktopVehicleImageSrcset(vehicle.image, i18n.asset, !desktopMounted)}
				sizes={desktopMounted
					? '(min-width: 1440px) 248px, (min-width: 1200px) calc((100vw - 140px) / 4), calc((100vw - 108px) / 4)'
					: '(min-width: 1440px) 248px, (min-width: 1200px) calc((100vw - 140px) / 4), (min-width: 992px) calc((100vw - 108px) / 4), 1px'}
				alt={vehicle.shortTitle}
				width={image.width}
				height={image.height}
				data-daynight-image-fallback
				loading={index < 4 ? 'eager' : 'lazy'}
				decoding="async"
				{@attach imageFallbackAttachment}
			/>
		</a>
		{#if hasRealPhotos && vehicle.gallery.length > 1}
			<p class="desktop-catalogue-card__photos">
				<img src={i18n.asset('/assets/icons/picture.svg')} alt="" aria-hidden="true" />
				{vehicle.gallery.length}
			</p>
		{/if}
	</div>
	<div class="content">
		<DesktopVehicleCardDetails {vehicle} />
	</div>
</div>

<style>
	.desktop-catalogue-card {
		background: #fff;
		border: 1px solid var(--discovery-control-border, #d9dde1);
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		height: 100%;
		min-width: 0;
		overflow: hidden;
		position: relative;
	}
	.desktop-catalogue-card:is(:hover, :focus-within) {
		border-color: var(--discovery-border-hover, #9ca3af);
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: start;
		gap: 8px;
		position: absolute;
		inset: 12px 12px auto;
		z-index: 1;
	}
	.image {
		aspect-ratio: 4 / 3;
		background: #e7e9eb;
		flex: none;
		overflow: hidden;
		position: relative;
	}
	.image > a {
		display: block;
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.card--img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.content {
		display: flex;
		flex-direction: column;
		padding: 16px;
		position: relative;
		flex: 1;
		min-width: 0;
	}
	.desktop-catalogue-card__photos {
		display: inline-flex;
		align-items: center;
		position: absolute;
		right: 12px;
		bottom: 12px;
		gap: 5px;
		padding: 4px 8px;
		margin: 0;
		border-radius: 6px;
		background: #171b1e;
		color: #fff;
		font: var(--sa-weight-medium) var(--sa-text-caption)/1.4 var(--sa-font);
	}
	.desktop-catalogue-card__photos img {
		width: 16px;
		height: 16px;
	}
	.desktop-catalogue-card a:focus-visible {
		outline: 2px solid var(--desktop-focus, #171b1e);
		outline-offset: 3px;
	}
</style>
