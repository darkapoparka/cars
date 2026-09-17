<script lang="ts">
	import { resolve } from '$lib/utils/preview-paths';
	import Archive from '@lucide/svelte/icons/archive';
	import Eye from '@lucide/svelte/icons/eye';
	import MessageSquareReply from '@lucide/svelte/icons/message-square-reply';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Search from '@lucide/svelte/icons/search';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import AdminEmptyState from '$lib/components/admin/AdminEmptyState.svelte';
	import AdminMessage from '$lib/components/admin/AdminMessage.svelte';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import {
		formatDate,
		formatNumber,
		formatStatus,
		statusVariant
	} from '$lib/components/admin/format';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const statusOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'open', label: 'Open' },
		{ value: 'waiting', label: 'Waiting' },
		{ value: 'closed', label: 'Closed' },
		{ value: 'archived', label: 'Archived' }
	] as const;

	const metrics = $derived([
		{
			label: 'All',
			value: data.conversations.length,
			detail: 'Visible conversations'
		},
		{
			label: 'Open',
			value: data.conversations.filter((conversation) => conversation.status === 'open').length,
			detail: 'Needs staff reply'
		},
		{
			label: 'Unread',
			value: data.conversations.reduce(
				(total, conversation) => total + conversation.unreadCustomerMessages,
				0
			),
			detail: 'Customer messages'
		},
		{
			label: 'Waiting',
			value: data.conversations.filter((conversation) => conversation.status === 'waiting').length,
			detail: 'Staff replied'
		}
	]);

	function filterHref(status: string) {
		const params = new SvelteURLSearchParams();
		if (status !== 'all') params.set('status', status);
		if (data.filters.query) params.set('q', data.filters.query);
		const suffix = params.toString();
		return resolve(`/admin/conversations${suffix ? `?${suffix}` : ''}`);
	}

	function messagePreview(conversation: PageProps['data']['conversations'][number]) {
		return conversation.lastMessage?.body || 'No messages yet';
	}

	function linkedRecord(conversation: PageProps['data']['conversations'][number]) {
		if (conversation.lead) return `Lead · ${formatStatus(conversation.lead.status)}`;
		if (conversation.importRequest)
			return `Import · ${formatStatus(conversation.importRequest.status)}`;
		return formatStatus(conversation.kind);
	}
</script>

<svelte:head>
	<title>Admin - Conversations</title>
</svelte:head>

<AdminShell title="Conversations" activePath="/admin/conversations">
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
					<Card.Title>Customer inbox</Card.Title>
					<Card.Description>Visitor chat, lead, and import conversations.</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="grid gap-4 p-4">
				{#if form?.error}<AdminMessage tone="error">{form.error}</AdminMessage>{/if}
				{#if data.notice}<AdminMessage tone="notice">{data.notice}</AdminMessage>{/if}

				<div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
					<form
						class="flex w-full flex-col gap-2 sm:flex-row xl:max-w-xl"
						method="GET"
						action={resolve('/admin/conversations')}
					>
						<input type="hidden" name="status" value={data.filters.status} />
						<div class="relative flex-1">
							<Search
								class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
								aria-hidden="true"
							/>
							<Input
								class="pl-8"
								name="q"
								value={data.filters.query}
								placeholder="Search customer, subject, message"
								autocomplete="off"
							/>
						</div>
						<Button type="submit" variant="outline">Search</Button>
					</form>

					<div class="flex flex-wrap gap-2">
						{#each statusOptions as option (option.value)}
							<Button
								href={filterHref(option.value)}
								variant={data.filters.status === option.value ? 'default' : 'outline'}
								size="sm"
							>
								{option.label}
							</Button>
						{/each}
					</div>
				</div>
			</Card.Content>
			<Card.Content class="p-0">
				{#if data.conversations.length}
					<div class="overflow-x-auto">
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>Customer</Table.Head>
									<Table.Head>Last message</Table.Head>
									<Table.Head>Status</Table.Head>
									<Table.Head class="hidden text-right lg:table-cell">Updated</Table.Head>
									<Table.Head class="text-right">Actions</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each data.conversations as conversation (conversation.id)}
									<Table.Row>
										<Table.Cell>
											<a
												class="grid min-w-60 gap-2"
												href={resolve(`/admin/conversations/${conversation.id}`)}
											>
												<span class="flex items-center gap-2">
													<span class="truncate font-medium">{conversation.customerName}</span>
													{#if conversation.unreadCustomerMessages}
														<Badge variant="default">
															{formatNumber(conversation.unreadCustomerMessages)}
														</Badge>
													{/if}
												</span>
												<span class="text-muted-foreground truncate text-xs">
													{conversation.customerContact || conversation.subject}
												</span>
											</a>
										</Table.Cell>
										<Table.Cell>
											<div class="min-w-80">
												<p class="truncate text-sm">{messagePreview(conversation)}</p>
												<p class="text-muted-foreground truncate text-xs">
													{linkedRecord(conversation)}
												</p>
											</div>
										</Table.Cell>
										<Table.Cell>
											<Badge variant={statusVariant(conversation.status)} class="capitalize">
												{formatStatus(conversation.status)}
											</Badge>
										</Table.Cell>
										<Table.Cell
											class="text-muted-foreground hidden text-right text-xs lg:table-cell"
										>
											{formatDate(conversation.last_message_at ?? conversation.updated_at)}
										</Table.Cell>
										<Table.Cell>
											<div class="flex min-w-56 justify-end gap-2">
												<Button
													href={resolve(`/admin/conversations/${conversation.id}`)}
													variant="outline"
													size="sm"
												>
													<Eye data-icon="inline-start" aria-hidden="true" />
													Open
												</Button>
												{#if conversation.status === 'closed'}
													<form method="POST" action="?/reopen">
														<input type="hidden" name="id" value={conversation.id} />
														<Button type="submit" variant="ghost" size="sm">
															<RotateCcw data-icon="inline-start" aria-hidden="true" />
															Reopen
														</Button>
													</form>
												{:else}
													<form method="POST" action="?/close">
														<input type="hidden" name="id" value={conversation.id} />
														<Button type="submit" variant="ghost" size="sm">
															<Archive data-icon="inline-start" aria-hidden="true" />
															Close
														</Button>
													</form>
												{/if}
											</div>
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</div>
				{:else}
					<AdminEmptyState
						title="No conversations match the current filters"
						description="Visitor chat and form conversations will appear here when customers write in."
						class="m-4"
					>
						<Button href={resolve('/admin/conversations')} variant="outline">
							<MessageSquareReply data-icon="inline-start" aria-hidden="true" />
							Clear filters
						</Button>
					</AdminEmptyState>
				{/if}
			</Card.Content>
		</Card.Root>
	</section>
</AdminShell>
