<script lang="ts">
	import { resolve } from '$app/paths';
	import { Calendar, Cog, Fuel, Gauge } from '@lucide/svelte';

	type MobileVehicleCardData = {
		slug: string;
		image: string;
		title: string;
		brand: string;
		priceLabel: string;
		monthlyLabel: string;
		mileageLabel: string;
		year: string | number;
		fuel: string;
		transmission: string;
		tag?: string;
	};

	let {
		card,
		image = card.image,
		fallbackImage = '/assets/images/card/card-48.jpg'
	}: { card: MobileVehicleCardData; image?: string; fallbackImage?: string } = $props();

	const useFallbackImage = (event: Event) => {
		const element = event.currentTarget as HTMLImageElement;
		if (!element.src.endsWith(fallbackImage)) element.src = fallbackImage;
	};
</script>

<a
	class="mobile-vehicle-card"
	href={resolve('/inventory/[slug]', { slug: card.slug })}
	aria-label={card.title}
>
	<div class="mobile-vehicle-card__image">
		<img
			src={image}
			alt={card.title}
			width="660"
			height="440"
			loading="lazy"
			decoding="async"
			onerror={useFallbackImage}
		/>
		{#if card.tag}<span>{card.tag}</span>{/if}
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

	.mobile-vehicle-card__image span {
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
	@media (max-width: 430px) {
		.mobile-vehicle-card__body li :global(svg) {
			display: none;
		}
	}
</style>
