<script lang="ts">
	import type { BlogPost } from '$lib/data/blog';
	import BlogListCard from './BlogListCard.svelte';
	let { post }: { post: BlogPost } = $props();
</script>

<BlogListCard {post} />
