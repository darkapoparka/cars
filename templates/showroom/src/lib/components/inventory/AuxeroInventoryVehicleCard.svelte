<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';
	import type { AuxeroInventoryVehicleCard } from '$lib/auxero/inventory';
	import { eliqautoAssets, eliqautoContact } from '$lib/data/eliqauto';
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
	let favoriteActionLabel = $derived(
		`${isSaved ? (copy.savePrefix === 'Save' ? 'Remove' : 'Премахни') : copy.savePrefix} ${card.title}`
	);

	const applyCardImageFallback = (image: HTMLImageElement | undefined) => {
		if (!image || image.src.endsWith(eliqautoAssets.hero)) {
			return;
		}

		image.src = eliqautoAssets.hero;
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

</script>

{#if variant === 'list'}
	<div class="card-box card-box-style-9 eliqauto-no-image-zoom" data-eliqauto-slug={card.slug}>
		<a
			class="eliqauto-card-hitbox"
			href={resolve('/inventory/[slug]', { slug: card.slug })}
			aria-label={`${copy.viewDetails}: ${card.title}`}
		></a>
		<div class="top">
			<p class={`${card.highlightClass} highlight text-white`}>{card.tag}</p>
			<button
				type="button"
				class={['heart eliqauto-favorite', isSaved && 'is-active']}
				aria-label={favoriteActionLabel}
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
			<a href={resolve('/inventory/[slug]', { slug: card.slug })} tabindex="-1" aria-hidden="true">
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
			<p class="h6 card-box__title mb-4">
				<a href={resolve('/inventory/[slug]', { slug: card.slug })} tabindex="-1" aria-hidden="true"
					>{card.title}</a
				>
			</p>
			<p class="text-secondary clamp-1 clamp mb-8">
				{card.description || eliqautoContact.appointmentNote}
			</p>
			{@render cardMeta(card, 'tag style3 mb-14')}
			<p class="h6 card-box__price mb-10 flex items-center justify-between gap-8">
				{card.priceLabel}
			</p>
			<div class="eliqauto-card-actions">
				<a href={resolve('/inventory/[slug]', { slug: card.slug })} class="eliqauto-card-details">
					<span>{copy.viewDetails}</span>
					<ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
				</a>
			</div>
		</div>
	</div>
{:else}
	<div
		class="card-box card-box-style-1 eliqauto-no-image-zoom wow fadeIn"
		data-wow-delay={card.delay}
		data-eliqauto-slug={card.slug}
	>
		<a
			class="eliqauto-card-hitbox"
			href={resolve('/inventory/[slug]', { slug: card.slug })}
			aria-label={`${copy.viewDetails}: ${card.title}`}
		></a>
		<div class="top">
			<p class={`${card.highlightClass} highlight text-white`}>{card.mileageLabel}</p>
			<button
				type="button"
				class={['heart eliqauto-favorite', isSaved && 'is-active']}
				aria-label={favoriteActionLabel}
				aria-pressed={isSaved}
				onclick={handleFavoriteActivation}
			>
				{@render heartIcon()}
			</button>
		</div>
		<div class="image">
			<a href={resolve('/inventory/[slug]', { slug: card.slug })} tabindex="-1" aria-hidden="true">
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
			<p class="h6 card-box__title mb-8">
				<a href={resolve('/inventory/[slug]', { slug: card.slug })} tabindex="-1" aria-hidden="true"
					>{card.title}</a
				>
			</p>
			{@render compactCardMeta(card, 'tag style2 mb-10 eliqauto-card-specs')}
			<p class="card-box__price eliqauto-card-price h6 mb-15">
				<span class="eliqauto-card-price__amount">{card.priceLabel}</span>
				{#if card.monthlyLabel}
					<span class="eliqauto-card-price__finance">
						<span class="eliqauto-card-price__monthly text-sm">{card.monthlyLabel}</span>
						<a
							href={resolve(`/financing?price=${card.priceEur}`)}
							class="eliqauto-card-price__finance-link text-underline text-muted text-xs"
						>
							{copy.finance}
						</a>
					</span>
				{/if}
			</p>
			<div class="eliqauto-card-actions">
				<a href={resolve('/inventory/[slug]', { slug: card.slug })} class="eliqauto-card-details">
					<span>{copy.viewDetails}</span>
					<ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
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

<style>
	.eliqauto-favorite {
		border: 0;
		padding: 0;
		font: inherit;
		cursor: pointer;
	}

	.card-box-style-1 {
		position: relative;
		background: #ffffff;
		display: flex;
		flex-direction: column;
		height: 100%;
		cursor: pointer;
		font-family: var(--bc-font-body);
	}

	.card-box-style-1 .content {
		background: #ffffff;
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.card-box-style-9,
	:global(body.eliqauto-inventory-template .card-box-style-9) {
		position: relative;
		background: #ffffff;
		border: 1px solid transparent;
		border-radius: 8px;
		box-shadow: 0 12px 28px rgba(28, 28, 28, 0.06);
		color: #1c1c1c;
		cursor: pointer;
		display: flex;
		font-family: var(--bc-font-body);
		min-height: 216px;
		overflow: hidden;
	}

	.eliqauto-card-hitbox {
		position: absolute;
		z-index: 1;
		inset: 0;
		border-radius: inherit;
	}

	.eliqauto-card-hitbox:focus-visible {
		outline: 2px solid rgb(165 23 23 / 0.5);
		outline-offset: -3px;
	}

	.card-box a:not(.eliqauto-card-hitbox) {
		position: relative;
		z-index: 2;
	}

	.card-box .eliqauto-favorite {
		z-index: 3;
	}

	.card-box .top {
		z-index: 4;
	}

	.card-box-style-9:hover,
	.card-box-style-9:focus-within,
	:global(body.eliqauto-inventory-template .card-box-style-9:hover),
	:global(body.eliqauto-inventory-template .card-box-style-9:focus-within) {
		background: #ffffff;
		box-shadow: 0 12px 28px rgba(28, 28, 28, 0.06);
		color: #1c1c1c;
	}

	.card-box-style-9 .image,
	:global(body.eliqauto-inventory-template .card-box-style-9 .image) {
		background: var(--bc-accent-soft);
		border-radius: 8px 0 0 8px;
		flex: 0 0 300px;
		max-width: 300px;
		min-height: 220px;
		overflow: hidden;
		width: 300px;
	}

	.card-box-style-9 .image a,
	.card-box-style-9 .image img,
	:global(body.eliqauto-inventory-template .card-box-style-9 .image a),
	:global(body.eliqauto-inventory-template .card-box-style-9 .image img) {
		display: block;
		height: 100%;
		width: 100%;
	}

	.card-box-style-9 .image img,
	:global(body.eliqauto-inventory-template .card-box-style-9 .image img) {
		object-fit: cover;
	}

	.card-box-style-9 .content,
	.card-box-style-9:hover .content,
	.card-box-style-9:focus-within .content,
	:global(body.eliqauto-inventory-template .card-box-style-9 .content),
	:global(body.eliqauto-inventory-template .card-box-style-9:hover .content),
	:global(body.eliqauto-inventory-template .card-box-style-9:focus-within .content) {
		background: #ffffff;
		border: 0;
		color: #1c1c1c;
		display: flex;
		flex: 1 1 auto;
		flex-direction: column;
		min-width: 0;
		padding: 22px 24px;
		width: auto;
	}

	.card-box-style-9 .card-box__title,
	.card-box-style-9 .card-box__title a,
	.card-box-style-9:hover .card-box__title,
	.card-box-style-9:hover .card-box__title a,
	:global(body.eliqauto-inventory-template .card-box-style-9 .card-box__title),
	:global(body.eliqauto-inventory-template .card-box-style-9 .card-box__title a),
	:global(body.eliqauto-inventory-template .card-box-style-9:hover .card-box__title),
	:global(body.eliqauto-inventory-template .card-box-style-9:hover .card-box__title a) {
		color: #1c1c1c;
	}

	.card-box-style-9 .text-secondary,
	.card-box-style-9:hover .text-secondary,
	:global(body.eliqauto-inventory-template .card-box-style-9 .text-secondary),
	:global(body.eliqauto-inventory-template .card-box-style-9:hover .text-secondary) {
		color: #666666;
	}

	.card-box-style-9 .content .tag li,
	.card-box-style-9:hover .content .tag li,
	:global(body.eliqauto-inventory-template .card-box-style-9 .content .tag li),
	:global(body.eliqauto-inventory-template .card-box-style-9:hover .content .tag li) {
		background: #fff7f7;
		border: 1px solid #efdddd;
		color: #1c1c1c;
	}

	.card-box-style-9 .content .tag li span,
	.card-box-style-9:hover .content .tag li span,
	:global(body.eliqauto-inventory-template .card-box-style-9 .content .tag li span),
	:global(body.eliqauto-inventory-template .card-box-style-9:hover .content .tag li span) {
		color: #1c1c1c;
	}

	.card-box-style-9 .card-box__price,
	.card-box-style-9:hover .card-box__price,
	:global(body.eliqauto-inventory-template .card-box-style-9 .card-box__price),
	:global(body.eliqauto-inventory-template .card-box-style-9:hover .card-box__price) {
		color: #a51717;
	}

	.card-box-style-9 .bottom .category,
	.card-box-style-9 .bottom .category a,
	:global(body.eliqauto-inventory-template .card-box-style-9 .bottom .category),
	:global(body.eliqauto-inventory-template .card-box-style-9 .bottom .category a) {
		color: #ffffff;
	}

	@media (max-width: 767.98px) {
		.card-box-style-9,
		:global(body.eliqauto-inventory-template .card-box-style-9) {
			display: block;
		}

		.card-box-style-9 .image,
		:global(body.eliqauto-inventory-template .card-box-style-9 .image) {
			aspect-ratio: 4 / 3;
			border-radius: 8px 8px 0 0;
			flex-basis: auto;
			max-width: none;
			min-height: 0;
			width: 100%;
		}
	}

	@media (min-width: 768px) {
		.card-box-style-1,
		.card-box-style-1 .content,
		.card-box-style-9,
		.card-box-style-9 .content,
		:global(body.eliqauto-inventory-template .card-box-style-9),
		:global(body.eliqauto-inventory-template .card-box-style-9 .content) {
			background: var(--bc-vehicle-card-surface);
			transition: background-color 0.2s ease;
		}

		.card-box-style-1,
		.card-box-style-9,
		:global(body.eliqauto-inventory-template .card-box-style-9) {
			border-color: transparent;
		}
	}

	@media (hover: hover) and (pointer: fine) {
		:global(body.eliqauto-inventory-template) .card-box-style-1:hover,
		:global(body.eliqauto-inventory-template) .card-box-style-1:focus-within {
			border-color: transparent;
			background: #ffffff;
		}

		:global(body.eliqauto-inventory-template) .card-box-style-1:hover .content,
		:global(body.eliqauto-inventory-template) .card-box-style-1:focus-within .content {
			background: #ffffff;
		}

		.card-box-style-9:hover,
		.card-box-style-9:focus-within,
		.card-box-style-9:hover .content,
		.card-box-style-9:focus-within .content,
		:global(body.eliqauto-inventory-template .card-box-style-9:hover),
		:global(body.eliqauto-inventory-template .card-box-style-9:focus-within),
		:global(body.eliqauto-inventory-template .card-box-style-9:hover .content),
		:global(body.eliqauto-inventory-template .card-box-style-9:focus-within .content) {
			border-color: transparent;
			background: #ffffff;
		}
	}

	.card-box-style-1 .content .tag li {
		background: #fff7f7;
	}

	:global(body.eliqauto-inventory-template) .card-box .top .highlight {
		background: #ffffff;
		color: #1c1c1c;
	}

	:global(body.eliqauto-inventory-template) .card-box .top .highlight,
	:global(body.eliqauto-inventory-template) .card-box .bottom .category,
	:global(body.eliqauto-inventory-template) .card-box .bottom .category a {
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0;
		line-height: 18px;
	}

	.card-box-style-1 .card-box__title {
		display: -webkit-box;
		min-height: 58px;
		overflow: hidden;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	:global(body.eliqauto-inventory-template) .card-box-style-1 .card-box__title,
	:global(body.eliqauto-inventory-template) .card-box-style-1 .card-box__title a,
	:global(body.eliqauto-inventory-template) .card-box-style-9 .card-box__title,
	:global(body.eliqauto-inventory-template) .card-box-style-9 .card-box__title a {
		color: #151515;
		font-family: var(--bc-font-heading);
		font-size: var(--bc-vehicle-card-title-size);
		font-weight: var(--bc-vehicle-card-title-weight);
		letter-spacing: 0;
		line-height: var(--bc-vehicle-card-title-leading);
		text-transform: none;
	}

	:global(body.eliqauto-inventory-template) .card-box-style-1 .text-secondary,
	:global(body.eliqauto-inventory-template) .card-box-style-9 .text-secondary {
		font-size: var(--bc-text-control, 16px);
		line-height: 1.45;
	}

	.card-box-style-1 .image {
		aspect-ratio: 4 / 3;
		background: #ffffff;
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

	.card-box-style-9 .flex.gap-32 {
		gap: 18px;
	}

	.eliqauto-card-specs {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		overflow: visible;
	}

	.eliqauto-card-specs li {
		display: flex;
		flex: 0 0 auto;
		justify-content: flex-start;
		min-width: 0;
		padding: 5px 6px;
		white-space: nowrap;
	}

	.eliqauto-card-specs li img {
		flex: 0 0 14px;
		height: 14px;
		object-fit: contain;
		width: 14px;
	}

	.eliqauto-card-specs li span {
		min-width: 0;
		overflow: visible;
		text-overflow: clip;
	}

	:global(body.eliqauto-inventory-template) .card-box-style-1 .eliqauto-card-specs {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		overflow: visible;
	}

	:global(body.eliqauto-inventory-template) .card-box-style-1 .eliqauto-card-specs li {
		display: flex;
		flex: 0 0 auto;
		justify-content: flex-start;
		min-width: 0;
		padding: 5px 6px;
		white-space: nowrap;
	}

	:global(body.eliqauto-inventory-template) .card-box-style-1 .eliqauto-card-specs li span {
		min-width: 0;
		overflow: visible;
		text-overflow: clip;
	}

	/* grid4 is the densest layout (~220px cards). The shared equal-thirds
	   `flex: 1 1 0` clamps each chip to ~59px there and truncates the labels
	   ("2019"→"20…", "Бензин"→"Бе…"). At that density only, drop the small icons
	   and let chips size to their content (wrap as a safety net) so the specs
	   read in full. grid3 / halfmap keep the tidy single icon-row above. */
	:global(body.auxero-template-listing-grid4-columns-html) .card-box-style-1 .eliqauto-card-specs {
		flex-wrap: wrap;
		overflow: visible;
	}

	:global(body.auxero-template-listing-grid4-columns-html)
		.card-box-style-1
		.eliqauto-card-specs
		li {
		flex: 0 0 auto;
	}

	:global(body.auxero-template-listing-grid4-columns-html)
		.card-box-style-1
		.eliqauto-card-specs
		li
		img {
		display: none;
	}

	:global(body.auxero-template-listing-grid4-columns-html)
		.card-box-style-1
		.eliqauto-card-specs
		li
		span {
		overflow: visible;
		text-overflow: clip;
	}

	/* Same density problem for the brand pill on the photo: "MERCEDES-BENZ"
	   wraps to two lines inside ~220px cards and pokes past the image edge.
	   Keep it a single compact line at grid4 only. */
	:global(body.auxero-template-listing-grid4-columns-html) .card-box-style-1 .bottom .category,
	:global(body.auxero-template-listing-grid4-columns-html) .card-box-style-1 .bottom .category a {
		font-size: 13px;
		letter-spacing: 0;
		white-space: nowrap;
	}

	.eliqauto-card-price {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: 4px 12px;
		justify-content: space-between;
	}

	.eliqauto-card-price__amount {
		font-size: 22px;
		font-weight: var(--bc-weight-semibold);
		line-height: var(--bc-leading-card-price, 1.2);
		white-space: nowrap;
	}

	/* The shared card guard forces the price to --bc-card-ink (white) for the
	   original dark cards. The grid card (style-1) was reskinned to a white
	   surface, so that white price is invisible at rest (it only flips to red
	   on hover/active). Restore the brand-red resting colour here, matching the
	   list variant (style-9). Uses the same :global wrapper so specificity beats
	   the guard's `.card-box[data-eliqauto-slug] .eliqauto-card-price__amount`. */
	:global(body.eliqauto-inventory-template .card-box-style-1 .eliqauto-card-price__amount) {
		color: #a51717;
	}

	/* Use the shared page-muted ink for readable secondary links on white cards. */
	:global(body.eliqauto-inventory-template .card-box-style-1 .eliqauto-card-price__finance-link) {
		color: var(--bc-muted);
	}

	.eliqauto-card-price__finance {
		align-items: flex-end;
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-left: auto;
		text-align: right;
	}

	.eliqauto-card-price__monthly {
		display: block;
		font-size: var(--bc-text-caption, 15px);
		line-height: var(--bc-leading-caption, 1.35);
		white-space: nowrap;
	}

	.eliqauto-card-price__finance-link {
		display: inline-flex;
		min-height: var(--bc-touch);
		align-items: center;
		font-size: var(--bc-text-caption);
		line-height: 1.3;
		margin-left: 0;
		white-space: nowrap;
	}

	@media (min-width: 768px) {
		.eliqauto-card-price__finance-link {
			min-height: 28px;
			font-size: 14px;
		}
	}

	.eliqauto-card-actions {
		display: grid;
		min-height: 44px;
		align-items: center;
		grid-template-columns: minmax(0, 1fr);
		margin-top: auto;
	}

	:global(body.eliqauto-inventory-template) .eliqauto-card-actions .eliqauto-card-details {
		display: inline-flex;
		min-width: 0;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 0 14px;
		border: 1px solid var(--bc-accent);
		border-radius: 8px;
		background: var(--bc-accent);
		color: #ffffff;
		font-family: var(--bc-font-body);
		font-size: var(--bc-vehicle-card-action-size);
		font-weight: var(--bc-weight-semibold);
		line-height: 1.2;
		text-decoration: none;
		white-space: nowrap;
		transition:
			background-color 0.16s ease,
			border-color 0.16s ease;
	}

	:global(body.eliqauto-inventory-template)
		.eliqauto-card-actions
		.eliqauto-card-details
		:global(svg) {
		flex: 0 0 auto;
		color: currentColor;
		stroke: currentColor;
	}

	:global(body.eliqauto-inventory-template)
		.eliqauto-card-actions
		.eliqauto-card-details:focus-visible {
		border-color: var(--bc-accent-hover);
		background: var(--bc-accent-hover);
		outline: 2px solid var(--bc-accent);
		outline-offset: 3px;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(body.eliqauto-inventory-template) .eliqauto-card-actions .eliqauto-card-details:hover {
			border-color: var(--bc-accent-hover);
			background: var(--bc-accent-hover);
			color: #ffffff;
		}
	}
</style>
