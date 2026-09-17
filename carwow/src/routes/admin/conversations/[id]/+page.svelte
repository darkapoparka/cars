<script lang="ts">
	import { resolve } from '$lib/utils/preview-paths';
	import Archive from '@lucide/svelte/icons/archive';
	import CheckCheck from '@lucide/svelte/icons/check-check';
	import MessageSquareReply from '@lucide/svelte/icons/message-square-reply';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Send from '@lucide/svelte/icons/send';
	import AdminMessage from '$lib/components/admin/AdminMessage.svelte';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import { formatDate, formatStatus, statusVariant } from '$lib/components/admin/format';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const thread = $derived(data.thread);
	const customerMembers = $derived(
		thread.members.filter((member) => member.member_type === 'customer')
	);
	const unreadCustomerMessages = $derived(
		thread.messages.filter((message) => message.sender_type === 'customer' && !message.read_at)
			.length
	);
	const customerSummary = $derived(
		customerMembers
			.map((member) =>
				[member.display_name, member.email, member.phone].filter(Boolean).join(' · ')
			)
			.filter(Boolean)
			.join(' / ') || 'Website visitor'
	);

	function messageClass(senderType: string) {
		return senderType === 'staff'
			? 'ms-auto bg-primary text-primary-foreground'
			: senderType === 'system'
				? 'mx-auto bg-muted text-muted-foreground'
				: 'me-auto bg-muted text-foreground';
	}
</script>

<svelte:head>
	<title>Admin - Conversation</title>
</svelte:head>

<AdminShell title="Conversation" activePath="/admin/conversations">
	<section class="grid gap-4 px-4 lg:px-6 @6xl/main:grid-cols-[minmax(0,1fr)_22rem]">
		<Card.Root class="self-start">
			<Card.Header class="border-b">
				<div>
					<div class="flex flex-wrap items-center gap-2">
						<Card.Title>{thread.conversation.subject}</Card.Title>
						<Badge variant={statusVariant(thread.conversation.status)} class="capitalize">
							{formatStatus(thread.conversation.status)}
						</Badge>
						{#if unreadCustomerMessages}
							<Badge variant="default">{unreadCustomerMessages} unread</Badge>
						{/if}
					</div>
					<Card.Description>
						{customerSummary} · {formatStatus(thread.conversation.kind)}
					</Card.Description>
				</div>
				<Card.Action>
					<Button href={resolve('/admin/conversations')} variant="outline" size="sm">Back</Button>
				</Card.Action>
			</Card.Header>
			<Card.Content class="grid gap-4 p-4">
				{#if form?.error}<AdminMessage tone="error">{form.error}</AdminMessage>{/if}
				{#if data.notice}<AdminMessage tone="notice">{data.notice}</AdminMessage>{/if}

				<div class="grid gap-3">
					{#if thread.messages.length}
						{#each thread.messages as message (message.id)}
							<article
								class={`max-w-[78%] rounded-lg px-3 py-2 text-sm ${messageClass(message.sender_type)}`}
							>
								<div class="flex items-center justify-between gap-2">
									<p class="truncate font-medium">
										{message.sender_name || formatStatus(message.sender_type)}
									</p>
									<time class="text-xs opacity-75" datetime={message.created_at}>
										{formatDate(message.created_at)}
									</time>
								</div>
								<p class="mt-1 leading-6 whitespace-pre-wrap">{message.body}</p>
							</article>
						{/each}
					{:else}
						<div class="bg-muted/40 rounded-lg border p-6 text-center">
							<MessageSquareReply class="text-muted-foreground mx-auto mb-2" aria-hidden="true" />
							<p class="font-medium">No messages yet</p>
							<p class="text-muted-foreground text-sm">
								Reply when the visitor sends the first message.
							</p>
						</div>
					{/if}
				</div>

				<form method="POST" action="?/reply" class="grid gap-3 border-t pt-4">
					<label class="text-sm font-medium" for="conversation-reply">Reply</label>
					<Textarea
						id="conversation-reply"
						name="body"
						rows={5}
						maxlength={4000}
						placeholder="Write a helpful reply for the customer"
						required
					/>
					<div class="flex justify-end gap-2">
						<Button type="submit">
							<Send data-icon="inline-start" aria-hidden="true" />
							Send reply
						</Button>
					</div>
				</form>
			</Card.Content>
		</Card.Root>

		<div class="grid gap-4 self-start">
			<Card.Root>
				<Card.Header class="border-b">
					<Card.Title>Thread state</Card.Title>
					<Card.Description>
						Updated {formatDate(
							thread.conversation.last_message_at ?? thread.conversation.updated_at
						)}
					</Card.Description>
				</Card.Header>
				<Card.Content class="grid gap-2 p-4">
					<form method="POST" action="?/markRead">
						<Button type="submit" variant="outline" class="w-full justify-start">
							<CheckCheck data-icon="inline-start" aria-hidden="true" />
							Mark read
						</Button>
					</form>
					{#if thread.conversation.status === 'closed'}
						<form method="POST" action="?/reopen">
							<Button type="submit" variant="outline" class="w-full justify-start">
								<RotateCcw data-icon="inline-start" aria-hidden="true" />
								Reopen conversation
							</Button>
						</form>
					{:else}
						<form method="POST" action="?/close">
							<Button type="submit" variant="outline" class="w-full justify-start">
								<Archive data-icon="inline-start" aria-hidden="true" />
								Close conversation
							</Button>
						</form>
					{/if}
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="border-b">
					<Card.Title>Participants</Card.Title>
				</Card.Header>
				<Card.Content class="grid gap-3 p-4">
					{#each thread.members as member (member.id)}
						<div class="bg-muted/35 rounded-lg border p-3">
							<p class="text-sm font-medium">
								{member.display_name || formatStatus(member.member_type)}
							</p>
							<p class="text-muted-foreground text-xs capitalize">
								{formatStatus(member.member_type)}
							</p>
							{#if member.email || member.phone}
								<p class="text-muted-foreground mt-2 text-xs">
									{[member.email, member.phone].filter(Boolean).join(' / ')}
								</p>
							{/if}
						</div>
					{/each}
				</Card.Content>
			</Card.Root>
		</div>
	</section>
</AdminShell>
