<script lang="ts">
	import { editorialCopy } from '$lib/content/editorial';
	import { assetHref } from '$lib/utils/assets';
	import type { PageProps } from './$types';
	import ArticleCard from '$lib/components/blog/ArticleCard.svelte';
	import Action from '$lib/components/common/Action.svelte';
	import MobilePageHero from '$lib/components/common/MobilePageHero.svelte';
	import { linkHref } from '$lib/utils/links';
	let { data }: PageProps = $props();
	const copy = $derived(editorialCopy[data.locale]);
	const english = $derived(data.locale === 'en');
</script>

<svelte:head
	><title>{data.post.title} — {data.site.identity.name}</title><meta
		name="description"
		content={data.post.excerpt}
	/><meta property="og:type" content="article" /><meta
		property="og:title"
		content={data.post.title}
	/><meta
		property="og:image"
		content={data.site.identity.origin + assetHref(data.post.image)}
	/></svelte:head
>
<main id="main-content">
	<MobilePageHero title={copy.guides} headingLevel={2}
		>{#snippet actions()}<a
				class="article-mobile-back"
				href={linkHref('/blog' + (english ? '?lang=en' : ''))}>← {copy.allGuides}</a
			>{/snippet}</MobilePageHero
	>
	<article class="site-container article-page">
		<div class="site-desktop-only">
			<Action href={'/blog' + (english ? '?lang=en' : '')} variant="quiet"
				>← {copy.allGuides}</Action
			>
		</div>
		<h1>{data.post.title}</h1>
		<p class="article-meta">{data.post.category} · {data.post.date}</p>
		<img
			class="article-cover"
			src={assetHref(data.post.image)}
			alt=""
			width="1200"
			height="800"
			fetchpriority="high"
		/>
		<p class="article-lead">{data.post.excerpt}</p>
		{#each data.post.content as paragraph, index (index)}<p>{paragraph}</p>{/each}
		<Action href="/contact" variant="secondary">{copy.discuss}</Action>
	</article>
	<section class="site-section site-container site-stack">
		<h2 class="site-heading">{copy.related}</h2>
		<div class="article-related">
			{#each data.related as post (post.slug)}<ArticleCard {post} {english} mobileRow />{/each}
		</div>
	</section>
</main>

<style>
	.article-page {
		max-width: var(--bc-container-narrow);
		padding-block: var(--bc-section-sm);
	}
	h1 {
		margin: var(--bc-space-5) 0 var(--bc-space-3);
		font: var(--bc-weight-heading) var(--bc-text-h2)/var(--bc-leading-h2) var(--bc-font-heading);
	}
	p {
		font-size: var(--bc-text-prose);
		line-height: var(--bc-leading-prose);
		color: var(--bc-copy);
		margin-block: var(--bc-space-5);
	}
	.article-meta {
		color: var(--bc-muted);
		font-size: var(--bc-text-label);
	}
	.article-cover {
		display: block;
		width: 100%;
		height: auto;
		border-radius: var(--bc-radius-panel);
	}
	.article-lead {
		font-weight: var(--bc-weight-heading);
	}
	.article-related {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--bc-space-6);
	}
	@media (min-width: 768px) {
		.article-page {
			margin-block: var(--bc-space-8);
			padding: var(--bc-space-8);
			border: 1px solid var(--bc-border);
			border-radius: var(--bc-desktop-card-radius);
			background: var(--bc-surface-raised);
			box-shadow: var(--bc-editorial-shadow);
		}
		h1 {
			font-size: var(--bc-desktop-hero-title);
		}
		.article-cover {
			border-radius: var(--bc-desktop-media-radius);
		}
		.article-related {
			gap: var(--bc-space-5);
		}
	}
	@media (max-width: 767.98px) {
		.article-related {
			grid-template-columns: 1fr;
		}
	}

	.article-mobile-back {
		display: flex;
		width: fit-content;
		align-items: center;
		min-height: var(--bc-control-height-standard);
		color: var(--bc-white);
		font-size: var(--bc-text-control);
		text-decoration: none;
	}
	@media (max-width: 767.98px) {
		h1 {
			margin-top: 0;
			font-size: var(--bc-mobile-page-title);
			line-height: var(--bc-mobile-page-title-leading);
		}
		p {
			font-size: var(--bc-text-body);
			line-height: var(--bc-leading-body-lg);
			margin-block: var(--bc-space-4);
		}
		.article-cover {
			aspect-ratio: 1.8;
			object-fit: contain;
		}
	}
</style>
