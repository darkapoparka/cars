<script lang="ts">
	import { homeDiscoveryCopy } from '$lib/content/home-discovery';
	import { mobileHomeCopy } from '$lib/content/mobile-home';
	import type { homePageData } from '$lib/server/home';
	import { linkHref } from '$lib/utils/links';
	import ReviewCard from '$lib/components/reviews/ReviewCard.svelte';
	import ArticleCard from '$lib/components/blog/ArticleCard.svelte';
	import YouTubeSection from '$lib/components/common/YouTubeSection.svelte';
	import CommerceBanner from '$lib/components/common/CommerceBanner.svelte';
	import HomeBrowseCard from './HomeBrowseCard.svelte';
	import { aboutVideos, youtubeChannelHref } from '$lib/data/about-videos';
	let { data }: { data: ReturnType<typeof homePageData> } = $props();
	const english = $derived(data.locale === 'en');
	const copy = $derived(homeDiscoveryCopy[data.locale]);
	const mobileCopy = $derived(mobileHomeCopy[data.locale]);
	const href = (path: string) => linkHref(path + (english ? '?lang=en' : ''));
</script>

<div class="home-mobile-editorial">
	{#if data.reviewItems.length}
		<section class="site-container editorial-section">
			<header>
				<h2>{copy.reviews}</h2>
			</header>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<div class="review-rail" tabindex="0" role="region" aria-label={copy.reviews}>
				{#each data.reviewItems as review (review.name)}
					<ReviewCard {review} {english} compactRole={copy.customer} />
				{/each}
				<HomeBrowseCard href={href('/reviews')} label={copy.viewAll} context={copy.reviews} />
			</div>
		</section>
	{/if}
	<YouTubeSection
		videos={aboutVideos}
		{english}
		channelHref={youtubeChannelHref}
		mobileHomeTitle={mobileCopy.videos}
	/>
	<section
		class="site-container editorial-section contact-section"
		aria-label={mobileCopy.contactTitle}
	>
		<CommerceBanner
			title={mobileCopy.contactTitle}
			body={mobileCopy.contactBody}
			action={mobileCopy.contactAction}
			href={href('/contact')}
			image="/assets/daynight/banners/commerce-visit"
			compact
		/>
	</section>
	{#if data.posts.length}
		<section class="site-container editorial-section guide-section">
			<header>
				<h2>{copy.guides}</h2>
			</header>
			<div class="guide-list">
				{#each data.posts as post (post.slug)}
					<ArticleCard {post} {english} compact mobileRow readLabel={mobileCopy.read} />
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.home-mobile-editorial {
		display: none;
	}
	@media (max-width: 767.98px) {
		.home-mobile-editorial {
			display: block;
		}
		.editorial-section {
			padding-block: 24px 8px;
		}
		header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			margin-bottom: 12px;
		}
		h2 {
			margin: 0;
			font: var(--bc-weight-heading) 24px/1.25 var(--bc-font-body);
			letter-spacing: -0.025em;
			color: var(--bc-ink);
		}
		.review-rail {
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: 88%;
			gap: 12px;
			overflow-x: auto;
			scroll-snap-type: x proximity;
			padding-block: 2px 8px;
			scrollbar-width: none;
		}
		.review-rail :global(.review-card) {
			padding: 16px;
			gap: 14px;
			background: var(--bc-surface-raised);
			scroll-snap-align: start;
		}
		.review-rail :global(.review-card__avatar) {
			flex-basis: 40px;
			width: 40px;
			height: 40px;
		}
		.review-rail :global(.review-card__person strong) {
			font-size: 16px;
		}
		.guide-list {
			display: grid;
			gap: 12px;
		}
		.guide-section {
			padding-bottom: 24px;
		}
		.guide-list :global(.article-card__image) {
			min-height: 120px;
			object-fit: cover;
		}
		.guide-list :global(.article-card__link) {
			grid-template-columns: 28% minmax(0, 1fr);
		}
		.guide-list :global(.article-card__title) {
			display: block;
			overflow: visible;
			font-size: 16px;
			line-height: 1.3;
		}
		.guide-list :global(.article-card__meta span:last-child) {
			display: none;
		}
		.guide-list :global(.article-card__meta) {
			display: flex;
			font-size: 12px;
		}
		.guide-list :global(.article-card__meta span:first-child) {
			display: block;
		}
		.guide-list :global(.article-card__more) {
			display: flex;
			justify-content: flex-end;
			gap: 6px;
			min-height: 28px;
			font-size: 13px;
			font-weight: var(--bc-weight-body);
			color: var(--bc-muted);
		}
		.guide-list :global(.article-card__body) {
			justify-content: flex-start;
			gap: 6px;
			padding: 12px;
		}
		.contact-section :global(.commerce-banner) {
			aspect-ratio: auto;
			min-height: 148px;
			padding: 16px;
		}
		.contact-section :global(h3) {
			max-width: 65%;
		}
	}
</style>
