<script lang="ts">
	import { resolve } from '$app/paths';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Mail from '@lucide/svelte/icons/mail';
	import Phone from '@lucide/svelte/icons/phone';
	import Save from '@lucide/svelte/icons/save';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import {
		formatDate,
		formatNumber,
		formatStatus,
		statusVariant
	} from '$lib/components/admin/format';
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

	const statuses = ['new', 'assigned', 'contacted', 'closed'];
	const sourceLabels: Record<string, string> = {
		'sell-your-car': 'Sell your car',
		'vehicle-detail': 'Vehicle inquiry',
		website: 'Website'
	};

	const sourceLabel = (source: string) => sourceLabels[source] ?? source.replaceAll('-', ' ');

	const activeInquiry = $derived(
		data.cms.inquiries.find((inquiry) => inquiry.id === data.activeInquiryId) ??
			data.cms.inquiries[0]
	);
	const activeAgent = $derived(
		activeInquiry
			? data.cms.agents.find((agent) => agent.slug === activeInquiry.assignedAgentSlug)
			: undefined
	);
	const openInquiries = $derived(
		data.cms.inquiries.filter((inquiry) => inquiry.status !== 'closed').length
	);
	const assignedInquiries = $derived(
		data.cms.inquiries.filter((inquiry) => inquiry.status === 'assigned').length
	);
	const contactedInquiries = $derived(
		data.cms.inquiries.filter((inquiry) => inquiry.status === 'contacted').length
	);
	const inboxSummary = $derived(
		`${formatNumber(openInquiries)} open / ${formatNumber(assignedInquiries)} assigned / ${formatNumber(contactedInquiries)} contacted`
	);
</script>

<svelte:head>
	<title>Day Night Auto Admin - Inquiries</title>
</svelte:head>

<AdminShell title="Inquiries" activePath="/admin/inquiries">
	<section
		class="grid items-start gap-4 px-4 lg:px-6 xl:grid-cols-[25rem_minmax(0,1fr)]"
		data-daynight-admin-inquiries
	>
		<Card.Root class="overflow-hidden">
			<Card.Header class="border-b">
				<div>
					<Card.Title>Lead inbox</Card.Title>
					<Card.Description>{inboxSummary}</Card.Description>
				</div>
				<Card.Action>
					<Badge variant="outline">{formatNumber(data.cms.inquiries.length)} total</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Content class="p-0">
				<ScrollArea.Root class="max-h-[calc(100svh-11rem)]">
					<div class="grid gap-1 p-2">
						{#each data.cms.inquiries as inquiry (inquiry.id)}
							<a
								href={resolve(('/admin/inquiries?lead=' + encodeURIComponent(inquiry.id)) as '/')}
								aria-current={activeInquiry?.id === inquiry.id ? 'page' : undefined}
								data-daynight-admin-inquiry={inquiry.id}
								class={cn(
									'hover:bg-muted flex min-h-24 items-start gap-3 rounded-lg px-3 py-3 text-sm transition-colors',
									activeInquiry?.id === inquiry.id && 'bg-muted ring-border ring-1'
								)}
							>
								<Avatar.Root class="size-10">
									<Avatar.Fallback>{inquiry.contactName.slice(0, 1)}</Avatar.Fallback>
								</Avatar.Root>
								<span class="grid min-w-0 flex-1 gap-1.5">
									<span class="flex items-center justify-between gap-2">
										<span class="truncate font-medium">{inquiry.contactName}</span>
										<span class="text-muted-foreground shrink-0 text-xs">
											{formatDate(inquiry.createdAt)}
										</span>
									</span>
									<span class="text-muted-foreground truncate text-xs">{inquiry.contactEmail}</span>
									<span class="flex min-w-0 items-center justify-between gap-2">
										<span class="truncate text-xs">
											{inquiry.vehicleTitle ?? sourceLabel(inquiry.source)}
										</span>
										<Badge variant={statusVariant(inquiry.status)} class="shrink-0 capitalize">
											{formatStatus(inquiry.status)}
										</Badge>
									</span>
									<span class="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
										{inquiry.message}
									</span>
								</span>
							</a>
						{:else}
							<div class="text-muted-foreground p-6 text-sm">No active inquiries yet.</div>
						{/each}
					</div>
				</ScrollArea.Root>
			</Card.Content>
		</Card.Root>

		{#if activeInquiry}
			<Card.Root class="overflow-hidden">
				<Card.Header class="border-b">
					<div class="flex min-w-0 items-start gap-3">
						<Avatar.Root class="size-11">
							<Avatar.Fallback>{activeInquiry.contactName.slice(0, 1)}</Avatar.Fallback>
						</Avatar.Root>
						<div class="min-w-0">
							<Card.Title class="truncate">{activeInquiry.contactName}</Card.Title>
							<Card.Description class="flex flex-wrap items-center gap-x-4 gap-y-1">
								<a
									href={`mailto:${activeInquiry.contactEmail}`}
									class="hover:bg-muted hover:text-foreground -mx-2 inline-flex min-h-9 min-w-0 items-center gap-2 rounded-md px-2 transition-colors"
								>
									<Mail class="size-4 shrink-0" aria-hidden="true" />
									<span class="truncate">{activeInquiry.contactEmail}</span>
								</a>
								<a
									href={`tel:${activeInquiry.contactPhone}`}
									class="hover:bg-muted hover:text-foreground -mx-2 inline-flex min-h-9 items-center gap-2 rounded-md px-2 transition-colors"
								>
									<Phone class="size-4 shrink-0" aria-hidden="true" />
									{activeInquiry.contactPhone}
								</a>
							</Card.Description>
						</div>
					</div>
					<Card.Action>
						<div class="flex flex-wrap justify-end gap-2">
							<Badge variant={statusVariant(activeInquiry.status)} class="capitalize">
								{formatStatus(activeInquiry.status)}
							</Badge>
							{#if activeInquiry.routePath?.startsWith('/')}
								<Button href={activeInquiry.routePath} variant="outline" size="sm">
									<ExternalLink data-icon="inline-start" aria-hidden="true" />
									Context
								</Button>
							{/if}
						</div>
					</Card.Action>
				</Card.Header>

				<Card.Content class="grid gap-6 p-5">
					{#if form?.error}
						<Alert variant="destructive">
							<AlertTitle>Inquiry was not saved</AlertTitle>
							<AlertDescription>{form.error}</AlertDescription>
						</Alert>
					{/if}

					<div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
						<div class="grid content-start gap-5">
							<section class="grid gap-2">
								<p class="text-muted-foreground m-0 text-xs font-medium tracking-wide uppercase">
									Customer message
								</p>
								<p class="m-0 text-base leading-7">{activeInquiry.message}</p>
							</section>

							<section class="grid gap-3 border-t pt-5">
								<p class="text-muted-foreground m-0 text-xs font-medium tracking-wide uppercase">
									Context
								</p>
								<div class="grid gap-1">
									<h2 class="m-0 text-xl font-semibold tracking-tight">
										{activeInquiry.vehicleTitle ?? sourceLabel(activeInquiry.source)}
									</h2>
									<p class="text-muted-foreground m-0 text-sm">
										{sourceLabel(activeInquiry.source)} submitted on {formatDate(
											activeInquiry.createdAt
										)}
									</p>
								</div>
								{#if activeInquiry.routePath?.startsWith('/')}
									<Button
										href={activeInquiry.routePath}
										variant="outline"
										size="sm"
										class="justify-self-start"
									>
										<ExternalLink data-icon="inline-start" aria-hidden="true" />
										Open source page
									</Button>
								{/if}
							</section>
						</div>

						<aside class="bg-muted/35 grid content-start gap-4 rounded-lg p-4 text-sm">
							<div class="flex items-center justify-between gap-3">
								<span class="text-muted-foreground">Status</span>
								<Badge variant={statusVariant(activeInquiry.status)} class="capitalize">
									{formatStatus(activeInquiry.status)}
								</Badge>
							</div>
							<div class="flex items-center justify-between gap-3">
								<span class="text-muted-foreground">Assigned to</span>
								<span class="truncate font-medium">{activeAgent?.name ?? 'Unassigned'}</span>
							</div>
							<div class="flex items-center justify-between gap-3">
								<span class="text-muted-foreground">Source</span>
								<span class="truncate font-medium">{sourceLabel(activeInquiry.source)}</span>
							</div>
							<div class="flex items-center justify-between gap-3">
								<span class="text-muted-foreground">Contact role</span>
								<span class="truncate font-medium capitalize">{activeInquiry.userRole}</span>
							</div>
							<div class="flex items-center justify-between gap-3">
								<span class="text-muted-foreground">Lead id</span>
								<span class="truncate font-mono text-xs">{activeInquiry.id}</span>
							</div>
						</aside>
					</div>
				</Card.Content>

				<Card.Footer class="bg-background/95 border-t">
					<form method="POST" class="grid w-full gap-4">
						<input type="hidden" name="id" value={activeInquiry.id} />

						<div class="grid gap-4 xl:grid-cols-[13rem_17rem_minmax(0,1fr)_auto] xl:items-end">
							<div class="grid gap-2">
								<Label for="inquiry-status">Lead status</Label>
								<select
									id="inquiry-status"
									name="status"
									class="border-input bg-background focus-visible:ring-ring h-11 rounded-lg border px-3 text-sm capitalize outline-none focus-visible:ring-3"
								>
									{#each statuses as statusName (statusName)}
										<option value={statusName} selected={activeInquiry.status === statusName}>
											{formatStatus(statusName)}
										</option>
									{/each}
								</select>
							</div>
							<div class="grid gap-2">
								<Label for="inquiry-agent">Owner</Label>
								<select
									id="inquiry-agent"
									name="assignedAgentSlug"
									class="border-input bg-background focus-visible:ring-ring h-11 rounded-lg border px-3 text-sm outline-none focus-visible:ring-3"
								>
									{#each data.cms.agents as agent (agent.slug)}
										<option
											value={agent.slug}
											selected={activeInquiry.assignedAgentSlug === agent.slug}
										>
											{agent.name}
										</option>
									{/each}
								</select>
							</div>
							<div class="grid min-w-0 gap-2">
								<Label for="inquiry-message">Triage note</Label>
								<Textarea
									id="inquiry-message"
									name="message"
									value={activeInquiry.message}
									class="min-h-20 resize-none"
								/>
							</div>
							<Button type="submit" size="lg">
								<Save data-icon="inline-start" aria-hidden="true" />
								Save triage
							</Button>
						</div>
					</form>
				</Card.Footer>
			</Card.Root>
		{:else}
			<Card.Root class="min-h-[32rem]">
				<Card.Content class="grid min-h-[32rem] place-items-center p-6 text-center">
					<div class="grid gap-2">
						<Card.Title>No active inquiry</Card.Title>
						<Card.Description>New leads will appear here for triage.</Card.Description>
					</div>
				</Card.Content>
			</Card.Root>
		{/if}
	</section>
</AdminShell>
