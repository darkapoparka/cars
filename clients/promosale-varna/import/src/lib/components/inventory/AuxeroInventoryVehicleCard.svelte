<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroInventoryVehicleCard } from '$lib/auxero/inventory';
	import { daynightAssets, daynightContact } from '$lib/data/daynight';
	import { getMessages, type VehicleCardCopy } from '$lib/i18n/messages';
	import { getGarageContext } from '$lib/state/garage.svelte';

	let {
		card,
		copy = getMessages('bg').inventory.vehicleCard,
		variant = 'grid'
	}: {
		card: AuxeroInventoryVehicleCard;
		copy?: VehicleCardCopy;
		variant?: 'grid' | 'list';
	} = $props();

	const garage = getGarageContext();
	let isSaved = $derived(garage.isFavorite(card.slug));

	const applyCardImageFallback = (image: HTMLImageElement | undefined) => {
		if (!image || image.src.endsWith(daynightAssets.hero)) {
			return;
		}

		image.src = daynightAssets.hero;
	};

	const handleCardImageError = (event: Event) => {
		applyCardImageFallback(
			event.currentTarget instanceof HTMLImageElement ? event.currentTarget : undefined
		);
	};

	const handleFavoriteActivation = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		garage.toggleFavorite(card.slug);
	};

	const handleCompareActivation = () => {
		garage.addCompare(card.slug);
	};
</script>

{#if variant === 'list'}
	<div class="card-box card-box-style-9 daynight-no-image-zoom" data-daynight-slug={card.slug}>
		<div class="top">
			<p class={`${card.highlightClass} highlight text-white`}>{card.tag}</p>
			<button
				type="button"
				class={['heart daynight-favorite', isSaved && 'is-active']}
				aria-label={`${copy.savePrefix} ${card.title}`}
				aria-pressed={isSaved}
				onclick={handleFavoriteActivation}
			>
				{@render heartIcon()}
			</button>
		</div>
		<div class="bottom">
			<p class="category text-white uppercase">
				<a
					href={resolve('/inventory/[slug]', { slug: card.slug })}
					class="text-xs text-white uppercase">{card.brand}</a
				>
			</p>
			<div class="flex items-center gap-8">
				<p class="category text-white uppercase">
					<img src="/assets/icons/picture.svg" alt={copy.photosAlt} />
					{card.imagesCount}
				</p>
				{#if card.videoCount > 0}
					<p class="category text-white uppercase">
						<img src="/assets/icons/play.svg" alt={copy.videoAlt} />
						{card.videoCount}
					</p>
				{/if}
			</div>
		</div>
		<div class="image">
			<a href={resolve('/inventory/[slug]', { slug: card.slug })}>
				<img
					class="card--img"
					src={card.image}
					alt={card.title}
					width="660"
					height="440"
					loading="lazy"
					decoding="async"
					onerror={handleCardImageError}
				/>
			</a>
		</div>
		<div class="content">
			<h2 class="h6 card-box__title mb-4">
				<a href={resolve('/inventory/[slug]', { slug: card.slug })}>{card.title}</a>
			</h2>
			<p class="text-secondary clamp-1 clamp mb-8">
				{card.description || daynightContact.appointmentNote}
			</p>
			{@render cardMeta(card, 'tag style3 mb-14')}
			<p class="h6 card-box__price mb-10 flex items-center justify-between gap-8">
				{card.priceLabel.replaceAll('EUR', '€')}
			</p>
			<div class="flex gap-32">
				<button
					type="button"
					class="compare-details btn btn-small open-modal"
					data-modal-id="#CompareModal"
					data-daynight-compare={card.slug}
					aria-label={`${copy.compare}: ${card.title}`}
					onclick={handleCompareActivation}
				>
					{@render compareIcon()}
					{copy.compare}
				</button>
				<a href={resolve('/inventory/[slug]', { slug: card.slug })} class="view-details">
					{copy.viewDetails}
					<img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt={copy.viewDetails} />
				</a>
			</div>
		</div>
	</div>
{:else}
	<div
		class="card-box card-box-style-1 daynight-no-image-zoom wow fadeIn"
		data-wow-delay={card.delay}
		data-daynight-slug={card.slug}
	>
		<div class="top">
			<p class={`${card.highlightClass} highlight text-white`}>{card.mileageLabel}</p>
			<button
				type="button"
				class={['heart daynight-favorite', isSaved && 'is-active']}
				aria-label={`${copy.savePrefix} ${card.title}`}
				aria-pressed={isSaved}
				onclick={handleFavoriteActivation}
			>
				{@render heartIcon()}
			</button>
		</div>
		<div class="image">
			<a href={resolve('/inventory/[slug]', { slug: card.slug })}>
				<img
					class="card--img"
					src={card.image}
					alt={card.title}
					width="660"
					height="440"
					loading="lazy"
					decoding="async"
					onerror={handleCardImageError}
				/>
			</a>
		</div>
		<div class="content border-light border-top-none">
			<div class="bottom">
				<p class="category text-white uppercase">
					<a
						href={resolve('/inventory/[slug]', { slug: card.slug })}
						class="text-xs text-white uppercase">{card.brand}</a
					>
				</p>
				<div class="flex items-center gap-8">
					<p class="category text-white uppercase">
						<img src="/assets/icons/picture.svg" alt={copy.photosAlt} />
						{card.imagesCount}
					</p>
					{#if card.videoCount > 0}
						<p class="category text-white uppercase">
							<img src="/assets/icons/play.svg" alt={copy.videoAlt} />
							{card.videoCount}
						</p>
					{/if}
				</div>
			</div>
			<h2 class="h6 card-box__title mb-8">
				<a href={resolve('/inventory/[slug]', { slug: card.slug })}>{card.title}</a>
			</h2>
			{@render compactCardMeta(card, 'tag style2 mb-10 daynight-card-specs')}
			<p class="card-box__price daynight-card-price h6 mb-15">
				<span class="daynight-card-price__amount">{card.priceLabel.replaceAll('EUR', '€')}</span>
				<span class="daynight-card-price__finance"
					><a
						href={resolve('/financing')}
						class="daynight-card-price__monthly daynight-card-price__finance-link"
						aria-label={copy.finance}>{card.monthlyLabel.replaceAll('EUR', '€')}</a
					></span
				>
			</p>
			<div class="daynight-card-actions flex justify-between">
				<a href={resolve('/inventory/[slug]', { slug: card.slug })} class="view-details">
					{copy.viewDetails}
					<img class="ml-4" src="/assets/icons/CaretCircleRight.svg" alt={copy.viewDetails} />
				</a>
			</div>
		</div>
	</div>
{/if}

{#snippet cardMeta(card: AuxeroInventoryVehicleCard, tagClass: string)}
	<ul class={tagClass}>
		<li>
			<img src="/assets/icons/icon-gauge.svg" alt={copy.mileageAlt} /><span
				>{card.mileageLabel}</span
			>
		</li>
		<li>
			<img src="/assets/icons/calendar.svg" alt={copy.yearAlt} /><span>{card.year}</span>
		</li>
		<li>
			<img src="/assets/icons/gaspump.svg" alt={copy.fuelAlt} /><span>{card.fuel}</span>
		</li>
		<li>
			<img src="/assets/icons/transmission.svg" alt={copy.transmissionAlt} /><span
				>{card.transmission}</span
			>
		</li>
	</ul>
{/snippet}

{#snippet compactCardMeta(card: AuxeroInventoryVehicleCard, tagClass: string)}
	<ul class={tagClass}>
		<li title={`${copy.yearAlt}: ${card.year}`}>
			<img src="/assets/icons/calendar.svg" alt={copy.yearAlt} /><span>{card.year}</span>
		</li>
		<li title={`${copy.fuelAlt}: ${card.fuel}`}>
			<img src="/assets/icons/gaspump.svg" alt={copy.fuelAlt} /><span>{card.fuel}</span>
		</li>
		<li title={`${copy.transmissionAlt}: ${card.transmission}`}>
			<img src="/assets/icons/transmission.svg" alt={copy.transmissionAlt} /><span
				>{card.transmission}</span
			>
		</li>
	</ul>
{/snippet}

{#snippet heartIcon()}
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g clip-path="url(#clip0_13399_19510)">
			<path
				d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 4.62145 2.48851 3.98851C3.12145 3.35558 3.97989 3 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C12.0201 3 12.8785 3.35558 13.5115 3.98851C14.1444 4.62145 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z"
				stroke="white"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</g>
	</svg>
{/snippet}

{#snippet compareIcon()}
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g clip-path="url(#clip0_13399_19575)">
			<path
				d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
				stroke="#1C1C1C"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M6.875 10H13.125"
				stroke="#1C1C1C"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M10 6.875V13.125"
				stroke="#1C1C1C"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</g>
	</svg>
{/snippet}

<style>
	.card-box-style-1 {
		background: #f4f4f4 !important;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.card-box-style-1 .content {
		background: #f4f4f4 !important;
		display: flex;
		flex: 1;
		flex-direction: column;
		transition: background-color 0.14s ease;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(body.daynight-inventory-template) .card-box-style-1:hover,
		:global(body.daynight-inventory-template) .card-box-style-1:focus-within {
			background: #ffffff !important;
		}

		:global(body.daynight-inventory-template) .card-box-style-1:hover .content,
		:global(body.daynight-inventory-template) .card-box-style-1:focus-within .content {
			background: #ffffff !important;
		}
	}

	.card-box-style-1 .content .tag li {
		background: var(--bc-surface-soft) !important;
	}

	:global(body.daynight-inventory-template) .card-box .top .highlight {
		background: #ffffff !important;
		color: #1c1c1c !important;
	}

	.card-box-style-1 .card-box__title {
		font-family: var(--bc-font-heading);
		font-size: 22px !important;
		font-weight: 600 !important;
		letter-spacing: var(--bc-tracking-tight);
		line-height: 1.15 !important;
		min-height: 2.3em;
		overflow-wrap: anywhere;
	}

	.card-box-style-1 .text-secondary {
		font-size: var(--bc-text-body);
		line-height: 1.5;
	}

	.card-box-style-1 .image {
		aspect-ratio: 4 / 3;
		background: #ffffff !important;
		overflow: hidden;
	}

	.card-box-style-1 .image a,
	.card-box-style-1 .image img {
		display: block;
		width: 100%;
		height: 100%;
	}

	.card-box-style-1 .image img {
		object-fit: cover;
	}

	.view-details {
		align-items: center;
		background: var(--bc-accent) !important;
		border: 1px solid var(--bc-accent);
		border-radius: var(--bc-radius-control);
		color: #ffffff !important;
		display: inline-flex;
		font-size: 16px !important;
		font-weight: 600 !important;
		justify-content: center;
		line-height: 1.2 !important;
		min-height: 44px;
		padding: 0 12px;
		white-space: nowrap;
	}

	.view-details img {
		display: none;
	}

	@media (hover: hover) and (pointer: fine) {
		.view-details:hover {
			background: var(--bc-accent-hover) !important;
			border-color: var(--bc-accent-hover);
			color: #ffffff !important;
		}
	}

	.card-box-style-9 .flex.gap-32 {
		gap: 18px;
	}

	.daynight-card-specs {
		display: flex !important;
		flex-wrap: wrap !important;
		gap: 5px !important;
		overflow: visible !important;
	}

	.daynight-card-specs li {
		display: flex !important;
		flex: 1 1 calc(33.333% - 4px) !important;
		justify-content: flex-start !important;
		min-width: 0 !important;
		padding: 5px 6px !important;
		white-space: normal !important;
	}

	.daynight-card-specs li img {
		flex: 0 0 14px;
		height: 14px;
		object-fit: contain;
		width: 14px;
	}

	.daynight-card-specs li span {
		min-width: 0 !important;
		overflow: visible !important;
		overflow-wrap: anywhere;
		text-overflow: clip !important;
	}

	:global(body.daynight-inventory-template) .card-box-style-1 .daynight-card-specs {
		display: flex !important;
		flex-wrap: wrap !important;
		gap: 5px !important;
		overflow: visible !important;
	}

	:global(body.daynight-inventory-template) .card-box-style-1 .daynight-card-specs li {
		display: flex !important;
		flex: 1 1 calc(33.333% - 4px) !important;
		justify-content: flex-start !important;
		min-width: 0 !important;
		padding: 5px 6px !important;
		white-space: normal !important;
	}

	:global(body.daynight-inventory-template) .card-box-style-1 .daynight-card-specs li span {
		min-width: 0 !important;
		overflow: visible !important;
		overflow-wrap: anywhere;
		text-overflow: clip !important;
	}

	/* grid4 is the densest layout (~220px cards). The shared equal-thirds
	   `flex: 1 1 0` clamps each chip to ~59px there and truncates the labels
	   ("2019"→"20…", "Бензин"→"Бе…"). At that density only, drop the small icons
	   and let chips size to their content (wrap as a safety net) so the specs
	   read in full. grid3 / halfmap keep the tidy single icon-row above. */
	:global(body.auxero-template-listing-grid4-columns-html) .card-box-style-1 .daynight-card-specs {
		flex-wrap: wrap !important;
		overflow: visible !important;
	}

	:global(body.auxero-template-listing-grid4-columns-html)
		.card-box-style-1
		.daynight-card-specs
		li {
		flex: 0 0 auto !important;
	}

	:global(body.auxero-template-listing-grid4-columns-html)
		.card-box-style-1
		.daynight-card-specs
		li
		img {
		display: none !important;
	}

	:global(body.auxero-template-listing-grid4-columns-html)
		.card-box-style-1
		.daynight-card-specs
		li
		span {
		overflow: visible !important;
		text-overflow: clip !important;
	}

	/* Same density problem for the brand pill on the photo: "MERCEDES-BENZ"
	   wraps to two lines inside ~220px cards and pokes past the image edge.
	   Keep it a single compact line at grid4 only. */
	:global(body.auxero-template-listing-grid4-columns-html) .card-box-style-1 .bottom .category,
	:global(body.auxero-template-listing-grid4-columns-html) .card-box-style-1 .bottom .category a {
		font-size: 11px !important;
		letter-spacing: 0 !important;
		white-space: nowrap !important;
	}

	.daynight-card-price {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: 4px 12px;
		justify-content: space-between;
	}

	.daynight-card-price__amount {
		font-size: var(--bc-text-price);
		font-weight: 600;
		line-height: 28px;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.daynight-card-price__finance {
		align-items: flex-end;
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-left: auto;
		text-align: right;
	}

	.daynight-card-price__monthly {
		display: block;
		line-height: 20px;
		white-space: nowrap;
	}

	.daynight-card-price__finance-link {
		line-height: 16px;
		margin-left: 0;
		white-space: nowrap;
	}

	.daynight-card-actions {
		align-items: center;
		margin-top: auto;
	}

	.daynight-card-actions .view-details {
		display: inline-flex !important;
		width: 100% !important;
		min-width: 0 !important;
		padding-inline: 12px !important;
	}
</style>
