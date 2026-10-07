<script lang="ts">
	import { assetHref } from '$lib/utils/assets';
	import { editorialCopy } from '$lib/content/editorial';
	import type { BlogPost } from '$lib/data/blog';
	import { linkHref } from '$lib/utils/links';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	let {
		post,
		english = false,
		level = 3,
		compact = false,
		mobileRow = false,
		readLabel
	}: {
		post: BlogPost;
		english?: boolean;
		level?: 2 | 3;
		compact?: boolean;
		mobileRow?: boolean;
		readLabel?: string;
	} = $props();
</script>

<article
	class="article-card"
	class:article-card--compact={compact}
	class:article-card--mobile-row={mobileRow}
>
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
				>{readLabel ?? editorialCopy[english ? 'en' : 'bg'].read}<ArrowRight
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
		object-fit: contain;
		background: var(--bc-surface);
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
		.article-card__link {
			border-radius: var(--bc-desktop-card-radius);
		}
		.article-card__image {
			width: calc(100% - var(--bc-space-2) * 2);
			margin: var(--bc-space-2) var(--bc-space-2) 0;
			border-radius: var(--bc-desktop-media-radius);
		}
		.article-card__title {
			font-family: var(--bc-font-body);
			font-size: var(--bc-desktop-card-heading);
		}
		.article-card__more {
			font-weight: var(--bc-weight-action);
		}
		.article-card--compact .article-card__image {
			aspect-ratio: 2.4;
			object-fit: cover;
		}
		.article-card--compact .article-card__body {
			padding: var(--bc-space-5);
		}
		.article-card--compact .article-card__title {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			overflow: hidden;
			min-height: 2lh;
			font-size: var(--bc-text-h5);
		}
		.article-card--compact p {
			display: none;
		}
		p,
		.article-card__more {
			font-size: var(--bc-text-body);
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
			font-size: 17px;
			line-height: 22px;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			overflow: hidden;
			min-height: 44px;
		}
	}

	@media (max-width: 767.98px) {
		.article-card--mobile-row .article-card__link {
			display: grid;
			grid-template-columns: 32% minmax(0, 1fr);
		}
		.article-card--mobile-row .article-card__image {
			height: 100%;
			min-height: 160px;
			aspect-ratio: auto;
		}
		.article-card--mobile-row .article-card__body {
			min-width: 0;
			gap: var(--bc-space-2);
			padding: var(--bc-space-3);
		}
		.article-card--mobile-row p,
		.article-card--mobile-row .article-card__meta span:first-child {
			display: none;
		}
		.article-card--mobile-row .article-card__title {
			font-size: var(--bc-text-control);
			line-height: 1.25;
			min-height: 0;
			-webkit-line-clamp: 3;
			line-clamp: 3;
		}
		.article-card--mobile-row .article-card__more {
			padding: 0;
			font-size: var(--bc-text-body);
			font-weight: var(--bc-weight-action);
		}
	}
</style>
