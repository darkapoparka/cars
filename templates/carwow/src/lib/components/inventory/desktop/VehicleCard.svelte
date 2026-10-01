<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { fromAction } from 'svelte/attachments';
	import { getDayNightVehicleCondition, placeholderImageSlugs } from '$lib/data/daynight-vehicles';
	import type { InventoryListVehicle } from '$lib/types/inventory';
	import VehicleBadge from './VehicleBadge.svelte';
	import VehicleMetaRow from './VehicleMetaRow.svelte';
	import VehiclePriceRow from './VehiclePriceRow.svelte';
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
					? '(min-width: 1241px) calc((100vw - 160px) / 4), calc((100vw - 120px) / 3)'
					: '(min-width: 1241px) calc((100vw - 160px) / 4), (min-width: 992px) calc((100vw - 120px) / 3), 1px'}
				alt={vehicle.shortTitle}
				width={image.width}
				height={image.height}
				data-daynight-image-fallback
				loading={index < 4 ? 'eager' : 'lazy'}
				decoding="async"
				{@attach imageFallbackAttachment}
			/>
		</a>
	</div>
	<div class="content">
		<div class="bottom">
			<p class="category text-white">
				<a
					href={i18n.href(resolve('/inventory/[slug]', { slug: vehicle.slug }))}
					class="text-xs text-white"
					aria-label={`${i18n.spec(vehicle.transmission)} - ${vehicle.shortTitle} ${vehicle.year}`}
					>{i18n.spec(vehicle.transmission)}</a
				>
			</p>
			<div class="flex items-center gap-8">
				{#if hasRealPhotos}
					<p class="category text-white uppercase">
						<img
							src={i18n.asset('/assets/icons/picture.svg')}
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
				href={i18n.href(resolve('/inventory/[slug]', { slug: vehicle.slug }))}
				title={`${vehicle.shortTitle} ${vehicle.year}`}>{vehicle.shortTitle}</a
			>
		</p>
		<VehicleMetaRow {vehicle} styleClass="style2 mb-10" />
		<VehiclePriceRow {vehicle} />
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
		gap: 12px;
		padding: 16px;
		position: relative;
		flex: 1;
		min-width: 0;
	}
	.bottom {
		display: flex;
		justify-content: space-between;
		position: absolute;
		inset: auto 12px calc(100% + 12px);
	}
	.category {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		min-height: 26px;
		padding: 4px 8px;
		border-radius: 6px;
		background: #171b1e;
		color: #fff;
		font-size: var(--sa-text-caption);
		line-height: 18px;
	}
	.category a {
		color: inherit;
		font: inherit;
	}
	.category img {
		width: 16px;
		height: 16px;
	}
	.desktop-catalogue-card .card-box__title {
		margin: 0;
		min-height: 47px;
		font: var(--sa-weight-semibold) var(--sa-text-lg)/1.3 var(--sa-font);
		color: var(--sa-ink);
	}
	.card-box__title a {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		color: inherit;
		font: inherit;
	}
	.desktop-catalogue-card :global(.tag.style2) {
		margin: 0;
	}
	.desktop-catalogue-card :global(.card-box__price) {
		border-top: 1px solid #eaecf0;
		margin: auto 0 0;
		padding-top: 12px;
	}
	.desktop-catalogue-card a:focus-visible {
		outline: 2px solid var(--desktop-focus, #171b1e);
		outline-offset: 3px;
	}
</style>
