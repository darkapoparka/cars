<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroBlogDetailContent } from '$lib/auxero/blog-detail';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import BlogDetailMainContent from './BlogDetailMainContent.svelte';
	import BlogListCard from './BlogListCard.svelte';
	import { ArrowLeft } from '@lucide/svelte';

	let {
		content,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		content: AuxeroBlogDetailContent;
		pageDocument: AuxeroPageDocument;
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();

	let post = $derived(content.post);
</script>

<AuxeroPublicShell
	copy={shellCopy}
	footer={shellFooter}
	header={shellHeader}
	modals={shellModals}
	{pageDocument}
	runtimeHtml={shellRuntimeHtml}
	title={`${post.title} — Day Night Auto`}
>
	<article class="dn-article">
		<header class="dn-article__header">
			<a class="dn-article__back" href={resolve('/blog')}
				><ArrowLeft size={18} aria-hidden="true" /> Всички статии</a
			>
			<h1>{post.title}</h1>
			<p class="dn-article__meta"><span>{post.date}</span><span>{post.category}</span></p>
			<img
				class="dn-article__cover"
				src={post.image}
				alt=""
				width="1280"
				height="720"
				loading="eager"
				fetchpriority="high"
				decoding="async"
			/>
		</header>
		<BlogDetailMainContent {content} />
		{#if content.related.length}
			<section class="dn-article__related" aria-labelledby="related-heading">
				<h2 id="related-heading">{content.relatedTitle}</h2>
				<div class="dn-article__rail">
					{#each content.related as relatedPost (relatedPost.slug)}<BlogListCard
							post={relatedPost}
						/>{/each}
				</div>
			</section>
		{/if}
	</article>
</AuxeroPublicShell>

<style>
	.dn-article {
		max-width: 1040px;
		margin-inline: auto;
		padding: 40px 24px 64px;
		color: var(--bc-ink);
	}
	.dn-article__header {
		max-width: 800px;
		margin-inline: auto;
	}
	.dn-article__back {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		padding: 10px 14px;
		background: var(--bc-card-bg);
		border-radius: var(--bc-radius-control);
		color: var(--bc-ink);
		font-size: 15px;
		font-weight: 600;
	}
	.dn-article h1 {
		margin: 24px 0 16px;
		font-size: clamp(30px, 3.5vw, 44px);
		line-height: 1.15;
		font-weight: 700;
		text-wrap: balance;
		color: var(--bc-ink);
	}
	.dn-article__meta {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 20px;
		margin: 0 0 24px;
		font-size: 14px;
		line-height: 20px;
		color: var(--bc-muted);
	}
	.dn-article__meta span {
		color: inherit;
	}
	.dn-article__cover {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 2 / 1;
		object-fit: cover;
		border-radius: var(--bc-radius-card);
	}
	.dn-article__related {
		margin-top: 48px;
	}
	.dn-article__related h2 {
		margin: 0 0 20px;
		font-size: 26px;
		line-height: 32px;
		color: var(--bc-ink);
	}
	.dn-article__rail {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px;
	}
	.dn-article__back:focus-visible {
		outline: 3px solid var(--bc-focus);
		outline-offset: 3px;
	}
	@media (max-width: 767px) {
		.dn-article {
			padding: 20px 16px 32px;
		}
		.dn-article h1 {
			margin-top: 20px;
			font-size: 30px;
			line-height: 35px;
			text-wrap: pretty;
		}
		.dn-article__cover {
			aspect-ratio: 16 / 9;
		}
		.dn-article__meta {
			margin-bottom: 20px;
		}
		.dn-article__related {
			margin-top: 32px;
		}
		.dn-article__related h2 {
			font-size: 24px;
			line-height: 30px;
		}
		.dn-article__rail {
			display: flex;
			overflow-x: auto;
			gap: 14px;
			margin-inline: -16px;
			padding: 6px 16px;
			scroll-snap-type: x proximity;
			scroll-padding-inline: 16px;
			scrollbar-width: none;
		}
		.dn-article__rail :global(.dn-blog-card) {
			flex: 0 0 84%;
			scroll-snap-align: start;
		}
	}
</style>
