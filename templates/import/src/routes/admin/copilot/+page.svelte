<script lang="ts">
	import { DefaultChatTransport, type UIMessage } from 'ai';
	import { Chat } from '@ai-sdk/svelte';
	import Bot from '@lucide/svelte/icons/bot';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import CircleUserRound from '@lucide/svelte/icons/circle-user-round';
	import MessageSquareText from '@lucide/svelte/icons/message-square-text';
	import SendHorizontal from '@lucide/svelte/icons/send-horizontal';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Square from '@lucide/svelte/icons/square';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import { formatDate, formatNumber } from '$lib/components/admin/format';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as ScrollArea from '$lib/components/ui/scroll-area/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { cn } from '$lib/utils.js';

	let { data } = $props();

	type TextPart = Extract<UIMessage['parts'][number], { type: 'text' }>;

	let input = $state('');
	let chatError = $state('');
	let messageViewport = $state<HTMLElement | null>(null);

	const chat = new Chat({
		id: 'daynight-admin-copilot',
		onError: (error) => {
			chatError = error.message;
		},
		transport: new DefaultChatTransport({
			api: '/admin/copilot/chat?role=admin'
		})
	});

	const textParts = (message: UIMessage): TextPart[] =>
		message.parts.filter((part): part is TextPart => part.type === 'text');

	const isBusy = () => chat.status === 'submitted' || chat.status === 'streaming';
	const canSend = $derived(input.trim().length > 0 && !isBusy());
	const incompleteListings = $derived(data.incompleteListings);

	const sendMessage = async (value = input) => {
		const text = value.trim();

		if (!text || isBusy()) return;

		chatError = '';
		input = '';
		await chat.sendMessage({ text });
	};

	const sendQuickPrompt = async (prompt: string) => {
		await sendMessage(prompt);
	};

	const stopChat = async () => {
		await chat.stop();
	};

	const handleComposerKeydown = (event: KeyboardEvent) => {
		if (event.key !== 'Enter' || event.shiftKey) return;

		event.preventDefault();
		void sendMessage();
	};

	$effect(() => {
		const messageCount = chat.messages.length;
		const status = chat.status;

		if (messageCount === 0 && status === 'ready') return;

		window.requestAnimationFrame(() => {
			messageViewport?.scrollTo({ top: messageViewport.scrollHeight, behavior: 'smooth' });
		});
	});
</script>

<svelte:head>
	<title>Day Night Auto Admin - AI Copilot</title>
</svelte:head>

<AdminShell title="AI Copilot" activePath="/admin/copilot">
	<section class="grid grid-cols-1 gap-4 px-4 md:grid-cols-4 lg:px-6" aria-label="Copilot summary">
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Published stock</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(data.cms.kpis.liveListings)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Draft stock</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(data.cms.kpis.draftListings)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Open leads</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(data.cms.kpis.openLeads)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Listing gaps</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(incompleteListings.length)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
	</section>

	<section
		class="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(20rem,0.8fr)]"
	>
		<Card.Root class="overflow-hidden">
			<Card.Header class="border-b">
				<div class="flex min-w-0 items-center gap-3">
					<span
						class="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-lg"
					>
						<Bot aria-hidden="true" />
					</span>
					<div class="min-w-0">
						<Card.Title>Day Night Auto AI Copilot</Card.Title>
						<Card.Description class="truncate">
							{#if data.copilot.enabled}
								Streaming through {data.copilot.model}
							{:else}
								Chat UI active in safe local CMS mode
							{/if}
						</Card.Description>
					</div>
				</div>
				<Card.Action>
					<Badge variant={data.copilot.enabled ? 'default' : 'secondary'}>
						{data.copilot.enabled ? 'Enabled' : 'No key'}
					</Badge>
				</Card.Action>
			</Card.Header>

			<Card.Content class="grid gap-4 p-4 md:p-5">
				{#if chatError}
					<Alert variant="destructive">
						<TriangleAlert aria-hidden="true" />
						<AlertTitle>Copilot stream failed</AlertTitle>
						<AlertDescription>{chatError}</AlertDescription>
					</Alert>
				{:else if !data.copilot.enabled}
					<Alert>
						<CheckCircle2 aria-hidden="true" />
						<AlertTitle>Safe local mode</AlertTitle>
						<AlertDescription>
							OpenAI is wired but no API key is available in this environment, so replies are
							deterministic summaries from live CMS data.
						</AlertDescription>
					</Alert>
				{/if}

				<div class="flex flex-wrap gap-2" aria-label="Copilot prompt shortcuts">
					{#each data.copilot.quickPrompts as prompt (prompt.label)}
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled={isBusy()}
							onclick={() => void sendQuickPrompt(prompt.prompt)}
						>
							<Sparkles data-icon="inline-start" aria-hidden="true" />
							{prompt.label}
						</Button>
					{/each}
				</div>

				<div class="border-border bg-muted/30 overflow-hidden rounded-lg border">
					<ScrollArea.Root class="h-[31rem]" bind:viewportRef={messageViewport}>
						<div
							class="flex min-h-[31rem] flex-col justify-end gap-4 p-4 md:p-5"
							aria-live="polite"
						>
							<div class="flex items-start gap-3">
								<span
									class="bg-primary/10 text-primary grid size-9 shrink-0 place-items-center rounded-full"
								>
									<Bot size={18} aria-hidden="true" />
								</span>
								<div
									class="bg-background text-foreground ring-border grid max-w-[82%] gap-2 rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed shadow-sm ring-1"
								>
									<div class="flex items-center gap-2 text-xs font-medium">
										<MessageSquareText size={15} aria-hidden="true" />
										Copilot
									</div>
									<p class="m-0 whitespace-pre-wrap">{data.copilot.welcome}</p>
								</div>
							</div>

							{#each chat.messages as message (message.id)}
								<div class={cn('flex items-start gap-3', message.role === 'user' && 'justify-end')}>
									{#if message.role !== 'user'}
										<span
											class="bg-primary/10 text-primary grid size-9 shrink-0 place-items-center rounded-full"
										>
											<Bot size={18} aria-hidden="true" />
										</span>
									{/if}

									<div
										class={cn(
											'grid max-w-[82%] gap-2 rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
											message.role === 'user'
												? 'bg-primary text-primary-foreground rounded-br-md'
												: 'bg-background text-foreground ring-border rounded-bl-md ring-1'
										)}
									>
										<div class="flex items-center gap-2 text-xs font-medium">
											{#if message.role === 'user'}
												<CircleUserRound size={15} aria-hidden="true" />
												You
											{:else}
												<MessageSquareText size={15} aria-hidden="true" />
												Copilot
											{/if}
										</div>

										<div class="grid gap-2">
											{#each textParts(message) as part, index (`${message.id}-${index}`)}
												<p class="m-0 whitespace-pre-wrap">{part.text}</p>
											{/each}
										</div>
									</div>

									{#if message.role === 'user'}
										<span
											class="bg-primary text-primary-foreground grid size-9 shrink-0 place-items-center rounded-full"
										>
											<CircleUserRound size={18} aria-hidden="true" />
										</span>
									{/if}
								</div>
							{/each}

							{#if chat.status === 'submitted'}
								<div class="flex items-center gap-3">
									<span
										class="bg-primary/10 text-primary grid size-9 shrink-0 place-items-center rounded-full"
									>
										<Bot size={18} aria-hidden="true" />
									</span>
									<div
										class="bg-background ring-border rounded-2xl rounded-bl-md px-4 py-3 text-sm ring-1"
									>
										Thinking...
									</div>
								</div>
							{/if}
						</div>
					</ScrollArea.Root>
				</div>
			</Card.Content>

			<Card.Footer class="border-t p-4 md:p-5">
				<form
					class="grid w-full gap-3"
					onsubmit={(event) => {
						event.preventDefault();
						void sendMessage();
					}}
				>
					<Textarea
						bind:value={input}
						class="min-h-24 resize-none"
						placeholder="Ask about stock gaps, draft descriptions, leads, imports, or today&apos;s CEO snapshot..."
						onkeydown={handleComposerKeydown}
					/>
					<div class="flex flex-wrap items-center justify-between gap-3">
						<p class="text-muted-foreground text-xs">
							{data.copilot.enabled
								? 'Context is refreshed from CMS on every request.'
								: 'No secret is exposed; local fallback uses only CMS state.'}
						</p>
						<div class="flex gap-2">
							{#if isBusy()}
								<Button type="button" variant="outline" onclick={() => void stopChat()}>
									<Square data-icon="inline-start" aria-hidden="true" />
									Stop
								</Button>
							{/if}
							<Button type="submit" disabled={!canSend}>
								<SendHorizontal data-icon="inline-start" aria-hidden="true" />
								Send
							</Button>
						</div>
					</div>
				</form>
			</Card.Footer>
		</Card.Root>

		<div class="grid content-start gap-4">
			<Card.Root>
				<Card.Header>
					<Card.Title>Inventory Watchlist</Card.Title>
					<Card.Description
						>{formatNumber(incompleteListings.length)} records need review</Card.Description
					>
				</Card.Header>
				<Card.Content class="grid gap-3">
					{#each incompleteListings.slice(0, 5) as listing (listing.id)}
						<div class="border-border rounded-lg border p-3">
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0">
									<p class="truncate text-sm font-medium">{listing.title}</p>
									<p class="text-muted-foreground text-xs">
										{listing.status} - {listing.brand}
										{listing.model} - {listing.priceLabel}
									</p>
									<p class="text-muted-foreground mt-1 text-xs">
										Add {listing.missing.join(', ')}
									</p>
								</div>
								<Badge variant="outline" class="capitalize">{listing.status}</Badge>
							</div>
						</div>
					{:else}
						<p class="text-muted-foreground text-sm">All current listing records look complete.</p>
					{/each}
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Recent Work</Card.Title>
					<Card.Description>Leads, imports, and conversations</Card.Description>
				</Card.Header>
				<Card.Content class="grid gap-3">
					{#each data.cms.recentWork.slice(0, 5) as item (item.id)}
						<div class="border-border rounded-lg border p-3">
							<div class="flex items-center justify-between gap-3">
								<p class="truncate text-sm font-medium">{item.label}</p>
								<Badge variant="outline">{item.type}</Badge>
							</div>
							<p class="text-muted-foreground mt-1 line-clamp-2 text-xs">{item.body}</p>
							<p class="text-muted-foreground mt-2 text-xs">{formatDate(item.createdAt)}</p>
						</div>
					{/each}
				</Card.Content>
			</Card.Root>
		</div>
	</section>
</AdminShell>
