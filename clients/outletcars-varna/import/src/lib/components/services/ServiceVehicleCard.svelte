<script lang="ts">
	import { resolve } from '$app/paths';
	import { Calendar, Cog, Fuel, Gauge } from '@lucide/svelte';
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';
	let { card }: { card: HomeFiveVehicleCardData & { tag?: string } } = $props();
</script>

<article class="daynight-inventory-mobile-card">
	<a
		class="daynight-inventory-mobile-card__image"
		href={resolve('/inventory/[slug]', { slug: card.slug })}
	>
		<img
			src={card.image}
			alt={card.title}
			width="660"
			height="440"
			loading="lazy"
			decoding="async"
		/>
		{#if card.tag}<span>{card.tag}</span>{/if}
	</a>
	<div class="daynight-inventory-mobile-card__body">
		<p>{card.brand}</p>
		<h2>
			<a href={resolve('/inventory/[slug]', { slug: card.slug })}>{card.title}</a>
		</h2>
		<strong>{card.priceLabel}</strong>
		<small>{card.monthlyLabel}</small>
		<ul>
			<li><Gauge size={14} strokeWidth={2} aria-hidden="true" />{card.mileageLabel}</li>
			<li><Calendar size={14} strokeWidth={2} aria-hidden="true" />{card.year}</li>
			<li><Fuel size={14} strokeWidth={2} aria-hidden="true" />{card.fuel}</li>
			<li><Cog size={14} strokeWidth={2} aria-hidden="true" />{card.transmission}</li>
		</ul>
	</div>
</article>

<style>
	.daynight-inventory-mobile-card {
		display: grid;
		width: 100%;
		max-width: 100%;
		min-width: 0;
		grid-template-columns: clamp(96px, 32vw, 132px) minmax(0, 1fr);
		min-height: 154px;
		overflow: hidden;
		border: 0;
		border-radius: 8px;
		background: #ffffff;
		box-shadow: none;
	}

	.daynight-inventory-mobile-card__image {
		position: relative;
		display: block;
		min-height: 154px;
		overflow: hidden;
	}

	.daynight-inventory-mobile-card__image img {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 154px;
		object-fit: cover;
	}

	.daynight-inventory-mobile-card__image span {
		position: absolute;
		top: 8px;
		left: 8px;
		min-height: 24px;
		border-radius: 999px;
		background: var(--bc-accent);
		padding: 0 8px;
		color: #ffffff;
		font-size: 10px;
		font-weight: 700;
		line-height: 24px;
		text-transform: uppercase;
	}

	.daynight-inventory-mobile-card__body {
		display: grid;
		min-width: 0;
		align-content: start;
		overflow: visible;
		padding: 10px 10px 10px 11px;
	}

	.daynight-inventory-mobile-card__body p {
		margin: 0 0 2px;
		color: #637184;
		font-size: 11px;
		font-weight: 600;
		line-height: 13px;
		text-transform: uppercase;
	}

	.daynight-inventory-mobile-card__body h2 {
		min-width: 0;
		margin: 0 0 5px;
		overflow: visible;
		color: #101010;
		font-size: 17px;
		font-weight: 650;
		line-height: 22px;
		overflow-wrap: anywhere;
	}

	.daynight-inventory-mobile-card__body h2 a {
		display: inline;
		min-width: 0;
		overflow: visible;
		color: inherit;
		font-size: inherit;
		font-weight: inherit;
		line-height: inherit;
		overflow-wrap: anywhere;
	}

	.daynight-inventory-mobile-card__body strong {
		color: var(--bc-accent);
		font-size: 20px;
		font-weight: 700;
		line-height: 24px;
	}

	.daynight-inventory-mobile-card__body small {
		margin-bottom: 7px;
		color: #67717d;
		font-size: 11px;
		font-weight: 600;
		line-height: 14px;
	}

	.daynight-inventory-mobile-card__body ul {
		display: grid;
		grid-template-columns: minmax(max-content, 1fr) minmax(0, 1fr);
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.daynight-inventory-mobile-card__body li {
		display: flex;
		min-width: 0;
		min-height: 36px;
		align-items: center;
		justify-content: flex-start;
		gap: 4px;
		overflow: visible;
		border-radius: 8px;
		background: var(--bc-surface-soft);
		padding: 6px;
		color: #4b5563;
		font-size: 12px;
		font-weight: 600;
		line-height: 1.35;
		overflow-wrap: normal;
		text-align: left;
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}

	.daynight-inventory-mobile-card__body li :global(svg) {
		flex: 0 0 auto;
	}

	@media (max-width: 399px) {
		.daynight-inventory-mobile-card {
			grid-template-columns: clamp(96px, calc(100vw - 251px), 124px) minmax(0, 1fr);
		}
	}

	@media (max-width: 359px) {
		.daynight-inventory-mobile-card__body li :global(svg) {
			display: none;
		}
	}
</style>
