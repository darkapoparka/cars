<script lang="ts">
	import { resolve } from '$app/paths';
	import { Calendar, Cog, Fuel } from '@lucide/svelte';
	import type { HomeFiveVehicleCardData } from '$lib/auxero/home-five';
	import type { VehicleCardCopy } from '$lib/i18n/messages';
	import { getGarageContext } from '$lib/state/garage.svelte';

	let {
		copy,
		style2 = false,
		vehicle
	}: {
		copy: VehicleCardCopy;
		style2?: boolean;
		vehicle: HomeFiveVehicleCardData;
	} = $props();

	const garage = getGarageContext();
	let isSaved = $derived(garage.isFavorite(vehicle.slug));

	const handleFavoriteActivation = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		garage.toggleFavorite(vehicle.slug);
	};
</script>

<div
	class="card-box card-box-style-1 daynight-no-image-zoom daynight-card-soft-hover"
	data-daynight-slug={vehicle.slug}
>
	<div class="top">
		<p class={`${vehicle.highlightClass} highlight text-white`}>{vehicle.mileageLabel}</p>
		<button
			type="button"
			class={['heart daynight-favorite', isSaved && 'is-active']}
			aria-label={`${copy.savePrefix} ${vehicle.title}`}
			aria-pressed={isSaved}
			onclick={handleFavoriteActivation}
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M8 14C8 14 1.5 10.5 1.5 6.375C1.5 5.47989 1.85558 4.62145 2.48851 3.98851C3.12145 3.35558 3.97989 3 4.875 3C6.28688 3 7.49625 3.76937 8 5C8.50375 3.76937 9.71312 3 11.125 3C12.0201 3 12.8785 3.35558 13.5115 3.98851C14.1444 4.62145 14.5 5.47989 14.5 6.375C14.5 10.5 8 14 8 14Z"
					stroke="white"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	</div>
	<div class="image">
		<a href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)}>
			<img
				class="card--img"
				src={vehicle.image}
				alt={vehicle.title}
				width="660"
				height="440"
				loading="lazy"
				decoding="async"
			/>
		</a>
	</div>
	<div class="content border-light border-top-none">
		<div class="bottom">
			<p class="category text-white uppercase">
				<a
					href={resolve(`/inventory?brand=${encodeURIComponent(vehicle.brand)}`)}
					class="text-xs text-white uppercase"
				>
					{vehicle.brand}
				</a>
			</p>
		</div>
		<p class="card-box__title h6 mb-8">
			<a
				href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)}
				title={vehicle.title}
				aria-label={vehicle.title}
			>
				<span class="daynight-card-title-full">{vehicle.title}</span>
				<span class="daynight-card-title-split" aria-hidden="true">
					<span class="daynight-card-model">{vehicle.modelLabel ?? vehicle.title}</span>
					{#if vehicle.trimLabel}<span class="daynight-card-trim">{vehicle.trimLabel}</span>{/if}
				</span>
			</a>
		</p>
		<ul class={style2 ? 'tag style2 daynight-card-specs mb-10' : 'tag daynight-card-specs mb-10'}>
			<li aria-label={`${copy.yearAlt}: ${vehicle.year}`}>
				<Calendar size={14} strokeWidth={1.9} aria-hidden="true" />
				<span>{vehicle.year}</span>
			</li>
			<li aria-label={`${copy.fuelAlt}: ${vehicle.fuel}`}>
				<Fuel size={14} strokeWidth={1.9} aria-hidden="true" />
				<span>{vehicle.fuel}</span>
			</li>
			<li aria-label={`${copy.transmissionAlt}: ${vehicle.transmission}`}>
				<Cog size={14} strokeWidth={1.9} aria-hidden="true" />
				<span>{vehicle.transmission}</span>
			</li>
		</ul>
		<p class="card-box__price daynight-card-price h6">
			<span class="daynight-card-price__amount">{vehicle.priceLabel.replace('EUR', '€')}</span>
			<a
				href={resolve('/financing')}
				class="daynight-card-price__monthly"
				aria-label={`${copy.finance}: ${vehicle.monthlyLabel}`}
				>{vehicle.monthlyLabel.replace('EUR', '€')}</a
			>
		</p>

		<div class="daynight-card-actions">
			<a href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)} class="view-details">
				<span>{copy.viewDetails}</span>
				<span class="view-details__arrow" aria-hidden="true">→</span>
			</a>
		</div>
	</div>
</div>

<style>
	.daynight-card-title-full {
		display: contents;
	}

	.daynight-card-title-split {
		display: none;
	}

	.card-box-style-1 {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.card-box-style-1 .content {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.card-box-style-1 .card-box__title {
		min-height: 3em;
		overflow-wrap: anywhere;
	}

	.card-box-style-1 .card-box__title a {
		display: block;
		overflow-wrap: anywhere;
	}

	/* Spec row as soft chips: more scannable/visible without heavier type. */
	.daynight-card-specs {
		flex-wrap: wrap !important;
		justify-content: flex-start;
		gap: 6px;
		overflow: visible;
		margin-bottom: 14px;
	}

	.daynight-card-specs li {
		align-items: center;
		flex: 0 0 auto;
		gap: 5px;
		min-width: 0;
		white-space: nowrap;
		padding: 5px 10px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-soft);
	}

	.daynight-card-specs li :global(svg) {
		width: 14px;
		height: 14px;
		opacity: 0.8;
		color: var(--bc-muted);
	}

	.daynight-card-specs li span {
		color: #1c1c1c;
	}

	.daynight-card-price {
		align-items: center;
		display: flex;
		gap: 12px;
		justify-content: space-between;
		margin-top: auto;
		margin-bottom: 0 !important;
	}

	.daynight-card-price__amount {
		color: inherit;
		font-size: 22px;
		font-weight: 600;
		line-height: 30px;
		white-space: nowrap;
	}

	.daynight-card-price__monthly {
		display: block;
		line-height: 20px;
		white-space: nowrap;
	}

	.daynight-card-actions {
		margin-top: 2px;
	}

	.daynight-card-actions .view-details {
		display: flex !important;
		width: 100%;
		min-height: 48px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 1px solid var(--bc-accent);
		border-radius: var(--bc-radius-control);
		background: var(--bc-accent);
		color: #ffffff !important;
		font-size: 18px !important;
		font-weight: 600 !important;
		line-height: 1.2;
		padding: 0 16px;
		text-decoration: none !important;
		white-space: nowrap;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.daynight-card-actions .view-details span {
		color: inherit !important;
	}

	.daynight-card-actions .view-details > span:first-child {
		font-family: inherit !important;
		font-size: inherit !important;
		font-weight: inherit !important;
		letter-spacing: inherit !important;
		line-height: inherit !important;
	}

	.daynight-card-actions .view-details:focus-visible {
		border-color: var(--bc-accent-hover) !important;
		background: var(--bc-accent-hover) !important;
		color: #ffffff !important;
	}

	@media (hover: hover) and (pointer: fine) {
		.daynight-card-actions .view-details:hover {
			border-color: var(--bc-accent-hover) !important;
			background: var(--bc-accent-hover) !important;
			color: #ffffff !important;
		}
	}

	.view-details__arrow {
		flex: 0 0 auto;
		font-size: 19px;
		font-weight: 700;
		line-height: 1;
	}

	.daynight-card-soft-hover {
		background-color: #fafafa;
		transition:
			background-color 0.25s ease,
			box-shadow 0.25s ease;
	}

	.daynight-card-soft-hover .content {
		background-color: #fafafa;
		transition: background-color 0.25s ease;
	}

	@media (min-width: 768px) {
		.daynight-card-price__amount {
			border-radius: 8px;
			background: rgb(185 22 28 / 0.12);
			color: #1c1c1c;
			padding: 1px 8px;
			transition:
				background-color 0.2s ease,
				color 0.2s ease;
		}

		.daynight-card-soft-hover {
			background-color: var(--bc-card-bg);
			border-color: var(--bc-border);
			transition:
				background-color 0.25s ease,
				border-color 0.25s ease,
				box-shadow 0.25s ease;
		}

		.daynight-card-soft-hover .content {
			background-color: var(--bc-card-bg);
			transition:
				background-color 0.25s ease,
				border-color 0.25s ease;
		}

		.card-box-style-1 .bottom .category {
			background-color: rgba(28, 28, 28, 0.74);
			border-color: rgba(255, 255, 255, 0.2);
			backdrop-filter: none;
			-webkit-backdrop-filter: none;
			transition:
				background-color 0.2s ease,
				border-color 0.2s ease;
		}

		.daynight-card-soft-hover .card-box__title a,
		.daynight-card-soft-hover .bottom .category a {
			text-decoration: none !important;
		}

		.daynight-card-soft-hover .card-box__price {
			color: #1c1c1c !important;
		}

		@media (hover: hover) and (pointer: fine) {
			.daynight-card-soft-hover:hover,
			.daynight-card-soft-hover:focus-within {
				background-color: #ffffff;
				border-color: var(--bc-border-strong) !important;
				box-shadow: inset 0 0 0 1px rgb(185 22 28 / 0.2) !important;
				transform: none;
			}

			.daynight-card-soft-hover:hover .content,
			.daynight-card-soft-hover:focus-within .content {
				background-color: #ffffff;
			}

			.daynight-card-soft-hover:hover .card-box__price,
			.daynight-card-soft-hover:focus-within .card-box__price,
			.daynight-card-soft-hover:hover .card-box__title a,
			.daynight-card-soft-hover:focus-within .card-box__title a,
			.daynight-card-soft-hover:hover .bottom .category a,
			.daynight-card-soft-hover:focus-within .bottom .category a {
				color: #1c1c1c !important;
				text-decoration: none !important;
			}

			.daynight-card-soft-hover:hover .bottom .category,
			.daynight-card-soft-hover:focus-within .bottom .category {
				background-color: var(--bc-card-pill-hover);
				border-color: rgb(255 255 255 / 0.24);
			}

			.daynight-card-soft-hover:hover .daynight-card-price__amount,
			.daynight-card-soft-hover:focus-within .daynight-card-price__amount {
				background-color: rgb(185 22 28 / 0.14);
				color: #1c1c1c;
			}
		}
	}

	@media (min-width: 992px) {
		.card-box-style-1 .image {
			background: var(--bc-card-media, #f4f5f2);
		}

		.card-box-style-1 .top .highlight {
			border: 1px solid rgba(28, 28, 28, 0.1);
			background: #ffffff !important;
			box-shadow: 0 4px 12px rgba(28, 28, 28, 0.14);
			color: var(--bc-card-ink, #1c1c1c) !important;
		}

		.daynight-card-price__amount {
			background: transparent;
			color: var(--bc-card-ink, #1c1c1c);
			padding: 0;
		}

		.daynight-card-soft-hover {
			background-color: var(--bc-card-bg, #f1f2f3);
			border-color: transparent;
			box-shadow: none !important;
		}

		.daynight-card-soft-hover .content {
			background-color: var(--bc-card-bg, #f1f2f3);
		}

		.card-box-style-1 .bottom .category {
			background-color: var(--bc-card-pill, rgba(28, 28, 28, 0.78));
			border-color: rgba(255, 255, 255, 0.18);
		}

		.daynight-card-soft-hover .card-box__price {
			color: var(--bc-card-ink, #1c1c1c) !important;
		}

		.daynight-card-soft-hover .daynight-card-price__finance-link:focus-visible {
			color: var(--bc-hover-accent) !important;
			text-decoration: none !important;
		}

		@media (hover: hover) and (pointer: fine) {
			.daynight-card-soft-hover:hover,
			.daynight-card-soft-hover:focus-within {
				background-color: var(--bc-card-hover, #f4f4f4);
				border-color: transparent !important;
				box-shadow: none !important;
				transform: none;
			}

			.daynight-card-soft-hover:hover .content,
			.daynight-card-soft-hover:focus-within .content {
				background-color: var(--bc-card-hover, #f4f4f4);
			}

			.daynight-card-soft-hover:hover .card-box__price,
			.daynight-card-soft-hover:focus-within .card-box__price,
			.daynight-card-soft-hover:hover .card-box__title a,
			.daynight-card-soft-hover:focus-within .card-box__title a {
				color: var(--bc-card-ink, #1c1c1c) !important;
				text-decoration: none !important;
			}

			.daynight-card-soft-hover:hover .bottom .category a,
			.daynight-card-soft-hover:focus-within .bottom .category a {
				color: #ffffff !important;
				text-decoration: none !important;
			}

			.daynight-card-soft-hover:hover .bottom .category,
			.daynight-card-soft-hover:focus-within .bottom .category {
				background-color: var(--bc-card-pill-hover, rgba(28, 28, 28, 0.88));
				border-color: rgba(255, 255, 255, 0.24);
			}

			.daynight-card-soft-hover:hover .daynight-card-price__amount,
			.daynight-card-soft-hover:focus-within .daynight-card-price__amount {
				background-color: transparent;
				color: var(--bc-card-ink, #1c1c1c);
			}

			.daynight-card-soft-hover .daynight-card-price__finance-link:hover {
				color: var(--bc-hover-accent) !important;
				text-decoration: none !important;
			}
		}
	}

	@media (max-width: 767px) {
		.card-box-style-1 {
			overflow: hidden;
			border: 0;
			border-radius: 10px;
			background: var(--bc-surface);
			box-shadow: none !important;
		}

		/* The whole card is the tap target on mobile — press it as one unit
		   (instant translateY, matching the hero/PDP idiom). */
		.card-box-style-1:has(a:active) {
			transform: translateY(1px);
		}

		/* Mobile card is finalized as title → chips → price; the details-arrow
		   row is a desktop-only affordance (the whole card is tappable). */
		.card-box-style-1 .divider,
		.daynight-card-actions {
			display: none;
		}

		.daynight-card-soft-hover .content {
			background: var(--bc-surface);
		}

		@media (hover: hover) and (pointer: fine) {
			.daynight-card-soft-hover:hover .content {
				background: var(--bc-surface);
			}
		}

		.card-box-style-1 .image {
			aspect-ratio: 1.68;
			height: auto;
		}

		.card-box-style-1 .image :global(img),
		.card-box-style-1 .image img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.card-box-style-1 .top .highlight {
			top: 8px;
			left: 8px;
			min-height: 24px;
			padding: 0 9px;
			border-radius: 8px;
			font-size: 12px;
			font-weight: 700;
			letter-spacing: -0.1px;
			line-height: 24px;
			border: 1px solid rgba(28, 28, 28, 0.08);
			background: #ffffff !important;
			color: var(--bc-card-ink, #1c1c1c) !important;
		}

		.card-box-style-1 .top .heart {
			display: none !important;
		}

		.card-box-style-1 .content {
			padding: 11px 12px 12px;
		}

		.card-box-style-1 .bottom {
			display: none;
		}

		.card-box-style-1 .card-box__title {
			min-height: 0;
			margin-bottom: 8px;
			font-size: 18px;
			font-weight: 650;
			line-height: 24px;
		}

		.card-box-style-1 .card-box__title a {
			display: inline-flex;
			min-height: 44px;
			align-items: center;
			margin-block: -9px;
			padding-block: 9px;
		}

		/* Auxero app.css underlines the title/brand link on tap (.active fake-hover
		   and sticky :hover). Kill it in every state on touch — the whole card is the
		   tap target, so an animated underline reads as a broken half-press. The
		   intentional finance-link underline is a different element, untouched. */
		.card-box-style-1 .content .card-box__title a {
			text-decoration: none !important;
		}

		/* Mobile: title → spec chips → price anchored at the bottom (price as the bold conclusion). */
		.daynight-card-specs {
			display: grid !important;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			order: 1;
			gap: 5px 6px !important;
			margin-top: 0;
			margin-bottom: 12px !important;
		}

		.daynight-card-specs li {
			width: 100%;
			min-width: 0;
			flex: initial;
			justify-content: center;
			box-sizing: border-box;
			gap: 0;
			padding: 5px 9px;
			min-height: 44px;
			font-size: 13px;
			line-height: 18px;
			/* Inner chips stay white so they remain visible against the standard soft card surface. */
			background: #ffffff;
			border-color: var(--bc-border);
		}

		.daynight-card-specs span {
			min-width: 0;
			overflow: visible;
			overflow-wrap: anywhere;
			text-align: center;
			text-overflow: clip;
			white-space: normal;
		}

		.daynight-card-specs :global(svg) {
			display: none;
		}

		.daynight-card-price {
			order: 2;
			margin-top: auto;
			align-items: center;
			flex-direction: row;
			gap: 8px;
			margin-bottom: 0 !important;
		}

		.daynight-card-price__amount {
			font-size: 18px;
			font-weight: 700;
			line-height: 22px;
		}

		.daynight-card-price__finance {
			align-items: flex-end;
			min-width: 0;
			text-align: right;
		}

		.daynight-card-price__monthly,
		.daynight-card-price__finance-link {
			font-size: 12px;
			font-weight: 500;
			line-height: 16px;
		}

		.daynight-card-price__finance-link {
			display: inline-flex;
			min-height: 44px;
			align-items: center;
			margin-block: -14px;
		}
	}

	@media (min-width: 768px) {
		:global(html body.auxero-template-home-05-html #wrapper) .card-box-style-1 .content {
			padding: 14px 16px 16px !important;
			gap: 10px !important;
			display: grid !important;
			grid-template-rows: 44px 28px 32px 44px;
			flex: none !important;
		}
		:global(html body.auxero-template-home-05-html #wrapper) .card-box-style-1 .card-box__title {
			min-height: 44px !important;
			height: 44px !important;
			margin: 0 !important;
			line-height: 22px;
		}
		:global(html body.auxero-template-home-05-html #wrapper)
			.card-box-style-1
			.daynight-card-specs {
			flex-wrap: nowrap !important;
			gap: 6px !important;
			justify-content: flex-start !important;
			margin: 0 !important;
		}
		:global(html body.auxero-template-home-05-html #wrapper) .daynight-card-specs li {
			padding: 4px 8px !important;
			border-radius: 6px;
			line-height: 20px;
			border: 0 !important;
			background: #fff !important;
			font-size: 14px;
			flex: 0 1 auto;
			overflow: hidden;
		}
		:global(html body.auxero-template-home-05-html #wrapper) .daynight-card-specs li span {
			overflow: hidden;
			text-overflow: ellipsis;
		}
		:global(html body.auxero-template-home-05-html #wrapper) .daynight-card-specs li :global(svg) {
			display: none;
		}
		:global(html body.auxero-template-home-05-html #wrapper)
			.card-box-style-1
			.daynight-card-price {
			margin: 0 !important;
			gap: 8px !important;
			min-height: 32px !important;
			display: flex !important;
			flex-direction: row !important;
			align-items: center !important;
		}
		:global(html body.auxero-template-home-05-html #wrapper) .daynight-card-price__amount {
			padding: 0 !important;
			background: transparent !important;
			font-size: 24px;
		}
		:global(html body.auxero-template-home-05-html #wrapper) .daynight-card-price__monthly {
			font-size: 14px;
			color: var(--bc-muted);
		}
		:global(html body.auxero-template-home-05-html #wrapper) .daynight-card-actions {
			margin: 0;
		}
		:global(html body.auxero-template-home-05-html #wrapper) .daynight-card-actions .view-details {
			min-height: 44px !important;
		}
	}
</style>
