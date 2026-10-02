<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import MobileBlogIndex from './MobileBlogIndex.svelte';
	import { getViewportContext } from '$lib/hooks/viewport.svelte';
	const viewport = getViewportContext();
	import { Search, X } from '@lucide/svelte';
	import DesktopYellowRouteHero from '$lib/components/layout/DesktopYellowRouteHero.svelte';
	import '$lib/styles/desktop-page-frame.css';
	import '$lib/styles/desktop-discovery.css';
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

	const desktopCategories: DayNightArticleCategory[] = ['Покупка', 'Продажба'];

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
	const quickTagOptions = $derived(
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
		return new Intl.DateTimeFormat(i18n.locale === 'bg' ? 'bg-BG' : 'en-GB', {
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

	function topicLabel(value: string) {
		const label = i18n.text(value);
		return label.charAt(0).toLocaleUpperCase(i18n.locale) + label.slice(1);
	}
</script>

{#snippet articleMeta(article: DayNightArticle)}
	<div class="blog-meta">
		{#if article.author}<span>{i18n.t('copy.5f201355756a')} {article.author}</span>{/if}
		<span>{formatArticleDate(article.date)}</span>
		<span class="blog-meta__category">{i18n.text(article.category)}</span>
	</div>
{/snippet}

{#snippet articleCard(article: DayNightArticle)}
	<a
		href={i18n.href(resolve('/blog/[slug]', { slug: article.slug }))}
		class="blog-article-card"
		data-daynight-article-card
		data-daynight-category={article.category}
		data-daynight-tags={article.tags.join(' ')}
		data-daynight-archive={articleArchiveValue(article)}
		data-daynight-title={article.title}
	>
		<div class="blog-article-card__media">
			<img
				src={i18n.asset(article.image)}
				alt={i18n.text(article.title)}
				width="960"
				height="540"
				loading="lazy"
				decoding="async"
			/>
		</div>
		<div class="blog-article-card__body">
			{@render articleMeta(article)}
			<h2>{i18n.text(article.title)}</h2>
			<p>{i18n.text(article.description)}</p>
		</div>
	</a>
{/snippet}

{#snippet blogHeroControls()}
	<div class="blog-hero-controls">
		<nav class="blog-category-switch" aria-label={i18n.t('copy.05f6c615a351')}>
			<a
				href={i18n.href(resolve(filterHref({ category: '' })))}
				aria-current={!normalizedFilters.category ? 'true' : undefined}
				>{i18n.t('copy.117d98cb652c')}</a
			>
			{#each desktopCategories as category (category)}
				<a
					href={i18n.href(resolve(filterHref({ category })))}
					aria-current={isActiveFilter('category', category) ? 'true' : undefined}
					>{i18n.text(category)}</a
				>
			{/each}
		</nav>
		<form action={i18n.href(resolve('/blog'))} class="blog-hero-search" method="get">
			<label class="sr-only" for="blog-hero-search">{i18n.t('copy.c744f13b5bc2')}</label>
			<div class="blog-hero-search__field">
				<input
					{@attach i18n.validation}
					id="blog-hero-search"
					name="q"
					type="search"
					placeholder={i18n.t('copy.da85f2b76310')}
					value={filters.q}
				/>
				<button type="submit" aria-label={i18n.t('copy.6517beda9674')}><Search size={20} /></button>
			</div>
			{#each searchHiddenFilters() as [name, value] (name)}
				<input type="hidden" {name} {value} />
			{/each}
		</form>
	</div>
{/snippet}

{#snippet blogResultControls()}
	<div class="blog-quick-row">
		<nav class="blog-quick-topics" aria-label={i18n.t('copy.318780093288')}>
			{#each categoryOptions.filter((option) => !desktopCategories.includes(option.value)) as option (option.value)}
				<a
					href={i18n.href(resolve(filterHref({ category: option.value })))}
					class="blog-topic-pill"
					class:is-active={isActiveFilter('category', option.value)}
					aria-current={isActiveFilter('category', option.value) ? 'true' : undefined}
					>{topicLabel(option.label)}</a
				>
			{/each}
			{#each quickTagOptions as option (option.value)}
				<a
					href={i18n.href(
						resolve(filterHref({ tag: isActiveFilter('tag', option.value) ? '' : option.value }))
					)}
					class="blog-topic-pill"
					class:is-active={isActiveFilter('tag', option.value)}
					aria-current={isActiveFilter('tag', option.value) ? 'true' : undefined}
					>{topicLabel(option.label)}</a
				>
			{/each}
		</nav>
		<div class="blog-filter-status" aria-live="polite">
			<span
				>{visibleArticles.length}
				{visibleArticles.length === 1
					? i18n.t('copy.53e0a90d4d5b')
					: i18n.t('copy.320493d7cb5d')}</span
			>
			{#if hasActiveFilters}
				<a href={i18n.href(resolve('/blog'))} class="blog-clear-filters"
					><X size={16} />{i18n.t('copy.fc38aced5a1d')}</a
				>
			{/if}
		</div>
	</div>
{/snippet}

{#if viewport.mobile}
	<MobileBlogIndex
		articles={visibleArticles}
		{filters}
		{filterHref}
		categories={[
			{ value: i18n.t('copy.807eb4d2438b'), label: i18n.t('copy.807eb4d2438b') },
			...categoryOptions.filter((option) => option.value !== 'Новини')
		]}
	/>
{:else}
	<div class="blog-page desktop-discovery-theme">
		<DesktopYellowRouteHero
			headingId="blog-route-title"
			title={i18n.t('copy.9651258a1b3e')}
			deckLayout="segmented"
			children={blogHeroControls}
		/>
		<section class="blog-list" aria-labelledby="blog-route-title">
			<div class="blog-container" data-daynight-blog-index>
				{@render blogResultControls()}
				{#if !articles.length}
					<div class="blog-empty" data-daynight-blog-empty>
						<h2>{i18n.t('copy.16352908518e')}</h2>
						<p>{i18n.t('copy.66b85c422167')}</p>
						<a class="sa-cta sa-cta-primary" href={i18n.href(resolve('/contact'))}
							>{i18n.t('copy.ef106e677853')}</a
						>
					</div>
				{:else if !visibleArticles.length}
					<div class="blog-empty" role="status">
						<p>{i18n.t('copy.35c9f823a4d2')}</p>
						<a class="sa-cta sa-cta-secondary" href={i18n.href(resolve('/blog'))}
							>{i18n.t('copy.fc38aced5a1d')}</a
						>
					</div>
				{:else}
					<div class="blog-card-grid">
						{#each visibleArticles as article (article.slug)}
							{@render articleCard(article)}
						{/each}
					</div>
				{/if}
			</div>
		</section>
	</div>
{/if}

<style>
	.blog-page {
		background: var(--discovery-canvas);
		color: var(--sa-ink);
		font-family: var(--sa-font);
	}
	.blog-page a:not(.sa-cta) {
		text-decoration: none;
	}
	.blog-hero-controls {
		display: grid;
		text-align: left;
	}
	.blog-quick-topics {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}
	.blog-category-switch {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		border-radius: 12px 12px 0 0;
		background: var(--discovery-action);
		overflow: hidden;
	}
	.blog-category-switch a {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		min-height: 52px;
		padding: 0 20px;
		border: 0;
		border-radius: 0;
		background: transparent;
		color: #fff;
		font: var(--sa-weight-medium) var(--sa-text-body-sm)/1.2 var(--sa-font);
		white-space: nowrap;
		transition: background-color 140ms ease;
	}
	.blog-category-switch a:hover {
		background: #4b5256;
	}
	.blog-category-switch a[aria-current='true'] {
		background: var(--discovery-panel);
		color: var(--discovery-ink);
		font-weight: var(--sa-weight-semibold);
	}
	.blog-category-switch a[aria-current='true']:hover {
		background: var(--discovery-muted-surface);
	}
	.blog-category-switch a:focus-visible {
		outline-offset: -4px !important;
	}
	.blog-hero-search {
		margin: 0;
		padding: 20px 40px 24px;
	}
	.blog-hero-search__field {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 44px;
		align-items: center;
		gap: 4px;
		height: 54px;
		padding: 4px;
		border: 1px solid var(--discovery-control-border);
		border-radius: var(--discovery-search-radius);
		background: #fff;
	}
	.blog-hero-search__field input {
		min-width: 0;
		width: 100%;
		height: 44px;
		margin: 0;
		padding: 0 15px;
		border: 0;
		background: transparent;
		color: var(--sa-ink);
		font: var(--sa-weight-regular) var(--sa-text-base)/1.4 var(--sa-font);
		outline: 0;
		box-shadow: none;
	}
	.blog-hero-search__field button {
		display: grid;
		width: 44px;
		height: 44px;
		place-items: center;
		padding: 0;
		border: 0;
		border-radius: var(--discovery-search-action-radius);
		background: var(--sa-yellow);
		color: var(--sa-ink);
		cursor: pointer;
	}
	.blog-hero-search__field button :global(svg) {
		color: inherit;
	}
	.blog-hero-search__field button:hover {
		background: color-mix(in srgb, var(--sa-yellow) 92%, var(--sa-ink));
	}
	.blog-hero-search__field:focus-within {
		outline: 2px solid var(--desktop-focus);
		outline-offset: 3px;
	}
	.blog-quick-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 20px;
		padding: 12px 16px;
		border-radius: 12px;
		background: var(--discovery-panel);
	}
	.blog-topic-pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		height: 40px;
		padding: 0 16px;
		border: 0;
		border-radius: 999px;
		background: var(--discovery-muted-surface);
		color: var(--discovery-ink);
		font: var(--sa-weight-medium) var(--sa-text-caption)/1.2 var(--sa-font);
		white-space: nowrap;
		transition: background-color 140ms ease;
	}
	.blog-topic-pill:hover {
		background: #e8ebee;
	}
	.blog-topic-pill.is-active {
		background: var(--sa-yellow);
		font-weight: var(--sa-weight-semibold);
	}
	.blog-topic-pill.is-active:hover {
		background: color-mix(in srgb, var(--sa-yellow) 92%, var(--sa-ink));
	}
	.blog-filter-status {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-left: auto;
		color: var(--discovery-muted);
		font: var(--sa-weight-regular) var(--sa-text-caption)/1.4 var(--sa-font);
		white-space: nowrap;
	}
	.blog-clear-filters {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 40px;
		padding: 0 12px;
		border: 0;
		border-radius: 999px;
		color: var(--sa-ink);
		background: transparent;
	}
	.blog-clear-filters:hover {
		background: var(--discovery-muted-surface);
	}
	.blog-list {
		padding: 24px 0 64px;
	}
	.blog-container {
		width: var(--desktop-content-width);
		max-width: var(--desktop-content-max);
		margin-inline: auto;
	}
	.blog-card-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 20px;
	}
	.blog-article-card {
		display: flex;
		flex-direction: column;
		min-width: 0;
		overflow: hidden;
		border: 1px solid var(--discovery-control-border);
		border-radius: 12px;
		background: #fff;
		color: var(--sa-ink);
	}
	.blog-article-card:hover {
		border-color: var(--discovery-border-hover);
	}
	.blog-article-card__media {
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--discovery-muted-surface);
	}
	.blog-article-card__media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.blog-article-card__body {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-width: 0;
		padding: 18px;
	}
	.blog-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
		color: var(--discovery-muted);
		font: var(--sa-weight-regular) var(--sa-text-caption)/1.4 var(--sa-font);
	}
	.blog-meta__category {
		padding: 2px 6px;
		border-radius: 4px;
		background: var(--discovery-muted-surface);
		color: var(--sa-ink);
		font-weight: var(--sa-weight-medium);
	}
	.blog-article-card h2 {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		min-height: 2lh;
		overflow: hidden;
		margin: 0;
		color: var(--sa-ink);
		font: var(--sa-weight-strong) var(--sa-text-xl)/1.3 var(--sa-font);
		letter-spacing: -0.02em;
	}
	.blog-article-card p {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		margin: 12px 0 0;
		color: var(--discovery-muted);
		font: var(--sa-weight-regular) var(--sa-text-caption)/1.5 var(--sa-font);
	}
	.blog-empty {
		max-width: 760px;
		margin-inline: auto;
		padding: 32px;
		border: 1px solid var(--discovery-control-border);
		border-radius: 12px;
		background: #fff;
		text-align: center;
	}
	.blog-empty h2 {
		margin: 0;
		font: var(--sa-weight-strong) var(--sa-text-xl)/1.4 var(--sa-font);
	}
	.blog-empty p {
		margin: 12px 0 24px;
		font: var(--sa-weight-regular) var(--sa-text-base)/1.5 var(--sa-font);
	}
	.blog-page :is(a, button):focus-visible {
		outline: 2px solid var(--desktop-focus);
		outline-offset: 3px;
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	@media (min-width: 992px) and (max-width: 1199px) {
		.blog-card-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
