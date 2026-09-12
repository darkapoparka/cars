<script lang="ts">
	import { resolve } from '$app/paths';
	import { Chat } from '@ai-sdk/svelte';
	import Bot from '@lucide/svelte/icons/bot';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import ClipboardCheck from '@lucide/svelte/icons/clipboard-check';
	import Database from '@lucide/svelte/icons/database';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import MessageSquareText from '@lucide/svelte/icons/message-square-text';
	import Send from '@lucide/svelte/icons/send';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Wrench from '@lucide/svelte/icons/wrench';
	import { DefaultChatTransport, type UIMessage } from 'ai';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import { formatNumber } from '$lib/components/admin/format';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { cn } from '$lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let input = $state('');
	let assistantError = $state('');

	const chat = new Chat<UIMessage>({
		transport: new DefaultChatTransport({
			api: resolve('/admin/assistant/chat')
		}),
		messages: [
			{
				id: 'assistant-welcome',
				role: 'assistant',
				parts: [
					{
						type: 'text',
						text: 'Ready. I can inspect CMS records, summarize queues, draft listing/post copy, and flag inventory QA. Writes stay in the reviewed CMS forms.'
					}
				]
			}
		],
		onError: (error) => {
			assistantError = error.message || 'The assistant request failed.';
		}
	});

	const isBusy = $derived(chat.status === 'submitted' || chat.status === 'streaming');
	const canSend = $derived(Boolean(input.trim()) && data.assistantConfigured && !isBusy);
	const openWork = $derived(
		data.dashboard.kpis.openLeads +
			data.dashboard.kpis.activeImports +
			data.dashboard.kpis.openConversations
	);

	const quickPrompts = $derived([
		{
			label: 'Queue brief',
			prompt:
				'Summarize new leads and active import requests. Prioritize what staff should do next and include admin links.'
		},
		{
			label: 'Inventory QA',
			prompt:
				'Check recent inventory for missing images, weak descriptions, missing prices, or draft listings that need attention.'
		},
		{
			label: 'Listing copy',
			prompt:
				'Help me draft a Bulgarian listing description. Ask for the vehicle or lot if the target is unclear.'
		},
		{
			label: 'Post draft',
			prompt:
				'Draft a Bulgarian news post idea based on current inventory and import pipeline activity.'
		}
	]);

	type MessagePart = UIMessage['parts'][number];
	type TextPart = Extract<MessagePart, { type: 'text' }>;
	type ToolPart = MessagePart & {
		type: string;
		state?: string;
		errorText?: string;
	};

	function isTextPart(part: MessagePart): part is TextPart {
		return part.type === 'text';
	}

	function isToolPart(part: MessagePart): part is ToolPart {
		return part.type === 'dynamic-tool' || part.type.startsWith('tool-');
	}

	function toolName(part: ToolPart) {
		if (part.type === 'dynamic-tool' && 'toolName' in part && typeof part.toolName === 'string') {
			return part.toolName;
		}

		return part.type.replace(/^tool-/, '');
	}

	function toolStateLabel(part: ToolPart) {
		if (part.state === 'input-streaming' || part.state === 'input-available') return 'Reading CMS';
		if (part.state === 'output-available') return 'Context loaded';
		if (part.state === 'output-error') return part.errorText || 'Tool failed';
		if (part.state === 'approval-requested') return 'Needs approval';

		return 'Working';
	}

	function messageLabel(message: UIMessage) {
		return message.role === 'user' ? 'Operator' : 'Assistant';
	}

	async function sendPrompt(text = input) {
		const prompt = text.trim();
		if (!prompt || !data.assistantConfigured || isBusy) return;

		assistantError = '';
		input = '';
		await chat.sendMessage({ text: prompt });
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		void sendPrompt();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			void sendPrompt();
		}
	}
</script>

<svelte:head>
	<title>Admin - Assistant</title>
</svelte:head>

<AdminShell title="Assistant" eyebrow="AI operations" activePath="/admin/assistant">
	<section class="grid grid-cols-1 gap-4 px-4 lg:grid-cols-[minmax(0,1fr)_24rem] lg:px-6">
		<Card.Root class="min-h-[40rem] min-w-0 overflow-hidden">
			<Card.Header class="border-b">
				<div class="min-w-0">
					<Card.Description class="flex items-center gap-2">
						<Bot aria-hidden="true" />
						G Auto operations assistant
					</Card.Description>
					<Card.Title class="text-2xl font-semibold">CMS workbench</Card.Title>
				</div>
				<Card.Action>
					<Badge variant={data.assistantConfigured ? 'default' : 'destructive'}>
						<Sparkles aria-hidden="true" />
						{data.assistantConfigured ? data.assistantModel : 'Key missing'}
					</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Content class="flex h-[calc(100svh-14rem)] min-h-[32rem] flex-col p-0">
				<div class="min-h-0 flex-1 overflow-y-auto p-4">
					<div class="flex flex-col gap-3">
						{#each chat.messages as message (message.id)}
							<div
								class={cn(
									'flex min-w-0',
									message.role === 'user' ? 'justify-end' : 'justify-start'
								)}
							>
								<div
									class={cn(
										'max-w-[78%] rounded-lg border px-3 py-2 text-sm shadow-sm',
										message.role === 'user'
											? 'bg-primary text-primary-foreground border-primary'
											: 'bg-card text-card-foreground'
									)}
								>
									<div class="mb-1 flex items-center justify-between gap-3">
										<span
											class={cn(
												'text-xs font-medium',
												message.role === 'user'
													? 'text-primary-foreground/70'
													: 'text-muted-foreground'
											)}
										>
											{messageLabel(message)}
										</span>
										{#if message.role === 'assistant'}
											<Badge variant="outline">Draft safe</Badge>
										{/if}
									</div>
									<div class="grid gap-2">
										{#each message.parts as part, partIndex (`${message.id}-${partIndex}`)}
											{#if isTextPart(part)}
												<p class="leading-6 whitespace-pre-wrap">{part.text}</p>
											{:else if isToolPart(part)}
												<div
													class={cn(
														'bg-muted/60 text-muted-foreground flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs',
														part.state === 'output-error' && 'text-destructive'
													)}
												>
													<Wrench aria-hidden="true" />
													<span class="font-medium">{toolName(part)}</span>
													<span>{toolStateLabel(part)}</span>
												</div>
											{/if}
										{/each}
									</div>
								</div>
							</div>
						{/each}

						{#if isBusy}
							<div class="flex justify-start">
								<div
									class="bg-card text-card-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-sm shadow-sm"
								>
									<LoaderCircle class="animate-spin" aria-hidden="true" />
									<span>Checking CMS context</span>
								</div>
							</div>
						{/if}
					</div>
				</div>

				{#if assistantError || chat.error}
					<div class="border-t px-4 py-3">
						<div
							class="border-destructive/40 bg-destructive/10 text-destructive flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
						>
							<CircleAlert aria-hidden="true" />
							<span>{assistantError || chat.error?.message}</span>
						</div>
					</div>
				{/if}

				<form class="border-t p-4" onsubmit={handleSubmit}>
					<div class="flex items-end gap-3">
						<Textarea
							class="min-h-20 resize-none"
							bind:value={input}
							placeholder={data.assistantConfigured
								? 'Ask about inventory QA, lead follow-up, imports, or post drafts'
								: 'Configure the server assistant key to enable the assistant'}
							disabled={!data.assistantConfigured}
							onkeydown={handleKeydown}
						/>
						<Button type="submit" disabled={!canSend} class="mb-0.5">
							<Send data-icon="inline-start" aria-hidden="true" />
							Send
						</Button>
					</div>
				</form>
			</Card.Content>
		</Card.Root>

		<div class="grid min-w-0 content-start gap-4">
			<Card.Root>
				<Card.Header class="border-b">
					<Card.Description>Live CMS context</Card.Description>
					<Card.Title class="text-2xl font-semibold tabular-nums">
						{formatNumber(openWork)} open work items
					</Card.Title>
				</Card.Header>
				<Card.Content class="grid gap-3">
					<div class="bg-muted/50 flex items-center justify-between gap-3 rounded-lg border p-3">
						<span class="flex items-center gap-2 text-sm">
							<MessageSquareText aria-hidden="true" />
							New leads
						</span>
						<Badge variant="outline">{formatNumber(data.dashboard.kpis.openLeads)}</Badge>
					</div>
					<div class="bg-muted/50 flex items-center justify-between gap-3 rounded-lg border p-3">
						<span class="flex items-center gap-2 text-sm">
							<Database aria-hidden="true" />
							Active imports
						</span>
						<Badge variant="outline">{formatNumber(data.dashboard.kpis.activeImports)}</Badge>
					</div>
					<div class="bg-muted/50 flex items-center justify-between gap-3 rounded-lg border p-3">
						<span class="flex items-center gap-2 text-sm">
							<ClipboardCheck aria-hidden="true" />
							Draft listings
						</span>
						<Badge variant="outline">{formatNumber(data.dashboard.kpis.draftListings)}</Badge>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="border-b">
					<Card.Description>Write boundary</Card.Description>
					<Card.Title class="flex items-center gap-2">
						<ShieldCheck aria-hidden="true" />
						Reviewed form saves
					</Card.Title>
				</Card.Header>
				<Card.Content class="grid gap-3">
					<div class="flex items-center justify-between gap-3">
						<span class="text-muted-foreground text-sm">CMS reads</span>
						<Badge variant="default">Enabled</Badge>
					</div>
					<Separator />
					<div class="flex items-center justify-between gap-3">
						<span class="text-muted-foreground text-sm">Copy drafts</span>
						<Badge variant="outline">Review</Badge>
					</div>
					<Separator />
					<div class="flex items-center justify-between gap-3">
						<span class="text-muted-foreground text-sm">Automatic writes</span>
						<Badge variant="secondary">Disabled</Badge>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="border-b">
					<Card.Description>Operator prompts</Card.Description>
					<Card.Title>Fast starts</Card.Title>
				</Card.Header>
				<Card.Content class="grid gap-2">
					{#each quickPrompts as item (item.label)}
						<Button
							type="button"
							variant="outline"
							class="min-h-11 justify-start text-left whitespace-normal"
							disabled={!data.assistantConfigured || isBusy}
							onclick={() => void sendPrompt(item.prompt)}
						>
							<MessageSquareText data-icon="inline-start" aria-hidden="true" />
							{item.label}
						</Button>
					{/each}
				</Card.Content>
			</Card.Root>
		</div>
	</section>
</AdminShell>
