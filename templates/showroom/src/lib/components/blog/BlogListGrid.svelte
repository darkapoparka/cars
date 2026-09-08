<script lang="ts">
	import type { BlogPost } from '$lib/data/blog';
	import BlogListCard from './BlogListCard.svelte';

	let { posts }: { posts: BlogPost[] } = $props();
</script>

<div class="md-grid-cols-1 mb-40 grid grid-cols-3 gap-x-30 gap-y-40" data-eliqauto-blog-grid>
	{#each posts as post (post.slug)}
		<BlogListCard {post} />
	{/each}
</div>
