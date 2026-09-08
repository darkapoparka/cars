<script lang="ts">
	import { resolve } from '$app/paths';
	import type { BlogPost } from '$lib/data/blog';

	let { post }: { post: BlogPost } = $props();
</script>

<a
	href={resolve(`/blog/${post.slug}`)}
	class="post-style-6 eliqauto-no-image-zoom overflow-hidden"
>
	<div class="image">
		<img
			class="post--img flex"
			src={post.image}
			alt={post.title}
			width="760"
			height="500"
			loading="lazy"
			decoding="async"
		/>
	</div>
	<div class="content">
		<div class="mb-12 flex justify-start gap-12">
			<span class="text-sm">от Eliqauto</span>
			<span class="text-sm">{post.date}</span>
			<span class="text-highlight text-underline text-sm uppercase">{post.category}</span>
		</div>
		<p class="h4 title mb-12">{post.title}</p>
		<p class="clamp clamp-2 text-secondary">{post.excerpt}</p>
	</div>
</a>
