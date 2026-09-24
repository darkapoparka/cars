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

	let { data } = $props();
	const statuses = ['active', 'paused'];
</script>

<svelte:head>
	<title>OUTLETCARS.BG Admin - Agents</title>
</svelte:head>

<AdminShell title="Agents" activePath="/admin/agents">
	<section class="grid grid-cols-1 gap-4 px-4 sm:grid-cols-3 lg:px-6" aria-label="Agent summary">
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Managed agents</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(data.cms.agents.length)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Active</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(data.cms.agents.filter((agent) => agent.status === 'active').length)}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root size="sm">
			<Card.Header>
				<Card.Description>Open assignments</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums">
					{formatNumber(data.cms.agents.reduce((total, agent) => total + agent.openInquiries, 0))}
				</Card.Title>
			</Card.Header>
		</Card.Root>
	</section>

	<section
		class="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6"
		data-daynight-agent-management="true"
	>
		{#each data.cms.agents as agent (agent.slug)}
			<Card.Root data-daynight-agent-card={agent.slug} data-daynight-agent-status={agent.status}>
				<Card.Header class="border-b">
					<div class="flex items-start gap-3">
						<img
							class="size-12 rounded-md object-cover ring-1 ring-border"
							src={agent.image}
							alt=""
						/>
						<div class="min-w-0">
							<Card.Title class="truncate text-base">{agent.name}</Card.Title>
							<Card.Description>{agent.title}</Card.Description>
						</div>
					</div>
					<Card.Action>
						<Badge variant={statusVariant(agent.status)} class="capitalize">
							{formatStatus(agent.status)}
						</Badge>
					</Card.Action>
				</Card.Header>
				<Card.Content class="grid gap-4 p-4">
					<div class="grid grid-cols-3 gap-3 text-sm">
						<div>
							<p class="m-0 text-xs text-muted-foreground">Open leads</p>
							<p class="m-0 font-semibold tabular-nums">{formatNumber(agent.openInquiries)}</p>
						</div>
						<div>
							<p class="m-0 text-xs text-muted-foreground">Sales</p>
							<p class="m-0 font-semibold tabular-nums">{formatNumber(agent.sales)}</p>
						</div>
						<div>
							<p class="m-0 text-xs text-muted-foreground">Rating</p>
							<p class="m-0 font-semibold tabular-nums">{agent.rating}</p>
						</div>
					</div>
					<form method="POST" class="grid gap-2">
						<input type="hidden" name="slug" value={agent.slug} />
						<div class="grid gap-2 sm:grid-cols-[1fr_auto]">
							<select
								name="status"
								class="h-10 rounded-lg border border-input bg-background px-3 text-sm capitalize outline-none focus-visible:ring-3 focus-visible:ring-ring"
							>
								{#each statuses as statusName (statusName)}
									<option value={statusName} selected={agent.status === statusName}>
										{formatStatus(statusName)}
									</option>
								{/each}
							</select>
							<Button type="submit" size="sm" variant="outline">Save</Button>
						</div>
						<Input name="note" value={agent.note} />
					</form>
				</Card.Content>
				<Card.Footer class="justify-between border-t text-xs text-muted-foreground">
					<span>Updated {formatDate(agent.updatedAt)}</span>
					<Button
						href={`/admin/agents/${encodeURIComponent(agent.slug)}`}
						variant="ghost"
						size="sm"
					>
						Open
					</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</section>
</AdminShell>
