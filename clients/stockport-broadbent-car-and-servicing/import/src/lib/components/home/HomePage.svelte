<script lang="ts">
	import { homeBrowseArtwork, homeDiscoveryCopy } from '$lib/content/home-discovery';
	import { assetHref } from '$lib/utils/assets';
	import { MediaQuery } from 'svelte/reactivity';
	import type { homePageData } from '$lib/server/home';
	import { linkHref } from '$lib/utils/links';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ReviewCard from '$lib/components/reviews/ReviewCard.svelte';
	import HomeBrowseCard from './HomeBrowseCard.svelte';
	import VehicleCard from '$lib/components/inventory/VehicleCard.svelte';
	import DesktopHero from './DesktopHomeHero.svelte';
	import MobileHero from './HomeFiveHero.svelte';
	import FeaturedMobile from './HomeFiveFeaturedVehicles.svelte';
	import ActionBand from './HomeFiveActionBand.svelte';
	import YouTubeSection from '$lib/components/common/YouTubeSection.svelte';
	import { aboutVideos, youtubeChannelHref } from '$lib/data/about-videos';
	import ArticleCard from '$lib/components/blog/ArticleCard.svelte';
	import HomeMobileEditorial from './HomeMobileEditorial.svelte';
	let { data }: { data: ReturnType<typeof homePageData> } = $props();
	const mobile = new MediaQuery('(max-width: 767.98px)', false);
	const copy = $derived(homeDiscoveryCopy[data.locale]);
	const english = $derived(data.locale === 'en');
	const localized = (url: string) =>
		english ? url + (url.includes('?') ? '&' : '?') + 'lang=en' : url;
	const href = (url: string) => linkHref(localized(url));
</script>

<main id="main-content" class="native-home">
	<div class="home-mobile-entry">
		<MobileHero hero={data.hero} />
		<FeaturedMobile vehicles={data.mobileFeatured} copy={data.copy} compactDesktop />
	</div>
	<div class="home-desktop-entry">
		<DesktopHero hero={data.hero} {english} />
		<section class="site-section site-container site-stack">
			<header class="home-section-heading">
				<h2 class="site-heading home-section-title">{data.copy.featuredTitle}</h2>
			</header>
			<div class="home-vehicles">
				{#each data.featured.slice(0, 3) as card (card.slug)}<VehicleCard {card} {english} />{/each}
				<HomeBrowseCard
					href={localized('/inventory')}
					label={copy.viewAll}
					context={data.copy.featuredTitle}
					artwork={homeBrowseArtwork.inventory}
					desktopOnly
				/>
			</div>
		</section>
	</div>
	<ActionBand copy={data.copy} variant="ownership" />
	<section class="site-section site-container site-stack">
		<h2 class="site-heading home-section-title">
			{mobile.current ? copy.mobileMakes : copy.browseMakes}
		</h2>
		<div class="home-brands">
			{#each data.brands as brand (brand.query)}
				{#if brand.allTile}<HomeBrowseCard
						href={localized(brand.href ?? '/inventory')}
						label={brand.name}
						context={copy.browseMakes}
						desktopOnly
					/>{/if}
				<a
					class:home-mobile-browse={brand.allTile}
					class:home-browse-all={brand.allTile}
					aria-label={brand.allTile ? brand.name : undefined}
					href={href(brand.href ?? '/inventory?brand=' + encodeURIComponent(brand.query))}
					>{#if brand.allTile}<span class="home-browse-icon"
							><ArrowRight size={32} aria-hidden="true" /></span
						>{:else if brand.image}<img
							src={assetHref(brand.image)}
							data-brand={brand.query}
							alt=""
							width="100"
							height="60"
							loading="lazy"
						/>{/if}<strong
						>{#if brand.allTile}<span class="browse-label-full">{brand.name}</span><span
								class="browse-label-short">{copy.all}</span
							>{:else}{brand.name}{/if}</strong
					><span>{brand.count}</span></a
				>{/each}
		</div>
	</section>
	<section class="site-section site-container site-stack">
		<h2 class="site-heading home-section-title">
			{mobile.current ? copy.mobileTypes : copy.browseTypes}
		</h2>
		<div class="home-types">
			{#each data.types as type (type.bodyType)}
				{#if type.allTile}<HomeBrowseCard
						href={localized(type.href)}
						label={type.label}
						context={copy.browseTypes}
						desktopOnly
					/>{/if}
				<a
					class:home-mobile-browse={type.allTile}
					class:home-browse-all={!type.image}
					href={href(type.href)}
					>{#if type.image}<img
							src={assetHref(type.image)}
							alt=""
							width="360"
							height="200"
							loading="lazy"
						/>{:else}<span class="home-browse-icon"
							><ArrowRight size={36} aria-hidden="true" /></span
						>{/if}<strong>{type.label}</strong></a
				>{/each}
		</div>
	</section>
	<HomeMobileEditorial {data} />
	<div class="home-desktop-editorial">
		<YouTubeSection videos={aboutVideos} {english} channelHref={youtubeChannelHref} />
		{#if data.reviewItems.length}
			<section class="site-section site-container site-stack">
				<header class="home-section-heading">
					<h2 class="site-heading home-section-title">
						{copy.reviews}
					</h2>
				</header>
				<!-- Keyboard focus lets readers scroll the review rail with arrow keys. -->
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<div class="home-reviews" tabindex="0" role="region" aria-label={copy.reviews}>
					{#each data.reviewItems as review (review.name)}<ReviewCard
							{review}
							{english}
							compactRole={copy.customer}
						/>{/each}
					<HomeBrowseCard
						href={localized('/reviews')}
						label={copy.viewAll}
						context={copy.reviews}
					/>
				</div>
			</section>
		{/if}
		<ActionBand copy={data.copy} variant="consultation" />
		<section class="site-section site-container site-stack">
			<header class="home-section-heading">
				<h2 class="site-heading home-section-title">
					{copy.guides}
				</h2>
			</header>
			<!-- Keyboard focus lets readers scroll the article rail with arrow keys. -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<div class="home-news" tabindex="0" role="region" aria-label={copy.guides}>
				{#each data.posts as post (post.slug)}<ArticleCard {post} {english} compact />{/each}
				<HomeBrowseCard href={localized('/blog')} label={copy.allGuides} context={copy.guides} />
			</div>
		</section>
	</div>
</main>

<style>
	.home-mobile-entry,
	.home-brands .browse-label-short {
		display: none;
	}
	.home-brands strong span {
		font: inherit;
		color: inherit;
	}

	.home-section-heading {
		text-align: center;
	}
	.home-section-title {
		text-align: center;
	}
	.home-vehicles {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--bc-space-5);
	}
	.home-brands {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: var(--bc-space-3);
	}
	.home-brands a,
	.home-types a {
		display: grid;
		justify-items: center;
		gap: var(--bc-space-2);
		padding: var(--bc-space-4);
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-card);
		background: var(--bc-surface-raised);
		text-decoration: none;
	}
	.home-brands a:hover,
	.home-types a:hover {
		background: var(--bc-surface);
		border-color: var(--bc-border-strong);
	}
	.home-brands .home-mobile-browse,
	.home-types .home-mobile-browse {
		display: none;
	}
	.home-brands img {
		height: 60px;
		width: 100px;
		object-fit: contain;
	}
	.home-brands span {
		font-size: var(--bc-text-meta);
		color: var(--bc-muted);
	}
	.home-types {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--bc-space-4);
	}
	.home-types img {
		width: 100%;
		height: 125px;
		object-fit: contain;
	}
	.home-reviews,
	.home-news {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: var(--bc-space-5);
	}
	@media (min-width: 768px) {
		.home-brands a,
		.home-types a {
			align-content: center;
			gap: var(--bc-space-3);
			padding: var(--bc-space-4);
			border-radius: var(--bc-radius-panel);
		}
		.home-brands strong,
		.home-types strong {
			font: var(--bc-weight-control) var(--bc-text-control)/var(--bc-leading-control)
				var(--bc-font-body);
		}
		.home-brands > a > span {
			font-size: var(--bc-text-label);
		}
	}
	@media (max-width: 1100px) {
		.home-vehicles,
		.home-reviews,
		.home-news {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.home-types {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.home-brands {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
	@media (max-width: 767.98px) {
		.home-desktop-editorial {
			display: none;
		}
		.home-brands .home-mobile-browse,
		.home-types .home-mobile-browse {
			display: grid;
		}
		.site-section {
			padding-block: 20px 12px;
		}
		.site-stack {
			gap: 16px;
		}
		.home-news :global(.article-card__body) {
			padding: 14px;
			gap: 8px;
		}
		.home-news :global(.article-card__image) {
			aspect-ratio: 16 / 9;
		}
		.home-news :global(.article-card__body > p) {
			display: none;
		}

		.home-vehicles,
		.home-types {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.home-brands {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 10px;
		}
		.home-brands a {
			min-height: 108px;
			padding: 10px 8px;
			align-content: center;
			gap: 6px;
		}
		.home-brands img {
			height: 56px;
			width: 88px;
			/* Balance the supplied artwork without changing the label baseline or tile size. */
			transform: scale(var(--brand-optical-scale, 1));
		}
		.home-brands img[data-brand='Tesla'] {
			--brand-optical-scale: 0.8;
		}
		.home-brands img[data-brand='Volvo'] {
			--brand-optical-scale: 0.84;
		}
		.home-brands img[data-brand='BMW'],
		.home-brands img[data-brand='Mercedes-Benz'],
		.home-brands img[data-brand='Porsche'],
		.home-brands img[data-brand='Honda'] {
			--brand-optical-scale: 0.92;
		}
		.home-brands img[data-brand='Toyota'],
		.home-brands img[data-brand='Audi'] {
			--brand-optical-scale: 1.08;
		}
		.home-brands img[data-brand='Ford'],
		.home-brands img[data-brand='Hyundai'] {
			--brand-optical-scale: 1.12;
		}
		.home-types img {
			height: 68px;
		}
		.home-brands span {
			display: none;
		}
		.home-reviews,
		.home-news {
			grid-template-columns: none;
			grid-auto-flow: column;
			grid-auto-columns: 88%;
			overflow-x: auto;
			scroll-snap-type: x proximity;
			gap: 12px;
			padding-bottom: 8px;
			scrollbar-width: thin;
			scrollbar-color: var(--bc-border-strong) transparent;
		}
		.home-reviews :global(.review-card),
		.home-news :global(.article-card) {
			scroll-snap-align: start;
		}
		.home-reviews :global(.review-card) {
			background: var(--bc-surface-raised);
		}
		.home-section-title {
			text-align: left;
		}
	}
	.home-browse-icon {
		display: grid;
		place-items: center;
		height: 60px;
		width: 100%;
	}
	.home-brands a.home-browse-all,
	.home-types a.home-browse-all {
		background: var(--bc-ink);
		border-color: var(--bc-ink);
		color: var(--bc-white);
	}
	.home-brands a.home-browse-all:hover,
	.home-types a.home-browse-all:hover {
		background: var(--bc-dark-hover);
	}
	.home-brands .home-browse-all > span {
		color: var(--bc-dark-muted);
	}
	.home-types .home-browse-icon {
		height: 125px;
	}
	@media (max-width: 767.98px) {
		.home-mobile-entry {
			display: block;
		}
		.home-desktop-entry {
			display: none;
		}
		.home-brands .browse-label-full {
			display: none;
		}
		.home-brands .browse-label-short {
			display: inline;
		}
		.home-brands a.home-browse-all {
			background: var(--bc-surface-raised);
			border-color: var(--bc-border);
			color: var(--bc-ink);
		}
		.home-brands .home-browse-all > span {
			color: var(--bc-ink);
		}
		.home-brands img {
			max-width: 100%;
		}
		.home-brands .home-browse-icon {
			display: grid;
			height: 56px;
		}
		.home-types .home-browse-icon {
			height: 68px;
		}
	}
</style>
