<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';
	import type { BlogPost } from '$lib/data/blog';
	let { post }: { post: BlogPost } = $props();
</script>

<a href={resolve('/blog/[slug]', { slug: post.slug })} class="dn-blog-card">
	<img src={post.image} alt="" width="760" height="500" loading="lazy" decoding="async" />
	<div class="dn-blog-card__body">
		<span class="dn-blog-card__date">{post.date}</span>
		<div class="dn-blog-card__heading">
			<h2>{post.title}</h2>
			<ArrowRight size={20} aria-hidden="true" />
		</div>
		<p>{post.excerpt}</p>
	</div>
</a>

<style>
	.dn-blog-card {
		display: flex;
		flex-direction: column;
		min-width: 0;
		overflow: hidden;
		border-radius: var(--bc-radius-card);
		background: var(--bc-card-bg);
		color: var(--bc-ink);
	}
	.dn-blog-card > img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 16/9;
		object-fit: cover;
	}
	.dn-blog-card__body {
		display: grid;
		gap: 10px;
		padding: 20px;
	}
	.dn-blog-card__date {
		color: var(--bc-muted);
		font-size: 13px;
		line-height: 18px;
	}
	.dn-blog-card__heading {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.dn-blog-card h2 {
		margin: 0;
		font-size: 21px;
		line-height: 27px;
		font-weight: 700;
		color: var(--bc-ink);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		overflow: hidden;
	}
	.dn-blog-card__heading :global(svg) {
		flex: 0 0 auto;
		color: var(--bc-ink);
	}
	.dn-blog-card p {
		margin: 0;
		font-size: var(--bc-mobile-body);
		line-height: var(--bc-mobile-body-leading);
		color: var(--bc-copy);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		font-weight: var(--bc-weight-body);
	}
	.dn-blog-card:hover h2 {
		color: var(--bc-accent);
	}
	.dn-blog-card:focus-visible {
		outline: 3px solid var(--bc-focus);
		outline-offset: 3px;
	}
	@media (max-width: 767px) {
		.dn-blog-card > img {
			height: 160px;
		}
		.dn-blog-card__body {
			padding: 16px;
			gap: 8px;
		}
		.dn-blog-card h2 {
			font-size: 19px;
			line-height: 25px;
		}
		.dn-blog-card p {
			display: none;
		}
	}
</style>
