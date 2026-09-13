<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveNewsPost } from '$lib/auxero/home-five';
	import { daynightAssets } from '$lib/data/daynight';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';
	import HomeSectionCta from './HomeSectionCta.svelte';

	let { copy, posts }: { copy: HomePageCopy; posts: HomeFiveNewsPost[] } = $props();

	let cards = $derived(posts.slice(0, 3));
	const readAllBlogTitle = $derived(
		copy.newsTitle === 'Day Night Auto notes' ? 'Read all blog posts' : 'Виж всички статии'
	);
	const brandedNewsTitle = $derived(/daynight/i.test(copy.newsTitle));
	const brandFirstNewsTitle = $derived(copy.newsTitle.toLowerCase().startsWith('daynight'));
	const newsTitleWithoutBrand = $derived(copy.newsTitle.replace(/daynight/i, '').trim());
</script>

{#if cards.length}
	<section class="daynight-news-section py-100">
		<div class="container">
			<div class="title-section daynight-news-banner wow fadeInDown mb-40" data-wow-delay="0.1s">
				<h2>
					{#if brandedNewsTitle}
						{#if brandFirstNewsTitle}
							<picture class="daynight-news-banner__brand">
								<source media="(max-width: 767px)" srcset={daynightAssets.logoLight} />
								<img
									src={daynightAssets.logoDark}
									alt="Day Night Auto"
									width="220"
									height="58"
									loading="lazy"
									decoding="async"
								/>
							</picture>
							{#if newsTitleWithoutBrand}
								<span>{newsTitleWithoutBrand}</span>
							{/if}
						{:else}
							{#if newsTitleWithoutBrand}
								<span>{newsTitleWithoutBrand}</span>
							{/if}
							<picture class="daynight-news-banner__brand">
								<source media="(max-width: 767px)" srcset={daynightAssets.logoLight} />
								<img
									src={daynightAssets.logoDark}
									alt="Day Night Auto"
									width="220"
									height="58"
									loading="lazy"
									decoding="async"
								/>
							</picture>
						{/if}
					{:else}
						{copy.newsTitle}
					{/if}
				</h2>
				<HomeSectionCta href="/blog" label={copy.commonCta} />
			</div>
			<div class="daynight-news-grid wow fadeInUp" data-wow-delay="0.1s">
				{#each cards as post (post.slug)}
					<a href={resolve(`/blog/${post.slug}`)} class="daynight-news-card">
						<img
							class="daynight-news-card__img"
							src={post.image}
							alt=""
							width="760"
							height="500"
							loading="lazy"
							decoding="async"
						/>
						<span class="daynight-news-card__category">{post.category}</span>
						<span class="daynight-news-card__content">
							<span class="daynight-news-card__meta">
								<span>{copy.byline}</span>
								<span aria-hidden="true">•</span>
								<span>{post.date}</span>
							</span>
							<span class="daynight-news-card__title">{post.title}</span>
							<span class="daynight-news-card__cta">
								<span class="daynight-news-card__cta-label">{copy.readMore}</span>
								<span class="daynight-news-card__icon" aria-hidden="true">
									<ArrowRight size={14} strokeWidth={2.7} />
								</span>
							</span>
						</span>
					</a>
				{/each}
				<a href={resolve('/blog')} class="daynight-news-all-card">
					<span class="daynight-news-all-card__preview" aria-hidden="true">
						{#each cards as post (post.slug)}
							<img
								src={post.image}
								alt=""
								width="120"
								height="144"
								loading="lazy"
								decoding="async"
							/>
						{/each}
					</span>
					<span class="daynight-news-card__content">
						<span class="daynight-news-all-card__title">{readAllBlogTitle}</span>
						<span class="daynight-news-card__cta">
							<span class="daynight-news-card__cta-label">{copy.commonCta}</span><ArrowRight
								size={16}
								aria-hidden="true"
							/>
						</span>
					</span>
				</a>
			</div>
		</div>
	</section>
{/if}

<style>
	.daynight-news-section {
		background-color: var(--bc-bg);
		padding-top: 64px;
		padding-bottom: 64px;
	}

	.daynight-news-banner {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		background: linear-gradient(
			135deg,
			var(--bc-ink) 0%,
			var(--bc-ink) 58%,
			var(--bc-showcase-dark-panel) 100%
		);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
		padding: 24px 28px;
	}

	.daynight-news-banner h2 {
		display: inline-flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 14px;
		color: var(--bc-white);
		margin: 0;
	}

	.daynight-news-banner h2 span {
		color: inherit !important;
		font: inherit;
		line-height: inherit;
	}

	.daynight-news-banner__brand {
		display: inline-flex;
		width: clamp(198px, 18vw, 286px);
		line-height: 1;
	}

	.daynight-news-banner__brand img {
		display: block;
		width: 100%;
		height: auto;
	}

	.daynight-news-grid {
		display: grid;
		gap: 24px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.daynight-news-card {
		aspect-ratio: 3 / 2;
		border-radius: 16px;
		color: var(--bc-white);
		display: flex;
		isolation: isolate;
		overflow: hidden;
		position: relative;
	}

	.daynight-news-card::after {
		background: linear-gradient(
			180deg,
			rgba(16, 17, 19, 0) 32%,
			rgba(16, 17, 19, 0.28) 52%,
			rgba(16, 17, 19, 0.84) 85%
		);
		content: '';
		inset: 0;
		position: absolute;
		z-index: 1;
	}

	.daynight-news-card:hover {
		color: var(--bc-white);
	}

	/* Tactile press feedback (instant translateY, matching the hero/PDP idiom). */
	.daynight-news-card:active,
	.daynight-news-all-card:active {
		transform: translateY(1px);
	}

	.daynight-news-card__img {
		height: 100%;
		left: 0;
		object-fit: cover;
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 0;
	}

	.daynight-news-card__category {
		background: rgba(13, 20, 12, 0.5);
		-webkit-backdrop-filter: blur(6px);
		backdrop-filter: blur(6px);
		border: 1px solid rgba(255, 255, 255, 0.26);
		border-radius: 999px;
		color: var(--bc-white);
		font-size: 11px;
		font-weight: 600;
		left: 18px;
		letter-spacing: 0.05em;
		padding: 6px 13px;
		position: absolute;
		text-transform: uppercase;
		top: 18px;
		z-index: 2;
	}

	.daynight-news-card__content {
		display: flex;
		flex-direction: column;
		gap: 7px;
		margin-top: auto;
		padding: 20px 22px 20px;
		position: relative;
		z-index: 2;
	}

	.daynight-news-card__meta {
		align-items: center;
		color: var(--bc-white);
		display: flex;
		font-size: 13px;
		font-weight: 600;
		gap: 8px;
		text-shadow: 0 1px 8px rgba(13, 20, 12, 0.6);
	}

	/* The inner spans inherit a near-black template colour otherwise */
	.daynight-news-card__meta span {
		color: var(--bc-white);
	}

	.daynight-news-card__title {
		color: var(--bc-white);
		display: block;
		font-size: 18px;
		font-weight: 700;
		line-height: 1.35;
		overflow-wrap: anywhere;
	}

	.daynight-news-card__cta {
		align-items: center;
		width: fit-content;
		border-radius: 999px;
		background: var(--bc-accent);
		color: var(--bc-white);
		display: inline-flex;
		font-size: 14px;
		font-weight: 700;
		gap: 9px;
		margin-top: 5px;
		padding: 7px 8px 7px 14px;
		transition:
			background-color 0.18s ease,
			color 0.18s ease;
	}

	.daynight-news-card:hover .daynight-news-card__cta,
	.daynight-news-card:focus-visible .daynight-news-card__cta {
		background: var(--bc-accent-hover);
		color: var(--bc-white);
	}

	.daynight-news-card__cta :global(svg) {
		flex: 0 0 auto;
	}

	.daynight-news-card__icon {
		display: inline-flex;
		width: 22px;
		height: 22px;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--bc-ink);
		color: var(--bc-white);
	}

	.daynight-news-card__icon :global(svg),
	.daynight-news-card__icon :global(path),
	.daynight-news-card__icon :global(line),
	.daynight-news-card__icon :global(polyline) {
		color: var(--bc-white) !important;
		stroke: var(--bc-white) !important;
	}

	.daynight-news-all-card {
		display: none;
	}

	.daynight-news-card:focus-visible,
	.daynight-news-all-card:focus-visible {
		outline: 2px solid var(--bc-focus);
		outline-offset: 4px;
	}

	@media (max-width: 991px) {
		.daynight-news-grid {
			grid-template-columns: 1fr;
			margin: 0 auto;
			max-width: 460px;
		}
	}

	@media (max-width: 767px) {
		.daynight-news-section {
			padding-top: 28px;
			padding-bottom: 32px;
		}

		.daynight-news-section :global(.title-section) {
			align-items: flex-start;
			justify-content: flex-start;
			margin-bottom: 18px !important;
			text-align: left;
		}

		.daynight-news-banner {
			overflow: visible;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			padding: 0;
		}

		.daynight-news-section :global(.title-section a) {
			display: none !important;
		}

		.daynight-news-section :global(.title-section h2) {
			gap: 9px;
			color: var(--bc-ink);
			margin: 0;
			font-size: 24px;
			font-weight: 700;
			letter-spacing: 0;
			line-height: 30px;
			text-align: left;
		}

		.daynight-news-banner__brand {
			width: min(45vw, 174px);
			transform: translateY(1px);
		}

		.daynight-news-grid {
			display: flex;
			gap: 14px;
			max-width: none;
			margin-inline: -15px;
			padding: 6px 15px;
			overflow-x: auto;
			scroll-snap-type: x proximity;
			scroll-padding-inline: 15px;
			scrollbar-width: none;
		}

		.daynight-news-grid::-webkit-scrollbar {
			display: none;
		}

		.daynight-news-card,
		.daynight-news-all-card {
			display: flex;
			flex: 0 0 min(82vw, 320px);
			flex-direction: column;
			aspect-ratio: auto;
			min-height: 0;
			border-radius: var(--bc-radius-card);
			background: var(--bc-card-bg);
			color: var(--bc-ink);
			overflow: hidden;
			scroll-snap-align: start;
		}

		.daynight-news-card::after,
		.daynight-news-card__category,
		.daynight-news-card__meta {
			display: none;
		}

		.daynight-news-card__img {
			position: static;
			display: block;
			width: 100%;
			height: 144px;
			object-fit: cover;
		}

		.daynight-news-card__content {
			display: grid;
			grid-template-columns: minmax(0, 1fr) 20px;
			align-items: center;
			flex: 1;
			gap: 12px;
			margin: 0;
			padding: 14px;
			min-width: 0;
		}

		.daynight-news-card__title,
		.daynight-news-all-card__title {
			display: -webkit-box;
			min-height: 66px;
			overflow: hidden;
			color: var(--bc-ink);
			font-size: var(--bc-mobile-card-title);
			font-weight: var(--bc-weight-heading);
			line-height: var(--bc-mobile-card-title-leading);
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
			line-clamp: 3;
		}

		.daynight-news-card__cta {
			width: 20px;
			height: 24px;
			min-height: 0;
			margin: 0;
			padding: 0;
			background: transparent;
			color: var(--bc-ink);
		}
		.daynight-news-card__cta-label {
			display: none;
		}
		.daynight-news-card:hover .daynight-news-card__cta,
		.daynight-news-card:focus-visible .daynight-news-card__cta,
		.daynight-news-all-card:hover .daynight-news-card__cta,
		.daynight-news-all-card:focus-visible .daynight-news-card__cta {
			background: transparent;
			color: var(--bc-accent);
		}
		.daynight-news-card__icon :global(svg),
		.daynight-news-card__icon :global(svg *) {
			color: var(--bc-ink) !important;
			stroke: var(--bc-ink) !important;
		}

		.daynight-news-card__icon {
			background: transparent;
			width: 16px;
			height: 16px;
		}

		.daynight-news-all-card__preview {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 4px;
			height: 144px;
		}

		.daynight-news-all-card__preview img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	@media (min-width: 768px) {
		.daynight-news-card__title {
			min-height: 52px;
			font-size: 19px;
			line-height: 26px;
		}
		.daynight-news-card__cta {
			background: transparent;
			border-radius: 0;
			padding: 0;
			min-height: 32px;
			gap: 8px;
			font-size: 15px;
		}
		.daynight-news-card__icon {
			background: transparent;
		}
		.daynight-news-card:hover .daynight-news-card__cta {
			background: transparent;
			text-decoration: underline;
		}
	}
</style>
