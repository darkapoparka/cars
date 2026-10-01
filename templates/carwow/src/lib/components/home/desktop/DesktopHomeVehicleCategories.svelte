<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import DesktopSectionHeading from '$lib/components/shared/DesktopSectionHeading.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { resolve } from '$app/paths';
	import { cars } from '$lib/data/daynight-vehicles';
	import {
		desktopOnlyImagePlaceholder,
		desktopOnlySizes,
		desktopOnlySrcset
	} from '$lib/utils/desktop-only-assets';

	const bodyCount = (body: string) =>
		cars.filter((car) => car.body === body || (body === 'SUV' && car.body === 'Джип')).length;

	const formatCount = (count: number) =>
		count > 0 ? i18n.count(count) : i18n.text('Няма наличност');

	// Counts come from live inventory; the canonical desktop can expose the full taxonomy
	// while keeping zero-stock categories honest and visually quiet.
	const allVehicleCategories = [
		{
			id: 'electric',
			title: i18n.t('copy.2f5800eb33f6'),
			query: `fuel=${encodeURIComponent('Електрически')}`,
			count: cars.filter((car) => car.fuel === 'Електрически').length,
			image: '/assets/images/body-type/normalized/body-sedan-transparent.webp'
		},
		{
			id: 'suv',
			title: i18n.t('copy.c3afa6b1101c'),
			query: 'body=SUV',
			count: bodyCount('SUV'),
			image: '/assets/images/body-type/normalized/body-suv-transparent.webp'
		},
		{
			id: 'wagon',
			title: i18n.t('copy.3a5801952ee8'),
			query: `body=${encodeURIComponent('Комби')}`,
			count: bodyCount('Комби'),
			image: '/assets/images/body-type/generated/body-wagon-studio-card-v1.webp'
		},
		{
			id: 'hatchback',
			title: i18n.t('copy.04a0ade45bf6'),
			query: `body=${encodeURIComponent('Хечбек')}`,
			count: bodyCount('Хечбек'),
			image: '/assets/images/body-type/normalized/body-hatchback-transparent.webp'
		},
		{
			id: 'sedan',
			title: i18n.t('copy.37327507b148'),
			query: `body=${encodeURIComponent('Седан')}`,
			count: bodyCount('Седан'),
			image: '/assets/images/body-type/generated/body-sedan-studio-card-v1.webp'
		},
		{
			id: 'coupe',
			title: i18n.t('copy.4554631dfefd'),
			query: `body=${encodeURIComponent('Купе')}`,
			count: bodyCount('Купе'),
			image: '/assets/images/body-type/generated/body-coupe-studio-card-v1.webp'
		},
		{
			id: 'van',
			title: i18n.t('copy.ea1d9f17bdef'),
			query: `body=${encodeURIComponent('Ван')}`,
			count: bodyCount('Ван'),
			image: '/assets/images/body-type/generated/body-mpv-studio-card-v1.webp'
		},
		{
			id: 'convertible',
			title: i18n.t('copy.1983c8d39bf3'),
			query: `body=${encodeURIComponent('Кабрио')}`,
			count: bodyCount('Кабрио'),
			image: '/assets/images/body-type/normalized/body-coupe-transparent.webp'
		}
	];

	let {
		title = i18n.t('copy.c5b39ab615ea'),
		ctaLabel = i18n.t('copy.b026ee3ab143'),
		showEmptyCategories = true
	}: {
		title?: string;
		ctaLabel?: string;
		showEmptyCategories?: boolean;
	} = $props();

	let vehicleCategories = $derived(
		showEmptyCategories
			? [...allVehicleCategories].sort(
					(left, right) => Number(right.count > 0) - Number(left.count > 0)
				)
			: allVehicleCategories.filter((category) => category.count > 0)
	);
</script>

<section class="daynight-home-section daynight-home-section--vehicle-types">
	<div class="daynight-home-container home-browse-heading">
		<DesktopSectionHeading {title} centered />
	</div>
	<div class="daynight-home-section-content daynight-home-container">
		<div class="daynight-vehicle-types">
			<div class="daynight-vehicle-types__grid">
				{#each vehicleCategories.slice(0, 7) as category (category.id)}
					<div class="daynight-vehicle-types__item">
						<a
							href={i18n.href(`${resolve('/inventory')}?${category.query}`)}
							class={`daynight-vehicle-type-card${category.count === 0 ? ' daynight-vehicle-type-card--empty' : ''}`}
						>
							<div class="daynight-vehicle-type-card__image">
								<img
									src={i18n.asset(desktopOnlyImagePlaceholder)}
									srcset={desktopOnlySrcset(category.image, 600)}
									sizes={desktopOnlySizes('220px')}
									alt={i18n.text(category.title)}
									loading="lazy"
									decoding="async"
								/>
							</div>
							<div class="daynight-vehicle-type-card__content">
								<p class="daynight-vehicle-type-card__title">
									{i18n.text(category.title)}
								</p>
								<p class="daynight-vehicle-type-card__count">
									{formatCount(category.count)}
								</p>
							</div>
						</a>
					</div>
				{/each}
				<div class="daynight-vehicle-types__item">
					<a
						href={i18n.href(resolve('/inventory'))}
						class="daynight-vehicle-type-card desktop-browse-all"
						aria-label={ctaLabel}
					>
						<ArrowRight size={48} strokeWidth={1.5} aria-hidden="true" />
						<span>{i18n.t('copy.5701bc5c6a95')}</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.home-browse-heading {
		padding-top: 36px;
	}
	.daynight-vehicle-types__grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px;
	}
	:global(body.daynight-home-page) .daynight-vehicle-type-card {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 224px;
		background: #fff !important;
		border: 1px solid var(--discovery-control-border) !important;
		border-radius: 12px !important;
		box-shadow: none !important;
		box-sizing: border-box;
		overflow: hidden;
		padding: 16px 12px !important;
		text-align: center;
		transition:
			background-color 140ms ease,
			border-color 140ms ease;
	}
	:global(body.daynight-home-page) .daynight-vehicle-type-card:is(:hover, :focus-visible) {
		background: var(--sa-yellow) !important;
		border-color: var(--sa-yellow) !important;
		box-shadow: none !important;
		transform: none !important;
	}
	:global(body.daynight-home-page) .daynight-vehicle-type-card:focus-visible {
		outline: 2px solid var(--desktop-focus);
		outline-offset: 3px;
	}
	:global(body.daynight-home-page) .daynight-vehicle-type-card__image {
		height: 138px !important;
		margin: 0 !important;
		padding: 0 0 8px !important;
	}
	:global(body.daynight-home-page) .daynight-vehicle-type-card__image img {
		height: 100% !important;
		width: 100% !important;
		object-fit: contain !important;
		mix-blend-mode: multiply;
		transform: none !important;
	}
	:global(body.daynight-home-page) .daynight-vehicle-type-card__content {
		margin: 0 !important;
		padding: 0 !important;
		text-align: center;
	}
	:global(body.daynight-home-page) .daynight-vehicle-type-card__title {
		font: var(--sa-weight-strong) var(--sa-text-xl)/1.3 var(--sa-font) !important;
		margin: 0 0 4px !important;
	}
	:global(body.daynight-home-page) .daynight-vehicle-type-card__count {
		color: var(--discovery-muted) !important;
		font: var(--sa-weight-regular) var(--sa-text-caption)/1.4 var(--sa-font) !important;
		margin: 0 !important;
	}
	:global(body.daynight-home-page)
		.daynight-vehicle-type-card--empty
		.daynight-vehicle-type-card__image
		img {
		opacity: 0.64;
	}
	:global(body.daynight-home-page) .daynight-vehicle-type-card.desktop-browse-all {
		align-items: center;
		justify-content: center;
		gap: 16px;
		background: var(--sa-yellow) !important;
		border-color: var(--sa-yellow) !important;
		color: var(--sa-ink);
		font: var(--sa-weight-strong) var(--sa-text-xl)/1.3 var(--sa-font);
	}
</style>
