<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HomeFiveNewsPost } from '$lib/auxero/home-five';
	import { eliqautoAssets } from '$lib/data/eliqauto';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import { ArrowRight } from '@lucide/svelte';
	import HomeSectionCta from './HomeSectionCta.svelte';

	let { copy, posts }: { copy: HomePageCopy; posts: HomeFiveNewsPost[] } = $props();

	let cards = $derived(posts.slice(0, 4));
	const editorialImages: Record<string, string> = {
		'vnos-ot-kanada-proverka': '/assets/eliqauto/editorial/inspection-v1.webp',
		'gotov-za-registracia': '/assets/eliqauto/editorial/registration-v1.webp',
		'prodai-avtomobila-si': '/assets/eliqauto/editorial/selling-v1.webp'
	};
	const editorialTitles: Record<string, string> = {
		'vnos-ot-kanada-proverka': 'Проверка на кола преди внос',
		'gotov-za-registracia': 'Какво е „готов за регистрация“',
		'prodai-avtomobila-si': 'Оценка на клиентски автомобил',
		'snimki-za-avtomobilna-obyava': 'Как да снимате кола за обява'
	};
	const readAllBlogTitle = $derived(
		copy.newsTitle === 'Eliq Auto notes' ? 'Read all blog posts' : 'Виж всички статии'
	);
	const readAllBlogCopy = $derived(
		copy.newsTitle === 'Eliq Auto notes'
			? 'Import, registration, and selling guides in one place.'
			: 'Съвети за внос, регистрация и продажба на автомобил.'
	);
	const brandedNewsTitle = $derived(/eliqauto/i.test(copy.newsTitle));
	const brandFirstNewsTitle = $derived(copy.newsTitle.toLowerCase().startsWith('eliqauto'));
	const newsTitleWithoutBrand = $derived(copy.newsTitle.replace(/eliqauto/i, '').trim());
</script>

{#if cards.length}
	<section class="eliqauto-news-section py-100">
		<div class="container">
			<div class="title-section eliqauto-news-banner wow fadeInDown mb-40" data-wow-delay="0.1s">
				<h2>
					{#if brandedNewsTitle}
						{#if brandFirstNewsTitle}
							<picture class="eliqauto-news-banner__brand">
								<source media="(max-width: 767px)" srcset={eliqautoAssets.logoLight} />
								<img
									src={eliqautoAssets.logoDark}
									alt="Eliqauto"
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
							<picture class="eliqauto-news-banner__brand">
								<source media="(max-width: 767px)" srcset={eliqautoAssets.logoLight} />
								<img
									src={eliqautoAssets.logoDark}
									alt="Eliqauto"
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
			<div class="eliqauto-news-grid wow fadeInUp" data-wow-delay="0.1s">
				{#each cards as post (post.slug)}
					<a href={resolve(`/blog/${post.slug}`)} class="eliqauto-news-card">
						<picture class="eliqauto-news-card__media">
							<source
								media="(min-width: 768px)"
								srcset={editorialImages[post.slug] ?? post.image}
							/>
							<img
								class="eliqauto-news-card__img"
								src={post.image}
								alt=""
								width="760"
								height="500"
								loading="lazy"
								decoding="async"
							/>
						</picture>
						<span class="eliqauto-news-card__category">{post.category}</span>
						<span class="eliqauto-news-card__content">
							<span class="eliqauto-news-card__meta">
								<span>{copy.byline}</span>
								<span aria-hidden="true">•</span>
								<span>{post.date}</span>
							</span>
							<span class="eliqauto-news-card__title" title={post.title}>
								<span class="eliqauto-news-card__desktop-title"
									>{editorialTitles[post.slug] ?? post.title}</span
								>
								<span class="eliqauto-news-card__mobile-title">{post.title}</span>
							</span>
							<span class="eliqauto-news-card__cta">
								{copy.readMore}
								<span class="eliqauto-news-card__icon" aria-hidden="true">
									<ArrowRight size={14} strokeWidth={2.7} />
								</span>
							</span>
						</span>
					</a>
				{/each}
				<a href={resolve('/blog')} class="eliqauto-news-all-card">
					<span class="eliqauto-news-all-card__topline">
						<img
							class="eliqauto-news-all-card__brand"
							src={eliqautoAssets.logoLight}
							alt="Eliqauto"
							width="220"
							height="58"
							loading="lazy"
							decoding="async"
						/>
					</span>
					<span class="eliqauto-news-all-card__title">{readAllBlogTitle}</span>
					<span class="eliqauto-news-all-card__copy">{readAllBlogCopy}</span>
					<span class="eliqauto-news-all-card__cta">
						<span>{copy.readMore}</span>
						<span class="eliqauto-news-all-card__icon" aria-hidden="true">
							<ArrowRight size={15} strokeWidth={2.7} />
						</span>
					</span>
				</a>
			</div>
		</div>
	</section>
{/if}

<style>
	.eliqauto-news-section {
		background-color: var(--bc-bg);
		padding-top: 64px;
		padding-bottom: 64px;
	}

	.eliqauto-news-banner {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
		border: 1px solid #2e2e34;
		border-radius: 8px;
		background: #18181b;
		box-shadow: none;
		min-height: 104px;
		padding: 28px 32px;
	}

	.eliqauto-news-banner h2 {
		display: inline-flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 14px;
		margin: 0;
		color: #ffffff;
		font-family: var(--bc-font-body);
		font-size: 40px;
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: 1.1;
	}

	.eliqauto-news-banner h2 span {
		color: inherit;
		font: inherit;
		line-height: inherit;
	}

	.eliqauto-news-banner__brand {
		display: inline-flex;
		width: clamp(198px, 18vw, 286px);
		line-height: 1;
	}

	.eliqauto-news-banner__brand img {
		display: block;
		width: 100%;
		height: auto;
	}

	.eliqauto-news-grid {
		display: grid;
		gap: 24px;
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.eliqauto-news-card {
		aspect-ratio: 3 / 2;
		border-radius: 16px;
		color: #ffffff;
		display: flex;
		isolation: isolate;
		overflow: hidden;
		position: relative;
	}

	.eliqauto-news-card::after {
		background: linear-gradient(
			180deg,
			rgba(13, 20, 12, 0) 16%,
			rgba(13, 20, 12, 0.62) 44%,
			rgba(13, 20, 12, 0.97) 78%
		);
		content: '';
		inset: 0;
		position: absolute;
		z-index: 1;
	}

	.eliqauto-news-card:hover {
		color: #ffffff;
	}

	/* Tactile press feedback (instant translateY, matching the hero/PDP idiom). */
	.eliqauto-news-card:active,
	.eliqauto-news-all-card:active {
		transform: translateY(1px);
	}

	.eliqauto-news-card__img {
		height: 100%;
		left: 0;
		object-fit: cover;
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 0;
	}

	.eliqauto-news-card__category {
		background: rgba(13, 20, 12, 0.5);
		-webkit-backdrop-filter: blur(6px);
		backdrop-filter: blur(6px);
		border: 1px solid rgba(255, 255, 255, 0.26);
		border-radius: 999px;
		color: #ffffff;
		font-size: 14px;
		font-weight: 700;
		left: 18px;
		letter-spacing: 0;
		line-height: 20px;
		padding: 7px 14px;
		position: absolute;
		text-transform: uppercase;
		top: 18px;
		z-index: 2;
	}

	.eliqauto-news-card__content {
		display: flex;
		flex-direction: column;
		gap: 7px;
		margin-top: auto;
		padding: 20px 22px 20px;
		position: relative;
		z-index: 2;
	}

	.eliqauto-news-card__meta {
		align-items: center;
		color: #ffffff;
		display: flex;
		font-size: 14px;
		font-weight: 600;
		gap: 8px;
		line-height: 20px;
		text-shadow: 0 1px 8px rgba(13, 20, 12, 0.6);
	}

	/* The inner spans inherit a near-black template colour otherwise */
	.eliqauto-news-card__meta span {
		color: #ffffff;
	}

	.eliqauto-news-card__title {
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		color: #ffffff;
		display: -webkit-box;
		font-size: 20px;
		font-weight: 700;
		line-clamp: 2;
		line-height: 1.24;
		overflow: hidden;
	}

	.eliqauto-news-card__cta {
		align-items: center;
		width: fit-content;
		border-radius: 999px;
		background: var(--bc-accent);
		color: var(--bc-accent-contrast);
		display: inline-flex;
		font-size: 15px;
		font-weight: 700;
		gap: 9px;
		line-height: 20px;
		margin-top: 5px;
		padding: 7px 8px 7px 14px;
		transition:
			background-color 0.18s ease,
			color 0.18s ease;
	}

	.eliqauto-news-card:hover .eliqauto-news-card__cta,
	.eliqauto-news-card:focus-visible .eliqauto-news-card__cta {
		background: #ffffff;
		color: #2a0c0c;
	}

	.eliqauto-news-card__cta :global(svg) {
		flex: 0 0 auto;
	}

	.eliqauto-news-card__icon {
		display: inline-flex;
		width: 22px;
		height: 22px;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: #2a0c0c;
		color: #ffffff;
	}

	.eliqauto-news-card__icon :global(svg),
	.eliqauto-news-card__icon :global(path),
	.eliqauto-news-card__icon :global(line),
	.eliqauto-news-card__icon :global(polyline) {
		color: #ffffff;
		stroke: #ffffff;
	}

	.eliqauto-news-all-card {
		display: none;
	}

	.eliqauto-news-card__desktop-title {
		display: none;
	}

	.eliqauto-news-card__title span {
		color: inherit;
		font: inherit;
	}

	@media (max-width: 991px) {
		.eliqauto-news-grid {
			grid-template-columns: 1fr;
			margin: 0 auto;
			max-width: 460px;
		}
	}

	@media (min-width: 768px) {
		.eliqauto-news-card__desktop-title {
			display: inline;
		}

		.eliqauto-news-card__mobile-title {
			display: none;
		}

		.eliqauto-news-grid {
			max-width: none;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.eliqauto-news-card {
			aspect-ratio: auto;
			flex-direction: column;
			border: 1px solid #e4e4e7;
			border-radius: 12px;
			background: #ffffff;
			color: #18181b;
		}

		.eliqauto-news-card::after,
		.eliqauto-news-card__category {
			display: none;
		}

		.eliqauto-news-card__media {
			display: block;
			aspect-ratio: 5 / 2;
			border-radius: 0;
			overflow: hidden;
		}

		.eliqauto-news-card__img {
			position: static;
			width: 100%;
			height: 100%;
		}

		.eliqauto-news-card__content {
			flex: 1;
			margin: 0;
			gap: 8px;
			padding: 16px;
		}

		.eliqauto-news-card__meta,
		.eliqauto-news-card__meta span {
			color: #52525b;
			text-shadow: none;
			font-size: 15px;
			font-weight: 400;
		}

		.eliqauto-news-card__meta {
			margin-top: auto;
		}

		.eliqauto-news-card__title {
			order: -1;
			margin-bottom: 4px;
			display: -webkit-box;
			min-height: 2.6em;
			color: #18181b;
			font-size: 20px;
			line-height: 1.3;
			overflow: hidden;
			-webkit-line-clamp: 2;
			line-clamp: 2;
		}

		.eliqauto-news-card__cta,
		.eliqauto-news-card:hover .eliqauto-news-card__cta,
		.eliqauto-news-card:focus-visible .eliqauto-news-card__cta {
			margin-top: 0;
			min-height: 44px;
			padding: 0 12px;
			border: 1px solid #d4d4d8;
			border-radius: 8px;
			background: transparent;
			color: #3f3f46;
			font-size: 16px;
		}

		.eliqauto-news-card:hover .eliqauto-news-card__cta,
		.eliqauto-news-card:focus-visible .eliqauto-news-card__cta {
			border-color: var(--bc-accent);
			color: var(--bc-accent);
		}

		.eliqauto-news-card__icon {
			background: transparent;
			color: inherit;
		}

		.eliqauto-news-card__icon :global(svg),
		.eliqauto-news-card__icon :global(path),
		.eliqauto-news-card__icon :global(line),
		.eliqauto-news-card__icon :global(polyline) {
			color: currentColor;
			stroke: currentColor;
		}

		.eliqauto-news-card:hover .eliqauto-news-card__title,
		.eliqauto-news-card:focus-visible .eliqauto-news-card__title {
			color: var(--bc-accent);
			text-decoration: underline;
			text-underline-offset: 4px;
		}

		.eliqauto-news-card:focus-visible {
			outline: 2px solid var(--bc-accent);
			outline-offset: 4px;
		}

		.eliqauto-news-card:active {
			transform: none;
		}
	}

	@media (min-width: 1200px) {
		.eliqauto-news-grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (max-width: 767px) {
		.eliqauto-news-card:nth-child(n + 4) {
			display: none;
		}
		.eliqauto-news-section {
			background-color: #ffffff;
			padding-top: 28px;
			padding-bottom: 32px;
		}

		.eliqauto-news-section :global(.title-section) {
			align-items: flex-start;
			justify-content: flex-start;
			margin-bottom: 18px;
			text-align: left;
		}

		.eliqauto-news-banner {
			overflow: visible;
			border: 0;
			border-radius: 0;
			background: transparent;
			box-shadow: none;
			min-height: 0;
			padding: 0;
		}

		.eliqauto-news-section :global(.title-section a) {
			display: none;
		}

		.eliqauto-news-section :global(.title-section h2) {
			gap: 9px;
			color: #1c1c1c;
			margin: 0;
			font-size: 24px;
			font-weight: 700;
			letter-spacing: 0;
			line-height: 30px;
			text-align: left;
		}

		.eliqauto-news-banner__brand {
			width: min(45vw, 174px);
			transform: translateY(1px);
		}

		.eliqauto-news-grid {
			gap: 18px;
		}

		.eliqauto-news-card {
			aspect-ratio: 1.9 / 1;
			border-radius: 14px;
		}

		.eliqauto-news-card::after {
			background: linear-gradient(
				180deg,
				rgba(13, 20, 12, 0.06) 0%,
				rgba(13, 20, 12, 0.52) 34%,
				rgba(13, 20, 12, 0.98) 74%
			);
		}

		.eliqauto-news-card__category {
			left: 18px;
			top: 14px;
			font-size: var(--bc-text-micro);
			line-height: 16px;
			padding: 5px 11px;
		}

		.eliqauto-news-card__content {
			gap: 4px;
			margin-top: auto;
			padding: 0 20px 13px;
		}

		.eliqauto-news-card__meta {
			font-size: 14px;
			line-height: 18px;
		}

		.eliqauto-news-card__title {
			-webkit-line-clamp: 2;
			font-size: 18px;
			line-clamp: 2;
			line-height: 24px;
		}

		.eliqauto-news-card__cta {
			margin-top: 2px;
			gap: 8px;
			font-size: 14px;
			line-height: 20px;
			padding: 6px 8px 6px 13px;
		}

		.eliqauto-news-all-card {
			display: flex;
			min-height: 184px;
			aspect-ratio: auto;
			flex-direction: column;
			gap: 8px;
			overflow: hidden;
			border-radius: 16px;
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.34), transparent 34%), #a51717;
			color: #ffffff;
			padding: 20px;
			position: relative;
			isolation: isolate;
		}

		.eliqauto-news-all-card::after {
			position: absolute;
			inset: 0;
			background-image: linear-gradient(135deg, rgba(24, 20, 20, 0.12) 1px, transparent 1px);
			background-size: 18px 18px;
			content: '';
			opacity: 0.22;
			pointer-events: none;
			z-index: -1;
		}

		.eliqauto-news-all-card:hover {
			background: linear-gradient(135deg, rgba(255, 255, 255, 0.34), transparent 34%), #a51717;
			color: #ffffff;
			transform: none;
		}

		.eliqauto-news-all-card__topline {
			display: flex;
			align-items: flex-start;
			justify-content: flex-start;
		}

		.eliqauto-news-all-card__brand {
			display: block;
			width: 134px;
			max-width: 52%;
			height: auto;
			box-sizing: border-box;
			border-radius: 999px;
			background: rgb(255 255 255 / 0.86);
			padding: 6px 9px;
		}

		.eliqauto-news-all-card__title {
			display: block;
			color: #ffffff;
			max-width: 260px;
			margin-top: 8px;
			font-size: 24px;
			font-weight: 700;
			letter-spacing: 0;
			line-height: 28px;
		}

		.eliqauto-news-all-card__copy {
			display: block;
			max-width: 290px;
			color: rgba(255, 255, 255, 0.88);
			font-size: 14px;
			font-weight: 600;
			line-height: 20px;
		}

		.eliqauto-news-all-card__cta {
			display: inline-flex;
			width: fit-content;
			align-items: center;
			justify-content: center;
			gap: 9px;
			margin-top: 4px;
			border-radius: 999px;
			background: #2a0c0c;
			color: #ffffff;
			font-size: 14px;
			font-weight: 700;
			line-height: 20px;
			padding: 8px 10px 8px 16px;
			transition:
				background-color 0.18s ease,
				color 0.18s ease;
		}

		.eliqauto-news-all-card:hover .eliqauto-news-all-card__cta,
		.eliqauto-news-all-card:focus-visible .eliqauto-news-all-card__cta {
			background: #ffffff;
			color: #2a0c0c;
		}

		.eliqauto-news-all-card__cta span {
			color: inherit;
		}

		.eliqauto-news-all-card__icon {
			display: inline-flex;
			width: 24px;
			height: 24px;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: #ffffff;
			color: #2a0c0c;
		}

		.eliqauto-news-all-card__icon :global(svg),
		.eliqauto-news-all-card__icon :global(path),
		.eliqauto-news-all-card__icon :global(line),
		.eliqauto-news-all-card__icon :global(polyline) {
			color: #2a0c0c;
			stroke: #2a0c0c;
		}
	}
</style>
