<script lang="ts">
	// Native self-contained rebuild of the /blog/[slug] (blog-details-2.html) desktop
	// article: breadcrumb + centered title/meta + hero image + body (lead, pull-quote,
	// paired images, sections, tags + share, author card, prev/next) + the "Още по
	// темата" related grid. The look that used to come from app.css +
	// StorefrontTemplateContent's :global stylesheet is reproduced as a SELF-CONTAINED
	// scoped style block below (design-system rules inlined from
	// StorefrontTemplateContent, de-scoped to this component's markup). Brand colours
	// route through tokens (--sa-*); template neutrals stay literal for an exact match.
	// The breadcrumb chevron imgs are replaced with lucide's ChevronRight.

	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ChevronRight, Mail, Share2 } from '@lucide/svelte';
	import { daynightSite } from '$lib/data/daynight-site';
	import type { DayNightArticle } from '$lib/data/daynight-blog';

	type BlogFilterHref = `/blog?${string}`;

	let { article, articles }: { article: DayNightArticle; articles: DayNightArticle[] } = $props();

	const relatedArticles = $derived(
		articles.filter((candidate) => candidate.slug !== article.slug).slice(0, 3)
	);
	const adjacentArticles = $derived.by(() => {
		const sourceArticles = articles.length ? articles : [article];
		const index = sourceArticles.findIndex((candidate) => candidate.slug === article.slug);
		const safeIndex = index === -1 ? 0 : index;

		return {
			previous: sourceArticles[(safeIndex - 1 + sourceArticles.length) % sourceArticles.length],
			next: sourceArticles[(safeIndex + 1) % sourceArticles.length]
		};
	});
	const shareUrl = $derived(`${page.url.origin}${resolve('/blog/[slug]', { slug: article.slug })}`);
	const encodedShareUrl = $derived(encodeURIComponent(shareUrl));
	const encodedShareTitle = $derived(encodeURIComponent(article.title));
	const facebookShareLinkProps = $derived({
		href: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
		target: '_blank',
		rel: 'noopener'
	});
	const mailShareLinkProps = $derived({
		href: `mailto:?subject=${encodedShareTitle}&body=${encodedShareUrl}`
	});
	function formatArticleDate(value: string) {
		return new Intl.DateTimeFormat('bg-BG', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(`${value}T00:00:00+02:00`));
	}

	function filterHref(name: 'category' | 'tag', value: string): BlogFilterHref {
		const params = new URLSearchParams([[name, value]]);
		return `/blog?${params.toString()}` as BlogFilterHref;
	}
</script>

{#snippet articleMeta()}
	<ul class="bloc-details-tag-style-2 mb-40">
		{#if article.author}<li><span class="h7">{article.author}</span></li>{/if}
		<li><a class="h7" href={resolve('/blog')}>{formatArticleDate(article.date)}</a></li>
		<li>
			<a class="h7" href={resolve(filterHref('category', article.category))}>{article.category}</a>
		</li>
	</ul>
{/snippet}

{#snippet socialLinks()}
	<ul class="blog-detail-social flex gap-12">
		<li><p>Сподели:</p></li>
		<li>
			<a {...facebookShareLinkProps} aria-label="Сподели публикацията">
				<Share2 size={18} />
			</a>
		</li>
		<li>
			<a {...mailShareLinkProps} aria-label="Изпрати публикацията по имейл">
				<Mail size={18} />
			</a>
		</li>
	</ul>
{/snippet}

{#snippet relatedCard(related: DayNightArticle)}
	<a href={resolve('/blog/[slug]', { slug: related.slug })} class="post-style-2 overflow-hidden">
		<img
			class="post--img flex"
			src={related.image}
			alt={related.title}
			loading="lazy"
			decoding="async"
		/>
		<div class="content">
			<p class="h5 title mb-8 text-white">{related.title}</p>
			<div class="blog-related-meta flex justify-start gap-8">
				{#if related.author}<span class="text-xs text-white">от {related.author}</span>{/if}
				<span class="text-xs text-white">{formatArticleDate(related.date)}</span>
				<span class="text-highlight text-underline text-xs uppercase">{related.category}</span>
			</div>
		</div>
	</a>
{/snippet}

<div class="blog-article-page">
	<section class="background-light mb-32">
		<div class="container">
			<ul class="breadcrumb">
				<li><a href={resolve('/')}>Начало</a></li>
				<li class="breadcrumb__icon" aria-hidden="true"><ChevronRight size={14} /></li>
				<li><a href={resolve('/blog')}>Блог</a></li>
				<li class="breadcrumb__icon" aria-hidden="true"><ChevronRight size={14} /></li>
				<li><span>{article.category}</span></li>
			</ul>
		</div>
	</section>

	<section>
		<div class="bloc-details-container">
			<h1 class="title-2 mb-16 text-center">{article.title}</h1>
			{@render articleMeta()}
			<img
				class="post--img radius-20 mb-40 flex"
				src={article.image}
				alt={article.title}
				loading="eager"
				decoding="async"
			/>
			<p class="h7 text-secondary line-height-28 mb-28">{article.description}</p>

			{#each article.sections as section (section.heading)}
				<h2 class="h4 mb-12">{section.heading}</h2>
				{#each section.paragraphs as paragraph (paragraph)}
					<p class="text-secondary h7 line-height-28 mb-28">{paragraph}</p>
				{/each}
			{/each}

			<div class="md-flex-col mb-40 flex justify-between gap-16">
				<ul class="blog-detail-tags flex gap-12">
					<li><p>Тема:</p></li>
					{#each article.tags.slice(0, 3) as tag (tag)}
						<li><a href={resolve(filterHref('tag', tag))}>{tag}</a></li>
					{/each}
				</ul>
				{@render socialLinks()}
			</div>

			<div class="divider mb-40"></div>
			<div class="mb-40">
			<div class="listing-details--contact-dealer mb-20">
					<img src="/dealer/logo-dark.svg" alt={daynightSite.shortName} />
					<div class="content">
						<a href={resolve('/about/daynight-auto-plovdiv')} class="h4 font-weight-600 mb-4">
							ЕКСТРА КАР-СМ
						</a>
						<p class="text-secondary mb-18">Автокъща в Варна</p>
						{#if daynightSite.email}
							<a href={`mailto:${daynightSite.email}`} class="text-highlight text-sm">
								{daynightSite.email}
							</a>
						{/if}
					</div>
				</div>
				<p class="h7 line-height-28">
					Имате въпрос за конкретен автомобил? <a href={resolve('/contact')}>Свържете се с екипа</a> и посочете обявата, която ви интересува.
				</p>
			</div>

			<div class="divider mb-26"></div>
			<div class="blog-detail-recentpost mb-24 flex justify-between">
				<div class="previous">
					<p class="font-weight-600 text-highlight mb-4 uppercase">ПРЕДИШНА</p>
					<a
						href={resolve('/blog/[slug]', { slug: adjacentArticles.previous.slug })}
						class="h5 font-weight-500 capitalize"
					>
						{adjacentArticles.previous.title}
					</a>
				</div>
				<div class="next">
					<p class="font-weight-600 text-highlight mb-4 text-right uppercase">СЛЕДВАЩА</p>
					<a
						href={resolve('/blog/[slug]', { slug: adjacentArticles.next.slug })}
						class="h5 font-weight-500 text-right capitalize"
					>
						{adjacentArticles.next.title}
					</a>
				</div>
			</div>
		</div>
	</section>

	{#if relatedArticles.length}
		<section class="py-100">
			<div class="container">
				<h2 class="mb-12 text-center">Още по темата</h2>
				<p class="h7 text-secondary mb-40 text-center">
					Последни новини и практични съвети за покупка, документи, финансиране и наличност.
				</p>
				<div class="md-grid-cols-1 grid grid-cols-3 gap-24">
					{#each relatedArticles as related (related.slug)}
						{@render relatedCard(related)}
					{/each}
				</div>
			</div>
		</section>
	{/if}
</div>

<style>
	/* Self-contained scoped styles for /blog/[slug]. Reproduce the legacy app.css +
	   StorefrontTemplateContent :global rules for the verbatim class strings used
	   above. Brand colours route through tokens (--sa-*); template neutrals stay
	   literal for an exact match. */

	.blog-article-page {
		box-sizing: border-box;
		color: #1c1c1c;
		font-family: var(--sa-font, 'Manrope', ui-sans-serif, system-ui, sans-serif);
		font-size: 16px;
		font-weight: 400;
		line-height: 26px;
		letter-spacing: 0;
	}

	/* Universal reset at low specificity so the .mb-* utilities (declared later, equal
	   specificity) still win for elements that carry them. */
	.blog-article-page :global(*) {
		box-sizing: border-box;
		margin: 0;
	}

	.blog-article-page :global(a) {
		color: inherit;
		text-decoration: none;
	}

	.blog-article-page :global(img),
	.blog-article-page :global(svg) {
		display: block;
		max-width: 100%;
	}

	/* Containers */
	.container {
		width: min(100% - 48px, 1320px);
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 15px;
	}

	.bloc-details-container {
		width: min(100% - 48px, 930px);
		margin: 0 auto;
	}

	.background-light {
		background: #f5f7fb;
	}

	/* Section spacing */
	.py-100 {
		padding-top: 100px;
		padding-bottom: 100px;
	}

	.mb-4 {
		margin-bottom: 4px;
	}

	.mb-8 {
		margin-bottom: 8px;
	}

	.mb-12 {
		margin-bottom: 12px;
	}

	.mb-14 {
		margin-bottom: 14px;
	}

	.mb-16 {
		margin-bottom: 16px;
	}

	.mb-18 {
		margin-bottom: 18px;
	}

	.mb-20 {
		margin-bottom: 20px;
	}

	.mb-24 {
		margin-bottom: 24px;
	}

	.mb-26 {
		margin-bottom: 26px;
	}

	.mb-28 {
		margin-bottom: 28px;
	}

	.mb-32 {
		margin-bottom: 32px;
	}

	.mb-40 {
		margin-bottom: 40px;
	}

	/* Grid / flex utilities */
	.grid {
		display: grid;
	}


	.grid-cols-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.flex {
		display: flex;
	}

	.items-center {
		align-items: center;
	}

	.justify-between {
		justify-content: space-between;
	}

	.justify-start {
		justify-content: flex-start;
	}

	.gap-8 {
		gap: 8px;
	}

	.gap-12 {
		gap: 12px;
	}

	.gap-16 {
		gap: 16px;
	}


	.gap-24 {
		gap: 24px;
	}

	.overflow-hidden {
		overflow: hidden;
	}

	.radius-20 {
		border-radius: 20px;
	}

	/* Text utilities */
	.capitalize {
		text-transform: none;
	}

	.uppercase {
		text-transform: uppercase;
	}

	.text-center {
		text-align: center;
	}

	.text-right {
		text-align: right;
	}

	.text-secondary {
		color: #667085;
	}

	.text-white {
		color: #fff;
	}

	.text-highlight {
		color: var(--sa-blue, #b00000);
	}

	.text-underline {
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.text-sm {
		font-size: 14px;
		line-height: 1.45;
	}

	.text-xs {
		font-size: 12px;
		line-height: 1.35;
	}

	.line-height-28 {
		line-height: 28px;
	}

	.font-weight-500 {
		font-weight: 500;
	}

	.font-weight-600 {
		font-weight: 600;
	}

	/* Heading utilities — app.css forced 600 on the heading group; StorefrontTemplate
	   Content re-set .h4/.h5 to 650 (winning at source order) while .h7 stayed 600. */
	.h4 {
		font-size: 22px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.25;
	}

	.h5 {
		font-size: 18px;
		font-weight: var(--sa-weight-semibold);
		line-height: 1.35;
	}

	.h7 {
		font-size: 16px;
		font-weight: 600;
		line-height: 1.6;
	}

	.title-2 {
		font-size: clamp(34px, 4vw, 54px);
		font-weight: 700;
		line-height: 1.08;
	}

	.blog-article-page h1 {
		color: #111827;
		font-weight: 700;
		line-height: 1.08;
		text-align: center;
	}

	.blog-article-page h2:not(.h4) {
		color: #111827;
		font-size: clamp(32px, 3.2vw, 48px);
		font-weight: 700;
		line-height: 1.08;
	}

	/* Breadcrumb */
	.breadcrumb {
		display: flex;
		min-height: 76px;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
		padding: 0;
		color: #5f6877;
		font-size: 14px;
		font-weight: 700;
		line-height: 22px;
		list-style: none;
	}

	.breadcrumb a,
	.breadcrumb span {
		font-size: 14px;
		font-weight: 400;
		line-height: 22px;
	}

	.breadcrumb a {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		color: #1c1c1c;
	}

	.breadcrumb span {
		color: #667085;
	}

	.breadcrumb__icon {
		display: inline-flex;
		align-items: center;
	}

	.breadcrumb__icon :global(svg) {
		width: 14px;
		height: 14px;
		opacity: 0.72;
	}

	/* Article media */
	.post--img {
		width: 100%;
		aspect-ratio: 1.55;
		object-fit: cover;
	}


	/* Tag + share rows */
	.bloc-details-tag-style-2,
	.blog-detail-tags,
	.blog-detail-social {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.bloc-details-tag-style-2 {
		justify-content: center;
	}

	.bloc-details-tag-style-2 a {
		color: #667085;
	}

	.blog-detail-tags a {
		border: 1px solid #e4e8ef;
		border-radius: 8px;
		background: #fff;
		color: #344054;
		padding: 10px 12px;
		font-weight: var(--sa-weight-semibold);
	}

	.blog-detail-tags a:hover {
		border-color: var(--sa-blue, #b00000);
		background: #eef4ff;
		color: var(--sa-blue, #b00000);
	}

	.blog-detail-social a :global(svg) {
		color: #1c1c1c;
	}

	.divider {
		height: 1px;
		background: #e4e8ef;
	}

	/* Author / dealer card */
	.listing-details--contact-dealer {
		display: grid;
		grid-template-columns: 86px minmax(0, 1fr);
		gap: 18px;
		align-items: center;
		border: 1px solid #e4e8ef;
		border-radius: 12px;
		background: #fff;
		padding: 20px;
		box-shadow: none;
	}

	.listing-details--contact-dealer img {
		width: 86px;
		height: 86px;
		object-fit: contain;
	}

	/* Prev / next */
	.blog-detail-recentpost {
		gap: 22px;
	}

	.blog-detail-recentpost > div {
		max-width: 46%;
	}

	/* Related cards (post-style-2 overlay) */
	.post-style-2 {
		position: relative;
		display: block;
		min-height: 320px;
		overflow: hidden;
		border-radius: 12px;
		background: #fff;
		color: #111827;
		text-decoration: none;
	}

	.post-style-2 .post--img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.post-style-2::after {
		position: absolute;
		inset: 0;
		background: rgba(8, 18, 37, 0.62);
		content: '';
	}

	.post-style-2 .content {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1;
		padding: 26px;
	}

	.blog-related-meta {
		flex-wrap: wrap;
	}

	@media (max-width: 991px) {
		.bloc-details-container .title-2 {
			font-size: 32px;
			line-height: 1.12;
			text-align: left;
		}

		.bloc-details-tag-style-2 {
			justify-content: flex-start;
		}
	}

	@media (max-width: 767px) {
		.container {
			width: min(100% - 32px, 1320px);
		}

		.bloc-details-container {
			width: min(100% - 32px, 930px);
		}

		.py-100 {
			padding-top: 56px;
			padding-bottom: 56px;
		}

		.md-grid-cols-1,
		.grid-cols-3 {
			grid-template-columns: 1fr;
		}

		.md-flex-col {
			flex-direction: column;
		}

		.blog-detail-recentpost {
			align-items: flex-start;
			flex-direction: column;
		}

		.blog-detail-recentpost > div {
			max-width: none;
		}
	}
</style>
