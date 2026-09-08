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
	let favoriteActionLabel = $derived(
		`${isSaved ? (copy.savePrefix === 'Save' ? 'Remove' : 'Премахни') : copy.savePrefix} ${vehicle.title}`
	);

	const handleFavoriteActivation = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		garage.toggleFavorite(vehicle.slug);
	};
</script>

<div
	class="card-box card-box-style-1 eliqauto-no-image-zoom eliqauto-card-soft-hover"
	data-eliqauto-slug={vehicle.slug}
>
	<a
		class="eliqauto-card-hitbox"
		href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)}
		aria-label={`${copy.viewDetails}: ${vehicle.title}`}
	></a>
	<div class="top">
		<p class={`${vehicle.highlightClass} highlight text-white`}>{vehicle.mileageLabel}</p>
		<button
			type="button"
			class={['heart eliqauto-favorite', isSaved && 'is-active']}
			aria-label={favoriteActionLabel}
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
		<a
			href={resolve(`/inventory/${encodeURIComponent(vehicle.slug)}`)}
			tabindex="-1"
			aria-hidden="true"
		>
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
				tabindex="-1"
				aria-hidden="true"
			>
				{vehicle.title}
			</a>
		</p>
		<ul class={style2 ? 'tag style2 eliqauto-card-specs mb-10' : 'tag eliqauto-card-specs mb-10'}>
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
		<p class="card-box__price eliqauto-card-price h6">
			<span class="eliqauto-card-price__amount">{vehicle.priceLabel}</span>
			{#if vehicle.monthlyLabel}
				<span class="eliqauto-card-price__finance">
					<span class="eliqauto-card-price__monthly text-sm">{vehicle.monthlyLabel}</span>
					<a
						href={resolve(`/financing?price=${vehicle.priceEur}`)}
						class="eliqauto-card-price__finance-link text-muted text-underline text-xs"
					>
						{copy.finance}
					</a>
				</span>
			{/if}
		</p>
	</div>
</div>

<style>
	.eliqauto-favorite {
		border: 0;
		padding: 0;
		font: inherit;
		cursor: pointer;
	}

	.card-box-style-1 .top .highlight {
		min-height: 32px;
		padding: 0 10px;
		font-size: var(--bc-text-micro);
		font-weight: var(--bc-weight-semibold);
		line-height: 32px;
	}

	.card-box-style-1 .top .heart {
		display: inline-flex;
		width: var(--bc-touch);
		height: var(--bc-touch);
		min-width: var(--bc-touch);
		min-height: var(--bc-touch);
		align-items: center;
		justify-content: center;
	}

	.card-box-style-1 .bottom .category a {
		display: inline-flex;
		min-height: var(--bc-touch);
		align-items: center;
		font-size: var(--bc-text-micro);
		line-height: 1.2;
	}

	.eliqauto-card-price__finance-link {
		display: inline-flex;
		min-height: var(--bc-touch);
		align-items: center;
		color: var(--bc-card-muted, var(--bc-muted));
		font-size: var(--bc-text-caption);
		font-weight: var(--bc-weight-medium);
		line-height: 1.3;
		margin-left: 0;
		white-space: nowrap;
	}
	.card-box-style-1 {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		cursor: pointer;
		font-family: var(--bc-font-body);
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

	.card-box-style-1 a:not(.eliqauto-card-hitbox) {
		position: relative;
		z-index: 2;
	}

	.card-box-style-1 .eliqauto-favorite {
		z-index: 3;
	}

	.card-box-style-1 .top {
		z-index: 4;
	}

	.card-box-style-1 .content {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.card-box-style-1 .card-box__title {
		display: -webkit-box;
		min-height: 50px;
		overflow: hidden;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: var(--bc-vehicle-card-title-size);
		font-weight: var(--bc-vehicle-card-title-weight);
		line-height: var(--bc-vehicle-card-title-leading);
	}

	.card-box-style-1 .card-box__title a {
		display: inline-flex;
		min-height: var(--bc-touch);
		align-items: center;
		overflow: hidden;
		color: var(--bc-card-ink, #1c1c1c);
		overflow-wrap: anywhere;
	}

	/* Spec row as soft chips: more scannable/visible without heavier type. */
	.eliqauto-card-specs {
		flex-wrap: wrap;
		justify-content: flex-start;
		gap: 6px;
		overflow: visible;
		margin-bottom: 14px;
	}

	.eliqauto-card-specs li {
		align-items: center;
		flex: 0 0 auto;
		gap: 5px;
		min-width: 0;
		white-space: nowrap;
		padding: 5px 10px;
		border: 1px solid var(--bc-border);
		border-radius: 8px;
		background: var(--bc-surface-soft);
		font-size: var(--bc-text-caption);
		font-weight: var(--bc-weight-medium);
		line-height: 18px;
	}

	.eliqauto-card-specs li :global(svg) {
		width: 14px;
		height: 14px;
		opacity: 0.8;
		color: var(--bc-accent);
	}

	.eliqauto-card-specs li span {
		color: #1f1f23;
	}

	.eliqauto-card-price {
		align-items: center;
		display: flex;
		gap: 12px;
		justify-content: space-between;
		margin-top: auto;
		margin-bottom: 0;
	}

	.eliqauto-card-price__amount {
		color: inherit;
		font-size: 22px;
		font-weight: var(--bc-weight-semibold);
		line-height: 30px;
		white-space: nowrap;
	}

	.eliqauto-card-price__finance {
		align-items: flex-end;
		display: flex;
		flex-direction: column;
		gap: 2px;
		text-align: right;
	}

	.eliqauto-card-price__monthly {
		display: block;
		font-size: var(--bc-text-caption);
		font-weight: var(--bc-weight-medium);
		line-height: 20px;
		white-space: nowrap;
	}

	.eliqauto-card-soft-hover {
		background-color: var(--bc-vehicle-card-surface);
		transition: border-color var(--bc-motion-hover);
	}

	.eliqauto-card-soft-hover .content {
		background-color: var(--bc-vehicle-card-surface);
		transition: none;
	}

	@media (min-width: 768px) {
		.eliqauto-card-price {
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto;
			min-height: 44px;
			align-items: center;
			gap: 0 8px;
		}

		.eliqauto-card-price__amount {
			max-width: 100%;
			white-space: normal;
			overflow-wrap: anywhere;
		}

		.eliqauto-card-price__finance {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			gap: 0;
		}

		.eliqauto-card-price__monthly {
			font-size: 14px;
			line-height: 16px;
			text-align: right;
		}

		.eliqauto-card-price__finance-link {
			/* Keep the 44px hit area while the visible two-line block stays 30px tall. */
			min-height: 44px;
			margin-block: -15px;
			font-size: 12px;
			line-height: 14px;
			max-width: 100%;
			white-space: nowrap;
		}

		.eliqauto-card-price__amount {
			border-radius: 8px;
			background: rgba(165, 23, 23, 0.13);
			color: #2a0c0c;
			padding: 1px 8px;
			transition:
				background-color 0.2s ease,
				color 0.2s ease;
		}

		.eliqauto-card-soft-hover {
			background-color: var(--bc-vehicle-card-surface);
			border-color: transparent;
			transition:
				background-color 0.25s ease,
				border-color 0.25s ease,
				box-shadow 0.25s ease;
		}

		.eliqauto-card-soft-hover .content {
			background-color: var(--bc-vehicle-card-surface);
			transition:
				background-color 0.25s ease,
				border-color 0.25s ease;
		}

		.card-box-style-1 .bottom .category {
			background-color: rgba(42, 12, 12, 0.84);
			border-color: rgba(255, 255, 255, 0.2);
			backdrop-filter: none;
			-webkit-backdrop-filter: none;
			transition:
				background-color 0.2s ease,
				border-color 0.2s ease;
		}

		.eliqauto-card-soft-hover .card-box__title a,
		.eliqauto-card-soft-hover .bottom .category a {
			text-decoration: none;
		}

		.eliqauto-card-soft-hover .card-box__price {
			color: #2a0c0c;
		}

		@media (hover: hover) and (pointer: fine) {
			.eliqauto-card-soft-hover:hover,
			.eliqauto-card-soft-hover:focus-within {
				background-color: #ffffff;
				border-color: transparent;
				box-shadow: none;
				transform: none;
			}

			.eliqauto-card-soft-hover:hover .content,
			.eliqauto-card-soft-hover:focus-within .content {
				background-color: #ffffff;
			}

			.eliqauto-card-soft-hover:hover .card-box__price,
			.eliqauto-card-soft-hover:focus-within .card-box__price,
			.eliqauto-card-soft-hover:hover .card-box__title a,
			.eliqauto-card-soft-hover:focus-within .card-box__title a,
			.eliqauto-card-soft-hover:hover .bottom .category a,
			.eliqauto-card-soft-hover:focus-within .bottom .category a {
				color: #2a0c0c;
				text-decoration: none;
			}

			.eliqauto-card-soft-hover:hover .bottom .category,
			.eliqauto-card-soft-hover:focus-within .bottom .category {
				background-color: rgba(42, 12, 12, 0.84);
				border-color: rgba(255, 255, 255, 0.2);
			}

			.eliqauto-card-soft-hover:hover .eliqauto-card-price__amount,
			.eliqauto-card-soft-hover:focus-within .eliqauto-card-price__amount {
				background-color: rgba(165, 23, 23, 0.2);
				color: #2a0c0c;
			}
		}
	}

	@media (min-width: 768px) and (max-width: 1399px) {
		.eliqauto-card-price__amount {
			font-size: 18px;
		}
		.eliqauto-card-price__monthly {
			font-size: 13px;
		}
	}

	@media (min-width: 992px) {
		.eliqauto-card-specs {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0;
			padding: 6px;
			border-radius: 8px;
			background: var(--bc-surface-hover);
		}

		.eliqauto-card-specs li {
			justify-content: center;
			gap: 5px;
			padding: 3px 5px;
			border: 0;
			border-radius: 0;
			background: transparent;
			font-size: 13px;
			line-height: 18px;
		}

		.card-box-style-1 .image {
			background: var(--bc-surface);
		}

		.card-box-style-1 .top .highlight {
			border: 1px solid rgba(28, 28, 28, 0.1);
			background: #ffffff;
			box-shadow: 0 4px 12px rgba(28, 28, 28, 0.14);
			color: #1c1c1c;
		}

		.eliqauto-card-price__amount {
			background: transparent;
			color: #1c1c1c;
			padding: 0;
		}

		.eliqauto-card-soft-hover {
			border: 0;
			background: var(--bc-vehicle-card-surface);
			box-shadow: none;
		}

		.eliqauto-card-soft-hover .content {
			background: var(--bc-vehicle-card-surface);
		}

		.eliqauto-card-soft-hover .card-box__title a,
		.eliqauto-card-soft-hover .eliqauto-card-price__amount,
		.eliqauto-card-soft-hover .eliqauto-card-price__monthly {
			color: #1c1c1c;
		}

		.eliqauto-card-soft-hover .eliqauto-card-price__finance-link {
			color: var(--bc-muted);
		}

		.card-box-style-1 .bottom .category {
			background-color: var(--bc-card-pill, rgba(28, 28, 28, 0.78));
			border-color: rgba(255, 255, 255, 0.18);
		}

		.eliqauto-card-soft-hover .card-box__price {
			color: #1c1c1c;
		}

		.eliqauto-card-soft-hover .eliqauto-card-price__finance-link:focus-visible {
			color: var(--bc-hover-accent);
			text-decoration: none;
		}

		@media (hover: hover) and (pointer: fine) {
			.eliqauto-card-soft-hover:hover,
			.eliqauto-card-soft-hover:focus-within {
				border: 0;
				background: var(--bc-vehicle-card-surface-hover);
				box-shadow: none;
				transform: none;
			}

			.eliqauto-card-soft-hover:hover .content,
			.eliqauto-card-soft-hover:focus-within .content {
				background: var(--bc-vehicle-card-surface-hover);
			}

			.eliqauto-card-soft-hover:hover .card-box__price,
			.eliqauto-card-soft-hover:focus-within .card-box__price,
			.eliqauto-card-soft-hover:hover .card-box__title a,
			.eliqauto-card-soft-hover:focus-within .card-box__title a {
				color: #1c1c1c;
				text-decoration: none;
			}

			.eliqauto-card-soft-hover:hover .bottom .category a,
			.eliqauto-card-soft-hover:focus-within .bottom .category a {
				color: #ffffff;
				text-decoration: none;
			}

			.eliqauto-card-soft-hover:hover .bottom .category,
			.eliqauto-card-soft-hover:focus-within .bottom .category {
				background-color: var(--bc-card-pill, rgba(28, 28, 28, 0.78));
				border-color: rgba(255, 255, 255, 0.18);
			}

			.eliqauto-card-soft-hover:hover .eliqauto-card-price__amount,
			.eliqauto-card-soft-hover:focus-within .eliqauto-card-price__amount {
				background-color: transparent;
				color: #1c1c1c;
			}

			.eliqauto-card-soft-hover .eliqauto-card-price__finance-link:hover {
				color: var(--bc-hover-accent);
				text-decoration: none;
			}
		}
	}

	@media (max-width: 767px) {
		.card-box-style-1 {
			overflow: hidden;
			border: 0;
			border-radius: 10px;
			background: var(--bc-surface);
			box-shadow: none;
		}

		/* The whole card is the tap target on mobile — press it as one unit
		   (instant translateY, matching the hero/PDP idiom). */
		.card-box-style-1:has(a:active) {
			transform: translateY(1px);
		}

		/* Mobile card is finalized as title → chips → price. */
		.card-box-style-1 .divider {
			display: none;
		}

		.eliqauto-card-soft-hover .content {
			background: var(--bc-surface);
		}

		@media (hover: hover) and (pointer: fine) {
			.eliqauto-card-soft-hover:hover .content {
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
			min-height: 32px;
			padding: 0 10px;
			border-radius: 8px;
			font-size: var(--bc-text-micro);
			font-weight: var(--bc-weight-semibold);
			letter-spacing: 0;
			line-height: 32px;
			border: 1px solid rgba(28, 28, 28, 0.08);
			background: #ffffff;
			color: #1c1c1c;
		}

		.card-box-style-1 .top .heart {
			display: none;
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
			font-size: 16px;
			font-weight: var(--bc-weight-semibold);
			line-height: 22px;
		}

		.card-box-style-1 .card-box__title a {
			display: inline-flex;
			min-height: 44px;
			align-items: center;
			margin-block: -9px;
			padding-block: 9px;
			color: #1c1c1c;
		}

		/* Auxero app.css underlines the title/brand link on tap (.active fake-hover
		   and sticky :hover). Kill it in every state on touch — the whole card is the
		   tap target, so an animated underline reads as a broken half-press. The
		   intentional finance-link underline is a different element, untouched. */
		.card-box-style-1 .content .card-box__title a {
			text-decoration: none;
		}

		/* Mobile: title → spec chips → price anchored at the bottom (price as the bold conclusion). */
		.eliqauto-card-specs {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			order: 1;
			gap: 5px 6px;
			margin-top: 0;
			margin-bottom: 12px;
		}

		.eliqauto-card-specs li {
			width: 100%;
			min-width: 0;
			flex: initial;
			justify-content: center;
			box-sizing: border-box;
			gap: 0;
			padding: 5px 9px;
			font-size: 13px;
			font-weight: var(--bc-weight-medium);
			line-height: 16px;
			/* Inner chips stay white so they remain visible against the standard soft card surface. */
			background: #ffffff;
			border-color: var(--bc-border);
		}

		.eliqauto-card-specs span {
			min-width: 0;
			overflow: hidden;
			text-align: center;
			text-overflow: ellipsis;
		}

		.eliqauto-card-specs :global(svg) {
			display: none;
		}

		.eliqauto-card-price {
			order: 2;
			margin-top: auto;
			align-items: center;
			flex-direction: row;
			gap: 8px;
			margin-bottom: 0;
		}

		.eliqauto-card-price__amount {
			color: #1c1c1c;
			font-size: 18px;
			font-weight: var(--bc-weight-bold);
			line-height: 22px;
		}

		.eliqauto-card-price__finance {
			align-items: flex-end;
			min-width: 0;
			text-align: right;
		}

		.eliqauto-card-price__monthly,
		.eliqauto-card-price__finance-link {
			font-size: 13px;
			font-weight: var(--bc-weight-medium);
			line-height: 16px;
		}

		.eliqauto-card-soft-hover .eliqauto-card-price__finance-link {
			display: inline-flex;
			min-height: 44px;
			align-items: center;
			color: var(--bc-muted);
			margin-block: -14px;
		}
	}
</style>
