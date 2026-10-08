<script lang="ts">
	import { page } from '$app/state';
	import { vehicleImageDelivery } from '$lib/utils/vehicle-images';
	import { nativeMessage } from '$lib/i18n/native';
	import { imageFallback } from '$lib/browser/image-fallback';
	import { linkHref as resolve } from '$lib/utils/links';
	import {
		compactCardFuel,
		compactCardMileage,
		compactCardTransmission
	} from '$lib/domain/vehicle-card-labels';
	import type { VehicleCardSummary } from '$lib/domain/vehicle-card';
	import Calendar from '@lucide/svelte/icons/calendar';
	import CarFront from '@lucide/svelte/icons/car-front';
	import Fuel from '@lucide/svelte/icons/fuel';
	import Gauge from '@lucide/svelte/icons/gauge';

	let {
		card,
		image = card.image,
		priority = false,
		variant = 'inventory'
	}: {
		card: VehicleCardSummary;
		image?: string;
		priority?: boolean;
		variant?: 'inventory' | 'import';
	} = $props();

	const locale = $derived(page.data.locale === 'en' ? 'en' : 'bg');
	const nt = (key: import('$lib/i18n/native').NativeKey) => nativeMessage(locale, key);
	let imageFailed = $state(false);
	const deliveryImage = $derived(vehicleImageDelivery(image));
	const mileage = $derived(compactCardMileage(card.mileageLabel, locale));
</script>

<a
	class="mobile-vehicle-card"
	class:mobile-vehicle-card--import={variant === 'import'}
	href={resolve('/inventory/' + encodeURIComponent(card.slug))}
>
	<div class="mobile-vehicle-card__image" class:image-failed={imageFailed}>
		{#if imageFailed}
			<div class="mobile-vehicle-card__placeholder" role="img" aria-label={nt('ui34') + card.title}>
				<CarFront size={28} strokeWidth={1.8} aria-hidden="true" />
				<span>{nt('ui35')}</span>
			</div>
		{:else}
			<img
				use:imageFallback
				src={deliveryImage.src}
				srcset={deliveryImage.srcset}
				alt={card.title}
				width="660"
				height="440"
				sizes="(max-width: 767px) 42vw, 200px"
				loading={priority ? 'eager' : 'lazy'}
				fetchpriority={priority ? 'high' : 'auto'}
				decoding="async"
				onerror={() => (imageFailed = true)}
			/>
		{/if}
		{#if card.tag}<span class="mobile-vehicle-card__tag">{card.tag}</span>{/if}
	</div>
	<div class="mobile-vehicle-card__body">
		{#if !card.title.toLocaleLowerCase().startsWith(card.brand.toLocaleLowerCase())}<p
				class="mobile-vehicle-card__brand"
			>
				{card.brand}
			</p>{/if}
		<h2>{card.title}</h2>
		<div class="mobile-vehicle-card__prices">
			<strong>{card.priceLabel}</strong>
			{#if card.monthlyLabel}<small>{card.monthlyLabel}</small>{/if}
		</div>
		<ul aria-label={locale === 'en' ? 'Specifications' : 'Характеристики'}>
			<li aria-label={(locale === 'en' ? 'Year: ' : 'Година: ') + card.year}>
				<Calendar size={13} strokeWidth={1.8} aria-hidden="true" /><span>{card.year}</span>
			</li>
			{#if variant === 'inventory'}
				<li title={card.fuel} aria-label={(locale === 'en' ? 'Fuel: ' : 'Гориво: ') + card.fuel}>
					<Fuel size={13} strokeWidth={1.8} aria-hidden="true" /><span
						>{compactCardFuel(card.fuel)}</span
					>
				</li>
				<li
					class="mobile-vehicle-card__transmission"
					title={card.transmission}
					aria-label={(locale === 'en' ? 'Transmission: ' : 'Скоростна кутия: ') +
						card.transmission}
				>
					<span>{compactCardTransmission(card.transmission)}</span>
				</li>
				<li
					class="mobile-vehicle-card__distance"
					title={card.mileageLabel}
					aria-label={(locale === 'en' ? 'Mileage: ' : 'Пробег: ') + card.mileageLabel}
				>
					<span>{mileage}</span>
				</li>
			{:else}
				<li
					class="mobile-vehicle-card__mileage"
					title={card.mileageLabel}
					aria-label={(locale === 'en' ? 'Mileage: ' : 'Пробег: ') + card.mileageLabel}
				>
					<Gauge size={13} strokeWidth={1.8} aria-hidden="true" /><span>{mileage}</span>
				</li>
			{/if}
		</ul>
	</div>
</a>

<style>
	.mobile-vehicle-card {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		min-width: 0;
		overflow: hidden;
		border-radius: var(--bc-radius-lg);
		background: var(--bc-white);
		color: var(--bc-ink);
		text-decoration: none;
	}
	.mobile-vehicle-card:focus-visible {
		outline: 3px solid var(--bc-focus);
		outline-offset: 3px;
	}
	.mobile-vehicle-card__image {
		position: relative;
		flex: 1 0 42%;
		aspect-ratio: 1.5;
		min-width: 0;
		min-height: 144px;
		overflow: hidden;
		background: var(--bc-surface-soft);
	}
	.mobile-vehicle-card__image img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.mobile-vehicle-card__tag {
		position: absolute;
		left: 8px;
		max-width: calc(100% - 16px);
		display: flex;
		align-items: center;
		gap: 4px;
		border-radius: 6px;
		background: var(--bc-white);
		padding: 4px 7px;
		color: var(--bc-copy);
		font-size: 0.6875rem;
		font-weight: var(--bc-weight-body);
		line-height: 1.273;
	}
	.mobile-vehicle-card__tag {
		top: 8px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.mobile-vehicle-card__placeholder {
		position: absolute;
		inset: 0;
		display: grid;
		place-content: center;
		justify-items: center;
		gap: var(--bc-space-2);
		padding: var(--bc-space-3);
		color: var(--bc-muted);
		text-align: center;
	}
	.mobile-vehicle-card__placeholder span {
		font-size: var(--bc-mobile-meta);
		line-height: var(--bc-mobile-meta-leading);
	}
	.mobile-vehicle-card__body {
		display: flex;
		flex: 1 0 58%;
		min-width: min(100%, 10rem);
		flex-direction: column;
		gap: 8px;
		padding: 12px;
	}
	.mobile-vehicle-card__brand {
		margin: 0;
		color: var(--bc-muted);
		font-size: 0.6875rem;
		line-height: 1.273;
	}
	h2 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		min-width: 0;
		overflow: hidden;
		overflow-wrap: anywhere;
		margin: 0;
		color: var(--bc-ink);
		font-size: var(--bc-mobile-card-title);
		font-weight: var(--bc-weight-heading);
		line-height: 1.2223;
	}
	.mobile-vehicle-card__prices {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 2px 8px;
		min-width: 0;
	}
	strong {
		color: var(--bc-accent);
		font-family: var(--bc-font-heading);
		font-size: var(--bc-mobile-card-price);
		font-weight: var(--bc-weight-emphasis);
		line-height: 1.2;
		font-variant-numeric: tabular-nums;
		min-width: 0;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	small {
		color: var(--bc-muted);
		font-size: var(--bc-mobile-stat);
		line-height: 1.3334;
		white-space: nowrap;
	}
	ul {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 6px;
		margin: auto 0 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 5px;
		border-radius: 6px;
		background: var(--bc-surface-soft);
		padding: 4px 7px;
		color: var(--bc-copy);
		font-size: var(--bc-mobile-stat);
		line-height: 1.3334;
	}
	li :global(svg) {
		flex: 0 0 auto;
		color: var(--bc-muted);
	}
	li span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.mobile-vehicle-card__transmission,
	.mobile-vehicle-card__distance,
	.mobile-vehicle-card__mileage {
		justify-content: center;
		font-variant-numeric: tabular-nums;
	}
	.mobile-vehicle-card--import ul {
		grid-template-columns: max-content minmax(0, 1fr);
	}
	@media (hover: none) and (pointer: coarse) {
		.mobile-vehicle-card:active {
			background: var(--bc-surface-hover);
		}
	}
	@media (max-width: 340px) {
		.mobile-vehicle-card__body {
			padding: 10px;
		}
		li {
			gap: 4px;
			padding-inline: 6px;
		}
	}
</style>
