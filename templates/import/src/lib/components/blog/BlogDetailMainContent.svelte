<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowRight } from '@lucide/svelte';
	import type { AuxeroBlogDetailContent } from '$lib/auxero/blog-detail';
	let { content }: { content: AuxeroBlogDetailContent } = $props();
</script>

<div class="dn-article-body">
	{#each content.paragraphs as paragraph (paragraph.id)}<p>{paragraph.text}</p>{/each}
	<a class="dn-article-contact" href={resolve('/contact')}>
		<span
			><strong>Обсъди своя автомобил с нас</strong><span
				>Изпрати линк, VIN или въпрос за конкретна обява.</span
			></span
		>
		<ArrowRight size={22} aria-hidden="true" />
	</a>
</div>

<style>
	.dn-article-body {
		max-width: 68ch;
		margin: 32px auto 0;
	}
	.dn-article-body > p {
		margin: 0 0 24px;
		font-size: var(--bc-text-prose);
		line-height: var(--bc-leading-prose);
		color: var(--bc-copy);
	}
	.dn-article-contact {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 24px;
		margin-top: 32px;
		border-radius: var(--bc-radius-card);
		background: var(--bc-card-bg);
		color: var(--bc-ink);
	}
	.dn-article-contact > span {
		display: grid;
		gap: 8px;
	}
	.dn-article-contact strong {
		font-size: 21px;
		line-height: 27px;
		color: var(--bc-ink);
	}
	.dn-article-contact span span {
		font-size: 16px;
		line-height: 24px;
		color: var(--bc-copy);
	}
	.dn-article-contact :global(svg) {
		color: var(--bc-accent);
		flex: 0 0 auto;
	}
	.dn-article-contact:focus-visible {
		outline: 3px solid var(--bc-focus);
		outline-offset: 3px;
	}
	@media (max-width: 767px) {
		.dn-article-body {
			margin-top: 24px;
		}
		.dn-article-body > p {
			font-size: var(--bc-text-prose);
			line-height: var(--bc-leading-prose);
			margin-bottom: 20px;
		}
		.dn-article-contact {
			padding: 20px;
			margin-top: 24px;
		}
		.dn-article-contact strong {
			font-size: 20px;
			line-height: 26px;
		}
	}
</style>
