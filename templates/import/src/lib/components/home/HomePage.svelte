<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { MediaQuery } from 'svelte/reactivity';
	import type { homePageData } from '$lib/server/home';
	import { linkHref } from '$lib/utils/links';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import LayoutGrid from '@lucide/svelte/icons/layout-grid';
	import ReviewCard from '$lib/components/reviews/ReviewCard.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import VehicleCard from '$lib/components/inventory/VehicleCard.svelte';
	import DesktopHero from './DesktopHomeHero.svelte';
	import MobileHero from './HomeFiveHero.svelte';
	import FeaturedMobile from './HomeFiveFeaturedVehicles.svelte';
	import ActionBand from './HomeFiveActionBand.svelte';
	import YouTubeSection from '$lib/components/common/YouTubeSection.svelte';
	import { aboutVideos } from '$lib/data/about-videos';
	import ArticleCard from '$lib/components/blog/ArticleCard.svelte';
	let { data }: { data: ReturnType<typeof homePageData> } = $props();
	const mobile = new MediaQuery('(max-width: 767.98px)', false);
	const english = $derived(data.locale === 'en');
	const localized = (url: string) =>
		english ? url + (url.includes('?') ? '&' : '?') + 'lang=en' : url;
	const href = (url: string) => linkHref(localized(url));
</script>

<main id="main-content" class="native-home">
	{#if mobile.current}
		<MobileHero hero={data.hero} />
		<FeaturedMobile vehicles={data.mobileFeatured} copy={data.copy} compactDesktop />
	{:else}
		<DesktopHero hero={data.hero} {english} />
		<section class="site-section site-container site-stack">
			<header class="home-section-heading">
				<h2 class="site-heading home-section-title">{data.copy.featuredTitle}</h2>
			</header>
			<div class="home-vehicles">
				{#each data.featured.slice(0, 4) as card (card.slug)}<VehicleCard {card} {english} />{/each}
			</div>
			<div class="home-section-action">
				<Action href={localized('/inventory')} variant="strong"
					>{english ? 'View all' : 'Виж всички'}<ArrowRight size={18} aria-hidden="true" /></Action
				>
			</div>
		</section>
	{/if}
	<ActionBand copy={data.copy} variant="ownership" />
	<section class="site-section site-container site-stack">
		<h2 class="site-heading home-section-title">
			{english ? 'Browse by make' : mobile.current ? 'Марки' : 'Разгледай по марка'}
		</h2>
		<div class="home-brands">
			{#each data.brands as brand (brand.query)}<a
					class:home-browse-all={brand.allTile}
					href={linkHref(href(brand.href ?? '/inventory?brand=' + encodeURIComponent(brand.query)))}
					>{#if brand.allTile}<span class="home-browse-icon"
							><LayoutGrid size={32} aria-hidden="true" /></span
						>{:else if brand.image}<img
							src={assetHref(brand.image)}
							alt=""
							width="100"
							height="60"
							loading="lazy"
						/>{/if}<strong>{brand.name}</strong><span>{brand.count}</span></a
				>{/each}
		</div>
	</section>
	<section class="site-section site-container site-stack">
		<h2 class="site-heading home-section-title">
			{english ? 'Browse by type' : mobile.current ? 'Типове' : 'Разгледай по тип'}
		</h2>
		<div class="home-types">
			{#each data.types as type (type.bodyType)}<a
					class:home-browse-all={type.bodyType === 'View all' || !type.image}
					href={linkHref(href(type.href))}
					>{#if type.image && type.bodyType !== 'View all'}<img
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
	<YouTubeSection videos={aboutVideos} {english} />
	{#if data.reviewItems.length}
		<section class="site-section site-container site-stack">
			<header class="home-section-heading">
				<h2 class="site-heading home-section-title">
					{english ? 'Customer reviews' : 'Клиентски отзиви'}
				</h2>
			</header>
			<div class="home-reviews">
				{#each data.reviewItems as review (review.name)}<ReviewCard {review} />{/each}
			</div>
			<div class="home-section-action">
				<Action href={localized('/reviews')} variant="strong"
					>{english ? 'View all' : 'Виж всички'}<ArrowRight size={18} aria-hidden="true" /></Action
				>
			</div>
		</section>
	{/if}
	<ActionBand copy={data.copy} variant="consultation" />
	<section class="site-section site-container site-stack">
		<header class="home-section-heading">
			<h2 class="site-heading home-section-title">
				{english ? 'Guides and advice' : 'Полезно за автомобила'}
			</h2>
		</header>
		<div class="home-news">
			{#each data.posts as post (post.slug)}<ArticleCard {post} {english} />{/each}
		</div>
		<div class="home-section-action">
			<Action href={localized('/blog')} variant="strong"
				>{english ? 'All guides' : 'Всички статии'}<ArrowRight
					size={18}
					aria-hidden="true"
				/></Action
			>
		</div>
	</section>
</main>

<style>
	.home-section-heading {
		text-align: center;
	}
	.home-section-title {
		text-align: center;
	}
	.home-section-action {
		display: flex;
		justify-content: center;
		padding-top: var(--bc-space-2);
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
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--bc-space-5);
	}
	@media (max-width: 1100px) {
		.home-vehicles,
		.home-types {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.home-brands {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
	@media (max-width: 767.98px) {
		.home-vehicles,
		.home-types {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.home-brands {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 10px;
		}
		.home-brands a {
			min-height: 132px;
			padding: 12px 8px;
		}
		.home-brands img {
			height: 56px;
			width: 88px;
		}
		.home-types img {
			height: 68px;
		}
		.home-brands span {
			display: none;
		}
		.home-reviews,
		.home-news {
			grid-template-columns: 1fr;
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
		.home-brands .home-browse-icon {
			display: grid;
			height: 56px;
		}
		.home-types .home-browse-icon {
			height: 68px;
		}
	}
</style>
