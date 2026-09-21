<script lang="ts">
	import { resolve } from '$app/paths';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import PostForm from '$lib/components/admin/PostForm.svelte';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>Admin - New post</title>
</svelte:head>

<AdminShell title="New post" eyebrow="Posts" activePath="/admin/posts">
	<section class="px-4 lg:px-6">
		<Card.Root>
			<Card.Header>
				<div>
					<Card.Description>Content CMS</Card.Description>
					<Card.Title>Create a database-backed site post</Card.Title>
				</div>
				<Card.Action>
					<Button href={resolve('/admin/posts')} variant="outline" size="sm">
						<ArrowLeft data-icon="inline-start" aria-hidden="true" />
						Posts
					</Button>
				</Card.Action>
			</Card.Header>
		</Card.Root>
	</section>

	<section class="px-4 lg:px-6">
		<PostForm {form} submitLabel="Create post" />
	</section>
</AdminShell>
