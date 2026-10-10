<script lang="ts">
	import { homeDiscoveryCopy } from '$lib/content/home-discovery';
	import { mobileHomeCopy } from '$lib/content/mobile-home';
	import { reviewPresentationCopy } from '$lib/content/reviews';
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
				<h2>{copy.mobileReviews}</h2>
				<span class="sample-label">{reviewPresentationCopy[data.locale].sample}</span>
			</header>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<div class="review-rail" tabindex="0" role="region" aria-label={copy.mobileReviews}>
				{#each data.reviewItems as review (review.name)}
					<ReviewCard {review} {english} compactRole={copy.customer} compact sample />
				{/each}
				<HomeBrowseCard href={href('/reviews')} label={copy.viewAll} context={copy.mobileReviews} />
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
				<h2>{copy.mobileGuides}</h2>
			</header>
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<div class="guide-list" tabindex="0" role="region" aria-label={copy.mobileGuides}>
				{#each data.posts as post (post.slug)}
					<ArticleCard {post} {english} compact readLabel={mobileCopy.read} />
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
			padding-block: var(--bc-space-6) var(--bc-space-2);
		}
		header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: var(--bc-space-3);
			margin-bottom: var(--bc-space-3);
		}
		h2 {
			margin: 0;
			font: var(--bc-mobile-home-section-font);
			letter-spacing: var(--bc-tracking-tight);
			color: var(--bc-ink);
		}
		.sample-label {
			color: var(--bc-muted);
			font: var(--bc-weight-body) var(--bc-mobile-meta)/var(--bc-mobile-meta-leading)
				var(--bc-font-body);
		}
		.review-rail {
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: 88%;
			gap: var(--bc-space-3);
			overflow-x: auto;
			scroll-snap-type: x proximity;
			padding-block: calc(var(--bc-space-1) / 2) var(--bc-space-2);
			scrollbar-width: none;
		}
		.review-rail :global(.review-card) {
			padding: var(--bc-space-4);
			gap: var(--bc-space-3);
			background: var(--bc-surface-raised);
			scroll-snap-align: start;
		}
		.review-rail :global(.review-card__person strong) {
			font: var(--bc-weight-emphasis) var(--bc-mobile-label)/var(--bc-mobile-label-leading)
				var(--bc-font-body);
		}
		.guide-list {
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: 88%;
			gap: var(--bc-space-3);
			overflow-x: auto;
			scroll-snap-type: x proximity;
			overscroll-behavior-x: contain;
			padding-block: calc(var(--bc-space-1) / 2) var(--bc-space-2);
			scrollbar-width: none;
		}
		.guide-list :global(.article-card) {
			scroll-snap-align: start;
		}
		.guide-section {
			padding-bottom: var(--bc-space-6);
		}
		.guide-list :global(.article-card__title) {
			display: block;
			overflow: visible;
			min-height: 0;
			font: var(--bc-weight-heading) var(--bc-mobile-label)/var(--bc-mobile-label-leading)
				var(--bc-font-body);
		}
		.guide-list :global(.article-card__meta span:last-child) {
			display: none;
		}
		.guide-list :global(.article-card__meta) {
			display: flex;
			font: var(--bc-weight-body) var(--bc-mobile-stat)/var(--bc-mobile-stat-leading)
				var(--bc-font-body);
		}
		.guide-list :global(.article-card__meta span:first-child) {
			display: block;
		}
		.guide-list :global(.article-card p) {
			display: none;
		}
		.guide-list :global(.article-card__more) {
			display: flex;
			justify-content: space-between;
			gap: var(--bc-space-2);
			min-height: var(--bc-space-6);
			padding: 0;
			font: var(--bc-weight-body) var(--bc-mobile-meta)/var(--bc-mobile-meta-leading)
				var(--bc-font-body);
			color: var(--bc-muted);
		}
		.guide-list :global(.article-card__more svg) {
			width: var(--bc-control-icon-size-compact);
			height: var(--bc-control-icon-size-compact);
		}
		.guide-list :global(.article-card__body) {
			justify-content: flex-start;
			gap: var(--bc-space-2);
			padding: var(--bc-space-4);
		}
		.contact-section :global(.commerce-banner) {
			aspect-ratio: auto;
			min-height: 148px;
			padding: 16px;
		}
		.contact-section :global(.commerce-banner h3) {
			max-width: 65%;
			font: var(--bc-weight-heading) var(--bc-mobile-section-title)/var(--bc-leading-h3)
				var(--bc-font-body);
		}
	}
</style>
