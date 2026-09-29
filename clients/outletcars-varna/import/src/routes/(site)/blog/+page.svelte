<script lang="ts">
	import { pageDescriptions } from '$lib/content/seo';
	import type { PageProps } from './$types';
	import PageIntro from '$lib/components/common/PageIntro.svelte';
	import ArticleCard from '$lib/components/blog/ArticleCard.svelte';
	let { data }: PageProps = $props();
	const english = $derived(data.locale === 'en');
</script>

<svelte:head
	><title
		>{english ? 'Guides and advice' : 'Полезно за автомобила'} — {data.site.identity.name}</title
	><meta
		name="description"
		content={pageDescriptions.blog[data.locale === 'en' ? 'en' : 'bg']}
	/></svelte:head
>
<main id="main-content">
	<PageIntro title={english ? 'Guides and advice' : 'Полезно за автомобила'} />
	<section class="site-section site-container article-grid">
		{#each data.posts as post (post.slug)}<ArticleCard {post} {english} level={2} />{/each}
	</section>
</main>

<style>
	.article-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--bc-space-6);
	}
	@media (max-width: 1023px) {
		.article-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 767.98px) {
		.article-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
