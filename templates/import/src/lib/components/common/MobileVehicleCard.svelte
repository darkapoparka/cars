<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { nativeMessage } from '$lib/i18n/native';
	import { page } from '$app/state';
	const nt = (key: import('$lib/i18n/native').NativeKey) =>
		nativeMessage(page.data.locale === 'en' ? 'en' : 'bg', key);
	import { imageFallback } from '$lib/browser/image-fallback';
	import { linkHref as resolve } from '$lib/utils/links';
	import Calendar from '@lucide/svelte/icons/calendar';
	import CarFront from '@lucide/svelte/icons/car-front';
	import Cog from '@lucide/svelte/icons/cog';
	import Fuel from '@lucide/svelte/icons/fuel';
	import Gauge from '@lucide/svelte/icons/gauge';

	import type { VehicleCardSummary as MobileVehicleCardData } from '$lib/domain/vehicle-card';

	let {
		card,
		image = card.image,
		priority = false
	}: { card: MobileVehicleCardData; image?: string; priority?: boolean } = $props();

	let imageFailed = $state(false);
</script>

<a
	class="mobile-vehicle-card"
	href={resolve('/inventory/' + encodeURIComponent(card.slug))}
	aria-label={card.title}
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
				src={assetHref(image)}
				alt={card.title}
				width="660"
				height="440"
				sizes="(max-width: 767px) 50vw, 330px"
				loading={priority ? 'eager' : 'lazy'}
				fetchpriority={priority ? 'high' : 'auto'}
				decoding="async"
				onerror={() => (imageFailed = true)}
			/>
		{/if}
		{#if card.tag}<span class="mobile-vehicle-card__tag">{card.tag}</span>{/if}
	</div>
	<div class="mobile-vehicle-card__body">
		<p>{card.brand}</p>
		<h2>{card.title}</h2>
		<div class="mobile-vehicle-card__prices">
			<strong>{card.priceLabel}</strong>
			<small>{card.monthlyLabel}</small>
		</div>
		<ul>
			<li>
				<Gauge size={14} strokeWidth={2} aria-hidden="true" /><span>{card.mileageLabel}</span>
			</li>
			<li><Calendar size={14} strokeWidth={2} aria-hidden="true" /><span>{card.year}</span></li>
			<li><Fuel size={14} strokeWidth={2} aria-hidden="true" /><span>{card.fuel}</span></li>
			<li><Cog size={14} strokeWidth={2} aria-hidden="true" /><span>{card.transmission}</span></li>
		</ul>
	</div>
</a>

<style>
	.mobile-vehicle-card {
		display: grid;
		width: 100%;
		min-width: 0;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		min-height: 154px;
		overflow: hidden;
		border-radius: var(--bc-radius-lg);
		background: var(--bc-white);
	}

	.mobile-vehicle-card__image {
		position: relative;
		display: block;
		min-height: 154px;
		overflow: hidden;
		text-decoration: none !important;
	}

	.mobile-vehicle-card__image img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		min-height: 154px;
		object-fit: cover;
	}

	.mobile-vehicle-card__tag {
		position: absolute;
		display: inline-flex;
		align-items: center;
		top: var(--bc-space-2);
		left: var(--bc-space-2);
		min-height: 24px;
		border-radius: var(--bc-radius-pill);
		background: var(--bc-accent);
		padding: 0 var(--bc-space-2);
		color: var(--bc-white);
		font-size: var(--bc-mobile-stat);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-stat-leading);
		text-transform: uppercase;
	}

	.mobile-vehicle-card__placeholder {
		position: absolute;
		inset: 0;
		display: grid;
		place-content: center;
		justify-items: center;
		gap: var(--bc-space-2);
		background: var(--bc-surface-soft);
		color: var(--bc-muted);
		padding: var(--bc-space-3);
		text-align: center;
	}

	.mobile-vehicle-card__placeholder span {
		max-width: 14ch;
		font-size: var(--bc-mobile-meta);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-meta-leading);
	}

	.mobile-vehicle-card__body {
		display: grid;
		min-width: 0;
		align-content: start;
		padding: var(--bc-space-2) var(--bc-space-2) var(--bc-space-2) var(--bc-space-3);
	}

	.mobile-vehicle-card__body p {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin: 0 0 2px;
		color: var(--bc-muted);
		font-size: var(--bc-mobile-stat);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-stat-leading);
		text-transform: uppercase;
	}

	.mobile-vehicle-card__body h2 {
		min-width: 0;
		margin: 0 0 var(--bc-space-1);
		color: var(--bc-ink);
		font-size: var(--bc-mobile-card-title);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-mobile-card-title-leading);
		overflow-wrap: anywhere;
	}

	.mobile-vehicle-card__body strong {
		color: var(--bc-accent);
		font-family: var(--bc-font-heading);
		font-size: var(--bc-mobile-card-price);
		font-weight: var(--bc-weight-emphasis);
		line-height: var(--bc-space-6);
		white-space: nowrap;
	}
	.mobile-vehicle-card__prices {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 4px;
		margin-bottom: var(--bc-space-2);
		min-width: 0;
	}

	.mobile-vehicle-card__body small {
		color: var(--bc-muted);
		font-size: var(--bc-mobile-stat);
		font-weight: var(--bc-weight-body);
		font-variant-numeric: tabular-nums;
		line-height: var(--bc-mobile-stat-leading);
		white-space: nowrap;
	}

	.mobile-vehicle-card__body ul {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
		gap: 4px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.mobile-vehicle-card__body li {
		display: flex;
		min-width: 0;
		min-height: var(--bc-mobile-stat-height);
		align-items: center;
		gap: var(--bc-space-1);
		border-radius: var(--bc-radius-md);
		background: var(--bc-surface-soft);
		padding: 4px 2px;
		color: var(--bc-copy);
		font-size: var(--bc-mobile-stat);
		font-weight: var(--bc-weight-body);
		line-height: var(--bc-mobile-stat-leading);
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}

	.mobile-vehicle-card__body li :global(svg) {
		flex: 0 0 auto;
	}
	.mobile-vehicle-card__body li span {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.mobile-vehicle-card {
		color: var(--bc-ink);
		text-decoration: none;
	}
	.mobile-vehicle-card:focus-visible {
		outline: 3px solid var(--bc-focus);
		outline-offset: 3px;
	}
	.mobile-vehicle-card__image {
		background: var(--bc-surface-soft);
	}
	.mobile-vehicle-card__body h2 {
		display: block;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		min-height: var(--bc-mobile-card-title-leading);
		line-height: var(--bc-mobile-card-title-leading);
		margin-bottom: 4px;
	}
	.mobile-vehicle-card__body li {
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: var(--bc-mobile-stat);
		gap: 3px;
		line-height: var(--bc-mobile-stat-leading);
		font-weight: var(--bc-weight-body);
	}
	@media (hover: none) and (pointer: coarse) {
		.mobile-vehicle-card:active {
			background: var(--bc-surface-hover);
		}

		.mobile-vehicle-card:active .mobile-vehicle-card__image img {
			opacity: 0.96;
		}
	}

	@media (max-width: 340px) {
		.mobile-vehicle-card__prices {
			gap: 6px;
			margin-bottom: 10px;
		}

		.mobile-vehicle-card__body small {
			font-size: 11px;
			line-height: 14px;
		}

		.mobile-vehicle-card__body ul {
			gap: 3px;
		}

		.mobile-vehicle-card__body li {
			min-height: 27px;
			padding: 3px;
		}
	}

	@media (max-width: 430px) {
		.mobile-vehicle-card__body li :global(svg) {
			display: none;
		}
	}
</style>
