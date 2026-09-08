<script lang="ts">
	// Native self-contained rebuild of the /blog (blog-standard.html) desktop main
	// content: breadcrumb + centered intro + the 2-column innerpage layout
	// (featured post-style-2 overlay card + post-style-6 card grid on the left,
	// search/categories/recent-posts/archive/tags widgets in the sticky sidebar).
	// The look that used to come from app.css + StorefrontTemplateContent's :global
	// stylesheet is reproduced as a SELF-CONTAINED scoped style block below (the
	// design-system rules for .post-style-2/.post-style-6/.recent-post/.widget-* are
	// inlined from StorefrontTemplateContent, de-scoped to this component's markup).
	// Brand colours route through tokens (--sa-*); template neutrals stay literal for
	// an exact visual match. The breadcrumb chevron img is replaced with lucide's
	// ChevronRight, matching the other native content routes.

	import { resolve } from '$app/paths';
	import { ChevronRight, Search } from '@lucide/svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import type { DayNightArticle, DayNightArticleCategory } from '$lib/data/daynight-blog';

	type BlogFilters = {
		q: string;
		category: string;
		tag: string;
		archive: string;
	};

	type CountedOption = {
		value: string;
		label: string;
		count: number;
	};
	type BlogFilterHref = '/blog' | `/blog?${string}`;

	const blogCategories: DayNightArticleCategory[] = [
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
	const cardArticles = $derived(visibleArticles.slice(1));
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
	const archiveOptions = $derived.by(() =>
		[
			...articles.reduce<Map<string, number>>((counts, article) => {
				const value = articleArchiveValue(article);
				counts.set(value, (counts.get(value) ?? 0) + 1);
				return counts;
			}, new Map())
		]
			.sort(([first], [second]) => second.localeCompare(first))
			.map(([value, count]) => ({ value, label: formatArticleArchive(value), count }))
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

	function formatArticleArchive(value: string) {
		return new Intl.DateTimeFormat('bg-BG', {
			month: 'long',
			year: 'numeric'
		}).format(new Date(`${value}-01T00:00:00+02:00`));
	}

	function filterHref(next: Partial<BlogFilters>): BlogFilterHref {
		const params = new SvelteURLSearchParams();
		const target = {
			q: '',
			category: '',
			tag: '',
			archive: '',
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

{#snippet articleMeta(article: DayNightArticle, tone: 'light' | 'dark' = 'dark')}
	<div class={tone === 'light' ? 'blog-meta blog-meta--light' : 'blog-meta'}>
		<span>от {article.author}</span>
		<span>{formatArticleDate(article.date)}</span>
		<span class="text-highlight text-underline uppercase">{article.category}</span>
	</div>
{/snippet}

{#snippet featuredCard(article: DayNightArticle)}
	<a
		href={resolve('/blog/[slug]', { slug: article.slug })}
		class="post-style-2 blog-featured-card mb-40 overflow-hidden"
		data-daynight-article-card
		data-daynight-category={article.category}
		data-daynight-tags={article.tags.join(' ')}
		data-daynight-archive={articleArchiveValue(article)}
		data-daynight-title={article.title}
	>
		<img
			class="post--img flex"
			src={article.image}
			alt={article.title}
			loading="eager"
			decoding="async"
		/>
		<div class="content">
			<p class="h3 mb-8 text-white capitalize">{article.title}</p>
			{@render articleMeta(article, 'light')}
		</div>
	</a>
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
			<p class="h4 title mb-12">{article.title}</p>
			<p class="clamp clamp-2 text-secondary">{article.description}</p>
		</div>
	</a>
{/snippet}

{#snippet filterList(title: string, options: CountedOption[], name: 'category' | 'tag' | 'archive')}
	<p class="h4 mb-16">{title}</p>
	<ul class={name === 'tag' ? 'widget-tags mb-32' : 'widget-categories mb-32'}>
		{#each options as option (option.value)}
			<li>
				<a
					href={resolve(filterHref({ [name]: option.value }))}
					class={isActiveFilter(name, option.value) ? 'active' : ''}
				>
					<span class="label">{option.label}</span>
					<span>({option.count})</span>
				</a>
			</li>
		{/each}
	</ul>
{/snippet}

<div class="blog-page">
	<section class="background-light mb-32">
		<div class="container">
			<ul class="breadcrumb">
				<li><a href={resolve('/')}>Начало</a></li>
				<li class="breadcrumb__icon" aria-hidden="true"><ChevronRight size={14} /></li>
				<li><span>Блог</span></li>
			</ul>
		</div>
	</section>

	<section class="pb-100">
		<div class="container">
			<div class="blog-page-title">
				<p class="eyebrow">Полезно от Аутомаркет Варна</p>
				<h1>Съвети за покупка, документи и финансиране</h1>
				<p class="h7 text-secondary line-height-28">
					Практични публикации за употребявани автомобили, огледи, регистрация, бартер и реална
					наличност в Варна.
				</p>
			</div>

			<div class="innerpage-container blog-index-layout">
				<div class="innerpage__content">
					<div data-daynight-blog-index>
						{#if featuredArticle}
							{@render featuredCard(featuredArticle)}
						{/if}

						{#if cardArticles.length}
							<div class="md-grid-cols-1 mb-40 grid grid-cols-2 gap-x-30 gap-y-40">
								{#each cardArticles as article (article.slug)}
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

				<aside class="innerpage__sidebar" aria-label="Филтри за публикации">
					<form action={resolve('/blog')} class="widget-search mb-34 w-full" method="get">
						<label class="sr-only" for="blog-search">Търсене в публикациите</label>
						<input
							class="input-normal"
							type="search"
							name="q"
							id="blog-search"
							placeholder="Търсене в новини..."
							value={filters.q}
						/>
						{#each searchHiddenFilters() as [name, value] (name)}
							<input type="hidden" {name} {value} />
						{/each}
						<button type="submit" class="widget-search-btn" aria-label="Търси">
							<Search size={22} />
						</button>
					</form>

					<p class="h4 mb-16">Категории</p>
					<ul class="widget-categories mb-32">
						<li>
							<a href={resolve(filterHref({}))} class={!hasActiveFilters ? 'active' : ''}>
								<span class="label">Всички публикации</span>
								<span>({articles.length})</span>
							</a>
						</li>
						{#each categoryOptions as option (option.value)}
							<li>
								<a
									href={resolve(filterHref({ category: option.value }))}
									class={isActiveFilter('category', option.value) ? 'active' : ''}
								>
									<span class="label">{option.label}</span>
									<span>({option.count})</span>
								</a>
							</li>
						{/each}
					</ul>

					<div class="divider mb-32 w-full"></div>
					<p class="h4 mb-16 capitalize">Последни публикации</p>
					<div class="mb-32">
						{#each articles.slice(0, 4) as article, index (article.slug)}
							<a
								href={resolve('/blog/[slug]', { slug: article.slug })}
								class="recent-post mb-16 overflow-hidden"
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
									<p class="title h7">{article.title}</p>
								</div>
							</a>
							{#if index < Math.min(articles.length, 4) - 1}
								<div class="divider mb-16 w-full"></div>
							{/if}
						{/each}
					</div>

					<div class="divider mb-32 w-full"></div>
					{@render filterList('Архив', archiveOptions, 'archive')}

					<div class="divider mb-32 w-full"></div>
					{@render filterList('Тагове', tagOptions, 'tag')}
				</aside>
			</div>
		</div>
	</section>
</div>

<style>
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
		box-sizing: border-box;
		color: #1c1c1c;
		font-family: var(--sa-font, 'Manrope', ui-sans-serif, system-ui, sans-serif);
		font-size: 16px;
		font-weight: 400;
		line-height: 26px;
		letter-spacing: 0;
	}

	.blog-page :global(*) {
		box-sizing: border-box;
		margin: 0;
	}

	.blog-page :global(a) {
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

	.background-light {
		background: #f5f7fb;
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

	.mb-16 {
		margin-bottom: 16px;
	}

	.mb-32 {
		margin-bottom: 32px;
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

	/* Grid / flex utilities */
	.grid {
		display: grid;
	}

	.grid-cols-2 {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.gap-y-40 {
		row-gap: 40px;
	}

	.gap-x-30 {
		column-gap: 30px;
	}

	.flex {
		display: flex;
	}

	.overflow-hidden {
		overflow: hidden;
	}

	/* Text utilities */
	.capitalize {
		text-transform: none;
	}

	.uppercase {
		text-transform: uppercase;
	}

	.text-secondary {
		color: #667085;
	}

	.text-highlight {
		color: var(--sa-blue, #B00000);
	}

	.text-white {
		color: #fff;
	}

	.text-underline {
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.line-height-28 {
		line-height: 28px;
	}

	/* Heading utilities. app.css forced font-weight:600 on the whole .h4…h7,h1…h6
	   group; StorefrontTemplateContent re-set .h3/.h4/.h5 weights (winning at source
	   order) while .h7 kept the 600. Reproduce the computed result. */
	.h3 {
		font-size: clamp(24px, 2.4vw, 32px);
		font-weight: 700;
		line-height: 1.16;
	}

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
		font-size: 18px;
		font-weight: 500;
		line-height: var(--sa-leading-body);
	}

	.eyebrow {
		margin-bottom: 12px;
		color: var(--sa-blue, #B00000);
		font-size: var(--sa-text-sm);
		font-weight: var(--sa-weight-medium);
		letter-spacing: 0;
		line-height: var(--sa-leading-snug);
		text-transform: none;
	}

	.blog-page h1 {
		color: #111827;
		font-size: clamp(36px, 4vw, 56px);
		font-weight: 700;
		line-height: 1.08;
		text-align: center;
	}

	/* Breadcrumb (values shared with the other native content routes: min-height 76px,
	   gap 10px, ul #5f6877 14/700, a/span 14/400 line-height 22, a #1c1c1c, span
	   #667085, icon 14px @ 0.72 opacity). */
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

	/* Centered intro block */
	.blog-page-title {
		margin: 0 auto 40px;
		max-width: 760px;
		text-align: center;
	}

	.blog-page-title h1 {
		margin-bottom: 14px;
	}

	/* Two-column innerpage layout: content + sticky filter sidebar. */
	.innerpage-container {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
		gap: 42px;
		align-items: start;
	}

	.blog-index-layout {
		align-items: start;
	}

	.innerpage__sidebar {
		position: sticky;
		top: 96px;
	}

	/* Blog cards (post-style-2 featured overlay + post-style-6 grid cards). */
	.post-style-2,
	.post-style-6,
	.recent-post {
		position: relative;
		border-radius: 12px;
		background: #fff;
		color: #111827;
		text-decoration: none;
	}

	.post--img {
		width: 100%;
		aspect-ratio: 1.55;
		object-fit: cover;
	}

	.post-style-2 {
		display: block;
		min-height: 320px;
		overflow: hidden;
	}

	.blog-featured-card {
		display: block;
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

	.post-style-6 {
		display: block;
		border: 1px solid #e4e8ef;
		box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
	}

	.post-style-6 .image,
	.recent-post .image {
		overflow: hidden;
	}

	.post-style-6 .content {
		padding: 22px;
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

	.blog-meta--light span {
		color: #fff;
		font-size: var(--sa-text-sm);
	}

	/* Recent-post compact card in the sidebar */
	.recent-post {
		display: grid;
		grid-template-columns: 92px minmax(0, 1fr);
		gap: 14px;
	}

	.recent-post .post--img {
		height: 78px;
		aspect-ratio: auto;
		border-radius: 8px;
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
		font-weight: 600;
		outline: 0;
		padding: 0 16px;
	}

	.widget-search .input-normal {
		padding-right: 54px;
	}

	.input-normal:focus {
		border-color: var(--sa-blue, #B00000);
		box-shadow: 0 0 0 3px rgba(176, 0, 0, 0.14);
	}

	.widget-search-btn {
		position: absolute;
		top: 6px;
		right: 6px;
		display: grid;
		width: 42px;
		height: 42px;
		place-items: center;
		border: 0;
		border-radius: 8px;
		background: #eef4ff;
		color: var(--sa-blue, #B00000);
		cursor: pointer;
	}

	.widget-search-btn :global(svg) {
		color: #1c1c1c;
	}

	/* Category / tag widgets */
	.widget-categories,
	.widget-tags {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.widget-categories a,
	.widget-tags a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 44px;
		border: 1px solid #e4e8ef;
		border-radius: 8px;
		background: #fff;
		color: #344054;
		padding: 10px 12px;
		font-weight: var(--sa-weight-semibold);
	}

	.widget-categories a.active,
	.widget-tags a.active,
	.widget-categories a:hover,
	.widget-tags a:hover {
		border-color: var(--sa-blue, #B00000);
		background: #eef4ff;
		color: var(--sa-blue, #B00000);
	}

	.widget-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.widget-tags a {
		gap: 8px;
		justify-content: center;
	}

	.divider {
		height: 1px;
		background: #e4e8ef;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}

	@media (max-width: 1100px) {
		.innerpage-container {
			grid-template-columns: 1fr;
		}

		.innerpage__sidebar {
			position: static;
		}
	}

	@media (max-width: 991px) {
		.blog-page-title {
			margin-bottom: 28px;
			text-align: left;
		}

		.blog-page-title h1 {
			font-size: 32px;
			line-height: 1.12;
		}
	}

	@media (max-width: 767px) {
		.container {
			width: min(100% - 32px, 1320px);
		}

		.pb-100 {
			padding-bottom: 56px;
		}

		.md-grid-cols-1,
		.grid-cols-2 {
			grid-template-columns: 1fr;
		}
	}
</style>
