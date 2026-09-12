<script lang="ts">
	import { previewPath } from '$lib/utils/preview-paths';
	import FileText from '@lucide/svelte/icons/file-text';
	import ImageIcon from '@lucide/svelte/icons/image';
	import Save from '@lucide/svelte/icons/save';
	import AdminMessage from '$lib/components/admin/AdminMessage.svelte';
	import AdminSelect from '$lib/components/admin/AdminSelect.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import type { PostFormFailure, PostFormValues } from '$lib/types/post-form';
	import type { AdminPostRow } from '$lib/types/admin-forms';

	type Props = {
		action?: string;
		post?: AdminPostRow | null;
		form?: PostFormFailure | { success?: string } | null;
		submitLabel?: string;
		cancelHref?: string;
		formId?: string;
	};

	let {
		action = undefined,
		post = null,
		form = null,
		submitLabel = 'Save post',
		cancelHref = '/admin/posts',
		formId = 'post-form'
	}: Props = $props();

	const statusOptions = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'published', label: 'Published' },
		{ value: 'archived', label: 'Archived' }
	] as const;

	const typeOptions = [
		{ value: 'blog', label: 'Blog' },
		{ value: 'news', label: 'News' }
	] as const;

	function getValues(candidate: Props['form']) {
		return candidate && 'values' in candidate ? candidate.values : undefined;
	}

	function getErrors(candidate: Props['form']) {
		return candidate && 'errors' in candidate ? candidate.errors : undefined;
	}

	const values = $derived(getValues(form));
	const errors = $derived(getErrors(form));

	function valueFor(field: keyof PostFormValues, fallback: string | number | null | undefined) {
		return values?.[field] ?? (fallback == null ? '' : String(fallback));
	}

	function textareaValueFor(field: keyof PostFormValues, fallback: string | null | undefined) {
		return valueFor(field, fallback)
			.replace(/\r\n/g, '\n')
			.replace(/\\r\\n/g, '\n')
			.replace(/\\n/g, '\n');
	}

	function tagsValue() {
		if (values?.tags !== undefined) return values.tags;
		return post?.tags?.join(', ') ?? '';
	}

	function errorFor(field: keyof PostFormValues) {
		return errors?.[field]?.[0] ?? '';
	}
</script>

<form id={formId} method="POST" {action} class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
	<div class="grid gap-4">
		{#if form && 'error' in form && form.error}
			<AdminMessage tone="error">{form.error}</AdminMessage>
		{/if}
		{#if form && 'success' in form && form.success}
			<AdminMessage tone="success">{form.success}</AdminMessage>
		{/if}

		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Post identity</Card.Title>
					<Card.Description>Title, slug, publishing status, and content type</Card.Description>
				</div>
				<Card.Action><FileText class="text-muted-foreground" aria-hidden="true" /></Card.Action>
			</Card.Header>
			<Card.Content class="grid gap-4 p-4 md:grid-cols-2">
				<label class="grid gap-2 text-sm font-medium md:col-span-2">
					Title
					<Input
						name="title"
						value={valueFor('title', post?.title)}
						aria-invalid={!!errorFor('title')}
						required
					/>
					{#if errorFor('title')}
						<span class="text-destructive text-xs">{errorFor('title')}</span>
					{/if}
				</label>

				<label class="grid gap-2 text-sm font-medium">
					Status
					<AdminSelect
						name="status"
						value={valueFor('status', post?.status || 'draft')}
						options={statusOptions}
						size="default"
					/>
				</label>

				<label class="grid gap-2 text-sm font-medium">
					Type
					<AdminSelect
						name="type"
						value={valueFor('type', post?.type || 'blog')}
						options={typeOptions}
						size="default"
					/>
				</label>

				<label class="grid gap-2 text-sm font-medium md:col-span-2">
					Slug
					<Input
						name="slug"
						value={valueFor('slug', post?.slug)}
						placeholder="auto-generated from title"
					/>
				</label>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Content</Card.Title>
					<Card.Description>Listing-page teaser and article body</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="grid gap-4 p-4">
				<label class="grid gap-2 text-sm font-medium">
					Excerpt
					<Textarea
						name="excerpt"
						value={valueFor('excerpt', post?.excerpt)}
						rows={3}
						placeholder="Short summary shown in content cards"
					/>
				</label>

				<label class="grid gap-2 text-sm font-medium">
					Body
					<Textarea
						name="body"
						value={textareaValueFor('body', post?.body)}
						rows={14}
						placeholder="Post body"
					/>
				</label>
			</Card.Content>
		</Card.Root>
	</div>

	<aside class="grid gap-4 self-start xl:sticky xl:top-24">
		<Card.Root>
			<Card.Header class="border-b">
				<Card.Title>Publish</Card.Title>
				<Card.Description>Save changes to the CMS record</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-wrap gap-2 p-4">
				<Button type="submit" class="min-w-40 flex-1">
					<Save data-icon="inline-start" aria-hidden="true" />
					{submitLabel}
				</Button>
				<Button href={previewPath(cancelHref)} variant="outline" class="min-w-28 flex-1">Cancel</Button>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Media and metadata</Card.Title>
					<Card.Description>Used by cards and public previews</Card.Description>
				</div>
				<Card.Action><ImageIcon class="text-muted-foreground" aria-hidden="true" /></Card.Action>
			</Card.Header>
			<Card.Content class="grid gap-4 p-4">
				<label class="grid gap-2 text-sm font-medium">
					Cover image URL
					<Input name="coverUrl" value={valueFor('coverUrl', post?.cover_url)} />
				</label>

				<label class="grid gap-2 text-sm font-medium">
					Category
					<Input name="category" value={valueFor('category', post?.category)} />
				</label>

				<label class="grid gap-2 text-sm font-medium">
					Tags
					<Input name="tags" value={tagsValue()} placeholder="tips, financing, inventory" />
				</label>

				<label class="grid gap-2 text-sm font-medium">
					Author
					<Input name="author" value={valueFor('author', post?.author || 'Перфект Ауто')} />
				</label>

				<label class="grid gap-2 text-sm font-medium">
					Read minutes
					<Input
						name="readMinutes"
						type="number"
						min="1"
						max="90"
						value={valueFor('readMinutes', post?.read_minutes || 4)}
					/>
				</label>
			</Card.Content>
		</Card.Root>
	</aside>
</form>
