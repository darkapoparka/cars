<script lang="ts">
	import { resolve } from '$lib/utils/preview-paths';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import AdminMessage from '$lib/components/admin/AdminMessage.svelte';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import PostForm from '$lib/components/admin/PostForm.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const postFormId = 'post-editor-form';

	function confirmDelete(event: SubmitEvent, title: string) {
		if (!confirm(`Delete ${title}? This removes the post from the CMS.`)) {
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>Admin - {data.post.title}</title>
</svelte:head>

<AdminShell title={data.post.title} eyebrow="Posts" activePath="/admin/posts">
	<section class="px-4 lg:px-6">
		<Card.Root>
			<Card.Header>
				<div class="flex min-w-0 flex-col gap-1">
					<div class="flex min-w-0 flex-wrap items-center gap-2">
						<Card.Description class="min-w-0 truncate">{data.post.slug}</Card.Description>
						<Badge variant="outline" class="capitalize">{data.post.status}</Badge>
					</div>
					<Card.Title class="text-xl font-semibold">{data.post.title}</Card.Title>
				</div>
				<Card.Action class="flex flex-wrap items-center justify-end gap-2">
					<Button href={resolve('/admin/posts')} variant="outline" size="sm">
						<ArrowLeft data-icon="inline-start" aria-hidden="true" />
						Posts
					</Button>
					<Button href={resolve(`/blog/${data.post.slug}`)} variant="outline" size="sm">
						<ExternalLink data-icon="inline-start" aria-hidden="true" />
						Preview
					</Button>
					<form
						method="POST"
						action="?/remove"
						onsubmit={(event) => confirmDelete(event, data.post.title)}
					>
						<Button type="submit" variant="destructive" size="sm">
							<Trash2 data-icon="inline-start" aria-hidden="true" />
							Delete
						</Button>
					</form>
				</Card.Action>
			</Card.Header>
		</Card.Root>
	</section>

	{#if data.notice}
		<section class="px-4 lg:px-6">
			<AdminMessage tone="success">{data.notice}</AdminMessage>
		</section>
	{/if}

	<section class="px-4 lg:px-6">
		<PostForm
			action="?/save"
			post={data.post}
			{form}
			formId={postFormId}
			submitLabel="Save changes"
		/>
	</section>
</AdminShell>
