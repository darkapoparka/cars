<script lang="ts">
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import {
		formatDate,
		formatNumber,
		formatStatus,
		statusVariant
	} from '$lib/components/admin/format';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	let { data } = $props();
	const statuses = ['active', 'paused'];
	const assignedInquiries = $derived(
		data.cms.inquiries.filter((inquiry) => inquiry.assignedAgentSlug === data.agent.slug)
	);
</script>

<svelte:head>
	<title>Promosale Varna Admin - {data.agent.name}</title>
</svelte:head>

<AdminShell title={data.agent.name} activePath="/admin/agents">
	<section class="grid grid-cols-1 gap-4 px-4 lg:grid-cols-[22rem_1fr] lg:px-6">
		<Card.Root>
			<Card.Header class="border-b">
				<img
					class="aspect-square w-full rounded-lg object-cover ring-1 ring-border"
					src={data.agent.image}
					alt=""
				/>
				<div>
					<Card.Title>{data.agent.name}</Card.Title>
					<Card.Description>{data.agent.title}</Card.Description>
				</div>
				<Card.Action>
					<Badge variant={statusVariant(data.agent.status)} class="capitalize">
						{formatStatus(data.agent.status)}
					</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Content class="grid gap-4 p-4">
				<div class="grid grid-cols-3 gap-3 text-sm">
					<div>
						<p class="m-0 text-xs text-muted-foreground">Open leads</p>
						<p class="m-0 font-semibold tabular-nums">{formatNumber(data.agent.openInquiries)}</p>
					</div>
					<div>
						<p class="m-0 text-xs text-muted-foreground">Sales</p>
						<p class="m-0 font-semibold tabular-nums">{formatNumber(data.agent.sales)}</p>
					</div>
					<div>
						<p class="m-0 text-xs text-muted-foreground">Rating</p>
						<p class="m-0 font-semibold tabular-nums">{data.agent.rating}</p>
					</div>
				</div>
				<form method="POST" class="grid gap-2">
					<div class="grid gap-2 sm:grid-cols-[1fr_auto]">
						<select
							name="status"
							class="h-10 rounded-lg border border-input bg-background px-3 text-sm capitalize outline-none focus-visible:ring-3 focus-visible:ring-ring"
						>
							{#each statuses as statusName (statusName)}
								<option value={statusName} selected={data.agent.status === statusName}>
									{formatStatus(statusName)}
								</option>
							{/each}
						</select>
						<Button type="submit" size="sm" variant="outline">Save</Button>
					</div>
					<Input name="note" value={data.agent.note} />
				</form>
			</Card.Content>
			<Card.Footer class="justify-between border-t text-xs text-muted-foreground">
				<span>Updated {formatDate(data.agent.updatedAt)}</span>
				<Button href="/admin/agents" variant="ghost" size="sm">Back</Button>
			</Card.Footer>
		</Card.Root>

		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Assigned inquiries</Card.Title>
					<Card.Description>Lead ownership and current follow-up state.</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="p-0">
				<div class="overflow-x-auto">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Contact</Table.Head>
								<Table.Head>Context</Table.Head>
								<Table.Head>Status</Table.Head>
								<Table.Head class="hidden lg:table-cell">Created</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each assignedInquiries as inquiry (inquiry.id)}
								<Table.Row>
									<Table.Cell>
										<p class="m-0 font-medium">{inquiry.contactName}</p>
										<p class="m-0 text-xs text-muted-foreground">{inquiry.contactEmail}</p>
									</Table.Cell>
									<Table.Cell>
										<p class="m-0 font-medium">{inquiry.vehicleTitle ?? inquiry.source}</p>
										<p class="m-0 text-xs text-muted-foreground">{inquiry.message}</p>
									</Table.Cell>
									<Table.Cell>
										<Badge variant={statusVariant(inquiry.status)} class="capitalize">
											{formatStatus(inquiry.status)}
										</Badge>
									</Table.Cell>
									<Table.Cell class="hidden text-xs text-muted-foreground lg:table-cell">
										{formatDate(inquiry.createdAt)}
									</Table.Cell>
								</Table.Row>
							{:else}
								<Table.Row>
									<Table.Cell colspan={4} class="p-6 text-center text-sm text-muted-foreground">
										No active inquiries assigned to this agent.
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</Card.Content>
		</Card.Root>
	</section>
</AdminShell>
