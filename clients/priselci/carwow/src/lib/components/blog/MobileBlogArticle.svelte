<script lang="ts">
	import { getI18n } from '$lib/locale/context';
	const i18n = getI18n();

	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ChevronLeft, ArrowRight, Share2 } from '@lucide/svelte';
	import type { DayNightArticle } from '$lib/data/daynight-blog';
	let { article, articles }: { article: DayNightArticle; articles: DayNightArticle[] } = $props();
	const related = $derived(
		articles
			.filter((item) => item.slug !== article.slug)
			.sort(
				(a, b) => Number(b.category === article.category) - Number(a.category === article.category)
			)
			.slice(0, 3)
	);
	const returnToBlog = $derived(page.state.blogReturn);
	const dateFormat = new Intl.DateTimeFormat(i18n.locale === 'bg' ? 'bg-BG' : 'en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
	let shareMessage = $state('');
	async function shareArticle() {
		shareMessage = '';
		try {
			if (navigator.share)
				await navigator.share({ title: i18n.text(article.title), url: page.url.href });
			else {
				await navigator.clipboard.writeText(page.url.href);
				shareMessage = 'Линкът е копиран';
			}
		} catch (error) {
			if (!(error instanceof Error && error.name === 'AbortError'))
				shareMessage = 'Не успяхме да споделим. Копирай адреса от браузъра.';
		}
	}
</script>

<main id="main-content" tabindex="-1" class="mobile-article">
	<div class="mobile-article__photo">
		<img src={i18n.asset(article.image)} alt="" loading="eager" decoding="async" />
	</div>
	<nav class="mobile-article__controls" aria-label={i18n.t('copy.a252dbba2ae0')}>
		<a
			href={i18n.href(resolve((returnToBlog ?? '/blog') as '/blog' | `/blog?${string}`))}
			aria-label={i18n.t('copy.7575687407cd')}
			onclick={(event) => {
				if (
					!returnToBlog ||
					event.button !== 0 ||
					event.ctrlKey ||
					event.metaKey ||
					event.shiftKey ||
					event.altKey
				)
					return;
				event.preventDefault();
				window.history.back();
			}}><ChevronLeft size={24} strokeWidth={2.2} aria-hidden="true" /></a
		>
		<button type="button" aria-label={i18n.t('copy.8bfad9fd5193')} onclick={shareArticle}
			><Share2 size={21} aria-hidden="true" /></button
		>
	</nav>
	<article class="mobile-article__panel" aria-labelledby="mobile-article-title">
		<header class="mobile-article__intro">
			<h1 id="mobile-article-title">{i18n.text(article.title)}</h1>
			<div class="mobile-article__meta">
				<a href={i18n.href(resolve(`/blog?category=${encodeURIComponent(article.category)}`))}
					>{i18n.text(article.category)}</a
				>
				<span>{article.readMinutes} {i18n.t('copy.1f836b1c2fe6')}</span>
				<time datetime={article.date}
					>{dateFormat.format(new Date(`${article.date}T12:00:00Z`))}</time
				>
			</div>
			{#if article.author}<p class="mobile-article__author">{article.author}</p>{/if}
			<p class="mobile-article__lead">{i18n.text(article.description)}</p>
		</header>
		<div class="mobile-article__body">
			{#each article.sections as section (section.heading)}
				<section>
					<h2>{i18n.text(section.heading)}</h2>
					{#each section.paragraphs as paragraph, index (index)}<p>{i18n.text(paragraph)}</p>{/each}
				</section>
			{/each}
		</div>
		{#if article.tags.length}
			<nav class="mobile-article__tags" aria-label={i18n.t('copy.8b7fb753702f')}>
				{#each article.tags as tag (tag)}<a
						href={i18n.href(resolve(`/blog?tag=${encodeURIComponent(tag)}`))}>{i18n.text(tag)}</a
					>{/each}
			</nav>
		{/if}
		{#if related.length}
			<aside class="mobile-article__related" aria-labelledby="mobile-related-title">
				<h2 id="mobile-related-title">{i18n.t('copy.6494327d1094')}</h2>
				{#each related as item (item.slug)}
					<a href={i18n.href(resolve('/blog/[slug]', { slug: item.slug }))}>
						<img src={i18n.asset(item.image)} alt="" loading="lazy" decoding="async" />
						<span
							><strong>{i18n.text(item.title)}</strong><small
								>{item.readMinutes}
								{i18n.t('copy.1f836b1c2fe6')}<ArrowRight size={17} aria-hidden="true" /></small
							></span
						>
					</a>
				{/each}
			</aside>
		{/if}
		<a class="mobile-article__all" href={i18n.href(resolve('/blog'))}
			><ChevronLeft size={18} aria-hidden="true" />{i18n.t('copy.8e3c1ad5a405')}</a
		>
	</article>
	{#if shareMessage}<p class="mobile-article__share-status" role="status">
			{i18n.text(shareMessage)}
		</p>{/if}
</main>

<style>
	.mobile-article {
		position: relative;
		min-height: 100svh;
		background: #eef1f6;
		color: var(--sa-ink);
		font-family: var(--sa-font);
	}
	.mobile-article__photo {
		height: clamp(220px, 72vw, 360px);
		background: #eef1f6;
	}
	.mobile-article__photo > img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.mobile-article__controls {
		position: absolute;
		z-index: 10;
		top: calc(env(safe-area-inset-top) + 12px);
		right: var(--sa-mobile-gutter);
		left: var(--sa-mobile-gutter);
		display: flex;
		justify-content: space-between;
		pointer-events: none;
	}
	.mobile-article__controls a,
	.mobile-article__controls button {
		display: grid;
		place-items: center;
		pointer-events: auto;
		width: 44px;
		height: 44px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: #fff;
		color: var(--sa-ink);
		box-shadow: 0 3px 12px rgba(17, 19, 21, 0.12);
		cursor: pointer;
	}
	.mobile-article__panel {
		position: relative;
		margin-top: -24px;
		border-radius: 24px 24px 0 0;
		padding: 24px 20px calc(88px + env(safe-area-inset-bottom));
		background: #fff;
	}
	.mobile-article__intro,
	.mobile-article__body,
	.mobile-article__tags,
	.mobile-article__related,
	.mobile-article__all {
		max-width: 62ch;
		margin-left: auto;
		margin-right: auto;
	}
	.mobile-article__intro h1 {
		margin: 0;
		font-size: var(--sa-type-page);
		font-weight: var(--sa-weight-heading);
		line-height: 1.15;
		letter-spacing: -0.6px;
		text-wrap: balance;
	}
	.mobile-article__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px 10px;
		margin-top: 16px;
		color: #56616e;
		font-size: var(--sa-text-caption);
		line-height: 1.4;
	}
	.mobile-article__meta a {
		display: inline-flex;
		align-items: center;
		min-height: 32px;
		border-radius: 8px;
		padding: 4px 9px;
		background: #fce8ed;
		color: var(--sa-red);
		font-weight: var(--sa-button-font-weight);
		text-decoration: none;
	}
	.mobile-article__author {
		margin: 10px 0 0;
		color: #56616e;
		font-size: var(--sa-text-caption);
	}
	.mobile-article__lead {
		margin: 20px 0 0;
		font-size: var(--sa-text-control);
		line-height: 1.6;
		color: #526071;
	}
	.mobile-article__body section {
		margin-top: 32px;
	}
	.mobile-article__body h2 {
		margin: 0 0 12px;
		font-size: var(--sa-text-card-title);
		font-weight: var(--sa-weight-heading);
		line-height: 1.25;
		letter-spacing: -0.3px;
		text-wrap: balance;
	}
	.mobile-article__body p {
		margin: 0;
		font-size: var(--sa-type-body);
		line-height: 1.7;
		color: #303b47;
		overflow-wrap: anywhere;
	}
	.mobile-article__body p + p {
		margin-top: 16px;
	}
	.mobile-article__tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 28px;
	}
	.mobile-article__tags a {
		display: inline-flex;
		align-items: center;
		min-height: 40px;
		border-radius: 12px;
		padding: 0 12px;
		background: #eef1f6;
		color: #526071;
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-button-font-weight);
		text-decoration: none;
	}
	.mobile-article__related {
		display: grid;
		gap: 10px;
		margin-top: 36px;
	}
	.mobile-article__related h2 {
		margin: 0 0 4px;
		font-size: var(--sa-text-card-title);
		font-weight: var(--sa-weight-heading);
		letter-spacing: -0.4px;
	}
	.mobile-article__related > a {
		display: grid;
		grid-template-columns: 96px minmax(0, 1fr);
		min-height: 116px;
		overflow: hidden;
		border-radius: 14px;
		background: #eef1f6;
		color: var(--sa-ink);
		text-decoration: none;
	}
	.mobile-article__related img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.mobile-article__related > a > span {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 12px;
		padding: 12px;
	}
	.mobile-article__related strong {
		font-size: var(--sa-text-base);
		font-weight: var(--sa-weight-heading);
		line-height: 1.3;
	}
	.mobile-article__related small {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 6px;
		font-size: var(--sa-text-caption);
		color: #526071;
	}
	.mobile-article__all {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		min-height: 48px;
		margin-top: 24px;
		color: var(--sa-ink);
		font-size: var(--sa-text-caption);
		font-weight: var(--sa-weight-semibold);
		text-decoration: none;
	}
	.mobile-article__share-status {
		position: fixed;
		z-index: 12;
		top: calc(env(safe-area-inset-top) + 64px);
		right: 14px;
		max-width: calc(100% - 28px);
		border-radius: 12px;
		background: var(--sa-ink);
		color: #fff;
		padding: 12px 16px;
		font-size: var(--sa-text-caption);
	}
	.mobile-article a:focus-visible,
	.mobile-article button:focus-visible {
		outline: 2px solid var(--sa-red);
		outline-offset: 2px;
	}
	@media (max-width: 359px) {
		.mobile-article__panel {
			padding-left: 16px;
			padding-right: 16px;
		}
	}
</style>
