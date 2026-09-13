<script lang="ts">
	import type { BlogPost } from '$lib/data/blog';
	import BlogListCard from './BlogListCard.svelte';
	let { posts }: { posts: BlogPost[] } = $props();
</script>

<div class="dn-blog-grid" data-daynight-blog-grid>
	{#each posts as post (post.slug)}<BlogListCard {post} />{/each}
</div>

<style>
	.dn-blog-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}
	@media (max-width: 991px) {
		.dn-blog-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 20px;
		}
	}
	@media (max-width: 575px) {
		.dn-blog-grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 20px;
		}
	}
</style>
