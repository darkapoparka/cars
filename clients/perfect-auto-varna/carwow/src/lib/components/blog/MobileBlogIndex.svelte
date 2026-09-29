<script lang="ts">
	import { routeParts } from '$lib/locale/core';
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import '$lib/styles/mobile-filter-pill.css';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Search, ArrowRight, X } from '@lucide/svelte';
	import type { DayNightArticle } from '$lib/data/daynight-blog';
	type Filters = { q: string; category: string; tag: string; archive: string };
	let {
		articles,
		filters,
		categories,
		filterHref
	}: {
		articles: DayNightArticle[];
		filters: Filters;
		categories: { value: string; label: string }[];
		filterHref: (next: Partial<Filters>) => '/blog' | `/blog?${string}`;
	} = $props();
	const hasFilters = $derived(Object.values(filters).some(Boolean));
	const dateFormat = new Intl.DateTimeFormat(i18n.locale === 'bg' ? 'bg-BG' : 'en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
</script>

<div class="mobile-blog">
	<h1 class="sr-only">{i18n.t('copy.fd9d10272875')}</h1>
	<header class="mobile-blog__top">
		<form
			action={resolve('/blog')}
			method="get"
			role="search"
			aria-label={i18n.t('copy.71e9661e5e2a')}
		>
			<label for="mobile-blog-search" class="sr-only">{i18n.t('copy.c744f13b5bc2')}</label>
			<div class="mobile-blog__search">
				<input
					{@attach i18n.validation}
					id="mobile-blog-search"
					type="search"
					name="q"
					value={filters.q}
					placeholder={i18n.t('copy.f5260831971f')}
					enterkeyhint="search"
				/>
				<button type="submit" aria-label={i18n.t('copy.6517beda9674')}
					><Search size={20} aria-hidden="true" /></button
				>
			</div>
			{#each ['category', 'tag', 'archive'] as name (name)}
				{#if filters[name as keyof Filters]}<input
						type="hidden"
						{name}
						value={filters[name as keyof Filters]}
					/>{/if}
			{/each}
		</form>
		<nav class="mobile-blog__pills" aria-label={i18n.t('copy.e0dfb21481b2')}>
			<a
				href={i18n.href(resolve(filterHref({ category: '' })))}
				class="mobile-filter-pill"
				class:active={!filters.category}
				aria-current={!filters.category ? 'true' : undefined}>{i18n.t('copy.117d98cb652c')}</a
			>
			{#each categories as category (category.value)}
				<a
					href={i18n.href(resolve(filterHref({ category: category.value })))}
					class="mobile-filter-pill"
					class:active={filters.category === category.value}
					aria-current={filters.category === category.value ? 'true' : undefined}
					>{i18n.text(category.label)}</a
				>
			{/each}
		</nav>
	</header>
	<div class="mobile-blog__results">
		<div class="mobile-blog__status">
			<span role="status"
				>{articles.length}
				{articles.length === 1 ? i18n.t('copy.53e0a90d4d5b') : i18n.t('copy.320493d7cb5d')}</span
			>
			{#if hasFilters}<a href={i18n.href(resolve('/blog'))}
					><X size={14} aria-hidden="true" />{i18n.t('copy.fc38aced5a1d')}</a
				>{/if}
		</div>
		<div class="mobile-blog__list" data-daynight-blog-index>
			{#each articles as article, index (article.slug)}
				<a
					class="mobile-blog__card"
					href={i18n.href(resolve('/blog/[slug]', { slug: article.slug }))}
					data-daynight-article-card
					onclick={(event) => {
						if (
							event.button !== 0 ||
							event.ctrlKey ||
							event.metaKey ||
							event.shiftKey ||
							event.altKey
						)
							return;
						event.preventDefault();
						void goto(resolve('/blog/[slug]', { slug: article.slug }), {
							state: { blogReturn: routeParts(page.url.pathname).path + page.url.search }
						});
					}}
				>
					<img
						src={i18n.asset(article.image)}
						alt=""
						loading={index < 3 ? 'eager' : 'lazy'}
						decoding="async"
					/>
					<div class="mobile-blog__copy">
						<div class="mobile-blog__meta">
							<span>{i18n.text(article.category)}</span><small
								>{article.readMinutes} {i18n.t('copy.62dcfe2d4dee')}</small
							>
						</div>
						<h2>{i18n.text(article.title)}</h2>
						<div class="mobile-blog__date">
							<time datetime={article.date}
								>{dateFormat.format(new Date(`${article.date}T12:00:00Z`))}</time
							><ArrowRight size={17} aria-hidden="true" />
						</div>
					</div>
				</a>
			{:else}
				<div class="mobile-blog__empty">
					<h2>
						{filters.category === 'Новини' && !filters.q
							? i18n.t('copy.095277522ab8')
							: i18n.t('copy.e77cdf9fa875')}
					</h2>
					<p>{i18n.t('copy.d99fb00691a5')}</p>
					<a href={i18n.href(resolve('/blog'))}
						>{i18n.t('copy.76a0fa2db422')}<ArrowRight size={18} aria-hidden="true" /></a
					>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.mobile-blog {
		min-height: 100svh;
		padding-bottom: calc(88px + env(safe-area-inset-bottom));
		background: #fff;
		color: var(--sa-ink);
		font-family: var(--sa-font);
	}
	.mobile-blog__top {
		position: sticky;
		top: 0;
		z-index: 5;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 8px;
		background: #fff;
		padding: calc(8px + env(safe-area-inset-top)) var(--sa-mobile-gutter) 8px;
	}
	.mobile-blog__search {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 52px;
		padding: 4px 4px 4px 17px;
		border: 1px solid var(--sa-line);
		border-radius: var(--sa-r-pill);
		background: #eef1f6;
	}
	.mobile-blog__search input {
		min-width: 0;
		flex: 1;
		border: 0;
		outline: 0;
		background: transparent;
		color: var(--sa-ink);
		font: var(--sa-weight-medium) var(--sa-text-base)/1.2 var(--sa-font);
		padding: 0;
	}
	.mobile-blog__search input::placeholder {
		color: #56616e;
		opacity: 1;
	}
	.mobile-blog__search button {
		display: grid;
		place-items: center;
		flex: 0 0 44px;
		width: 44px;
		height: 44px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: var(--sa-ink);
		color: #fff;
		cursor: pointer;
	}
	.mobile-blog__search button :global(svg) {
		color: #fff;
		stroke: #fff;
	}
	.mobile-blog__search:focus-within {
		outline: 2px solid var(--sa-red);
		outline-offset: 2px;
	}
	.mobile-blog__pills {
		display: flex;
		gap: 6px;
		overflow-x: auto;
		scrollbar-width: none;
		margin: 0 calc(-1 * var(--sa-mobile-gutter));
		padding: 2px var(--sa-mobile-gutter);
	}
	.mobile-blog__pills::-webkit-scrollbar {
		display: none;
	}
	.mobile-blog__pills a.active {
		background: #fce8ed;
		color: var(--sa-red);
	}
	.mobile-blog__results {
		padding: 0 var(--sa-mobile-gutter);
	}
	.mobile-blog__status {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 34px;
		color: #56616e;
		font-size: var(--sa-text-caption);
	}
	.mobile-blog__status a {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		min-height: 34px;
		color: var(--sa-red);
		font-weight: var(--sa-button-font-weight);
		text-decoration: none;
	}
	.mobile-blog__list {
		display: grid;
		gap: 10px;
	}
	.mobile-blog__card {
		display: grid;
		grid-template-columns: 36% minmax(0, 1fr);
		overflow: hidden;
		border-radius: 14px;
		background: #eef1f6;
		color: var(--sa-ink);
		text-decoration: none;
	}
	.mobile-blog__card > img {
		width: 100%;
		height: 100%;
		min-height: 148px;
		object-fit: cover;
	}
	.mobile-blog__copy {
		display: flex;
		flex-direction: column;
		gap: 10px;
		min-width: 0;
		padding: 12px;
	}
	.mobile-blog__meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 6px;
	}
	.mobile-blog__meta span {
		border-radius: 6px;
		background: #fff;
		padding: 3px 6px;
		font-size: var(--sa-text-xs);
		line-height: 1.2;
		font-weight: var(--sa-weight-semibold);
	}
	.mobile-blog__meta small {
		color: #56616e;
		font-size: var(--sa-text-xs);
	}
	.mobile-blog__copy h2 {
		margin: 0;
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-heading);
		line-height: 1.25;
		letter-spacing: -0.2px;
	}
	.mobile-blog__date {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
		margin-top: auto;
		color: #56616e;
		font-size: var(--sa-text-xs);
	}
	.mobile-blog__date :global(svg) {
		flex-shrink: 0;
		color: var(--sa-ink);
	}
	.mobile-blog__empty {
		padding: 36px 12px;
		text-align: center;
	}
	.mobile-blog__empty h2 {
		margin: 0 0 8px;
		font-size: var(--sa-text-xl);
	}
	.mobile-blog__empty p {
		margin: 0 0 16px;
		font-size: var(--sa-type-body);
		color: #56616e;
	}
	.mobile-blog__empty a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		padding: 0 16px;
		border-radius: var(--sa-r-pill);
		background: var(--sa-red);
		color: #fff;
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-button-font-weight);
		text-decoration: none;
	}
	.mobile-blog a:focus-visible,
	.mobile-blog button:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: -2px;
	}
</style>
