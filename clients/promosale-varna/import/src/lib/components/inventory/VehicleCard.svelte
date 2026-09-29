<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { imageFallback } from '$lib/browser/image-fallback';
	import Heart from '@lucide/svelte/icons/heart';
	import ArrowLeftRight from '@lucide/svelte/icons/arrow-left-right';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import type { AuxeroInventoryVehicleCard } from '$lib/domain/vehicle-card';
	import { linkHref } from '$lib/utils/links';
	import Action from '$lib/components/common/Action.svelte';
	let {
		card,
		priority = false,
		english = false
	}: { card: AuxeroInventoryVehicleCard; priority?: boolean; english?: boolean } = $props();
	const garage = getGarageContext();
	const href = $derived(
		'/inventory/' + encodeURIComponent(card.slug) + (english ? '?lang=en' : '')
	);
</script>

<article class="site-vehicle-card">
	<div class="site-vehicle-card__media">
		<a href={linkHref(href)} aria-label={card.title}
			><img
				use:imageFallback
				src={assetHref(card.image)}
				alt={card.title}
				width="660"
				height="440"
				loading={priority ? 'eager' : 'lazy'}
				fetchpriority={priority ? 'high' : 'auto'}
				decoding="async"
			/></a
		>
		<span class="site-vehicle-card__mileage">{card.mileageLabel}</span>
		<button
			class="site-vehicle-card__favorite"
			type="button"
			aria-label={(english ? 'Save ' : 'Запази ') + card.title}
			aria-pressed={garage.isFavorite(card.slug)}
			onclick={() => garage.toggleFavorite(card.slug)}
			><Heart
				size={19}
				fill={garage.isFavorite(card.slug) ? 'currentColor' : 'none'}
				aria-hidden="true"
			/></button
		>
	</div>
	<div class="site-vehicle-card__body">
		<h2><a href={linkHref(href)} title={card.title}>{card.title}</a></h2>
		<ul aria-label={english ? 'Specifications' : 'Характеристики'}>
			<li>{card.year}</li>
			<li>{card.fuel}</li>
			<li>{card.transmission}</li>
		</ul>
		<div class="site-vehicle-card__price">
			<strong>{card.priceLabel}</strong>{#if card.monthlyLabel}<a
					href={linkHref(
						'/financing?vehicle=' + encodeURIComponent(card.slug) + (english ? '&lang=en' : '')
					)}
					aria-label={(english ? 'Illustrative financing: ' : 'Ориентировъчно финансиране: ') +
						card.monthlyLabel}>{card.monthlyLabel}</a
				>{/if}
		</div>
		<div class="site-vehicle-card__actions">
			<Action {href}>{english ? 'View details' : 'Виж детайли'}</Action><button
				type="button"
				aria-label={(english ? 'Compare ' : 'Сравни ') + card.title}
				aria-pressed={garage.isCompared(card.slug)}
				onclick={() => garage.toggleCompare(card.slug)}
				><ArrowLeftRight size={19} aria-hidden="true" /></button
			>
		</div>
	</div>
</article>

<style>
	.site-vehicle-card {
		display: flex;
		flex-direction: column;
		min-width: 0;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface-raised);
		overflow: hidden;
		transition:
			border-color var(--bc-motion-fast),
			box-shadow var(--bc-motion-fast);
	}
	.site-vehicle-card:hover,
	.site-vehicle-card:focus-within {
		border-color: var(--bc-border-strong);
		box-shadow: var(--bc-shadow-card);
	}
	.site-vehicle-card__media {
		position: relative;
		aspect-ratio: 1.5;
		background: var(--bc-card-media);
	}
	.site-vehicle-card__media > a {
		position: absolute;
		inset: 0;
		display: block;
	}
	.site-vehicle-card__media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.site-vehicle-card__mileage {
		position: absolute;
		top: var(--bc-space-2);
		left: var(--bc-space-2);
		background: var(--bc-white);
		border-radius: var(--bc-radius-sm);
		padding: var(--bc-space-1) var(--bc-space-2);
		font-size: var(--bc-text-meta);
		color: var(--bc-ink);
		box-shadow: var(--bc-shadow-subtle);
	}
	.site-vehicle-card__favorite {
		position: absolute;
		top: var(--bc-space-1);
		right: var(--bc-space-1);
		width: var(--bc-control-height-standard);
		height: var(--bc-control-height-standard);
		border: 0;
		border-radius: var(--bc-radius-pill);
		background: radial-gradient(circle at center, var(--bc-white) 0 15px, transparent 16px);
		color: var(--bc-ink);
		display: grid;
		place-items: center;
	}
	.site-vehicle-card__favorite[aria-pressed='true'] {
		color: var(--bc-accent);
	}
	.site-vehicle-card__body {
		padding: var(--bc-space-4);
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--bc-space-3);
		min-width: 0;
	}
	h2 {
		margin: 0;
		font-family: var(--bc-font-heading);
		font-size: var(--bc-text-h5);
		font-weight: var(--bc-weight-heading);
		line-height: var(--bc-leading-h5);
	}
	h2 a {
		display: block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-decoration: none;
		color: var(--bc-ink);
	}
	ul {
		display: flex;
		flex-wrap: wrap;
		gap: var(--bc-space-1);
		list-style: none;
		padding: 0;
		margin: 0;
	}
	li {
		border-radius: var(--bc-radius-xs);
		background: var(--bc-surface);
		color: var(--bc-copy);
		padding: 2px var(--bc-space-2);
		font-size: var(--bc-text-meta);
		line-height: var(--bc-leading-meta);
	}
	.site-vehicle-card__price {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--bc-space-1) var(--bc-space-2);
		margin-top: auto;
	}
	strong {
		color: var(--bc-ink);
		font: var(--bc-weight-heading) var(--bc-text-h4)/var(--bc-leading-h4) var(--bc-font-heading);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.site-vehicle-card__price a {
		font-size: var(--bc-text-meta);
		color: var(--bc-copy);
		text-decoration: none;
	}
	.site-vehicle-card__price a:hover {
		text-decoration: underline;
	}
	.site-vehicle-card__actions {
		display: flex;
		gap: var(--bc-space-2);
	}
	.site-vehicle-card__actions :global(.site-action) {
		flex: 1;
	}
	.site-vehicle-card__actions > button {
		display: grid;
		place-items: center;
		width: var(--bc-control-height-standard);
		border: 1px solid transparent;
		border-radius: var(--bc-radius-control);
		background: var(--bc-control);
		color: var(--bc-muted);
	}
	.site-vehicle-card__actions > button[aria-pressed='true'] {
		border-color: var(--bc-accent);
		color: var(--bc-accent);
	}
	@media (min-width: 768px) {
		.site-vehicle-card {
			container-type: inline-size;
			container-name: vehicle-card;
		}
		.site-vehicle-card__actions :global(.site-action) {
			min-width: 0;
			min-height: var(--bc-control-height-secondary);
			padding-inline: var(--bc-space-3);
			border-radius: var(--bc-radius-md);
			font-size: var(--bc-text-control);
		}
		.site-vehicle-card__actions > button {
			flex: 0 0 var(--bc-control-height-secondary);
			width: var(--bc-control-height-secondary);
			border-radius: var(--bc-radius-md);
			color: var(--bc-copy);
		}
		.site-vehicle-card__actions > button:hover {
			background: var(--bc-bg-strong);
		}
		@container vehicle-card (max-width: 280px) {
			.site-vehicle-card__body {
				padding: var(--bc-space-3);
			}
			.site-vehicle-card__actions :global(.site-action) {
				min-height: var(--bc-control-height-compact);
				font-size: var(--bc-text-label);
			}
			.site-vehicle-card__actions > button {
				flex-basis: var(--bc-control-height-compact);
				width: var(--bc-control-height-compact);
			}
		}
	}
</style>
