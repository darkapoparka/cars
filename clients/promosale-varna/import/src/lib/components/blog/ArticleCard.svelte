<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import type { BlogPost } from '$lib/data/blog';
	import { linkHref } from '$lib/utils/links';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	let {
		post,
		english = false,
		level = 3
	}: { post: BlogPost; english?: boolean; level?: 2 | 3 } = $props();
</script>

<article class="article-card">
	<a class="article-card__link" href={linkHref('/blog/' + post.slug + (english ? '?lang=en' : ''))}>
		<img
			class="article-card__image"
			src={assetHref(post.image)}
			alt=""
			width="660"
			height="440"
			loading="lazy"
			decoding="async"
		/>
		<div class="article-card__body">
			<div class="article-card__meta"><span>{post.category}</span><span>{post.date}</span></div>
			<svelte:element this={level === 2 ? 'h2' : 'h3'} class="article-card__title"
				>{post.title}</svelte:element
			>
			<p>{post.excerpt}</p>
			<span class="article-card__more"
				>{english ? 'Read article' : 'Прочети статията'}<ArrowRight
					size={18}
					aria-hidden="true"
				/></span
			>
		</div>
	</a>
</article>

<style>
	.article-card {
		min-width: 0;
		display: flex;
	}
	.article-card__link {
		display: flex;
		flex-direction: column;
		width: 100%;
		border: 1px solid var(--bc-border);
		border-radius: var(--bc-radius-panel);
		overflow: hidden;
		background: var(--bc-surface-raised);
		color: var(--bc-ink);
		text-decoration: none;
		box-shadow: var(--bc-shadow-subtle);
		transition:
			border-color var(--bc-motion-fast),
			box-shadow var(--bc-motion-fast);
	}
	.article-card__link:hover,
	.article-card__link:focus-visible {
		border-color: var(--bc-border-strong);
		box-shadow: var(--bc-shadow-card);
	}
	.article-card__image {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 1.6;
		object-fit: cover;
		background: var(--bc-card-media);
	}
	.article-card__body {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: stretch;
		gap: var(--bc-space-3);
		padding: var(--bc-space-6);
	}
	.article-card__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--bc-space-2);
		color: var(--bc-muted);
		font-size: var(--bc-text-meta);
		line-height: var(--bc-leading-meta);
	}
	.article-card__title {
		margin: 0;
		font: var(--bc-weight-heading) var(--bc-text-h4)/1.25 var(--bc-font-heading);
		text-wrap: pretty;
	}
	p {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		margin: 0 0 var(--bc-space-2);
		color: var(--bc-copy);
		font-size: var(--bc-text-body);
		line-height: var(--bc-leading-body);
	}
	.article-card__more {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--bc-space-3);
		min-height: var(--bc-control-height-secondary);
		padding-top: var(--bc-space-2);
		margin-top: auto;
		font-weight: var(--bc-weight-heading);
		color: var(--bc-ink);
	}
	.article-card__link:hover .article-card__more {
		color: var(--bc-accent);
	}
	@media (min-width: 768px) {
		p,
		.article-card__more {
			font-size: var(--bc-text-prose);
		}
		p {
			line-height: var(--bc-leading-body-lg);
		}
	}
	@media (max-width: 767.98px) {
		.article-card__body {
			padding: var(--bc-space-5);
		}
		.article-card__title {
			font-size: var(--bc-mobile-section-title);
		}
	}
</style>
