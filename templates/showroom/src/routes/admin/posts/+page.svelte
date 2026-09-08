<script lang="ts">
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import { formatNumber, statusVariant } from '$lib/components/admin/format';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>Eliqauto Admin - Posts</title>
</svelte:head>

<AdminShell title="Posts" activePath="/admin/posts">
	<section class="grid grid-cols-1 gap-4 px-4 sm:grid-cols-3 lg:px-6" aria-label="Post summary">
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Published posts</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(data.cms.kpis.publishedPosts)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Categories</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(new Set(data.cms.posts.map((post) => post.category)).size)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Visible on blog</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(data.cms.posts.filter((post) => post.status === 'published').length)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
	</section>

	<section class="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:px-6 xl:grid-cols-3">
		{#each data.cms.posts as post (post.slug)}
			<Card.Root>
				<Card.Header class="border-b p-0">
					<img class="aspect-[16/9] w-full rounded-t-lg object-cover" src={post.image} alt="" />
				</Card.Header>
				<Card.Content class="grid gap-3 p-4">
					<div class="flex flex-wrap items-center gap-2">
						<Badge variant={statusVariant(post.status)} class="capitalize">{post.status}</Badge>
						<Badge variant="outline">{post.category}</Badge>
					</div>
					<div>
						<h2 class="m-0 text-base font-semibold">{post.title}</h2>
						<p class="text-muted-foreground m-0 mt-1 line-clamp-3 text-sm">{post.excerpt}</p>
					</div>
				</Card.Content>
				<Card.Footer class="text-muted-foreground justify-between border-t text-xs">
					<span>{post.date}</span>
					<Button href={`/blog/${encodeURIComponent(post.slug)}`} variant="ghost" size="sm">
						View
					</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</section>
</AdminShell>
