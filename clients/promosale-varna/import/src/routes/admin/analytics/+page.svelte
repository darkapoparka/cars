<script lang="ts">
	import BarChart3 from '@lucide/svelte/icons/bar-chart-3';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import { formatNumber } from '$lib/components/admin/format';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	let { data } = $props();

	const leadSegments = $derived([
		{
			label: 'New inquiries',
			value: data.cms.inquiries.filter((item) => item.status === 'new').length
		},
		{
			label: 'Assigned inquiries',
			value: data.cms.inquiries.filter((item) => item.status === 'assigned').length
		},
		{
			label: 'Contacted inquiries',
			value: data.cms.inquiries.filter((item) => item.status === 'contacted').length
		},
		{
			label: 'Closed inquiries',
			value: data.cms.inquiries.filter((item) => item.status === 'closed').length
		}
	]);
	const inventorySegments = $derived([
		{
			label: 'Published inventory',
			value: data.cms.inventory.filter((item) => item.status === 'published').length
		},
		{
			label: 'Draft inventory',
			value: data.cms.inventory.filter((item) => item.status === 'draft').length
		},
		{
			label: 'Archived inventory',
			value: data.cms.inventory.filter((item) => item.status === 'archived').length
		}
	]);
</script>

<svelte:head>
	<title>Promosale Varna Admin - Analytics</title>
</svelte:head>

<AdminShell title="Analytics" activePath="/admin/analytics">
	<section
		class="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:px-6 xl:grid-cols-4"
		aria-label="Analytics summary"
	>
		{#each data.cms.analytics as metric (metric.label)}
			<Card.Root size="sm">
				<Card.Header>
					<Card.Description>{metric.label}</Card.Description>
					<Card.Action>
						<BarChart3 class="text-muted-foreground" aria-hidden="true" />
					</Card.Action>
					<Card.Title class="text-2xl font-semibold tabular-nums">
						{formatNumber(metric.value)}
					</Card.Title>
				</Card.Header>
				<Card.Footer class="text-muted-foreground text-sm">{metric.status}</Card.Footer>
			</Card.Root>
		{/each}
	</section>

	<section class="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-2">
		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Lead funnel</Card.Title>
					<Card.Description>Inquiry status coverage across the admin workspace.</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="p-0">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Status</Table.Head>
							<Table.Head class="text-right">Count</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each leadSegments as segment (segment.label)}
							<Table.Row>
								<Table.Cell>{segment.label}</Table.Cell>
								<Table.Cell class="text-right font-medium tabular-nums">
									{formatNumber(segment.value)}
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Inventory health</Card.Title>
					<Card.Description
						>Listing status split for published stock and work in progress.</Card.Description
					>
				</div>
			</Card.Header>
			<Card.Content class="p-0">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Status</Table.Head>
							<Table.Head class="text-right">Count</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each inventorySegments as segment (segment.label)}
							<Table.Row>
								<Table.Cell>{segment.label}</Table.Cell>
								<Table.Cell class="text-right font-medium tabular-nums">
									{formatNumber(segment.value)}
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>
	</section>
</AdminShell>
