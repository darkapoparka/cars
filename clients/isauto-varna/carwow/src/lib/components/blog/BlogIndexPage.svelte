<script lang="ts">
	// Native self-contained rebuild of the /blog (blog-standard.html) desktop main
	// content: centered intro + the 2-column innerpage layout
	// (featured post-style-2 overlay card + post-style-6 card grid on the left,
	// search/categories/recent-posts/archive/tags widgets in the sticky sidebar).
	// The look that used to come from app.css + StorefrontTemplateContent's :global
	// stylesheet is reproduced as a SELF-CONTAINED scoped style block below (the
	// design-system rules for .post-style-2/.post-style-6/.recent-post/.widget-* are
	// inlined from StorefrontTemplateContent, de-scoped to this component's markup).
	// Brand colours route through tokens (--sa-*); template neutrals stay literal for
	// an exact visual match.

	import { resolve } from '$app/paths';
	import { Search, X } from '@lucide/svelte';
	import DesktopYellowRouteHero from '$lib/components/layout/DesktopYellowRouteHero.svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { DayNightArticle, DayNightArticleCategory } from '$lib/data/daynight-blog';

	type BlogFilters = {
		q: string;
		category: string;
		tag: string;
		archive: string;
	};

	type BlogFilterHref = '/blog' | `/blog?${string}`;

	const blogCategories: DayNightArticleCategory[] = [
		'Покупка',
		'Продажба',
		'Новини',
		'Съвети',
		'Финансиране',
		'Документи',
		'Марки'
	];

	let { articles, filters }: { articles: DayNightArticle[]; filters: BlogFilters } = $props();

	const normalizedFilters = $derived({
		q: normalize(filters.q),
		category: normalize(filters.category),
		tag: normalize(filters.tag),
		archive: normalize(filters.archive)
	});
	const visibleArticles = $derived.by(() =>
		articles.filter((article) => {
			const haystack = normalize(articleHaystack(article));
			const searchTerms = normalizedFilters.q.split(/\s+/).filter(Boolean);

			if (searchTerms.length && !searchTerms.every((term) => haystack.includes(term))) {
				return false;
			}

			if (
				normalizedFilters.category &&
				normalize(article.category) !== normalizedFilters.category
			) {
				return false;
			}

			if (
				normalizedFilters.tag &&
				!normalize(article.tags.join(' ')).includes(normalizedFilters.tag)
			) {
				return false;
			}

			if (
				normalizedFilters.archive &&
				normalize(articleArchiveValue(article)) !== normalizedFilters.archive
			) {
				return false;
			}

			return true;
		})
	);
	const featuredArticle = $derived(visibleArticles[0]);
	const cardArticles = $derived(visibleArticles.filter((article) => article !== featuredArticle));
	const categoryOptions = $derived.by(() =>
		blogCategories
			.map((category) => ({
				value: category,
				label: category,
				count: articles.filter((article) => article.category === category).length
			}))
			.filter((option) => option.count > 0)
	);
	const tagOptions = $derived.by(() =>
		[...new Set(articles.flatMap((article) => article.tags))]
			.sort((first, second) => first.localeCompare(second, 'bg-BG'))
			.slice(0, 12)
			.map((tag) => ({ value: tag, label: tag, count: countTag(tag) }))
	);
	const heroTagOptions = $derived(
		tagOptions
			.filter((option) => !['покупка', 'продажба'].includes(normalize(option.value)))
			.slice(0, 6)
	);
	const hasActiveFilters = $derived(
		Boolean(filters.q || filters.category || filters.tag || filters.archive)
	);

	function normalize(value: string) {
		return value.trim().toLocaleLowerCase('bg-BG');
	}

	function articleArchiveValue(article: DayNightArticle) {
		return article.date.slice(0, 7);
	}

	function articleHaystack(article: DayNightArticle) {
		return [
			article.title,
			article.description,
			article.category,
			article.kind,
			article.author,
			...article.tags,
			...article.body
		].join(' ');
	}

	function countTag(tag: string) {
		return articles.filter((article) => article.tags.includes(tag)).length;
	}

	function formatArticleDate(value: string) {
		return new Intl.DateTimeFormat('bg-BG', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(new Date(`${value}T00:00:00+02:00`));
	}

	function filterHref(next: Partial<BlogFilters>): BlogFilterHref {
		const params = new SvelteURLSearchParams();
		const target = {
			q: filters.q,
			category: filters.category,
			tag: filters.tag,
			archive: filters.archive,
			...next
		};

		if (target.q) params.set('q', target.q);
		if (target.category) params.set('category', target.category);
		if (target.tag) params.set('tag', target.tag);
		if (target.archive) params.set('archive', target.archive);

		const query = params.toString();
		return query ? (`/blog?${query}` as BlogFilterHref) : '/blog';
	}

	function searchHiddenFilters() {
		return [
			['category', filters.category],
			['tag', filters.tag],
			['archive', filters.archive]
		].filter(([, value]) => value);
	}

	function isActiveFilter(name: keyof BlogFilters, value: string) {
		return normalize(filters[name]) === normalize(value);
	}
</script>

{#snippet articleMeta(article: DayNightArticle)}
	<div class="blog-meta">
		{#if article.author}<span>от {article.author}</span>{/if}
		<span>{formatArticleDate(article.date)}</span>
		<span class="blog-meta__category">{article.category}</span>
	</div>
{/snippet}

{#snippet featuredCard(article: DayNightArticle)}
	<a
		href={resolve('/blog/[slug]', { slug: article.slug })}
		class="blog-featured-card"
		data-daynight-article-card
		data-daynight-category={article.category}
		data-daynight-tags={article.tags.join(' ')}
		data-daynight-archive={articleArchiveValue(article)}
		data-daynight-title={article.title}
	>
		<div class="blog-featured-card__image">
			<img
				class="post--img"
				src={article.image}
				alt={article.title}
				loading="eager"
				decoding="async"
			/>
		</div>
		<div class="blog-featured-card__content">
			{@render articleMeta(article)}
			<h2 class="h3 mb-8">{article.title}</h2>
			<p class="text-secondary">{article.description}</p>
		</div>
	</a>
{/snippet}

{#snippet blogHeroControls()}
	<div class="blog-hero-controls">
		<nav class="blog-category-switch" aria-label="Категории">
			<a href={resolve('/blog')} class={!hasActiveFilters ? 'active' : ''}>Всички</a>
			{#each categoryOptions as option (option.value)}
				<a
					href={resolve(
						filterHref({ category: isActiveFilter('category', option.value) ? '' : option.value })
					)}
					class:active={isActiveFilter('category', option.value)}
				>
					{option.label}
				</a>
			{/each}
		</nav>
		<form action={resolve('/blog')} class="blog-hero-search" method="get">
			<label class="sr-only" for="blog-hero-search">Търсене в публикациите</label>
			<div class="blog-hero-search__field">
				<input
					id="blog-hero-search"
					name="q"
					type="search"
					placeholder="Търси съвет, модел или тема..."
					value={filters.q}
				/>
				<button type="submit" aria-label="Търси"><Search size={20} /></button>
			</div>
			{#each searchHiddenFilters() as [name, value] (name)}
				<input type="hidden" {name} {value} />
			{/each}
		</form>
		<div class="blog-quick-row">
			<nav class="blog-quick-topics" aria-label="Бързи теми">
				{#each heroTagOptions as option (option.value)}
					<a
						href={resolve(
							filterHref({ tag: isActiveFilter('tag', option.value) ? '' : option.value })
						)}
						class:active={isActiveFilter('tag', option.value)}
					>
						{option.label}<span>{option.count}</span>
					</a>
				{/each}
			</nav>
			<div class="blog-filter-status" aria-live="polite">
				<span
					>{visibleArticles.length}
					{visibleArticles.length === 1 ? 'публикация' : 'публикации'}</span
				>
				{#if hasActiveFilters}<a href={resolve('/blog')} class="blog-clear-filters"
						><X size={16} />Изчисти</a
					>{/if}
			</div>
		</div>
	</div>
{/snippet}

{#snippet articleCard(article: DayNightArticle)}
	<a
		href={resolve('/blog/[slug]', { slug: article.slug })}
		class="post-style-6 overflow-hidden"
		data-daynight-article-card
		data-daynight-category={article.category}
		data-daynight-tags={article.tags.join(' ')}
		data-daynight-archive={articleArchiveValue(article)}
		data-daynight-title={article.title}
	>
		<div class="image">
			<img
				class="post--img flex"
				src={article.image}
				alt={article.title}
				loading="lazy"
				decoding="async"
			/>
		</div>
		<div class="content">
			{@render articleMeta(article)}
			<h2 class="h4 title mb-12">{article.title}</h2>
			<p class="clamp clamp-2 text-secondary">{article.description}</p>
		</div>
	</a>
{/snippet}

<div class="blog-page">
	<DesktopYellowRouteHero
		headingId="blog-route-title"
		title="Съвети за покупка и продажба"
		panel="light"
		deckWidth="wide"
		children={blogHeroControls}
	/>
	<section class="pb-100">
		<div class="container">
			<div class="blog-page-title">
				<p class="eyebrow">Блог</p>
				<h1>Съвети за покупка и продажба</h1>
				<p class="h7 text-secondary line-height-28">
					Огледи, сравнение на обяви и подготовка за продажба.
				</p>
			</div>

			{#if !articles.length}
				<div class="blog-empty" data-daynight-blog-empty>
					<h2>Все още няма публикувани статии.</h2>
					<p>Имате въпрос за покупка или продажба на автомобил?</p>
					<a class="sa-cta sa-cta-primary" href={resolve('/contact')}>Свържете се с нас</a>
				</div>
			{:else}
				<div class="blog-index-layout">
					<div class="blog-controls" role="search" aria-label="Търсене и категории">
						<form action={resolve('/blog')} class="widget-search mb-34 w-full" method="get">
							<label class="sr-only" for="blog-search">Търсене в публикациите</label>
							<input
								class="input-normal"
								type="search"
								name="q"
								id="blog-search"
								placeholder="Търсене в публикациите..."
								value={filters.q}
							/>
							{#each searchHiddenFilters() as [name, value] (name)}
								<input type="hidden" {name} {value} />
							{/each}
							<button type="submit" class="widget-search-btn" aria-label="Търси">
								<Search size={22} />
							</button>
						</form>
						<ul class="widget-categories blog-mobile-categories">
							<li>
								<a href={resolve('/blog')} class={!hasActiveFilters ? 'active' : ''}>Всички</a>
							</li>
							{#each categoryOptions as option (option.value)}
								<li>
									<a
										href={resolve(filterHref({ category: option.value }))}
										class={isActiveFilter('category', option.value) ? 'active' : ''}
										>{option.label}</a
									>
								</li>
							{/each}
						</ul>
					</div>

					<div class="innerpage__content">
						<div data-daynight-blog-index>
							{#if featuredArticle}
								<div class="blog-magazine">
									{@render featuredCard(featuredArticle)}
									{#if cardArticles.length}
										<div class="blog-magazine__side">
											{#each cardArticles.slice(0, 2) as article (article.slug)}
												{@render articleCard(article)}
											{/each}
										</div>
									{/if}
								</div>
							{/if}

							{#if cardArticles.length > 2}
								<div class="blog-card-grid">
									{#each cardArticles.slice(2) as article (article.slug)}
										{@render articleCard(article)}
									{/each}
								</div>
							{/if}

							{#if !visibleArticles.length}
								<p class="h5 text-secondary daynight-blog-empty mb-40">
									Няма публикации по избраните филтри.
								</p>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</section>
</div>

<style>
	.blog-hero-search {
		display: grid;
		gap: 0;
		padding: 0;
	}

	.blog-hero-search__field {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 44px;
		gap: 4px;
		min-height: 54px;
		padding: 4px;
		border: 1px solid var(--desktop-control-border);
		border-radius: 8px;
		background: #fff;
	}

	.blog-hero-search__field input {
		min-width: 0;
		border: 0;
		background: transparent;
		color: var(--sa-ink);
		font: var(--sa-weight-regular) var(--sa-text-base)/1.4 var(--sa-font);
		outline: 0;
		padding: 0 12px;
	}

	.blog-hero-search__field button {
		display: grid;
		width: 44px;
		height: 44px;
		place-items: center;
		border: 0;
		border-radius: 6px;
		background: var(--desktop-action);
		color: #fff;
		cursor: pointer;
	}

	.blog-hero-search__field:focus-within {
		outline: 2px solid var(--desktop-focus);
		outline-offset: 2px;
	}

	.blog-hero-controls {
		display: grid;
		gap: 12px;
	}

	.blog-category-switch {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		width: min(100%, 360px);
		margin-inline: auto;
		padding: 4px;
		border-radius: 8px;
		background: var(--desktop-field, var(--sa-fill));
	}

	.blog-category-switch a {
		display: inline-flex;
		min-height: 36px;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		color: var(--sa-muted);
		font: var(--sa-button-font-weight) var(--sa-text-caption)/1.2 var(--sa-font);
	}

	.blog-category-switch a:hover,
	.blog-category-switch a:focus-visible {
		color: var(--sa-ink);
	}

	.blog-category-switch a.active {
		background: var(--desktop-action);
		color: #fff;
	}

	.blog-quick-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.blog-quick-topics {
		display: flex;
		min-width: 0;
		align-items: center;
		gap: 8px;
		white-space: nowrap;
	}

	.blog-quick-topics a {
		display: inline-flex;
		min-height: 36px;
		align-items: center;
		gap: 6px;
		padding: 0 12px;
		border: 1px solid var(--desktop-control-border);
		border-radius: 8px;
		background: #fff;
		color: var(--sa-ink);
		font: var(--sa-button-font-weight) var(--sa-text-caption)/1.2 var(--sa-font);
	}

	.blog-quick-topics a span {
		color: var(--sa-muted);
		font-size: var(--sa-text-xs);
		font-weight: var(--sa-button-font-weight);
	}

	.blog-quick-topics a.active {
		border-color: var(--desktop-action);
		background: var(--desktop-action);
		color: #fff;
	}

	.blog-quick-topics a.active span {
		color: rgb(255 255 255 / 72%);
	}

	.blog-filter-status {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-left: auto;
		color: var(--sa-muted);
		font: var(--sa-weight-semibold) var(--sa-text-caption)/1.3 var(--sa-font);
		white-space: nowrap;
	}

	.blog-clear-filters {
		display: inline-flex;
		min-height: 36px;
		align-items: center;
		gap: 6px;
		border: 1px solid var(--desktop-control-border);
		border-radius: 8px;
		padding: 0 11px;
		background: #fff;
		color: var(--sa-ink) !important;
	}

	.blog-clear-filters:hover,
	.blog-clear-filters:focus-visible {
		border-color: var(--desktop-secondary-hover);
		background: var(--desktop-secondary-hover, var(--sa-fill-2));
	}

	@media (min-width: 992px) {
		.blog-controls .widget-search {
			display: none;
		}

		.blog-page {
			padding-top: 0;
		}

		.blog-page-title {
			display: none;
		}

		.blog-page > .pb-100 {
			background: #f4f5f6;
			padding-top: var(--sa-desktop-section-y-md);
		}
	}

	/* Self-contained scoped styles for /blog. These reproduce the rules the legacy
	   app.css + StorefrontTemplateContent :global stylesheet provided for the verbatim
	   class strings used above. Svelte scopes them to this component's markup, so no
	   :global wrapper is required (except :global(svg) for icons and the universal
	   reset). Brand colours route through tokens (--sa-*); template neutrals stay
	   literal for an exact match. */

	/* app.css zeroed every margin and box-sized everything; reproduce that universal
	   reset at low specificity so the .mb-* utilities below (declared later, equal
	   specificity) still win for elements that carry them. */
	.blog-page {
		padding-top: 0;
		box-sizing: border-box;
		color: #1c1c1c;
		font-family: var(--sa-font);
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-regular);
		line-height: 26px;
		letter-spacing: 0;
	}

	.blog-page :global(*) {
		box-sizing: border-box;
	}

	.blog-page :global(h1),
	.blog-page :global(h2),
	.blog-page :global(h3),
	.blog-page :global(p),
	.blog-page :global(ul) {
		margin: 0;
	}

	.blog-page :global(a:not(.sa-cta)) {
		color: inherit;
		text-decoration: none;
	}

	.blog-page :global(img),
	.blog-page :global(svg) {
		display: block;
		max-width: 100%;
	}

	/* Layout container — the legacy `.container` blended app.css (max-width 1440 /
	   padding 0 15px) with StorefrontTemplateContent (width min(100% - 48px, 1320px)).
	   The explicit max-width also defeats Tailwind's built-in `.container`. */
	.container {
		width: min(100% - 48px, 1320px);
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 15px;
	}

	.blog-empty {
		max-width: 760px;
		margin: 0 auto;
		text-align: center;
	}
	.blog-empty h2 {
		font-size: var(--sa-text-xl, var(--sa-text-xl));
		line-height: 1.4;
	}
	.blog-empty p {
		margin-block: 16px 24px;
	}

	/* Section spacing */
	.pb-100 {
		padding-bottom: 100px;
	}

	.mb-8 {
		margin-bottom: 8px;
	}

	.mb-12 {
		margin-bottom: 12px;
	}

	.mb-34 {
		margin-bottom: 34px;
	}

	.mb-40 {
		margin-bottom: 40px;
	}

	.w-full {
		width: 100%;
	}

	/* Flex utilities used by article media/meta snippets. */
	.flex {
		display: flex;
	}

	.overflow-hidden {
		overflow: hidden;
	}

	/* Text utilities */
	.text-secondary {
		color: #667085;
	}

	.line-height-28 {
		line-height: 28px;
	}

	/* Heading utilities. app.css forced font-weight:600 on the whole .h4…h7,h1…h6
	   group; StorefrontTemplateContent re-set .h3/.h4/.h5 weights (winning at source
	   order) while .h7 kept the 600. Reproduce the computed result. */
	.h3 {
		font-size: var(--sa-type-page);
		font-weight: var(--sa-weight-heading);
		line-height: 1.16;
	}

	.h4 {
		font-size: var(--sa-text-card-title);
		font-weight: var(--sa-weight-heading);
		line-height: 1.25;
	}

	.h5 {
		font-size: var(--sa-text-lg);
		font-weight: var(--sa-weight-heading);
		line-height: 1.35;
	}

	.h7 {
		font-size: var(--sa-text-lg);
		font-weight: var(--sa-weight-medium);
		line-height: var(--sa-leading-body);
	}

	.eyebrow {
		margin-bottom: 12px;
		color: var(--sa-blue, #b00000);
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-weight-medium);
		letter-spacing: 0;
		line-height: var(--sa-leading-snug);
		text-transform: none;
	}

	.blog-page h1 {
		color: #111827;
		font-size: var(--sa-text-desktop-hero-title);
		font-weight: var(--sa-weight-heading);
		line-height: 1.08;
		text-align: center;
	}

	/* Centered intro block */
	.blog-page-title {
		margin: 0 auto 40px;
		max-width: 760px;
		text-align: center;
	}

	.blog-page-title h1 {
		margin-bottom: 14px;
	}

	/* The blog is a full-width editorial stream. Search/category discovery lives in
	   the Chroma hero; archive/tag discovery follows the stream instead of consuming
	   a permanent sidebar column. */
	.blog-index-layout,
	.innerpage__content {
		min-width: 0;
		width: 100%;
	}

	.blog-controls {
		display: none;
	}

	.blog-magazine {
		display: grid;
		grid-template-columns: minmax(0, 1.7fr) minmax(320px, 0.8fr);
		gap: 24px;
		min-height: 500px;
		margin-bottom: 24px;
		align-items: stretch;
	}

	.blog-magazine > .blog-featured-card {
		min-height: 100%;
		margin-bottom: 0;
	}

	.blog-magazine__side {
		display: grid;
		grid-template-rows: repeat(2, minmax(0, 1fr));
		gap: 24px;
	}

	.blog-magazine__side .post-style-6 {
		display: grid;
		grid-template-columns: minmax(150px, 0.82fr) minmax(0, 1fr);
		height: 100%;
		min-height: 238px;
		overflow: hidden;
	}

	.blog-magazine__side .post-style-6 .post--img {
		height: 100%;
		aspect-ratio: auto;
	}

	.blog-magazine__side .post-style-6 .content {
		align-self: center;
		padding: 18px;
	}

	.blog-magazine__side .post-style-6 .clamp-2 {
		display: none;
	}

	.blog-card-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
		margin-bottom: 0;
	}

	.post--img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.blog-featured-card,
	.post-style-6 {
		display: block;
		overflow: hidden;
		border: 0;
		border-radius: 16px;
		background: #fff;
		color: #111827;
		box-shadow: 0 8px 24px rgb(15 23 42 / 7%);
		text-decoration: none;
		transition:
			transform 160ms ease,
			box-shadow 160ms ease;
	}

	.blog-featured-card:hover,
	.blog-featured-card:focus-visible,
	.post-style-6:hover,
	.post-style-6:focus-visible {
		transform: translateY(-2px);
		box-shadow: 0 14px 30px rgb(15 23 42 / 10%);
	}

	.blog-featured-card__image {
		height: 330px;
		overflow: hidden;
	}

	.blog-featured-card__content {
		padding: 24px;
	}

	.blog-featured-card__content > p {
		font-size: var(--sa-type-body);
		line-height: 1.55;
	}

	.post-style-6 .image {
		height: 210px;
		overflow: hidden;
	}

	.post-style-6 .content {
		padding: 20px;
	}

	.clamp-2 {
		display: -webkit-box;
		overflow: hidden;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	/* Article meta row */
	.blog-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
		justify-content: flex-start;
		margin-bottom: 12px;
	}

	.blog-meta span {
		font-size: var(--sa-text-sm);
		line-height: 1.4;
	}

	.blog-meta__category {
		color: var(--sa-red);
		font-weight: var(--sa-weight-strong);
		text-transform: uppercase;
	}

	/* Search widget */
	.widget-search {
		position: relative;
	}

	.input-normal {
		width: 100%;
		height: 54px;
		border: 1px solid #d9e0ea;
		border-radius: 8px;
		background: #fff;
		color: #111827;
		font: inherit;
		font-weight: var(--sa-weight-semibold);
		outline: 0;
		padding: 0 16px;
	}

	.widget-search .input-normal {
		padding-right: 54px;
	}

	.input-normal:focus {
		border-color: var(--sa-blue, #b00000);
		box-shadow: 0 0 0 3px rgba(176, 0, 0, 0.14);
	}

	.widget-search-btn {
		position: absolute;
		top: 5px;
		right: 5px;
		display: grid;
		width: 44px;
		height: 44px;
		place-items: center;
		border: 0;
		border-radius: 8px;
		background: var(--sa-line);
		color: var(--sa-blue, #b00000);
		cursor: pointer;
	}

	.widget-search-btn :global(svg) {
		color: #1c1c1c;
	}

	/* Compact mobile category controls. Desktop discovery lives in the hero. */
	.widget-categories {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.widget-categories a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 40px;
		border: 0;
		border-radius: 8px;
		background: var(--desktop-field, var(--sa-fill));
		color: #344054;
		padding: 9px 12px;
		font-weight: var(--sa-button-font-weight);
	}

	.widget-categories a:hover {
		background: var(--desktop-secondary-hover, var(--sa-fill-2));
		color: var(--desktop-action);
	}

	.blog-page .widget-categories a.active {
		background: var(--sa-ink);
		color: #fff;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}

	@media (max-width: 1199px) {
		.blog-magazine {
			grid-template-columns: 1fr;
			min-height: 0;
		}

		.blog-magazine > .blog-featured-card {
			min-height: 360px;
		}

		.blog-magazine__side {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			grid-template-rows: auto;
		}

		.blog-magazine__side .post-style-6 {
			grid-template-columns: 1fr;
		}

		.blog-magazine__side .post-style-6 .post--img {
			height: auto;
			aspect-ratio: 1.55;
		}

		.blog-card-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 991px) {
		.blog-controls {
			display: block;
			margin-bottom: 24px;
		}

		.blog-page-title {
			margin-bottom: 28px;
			text-align: left;
		}

		.blog-page-title h1 {
			font-size: var(--sa-type-page);
			line-height: 1.12;
		}
	}

	@media (max-width: 767px) {
		.blog-page-title h1 {
			text-align: left;
			font-size: var(--sa-text-panel-title);
		}
		.blog-page-title {
			margin-bottom: 24px;
		}
		.blog-controls .widget-search {
			margin-bottom: 16px;
		}
		.blog-controls .widget-categories {
			display: flex;
			gap: 8px;
			overflow-x: auto;
			padding-bottom: 4px;
			margin-bottom: 0;
		}
		.blog-controls .widget-categories li {
			flex: 0 0 auto;
		}
		.blog-controls .widget-categories a {
			gap: 8px;
			white-space: nowrap;
		}
		.blog-magazine,
		.blog-magazine__side,
		.blog-card-grid {
			grid-template-columns: 1fr;
		}
		.blog-featured-card__image {
			height: 220px;
		}
		.blog-featured-card__content {
			padding: 18px;
		}
		.post-style-6,
		.blog-magazine__side .post-style-6 {
			display: grid;
			grid-template-columns: 96px minmax(0, 1fr);
			min-height: 0;
		}
		.post-style-6 .post--img,
		.blog-magazine__side .post-style-6 .post--img {
			height: 100%;
			aspect-ratio: auto;
		}
		.post-style-6 .content,
		.blog-magazine__side .post-style-6 .content {
			padding: 12px;
		}
		.post-style-6 .h4 {
			font-size: var(--sa-text-lg);
		}
		.post-style-6 .blog-meta {
			gap: 4px 8px;
			margin-bottom: 8px;
		}

		.container {
			width: calc(100% - 32px);
			padding: 0;
		}
		.pb-100 {
			padding-bottom: 56px;
		}
	}
</style>
