<script lang="ts">
	import { resolve } from '$app/paths';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Send from '@lucide/svelte/icons/send';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import { formatDate, formatStatus, statusVariant } from '$lib/components/admin/format';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as ScrollArea from '$lib/components/ui/scroll-area/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { cn } from '$lib/utils.js';

	let { data, form } = $props();

	const statuses = ['open', 'read', 'closed'];
	const activeThread = $derived(data.activeThread);
	const firstMessage = $derived(activeThread?.messages[0]);
</script>

<svelte:head>
	<title>Eliqauto Admin - Messages</title>
</svelte:head>

<AdminShell title="Messages" activePath="/admin/messages">
	<section
		class="grid max-w-[96rem] gap-4 px-4 lg:px-6 xl:grid-cols-[25rem_minmax(0,1fr)]"
		data-eliqauto-admin-messages
	>
		<Card.Root class="overflow-hidden xl:h-[36rem]">
			<Card.Header class="border-b">
				<div>
					<Card.Title>Inbox</Card.Title>
					<Card.Description>Customer conversations routed to staff</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="p-0">
				<ScrollArea.Root class="h-80 xl:h-[30rem]">
					<div class="grid gap-1 p-2">
						{#each data.threads as thread (thread.id)}
							<a
								href={resolve(('/admin/messages?thread=' + encodeURIComponent(thread.id)) as '/')}
								data-eliqauto-admin-thread={thread.id}
								class={cn(
									'hover:bg-muted flex min-h-20 items-start gap-3 rounded-lg px-3 py-3 text-sm transition-colors',
									activeThread?.id === thread.id && 'bg-muted'
								)}
							>
								<Avatar.Root class="size-10">
									<Avatar.Fallback>{thread.participantInitials}</Avatar.Fallback>
								</Avatar.Root>
								<span class="grid min-w-0 flex-1 gap-1">
									<span class="flex items-center justify-between gap-2">
										<span class="truncate font-medium">{thread.participantName}</span>
										<span class="text-muted-foreground shrink-0 text-xs">
											{formatDate(thread.lastMessageAt)}
										</span>
									</span>
									<span class="text-muted-foreground truncate text-xs">{thread.subtitle}</span>
									<span class="flex items-center justify-between gap-2">
										<span class="truncate text-xs capitalize">{thread.title}</span>
										<Badge variant={statusVariant(thread.status)} class="capitalize">
											{formatStatus(thread.status)}
										</Badge>
									</span>
								</span>
							</a>
						{:else}
							<div class="text-muted-foreground p-6 text-sm">No message threads yet.</div>
						{/each}
					</div>
				</ScrollArea.Root>
			</Card.Content>
		</Card.Root>

		{#if activeThread}
			<Card.Root class="overflow-hidden xl:h-[36rem]">
				<Card.Header class="border-b">
					<div class="flex min-w-0 items-center gap-3">
						<Avatar.Root class="size-11">
							<Avatar.Fallback>{activeThread.participantInitials}</Avatar.Fallback>
						</Avatar.Root>
						<div class="min-w-0">
							<Card.Title class="truncate">{activeThread.participantName}</Card.Title>
							<Card.Description class="truncate">{activeThread.participantEmail}</Card.Description>
						</div>
					</div>
					<Card.Action>
						<div class="flex flex-wrap justify-end gap-2">
							<Badge variant={statusVariant(activeThread.status)} class="capitalize">
								{formatStatus(activeThread.status)}
							</Badge>
							{#if activeThread.routePath?.startsWith('/')}
								<Button href={activeThread.routePath} variant="outline" size="sm">
									<ExternalLink data-icon="inline-start" aria-hidden="true" />
									Context
								</Button>
							{/if}
						</div>
					</Card.Action>
				</Card.Header>

				<Card.Content class="bg-muted/30 p-0">
					<ScrollArea.Root class="h-80 xl:h-[20rem]">
						<div class="flex min-h-80 flex-col justify-end gap-4 p-4 xl:min-h-[20rem] xl:p-5">
							{#each activeThread.messages as message (message.id)}
								<div
									class={cn('flex gap-3', message.direction === 'outbound' && 'justify-end')}
									data-eliqauto-admin-message={message.id}
								>
									{#if message.direction === 'inbound'}
										<Avatar.Root class="size-9">
											<Avatar.Fallback>{message.initials}</Avatar.Fallback>
										</Avatar.Root>
									{/if}
									<div
										class={cn(
											'grid max-w-[78%] gap-1 rounded-2xl px-4 py-3 text-sm shadow-sm',
											message.direction === 'outbound'
												? 'bg-primary text-primary-foreground rounded-br-md'
												: 'bg-card text-card-foreground ring-border rounded-bl-md ring-1'
										)}
									>
										<span class="font-medium">{message.authorName}</span>
										<p class="m-0 leading-relaxed">{message.message}</p>
										<span
											class={cn(
												'text-xs',
												message.direction === 'outbound'
													? 'text-primary-foreground/75'
													: 'text-muted-foreground'
											)}
										>
											{formatDate(message.createdAt)}
										</span>
									</div>
								</div>
							{/each}
						</div>
					</ScrollArea.Root>
				</Card.Content>

				<Card.Footer class="bg-background/95 border-t p-4">
					<form method="POST" class="grid w-full gap-4">
						<input type="hidden" name="id" value={firstMessage?.id ?? activeThread.id} />
						<input type="hidden" name="threadId" value={activeThread.id} />
						<input type="hidden" name="routePath" value={activeThread.routePath} />
						<input type="hidden" name="vehicleSlug" value={activeThread.vehicleSlug ?? ''} />

						{#if form?.error}
							<Alert variant="destructive">
								<AlertTitle>Reply was not saved</AlertTitle>
								<AlertDescription>{form.error}</AlertDescription>
							</Alert>
						{/if}

						<div class="grid gap-3 xl:grid-cols-[13rem_minmax(0,1fr)] xl:items-end">
							<div class="grid gap-2">
								<Label for="message-status">Thread status</Label>
								<select
									id="message-status"
									name="status"
									class="border-input bg-background focus-visible:ring-ring h-10 rounded-lg border px-3 text-sm capitalize outline-none focus-visible:ring-3"
								>
									{#each statuses as statusName (statusName)}
										<option value={statusName} selected={activeThread.status === statusName}>
											{formatStatus(statusName)}
										</option>
									{/each}
								</select>
							</div>
							<div class="grid min-w-0 flex-1 gap-2">
								<Label for="reply">Staff reply</Label>
								<div class="flex flex-col gap-3 sm:flex-row sm:items-end">
									<Textarea
										id="reply"
										name="reply"
										class="min-h-20 flex-1 resize-none xl:min-h-16"
										placeholder="Write a concise update for the customer..."
									/>
									<Button type="submit" size="lg" class="sm:w-auto">
										<Send data-icon="inline-start" aria-hidden="true" />
										Send reply
									</Button>
								</div>
							</div>
						</div>
					</form>
				</Card.Footer>
			</Card.Root>
		{:else}
			<Card.Root class="xl:h-[36rem]">
				<Card.Content class="grid min-h-[32rem] place-items-center p-6 text-center xl:min-h-full">
					<div class="grid gap-2">
						<Card.Title>No active thread</Card.Title>
						<Card.Description>New customer messages will appear here.</Card.Description>
					</div>
				</Card.Content>
			</Card.Root>
		{/if}
	</section>
</AdminShell>
