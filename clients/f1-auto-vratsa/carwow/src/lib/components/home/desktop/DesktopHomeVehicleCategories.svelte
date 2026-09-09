<script lang="ts">
	import DesktopSectionHeading from '$lib/components/shared/DesktopSectionHeading.svelte';
	import { resolve } from '$app/paths';
	import { cars } from '$lib/data/daynight-vehicles';
	import {
		desktopOnlyImagePlaceholder,
		desktopOnlySizes,
		desktopOnlySrcset
	} from '$lib/utils/desktop-only-assets';

	const bodyCount = (body: string) => cars.filter((car) => car.body === body).length;

	const formatCount = (count: number) =>
		count > 0 ? `${count} ${count === 1 ? 'автомобил' : 'автомобила'}` : 'Няма наличност';

	// Counts come from live inventory; the canonical desktop can expose the full taxonomy
	// while keeping zero-stock categories honest and visually quiet.
	const allVehicleCategories = [
		{
			id: 'electric',
			title: 'Електрически',
			query: `fuel=${encodeURIComponent('Електрически')}`,
			count: cars.filter((car) => car.fuel === 'Електрически').length,
			image: '/assets/images/body-type/normalized/body-sedan-transparent.webp'
		},
		{
			id: 'suv',
			title: 'Джип',
			query: 'body=SUV',
			count: bodyCount('SUV'),
			image: '/assets/images/body-type/normalized/body-suv-transparent.webp'
		},
		{
			id: 'wagon',
			title: 'Комби',
			query: `body=${encodeURIComponent('Комби')}`,
			count: bodyCount('Комби'),
			image: '/assets/images/body-type/generated/body-wagon-studio-card-v1.webp'
		},
		{
			id: 'hatchback',
			title: 'Хечбек',
			query: `body=${encodeURIComponent('Хечбек')}`,
			count: bodyCount('Хечбек'),
			image: '/assets/images/body-type/normalized/body-hatchback-transparent.webp'
		},
		{
			id: 'sedan',
			title: 'Седан',
			query: `body=${encodeURIComponent('Седан')}`,
			count: bodyCount('Седан'),
			image: '/assets/images/body-type/generated/body-sedan-studio-card-v1.webp'
		},
		{
			id: 'coupe',
			title: 'Купе',
			query: `body=${encodeURIComponent('Купе')}`,
			count: bodyCount('Купе'),
			image: '/assets/images/body-type/generated/body-coupe-studio-card-v1.webp'
		},
		{
			id: 'van',
			title: 'Ван',
			query: `body=${encodeURIComponent('Ван')}`,
			count: bodyCount('Ван'),
			image: '/assets/images/body-type/generated/body-mpv-studio-card-v1.webp'
		},
		{
			id: 'convertible',
			title: 'Кабриолет',
			query: `body=${encodeURIComponent('Кабрио')}`,
			count: bodyCount('Кабрио'),
			image: '/assets/images/body-type/normalized/body-coupe-transparent.webp'
		}
	];

	let {
		title = 'Автомобили по тип',
		ctaLabel = 'Виж всички типове',
		showHeaderCta = true,
		showBelowCta = false,
		showEmptyCategories = false,
		headerCtaPlacement = 'inline'
	}: {
		title?: string;
		ctaLabel?: string;
		showHeaderCta?: boolean;
		showBelowCta?: boolean;
		showEmptyCategories?: boolean;
		headerCtaPlacement?: 'inline' | 'stacked';
	} = $props();

	let vehicleCategories = $derived(
		showEmptyCategories
			? allVehicleCategories
			: allVehicleCategories.filter((category) => category.count > 0)
	);
</script>

<section class="daynight-home-section daynight-home-section--vehicle-types">
	<div class="daynight-home-container home-browse-heading"><DesktopSectionHeading title={title} href={showHeaderCta ? resolve('/inventory') : undefined} label={ctaLabel} /></div>
	<div class="daynight-home-section-content daynight-home-container">
		<div class="daynight-vehicle-types">
			<div class="daynight-vehicle-types__grid">
				{#each vehicleCategories as category (category.id)}
					<div class="daynight-vehicle-types__item">
						<a
							href="{resolve('/inventory')}?{category.query}"
							class={`daynight-vehicle-type-card${category.count === 0 ? ' daynight-vehicle-type-card--empty' : ''}`}
						>
							<div class="daynight-vehicle-type-card__image">
								<img
									src={desktopOnlyImagePlaceholder}
									srcset={desktopOnlySrcset(category.image, 600)}
									sizes={desktopOnlySizes('220px')}
									alt={category.title}
								/>
							</div>
							<div class="daynight-vehicle-type-card__content">
								<p class="daynight-vehicle-type-card__title">
									{category.title}
								</p>
								<p class="daynight-vehicle-type-card__count">
									{formatCount(category.count)}
								</p>
							</div>
						</a>
					</div>
				{/each}
			</div>
		</div>
		{#if showBelowCta}
			<div class="daynight-home-browse-cta">
				<a href={resolve('/inventory')} class="daynight-home-browse-cta__link">
					{ctaLabel}
				</a>
			</div>
		{/if}
	</div>
</section>

<style>
 .home-browse-heading { padding-top: 36px; }
	:global(body.daynight-home-page) .daynight-vehicle-types__grid {
		gap: 16px !important;
	}

	:global(body.daynight-home-page) .daynight-vehicle-type-card {
		background: #fff !important;
		border: 0 !important;
		border-radius: 16px !important;
		box-shadow: none !important;
		box-sizing: border-box;
		min-height: 250px !important;
		overflow: hidden;
		padding: 14px 0 18px !important;
		transition: background-color 0.14s ease !important;
	}

	:global(body.daynight-home-page) .daynight-vehicle-type-card:hover,
	:global(body.daynight-home-page) .daynight-vehicle-type-card:focus-visible,
	:global(body.daynight-home-page) .daynight-vehicle-type-card:focus-within {
		background: #fff !important;
		border-color: transparent !important;
		box-shadow: none !important;
		transform: none !important;
	}

	:global(body.daynight-home-page) .daynight-vehicle-type-card:focus-visible {
		outline: 2px solid #d50032;
		outline-offset: 2px;
	}

	:global(body.daynight-home-page) .daynight-vehicle-type-card__image {
		height: 164px !important;
		margin: 0 !important;
		padding: 0 10px 12px !important;
	}

	:global(body.daynight-home-page) .daynight-vehicle-type-card__image img {
		height: 100% !important;
		object-fit: contain !important;
		mix-blend-mode: multiply;
		transform: none !important;
		width: 100% !important;
	}

	:global(body.daynight-home-page) .daynight-vehicle-type-card__content {
		margin-top: 0 !important;
		padding: 0 20px !important;
	}

	:global(body.daynight-home-page) .daynight-vehicle-type-card__title {
		font-size: 20px !important;
		font-weight: 650 !important;
		line-height: 1.2 !important;
		margin: 0 0 4px !important;
	}

	:global(body.daynight-home-page) .daynight-vehicle-type-card__count {
		color: #64748b !important;
		font-size: 13px !important;
		line-height: 1.3 !important;
		margin: 0 !important;
	}

	.daynight-home-browse-cta {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}

	:global(body.daynight-home-page) .daynight-home-browse-cta__link {
		align-items: center;
		background: transparent;
		border: 1px solid #c91620;
		border-radius: 8px;
		box-sizing: border-box;
		color: #c91620;
		display: inline-flex;
		font-size: 15px;
		font-weight: 650;
		justify-content: center;
		min-height: 42px;
		padding: 0 18px;
		text-decoration: none;
		transition:
			background-color 0.14s ease,
			border-color 0.14s ease,
			color 0.14s ease;
	}

	:global(body.daynight-home-page) .daynight-home-browse-cta__link:hover,
	:global(body.daynight-home-page) .daynight-home-browse-cta__link:focus-visible {
		background: #c91620;
		border-color: #c91620;
		color: #fff;
	}

	:global(body.daynight-home-page) .daynight-vehicle-type-card--empty {
		background: #f8fafc !important;
		border-color: #e2e8f0 !important;
	}

	:global(body.daynight-home-page)
		.daynight-vehicle-type-card--empty
		.daynight-vehicle-type-card__image
		img {
		opacity: 0.64;
	}

	:global(body.daynight-home-page)
		.daynight-vehicle-type-card--empty
		.daynight-vehicle-type-card__count {
		color: #94a3b8 !important;
	}

	@media (min-width: 992px) {
		.daynight-home-section--vehicle-types :global(.daynight-home-section-banner) {
			padding: 40px 0 18px !important;
		}

		.daynight-home-section--vehicle-types :global(.daynight-home-section-banner__inner) {
			align-items: center !important;
			flex-direction: row !important;
			justify-content: space-between !important;
			padding: 0 !important;
			text-align: left !important;
		}

		.daynight-home-section--vehicle-types :global(.daynight-home-section-banner__copy) {
			align-items: flex-start !important;
			justify-content: flex-start !important;
			text-align: left !important;
			width: auto !important;
		}

		.daynight-home-section--vehicle-types :global(.daynight-home-section-banner__copy h2) {
			text-align: left !important;
		}

		.daynight-home-section--vehicle-types :global(.daynight-home-section-banner__cta) {
			background: transparent !important;
			border: 0 !important;
			box-shadow: none !important;
			color: #111827 !important;
			min-height: auto !important;
			padding: 4px 0 !important;
			transform: none !important;
		}

		.daynight-home-section--vehicle-types :global(.daynight-home-section-banner__cta::after) {
			content: '→';
			margin-left: 8px;
		}

		.daynight-home-section--vehicle-types :global(.daynight-home-section-banner__cta:hover),
		.daynight-home-section--vehicle-types
			:global(.daynight-home-section-banner__cta:focus-visible) {
			background: transparent !important;
			color: #c91620 !important;
		}
	}
</style>
