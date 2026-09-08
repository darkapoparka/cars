<script lang="ts">
	import { Car, Heart } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import DayNightSpecIcon from '$lib/components/shared/icons/DayNightSpecIcon.svelte';
	import { shortFuel } from '$lib/utils/format';
	import { getGarageContext } from '$lib/state/garage.svelte';
	import { getDayNightVehicleBySlug, type DayNightVehicle } from '$lib/data/daynight-vehicles';
	import MobileBottomDock from '$lib/components/home/mobile/MobileBottomDock.svelte';
	import {
		enhanceDayNightImageFallbacks,
		daynightImageFallback
	} from '$lib/utils/daynight-image-fallback';
	import { onMount } from 'svelte';

	const garage = getGarageContext();

	onMount(() => enhanceDayNightImageFallbacks());

	// Map saved slugs → vehicles, dropping any that are no longer in the catalogue.
	const vehicles = $derived(
		garage.favorites
			.map((slug) => getDayNightVehicleBySlug(slug))
			.filter((vehicle): vehicle is DayNightVehicle => Boolean(vehicle))
	);

	const countLabel = $derived(
		vehicles.length === 1 ? '1 saved vehicle' : `${vehicles.length} saved vehicles`
	);

	function remove(slug: string) {
		garage.toggleFavorite(slug);
	}
</script>

<div class="mobile-favorites" aria-label="Saved vehicles">
	<main id="main-content" tabindex="-1">
		<section class="mobile-favorites-top">
			<a class="mobile-favorites-top__back" href={resolve('/')}>← Back to site</a>
			<span>Favorites</span>
			<h1>Saved</h1>
			<p>{vehicles.length ? countLabel : 'Save vehicles to find them here.'}</p>
		</section>

		<section class="mobile-favorites-results" aria-live="polite">
			{#if vehicles.length}
				<div class="mobile-favorites-list">
					{#each vehicles as vehicle (vehicle.slug)}
						<article class="mobile-favorites-card">
							<a
								class="mobile-favorites-card__link"
								href={resolve('/inventory/[slug]', { slug: vehicle.slug })}
							>
								<div class="mobile-favorites-card__media">
									<img
										src={vehicle.image}
										alt={vehicle.shortTitle}
										loading="lazy"
										decoding="async"
										data-daynight-image-fallback
										use:daynightImageFallback
									/>
									<span>{vehicle.badges[0] ?? 'Available'}</span>
								</div>
								<div class="mobile-favorites-card__body">
									<div class="mobile-favorites-card__title">
										<div>
											<small>{vehicle.brand}</small>
											<h3>{vehicle.shortTitle}</h3>
										</div>
										<div class="mobile-favorites-card__price">
											<strong>{vehicle.priceLabel}</strong>
											<span>{vehicle.monthly}</span>
										</div>
									</div>
									<ul aria-label="Key specs">
										<li>
											<DayNightSpecIcon name="mileage" size={15} />
											{vehicle.mileage}
										</li>
										<li>
											<DayNightSpecIcon name="year" size={15} />
											{vehicle.year}
										</li>
										<li>
											<DayNightSpecIcon name="fuel" size={15} />
											{shortFuel(vehicle.fuel)}
										</li>
										<li>
											<DayNightSpecIcon name="transmission" size={15} />
											{vehicle.transmission}
										</li>
									</ul>
								</div>
							</a>
							<button
								type="button"
								class="mobile-favorites-card__fav"
								aria-label={`Remove ${vehicle.shortTitle} from saved`}
								onclick={() => remove(vehicle.slug)}
							>
								<Heart size={18} strokeWidth={2.3} />
							</button>
						</article>
					{/each}
				</div>
			{:else}
				<div class="mobile-favorites-empty">
					<Heart size={28} strokeWidth={2.2} />
					<h2>No saved vehicles yet</h2>
					<p>Tap the heart on a listing to save a vehicle.</p>
					<a href={resolve('/inventory')}>
						<Car size={17} strokeWidth={2.2} />
						Browse vehicles
					</a>
				</div>
			{/if}
		</section>
	</main>

	<MobileBottomDock />
</div>

<style>
	.mobile-favorites {
		--mf-surface: #eef1f6;
		--mf-surface-strong: #e7eaee;
		--mf-line: #dfe5ec;
		--mf-inset: inset 0 1px 0 rgba(255, 255, 255, 0.82);

		min-height: 100svh;
		margin: 0 auto;
		background: #fff;
		color: var(--sa-ink);
		font-family: var(--sa-font);
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
	}

	.mobile-favorites main {
		padding-top: 0;
		padding-bottom: calc(64px + env(safe-area-inset-bottom));
	}

	.mobile-favorites-top {
		display: grid;
		gap: 4px;
		background: var(--sa-blue);
		padding: calc(env(safe-area-inset-top) + 18px) var(--sa-mobile-gutter) 20px;
		color: #fff;
	}

	.mobile-favorites-top span {
		color: rgba(255, 255, 255, 0.74);
		font-size: var(--sa-text-xs);
		font-weight: 800;
		letter-spacing: 0.09em;
		line-height: 1;
		text-transform: uppercase;
	}

	.mobile-favorites-top h1 {
		margin: 0;
		color: #fff;
		font-size: var(--sa-text-xl);
		font-weight: 800;
		letter-spacing: -0.02em;
		line-height: 1.2;
	}

	.mobile-favorites-top p {
		margin: 0;
		color: rgba(255, 255, 255, 0.82);
		font-size: var(--sa-text-sm);
		font-weight: 600;
		line-height: 1.35;
	}

	.mobile-favorites-results {
		display: grid;
		gap: 11px;
		padding: 12px var(--sa-mobile-gutter) 0;
		background: transparent;
	}

	.mobile-favorites-list {
		display: grid;
		gap: 9px;
	}

	.mobile-favorites-card {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--mf-line);
		border-radius: 8px;
		background: var(--mf-surface);
		box-shadow: var(--mf-inset);
	}

	.mobile-favorites-card__link {
		display: grid;
		grid-template-columns: 132px minmax(0, 1fr);
		color: var(--sa-ink);
		text-decoration: none;
	}

	.mobile-favorites-card__media {
		position: relative;
		overflow: hidden;
		min-height: 146px;
		background: var(--mf-surface-strong);
	}

	.mobile-favorites-card__media img {
		display: block;
		width: 100%;
		height: 100%;
		min-height: 146px;
		object-fit: cover;
	}

	.mobile-favorites-card__media :global(img.daynight-img-fallback) {
		box-sizing: border-box;
		padding: 18px;
		background: #f1f4f9;
		object-fit: contain;
	}

	.mobile-favorites-card__media span {
		position: absolute;
		top: 7px;
		left: 7px;
		border-radius: 999px;
		background: #b00000;
		padding: 5px 7px;
		color: #fff;
		font-size: var(--sa-text-xs);
		font-weight: 800;
		line-height: 1;
	}

	.mobile-favorites-card__body {
		display: flex;
		flex-direction: column;
		gap: 7px;
		min-width: 0;
		/* Reserve room on the right so the title never slides under the heart. */
		padding: 9px 10px;
	}

	.mobile-favorites-card__title {
		display: grid;
		gap: 5px;
		min-width: 0;
		/* Reserve room for the heart (top-right) here only, so the spec grid below
		   can use the full content width like the inventory card. */
		padding-right: 46px;
	}

	.mobile-favorites-card__title > div:first-child {
		display: grid;
		gap: 3px;
		min-width: 0;
	}

	.mobile-favorites-card__title small {
		color: #7e8896;
		font-size: var(--sa-text-xs);
		font-weight: 800;
		letter-spacing: 0.07em;
		line-height: 1;
		text-transform: uppercase;
	}

	.mobile-favorites-card h3 {
		display: -webkit-box;
		overflow: hidden;
		margin: 0;
		color: #0f1629;
		font-size: var(--sa-text-base);
		font-weight: 800;
		letter-spacing: -0.017em;
		line-height: 1.16;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
	}

	.mobile-favorites-card__price {
		display: grid;
		min-width: 0;
		gap: 2px;
	}

	.mobile-favorites-card__price strong {
		color: var(--sa-price);
		font-size: var(--sa-text-lg);
		font-weight: 800;
		letter-spacing: -0.01em;
		line-height: 1.1;
		white-space: nowrap;
	}

	.mobile-favorites-card__price span {
		overflow: hidden;
		min-width: 0;
		color: #6b7480;
		font-size: var(--sa-text-xs);
		font-weight: 700;
		line-height: 1.1;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mobile-favorites-card ul {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 6px;
		/* Pin specs to the bottom so badges align across every card. */
		margin: auto 0 0;
		padding: 0;
		list-style: none;
	}

	.mobile-favorites-card li {
		display: inline-flex;
		min-width: 0;
		min-height: 25px;
		align-items: center;
		justify-content: center;
		gap: 5px;
		overflow: hidden;
		border-radius: 7px;
		background: #fff;
		padding: 0 3px;
		color: #4e5965;
		font-size: var(--sa-text-xs);
		font-weight: 800;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mobile-favorites-card li :global(.daynight-spec-icon) {
		flex: 0 0 auto;
		color: #202a35;
	}

	/* Save/remove control lives on the white card body (top-right), never on the
	   photo. Filled red = saved. */
	.mobile-favorites-card__fav {
		position: absolute;
		top: 6px;
		right: 6px;
		display: grid;
		width: var(--sa-mobile-action-h);
		height: var(--sa-mobile-action-h);
		place-items: center;
		border: 1px solid var(--mf-line);
		border-radius: 50%;
		background: #fff;
		color: var(--sa-red, #e11d2a);
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(15, 23, 42, 0.12);
	}

	.mobile-favorites-card__fav :global(svg) {
		fill: currentColor;
	}

	.mobile-favorites-empty {
		display: grid;
		place-items: center;
		gap: 8px;
		border: 1px solid var(--mf-line);
		border-radius: 14px;
		background: var(--mf-surface);
		padding: 38px 18px;
		text-align: center;
		box-shadow: var(--mf-inset);
	}

	.mobile-favorites-empty :global(svg) {
		color: var(--sa-red, #e11d2a);
	}

	.mobile-favorites-empty h2 {
		margin: 0;
		color: #111315;
		font-size: var(--sa-text-base);
		font-weight: 800;
	}

	.mobile-favorites-empty p {
		margin: 0;
		max-width: 26ch;
		color: #66707a;
		font-size: var(--sa-text-sm);
		line-height: 1.4;
	}

	.mobile-favorites-empty a {
		display: inline-flex;
		min-height: var(--sa-mobile-action-h);
		align-items: center;
		gap: 7px;
		border-radius: 10px;
		background: #b00000;
		padding: 0 16px;
		color: #fff;
		font-size: var(--sa-text-sm);
		font-weight: 800;
		text-decoration: none;
	}

	.mobile-favorites-empty a :global(svg) {
		color: #fff;
	}

	.mobile-favorites :global(svg),
	.mobile-favorites :global(svg *) {
		stroke: currentColor !important;
	}

	/* Phones navigate via the bottom dock; the back link is a desktop affordance. */
	.mobile-favorites-top__back {
		display: none;
		justify-self: start;
		margin-bottom: 6px;
		color: rgba(255, 255, 255, 0.85);
		font-size: var(--sa-text-sm);
		font-weight: 700;
		text-decoration: none;
	}

	.mobile-favorites-top__back:hover {
		color: #fff;
		text-decoration: underline;
	}

	/* On desktop this route is only reachable by URL (the dock is mobile-only),
	   so present the saved list as a centered column with a way back to the site. */
	@media (min-width: 576px) {
		.mobile-favorites-top__back {
			display: inline-block;
		}

		.mobile-favorites {
			max-width: 520px;
			min-height: auto;
			margin: 24px auto 60px;
			border: 1px solid var(--mf-line);
			border-radius: 16px;
			overflow: hidden;
		}

		.mobile-favorites-top {
			border-radius: 0;
		}

		.mobile-favorites main {
			padding-bottom: 16px;
		}
	}

	@media (max-width: 370px) {
		.mobile-favorites-card__link {
			grid-template-columns: 122px minmax(0, 1fr);
		}

		.mobile-favorites-card__media {
			min-height: 140px;
		}

		.mobile-favorites-card h3 {
			font-size: var(--sa-text-base);
		}
	}
</style>
