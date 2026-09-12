<script lang="ts">
	import { resolve } from '$app/paths';
	import Edit3 from '@lucide/svelte/icons/edit-3';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import Search from '@lucide/svelte/icons/search';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import AdminEmptyState from '$lib/components/admin/AdminEmptyState.svelte';
	import AdminMessage from '$lib/components/admin/AdminMessage.svelte';
	import AdminRowCheckbox from '$lib/components/admin/AdminRowCheckbox.svelte';
	import AdminSelect from '$lib/components/admin/AdminSelect.svelte';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import { formatDate, formatNumber } from '$lib/components/admin/format';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const bulkFormId = 'posts-bulk-form';
	const statusOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'draft', label: 'Draft' },
		{ value: 'published', label: 'Published' },
		{ value: 'archived', label: 'Archived' }
	] as const;
	const postStatusOptions = statusOptions.filter((option) => option.value !== 'all');
	const typeOptions = [
		{ value: 'all', label: 'All types' },
		{ value: 'blog', label: 'Blog' },
		{ value: 'news', label: 'News' }
	] as const;

	const metrics = $derived([
		{ label: 'All posts', value: data.posts.counts.all, status: 'all', detail: 'CMS records' },
		{ label: 'Published', value: data.posts.counts.published, status: 'published', detail: 'Live' },
		{ label: 'Drafts', value: data.posts.counts.draft, status: 'draft', detail: 'Needs work' },
		{ label: 'Archived', value: data.posts.counts.archived, status: 'archived', detail: 'Hidden' }
	]);

	function filterHref(status: string, type = data.posts.filters.type) {
		const params = new SvelteURLSearchParams();
		if (status !== 'all') params.set('status', status);
		if (type !== 'all') params.set('type', type);
		if (data.posts.filters.query) params.set('q', data.posts.filters.query);
		const suffix = params.toString();
		return resolve(`/admin/posts${suffix ? `?${suffix}` : ''}`);
	}

	function typeHref(type: (typeof typeOptions)[number]['value']) {
		return filterHref(data.posts.filters.status, type);
	}

	function confirmDelete(event: SubmitEvent, title: string) {
		if (!confirm(`Delete ${title}? This removes the post from the CMS.`)) {
			event.preventDefault();
		}
	}

	function confirmBulkDelete(event: MouseEvent) {
		if (!confirm('Delete selected posts? This removes them from the CMS.')) {
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>Admin - Posts</title>
</svelte:head>

<AdminShell
	title="Posts"
	activePath="/admin/posts"
	primaryAction={{ label: 'New post', href: '/admin/posts/new' }}
>
	<section class="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:px-6 @5xl/main:grid-cols-4">
		{#each metrics as metric (metric.label)}
			<Card.Root size="sm">
				<Card.Header>
					<Card.Description>{metric.label}</Card.Description>
					<Card.Title class="text-2xl font-semibold tabular-nums">
						{formatNumber(metric.value)}
					</Card.Title>
				</Card.Header>
				<Card.Footer class="text-muted-foreground text-sm">{metric.detail}</Card.Footer>
			</Card.Root>
		{/each}
	</section>

	<section class="px-4 lg:px-6">
		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Content CMS</Card.Title>
					<Card.Description>
						Create, edit, publish, archive, preview, and remove site content records.
					</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="grid gap-4 p-4">
				{#if form?.error}<AdminMessage tone="error">{form.error}</AdminMessage>{/if}
				{#if data.notice}<AdminMessage tone="notice">{data.notice}</AdminMessage>{/if}

				<div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
					<form
						class="flex w-full flex-col gap-2 sm:flex-row xl:max-w-xl"
						method="GET"
						action={resolve('/admin/posts')}
					>
						<input type="hidden" name="status" value={data.posts.filters.status} />
						<input type="hidden" name="type" value={data.posts.filters.type} />
						<div class="relative flex-1">
							<Search
								class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
								aria-hidden="true"
							/>
							<Input
								class="pl-8"
								name="q"
								value={data.posts.filters.query}
								placeholder="Search title, slug, category, tag"
								autocomplete="off"
							/>
						</div>
						<Button type="submit" variant="outline">Search</Button>
					</form>

					<div class="flex flex-wrap gap-2">
						{#each statusOptions as option (option.value)}
							<Button
								href={filterHref(option.value)}
								variant={data.posts.filters.status === option.value ? 'default' : 'outline'}
								size="sm"
							>
								{option.label}
							</Button>
						{/each}
					</div>
				</div>

				<div
					class="bg-muted/30 flex flex-col gap-3 rounded-lg border p-3 xl:flex-row xl:items-center xl:justify-between"
				>
					<div class="flex flex-wrap gap-2">
						{#each typeOptions as option (option.value)}
							<Button
								href={typeHref(option.value)}
								variant={data.posts.filters.type === option.value ? 'secondary' : 'outline'}
								size="sm"
							>
								{option.label}
							</Button>
						{/each}
					</div>
					<form
						id={bulkFormId}
						method="POST"
						action="?/bulkStatus"
						class="flex flex-wrap items-center gap-2"
					>
						<AdminSelect
							name="status"
							value="draft"
							options={postStatusOptions}
							ariaLabel="Bulk status"
						/>
						<Button type="submit" variant="outline" size="sm">Apply to selected</Button>
						<Button
							type="submit"
							variant="destructive"
							size="sm"
							formaction="?/bulkRemove"
							onclick={confirmBulkDelete}
						>
							<Trash2 data-icon="inline-start" aria-hidden="true" />
							Delete selected
						</Button>
					</form>
				</div>
			</Card.Content>
			<Card.Content class="p-0">
				{#if data.posts.posts.length}
					<div class="overflow-x-auto">
						<Table.Root class="table-fixed">
							<Table.Header>
								<Table.Row>
									<Table.Head class="w-10"></Table.Head>
									<Table.Head>Post</Table.Head>
									<Table.Head class="w-48">Status</Table.Head>
									<Table.Head class="hidden w-24 md:table-cell">Type</Table.Head>
									<Table.Head class="hidden w-28 text-right lg:table-cell">Updated</Table.Head>
									<Table.Head class="w-32 text-right">Actions</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each data.posts.posts as post (post.id)}
									<Table.Row>
										<Table.Cell>
											<AdminRowCheckbox
												form={bulkFormId}
												value={post.id}
												ariaLabel={`Select ${post.title}`}
											/>
										</Table.Cell>
										<Table.Cell class="min-w-0">
											<div class="min-w-0">
												<a
													class="block min-h-8 truncate leading-8 font-medium hover:underline"
													href={resolve(`/admin/posts/${post.id}`)}
												>
													{post.title}
												</a>
												<p class="text-muted-foreground truncate text-xs">
													{post.excerpt || post.slug}
												</p>
												<p class="text-muted-foreground text-xs capitalize md:hidden">
													{post.type} / {formatDate(post.updated_at)}
												</p>
											</div>
										</Table.Cell>
										<Table.Cell>
											<form
												class="flex min-w-44 items-center gap-2"
												method="POST"
												action="?/updateStatus"
											>
												<input type="hidden" name="id" value={post.id} />
												<AdminSelect
													name="status"
													value={post.status}
													options={postStatusOptions}
													controlClass="min-w-28"
													ariaLabel={`Status for ${post.title}`}
												/>
												<Button type="submit" variant="outline" size="sm">Save</Button>
											</form>
										</Table.Cell>
										<Table.Cell class="hidden capitalize md:table-cell">{post.type}</Table.Cell>
										<Table.Cell
											class="text-muted-foreground hidden text-right text-xs lg:table-cell"
										>
											{formatDate(post.updated_at)}
										</Table.Cell>
										<Table.Cell>
											<div class="flex justify-end gap-2">
												<Button
													href={resolve(`/admin/posts/${post.id}`)}
													variant="default"
													size="sm"
												>
													<Edit3 data-icon="inline-start" aria-hidden="true" />
													Edit
												</Button>
												<DropdownMenu.Root>
													<DropdownMenu.Trigger>
														{#snippet child({ props })}
															<Button
																variant="outline"
																size="icon-sm"
																aria-label={`More actions for ${post.title}`}
																{...props}
															>
																<MoreHorizontal aria-hidden="true" />
															</Button>
														{/snippet}
													</DropdownMenu.Trigger>
													<DropdownMenu.Content align="end" class="w-44">
														<DropdownMenu.Group>
															<DropdownMenu.Item>
																<a
																	class="flex w-full items-center gap-2"
																	href={resolve(`/blog/${post.slug}`)}
																>
																	<ExternalLink aria-hidden="true" />
																	Preview post
																</a>
															</DropdownMenu.Item>
														</DropdownMenu.Group>
														<DropdownMenu.Separator />
														<DropdownMenu.Group>
															<DropdownMenu.Item variant="destructive">
																<form
																	class="w-full"
																	method="POST"
																	action="?/remove"
																	onsubmit={(event) => confirmDelete(event, post.title)}
																>
																	<input type="hidden" name="id" value={post.id} />
																	<button
																		class="flex w-full items-center gap-2 text-left"
																		type="submit"
																	>
																		<Trash2 aria-hidden="true" />
																		Delete
																	</button>
																</form>
															</DropdownMenu.Item>
														</DropdownMenu.Group>
													</DropdownMenu.Content>
												</DropdownMenu.Root>
											</div>
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</div>
				{:else}
					<AdminEmptyState
						title="No posts match the current filters"
						description="Create a post or clear filters to manage all Plus Auto content records."
						class="m-4"
					>
						<Button href={resolve('/admin/posts')} variant="outline">Clear filters</Button>
					</AdminEmptyState>
				{/if}
			</Card.Content>
		</Card.Root>
	</section>
</AdminShell>
