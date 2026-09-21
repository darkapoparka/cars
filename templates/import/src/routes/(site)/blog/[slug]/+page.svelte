<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import type { PageProps } from './$types';
	import ArticleCard from '$lib/components/blog/ArticleCard.svelte';
	import Action from '$lib/components/common/Action.svelte';
	let { data }: PageProps = $props();
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
	<article class="site-container article-page">
		<Action href={'/blog' + (english ? '?lang=en' : '')} variant="quiet"
			>← {english ? 'All guides' : 'Всички статии'}</Action
		>
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
		<Action href="/contact" variant="secondary"
			>{english ? 'Discuss your car' : 'Обсъди своя автомобил'}</Action
		>
	</article>
	<section class="site-section site-container site-stack">
		<h2 class="site-heading">{english ? 'Related guides' : 'Още по темата'}</h2>
		<div class="article-related">
			{#each data.related as post (post.slug)}<ArticleCard {post} {english} />{/each}
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
	@media (max-width: 767.98px) {
		.article-related {
			grid-template-columns: 1fr;
		}
	}
</style>
