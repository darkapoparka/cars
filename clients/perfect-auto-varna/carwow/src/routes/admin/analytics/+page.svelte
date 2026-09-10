<script lang="ts">
	import { resolve } from '$lib/utils/preview-paths';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import BarChart3 from '@lucide/svelte/icons/bar-chart-3';
	import Gauge from '@lucide/svelte/icons/gauge';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import { formatNumber } from '$lib/components/admin/format';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const metricCards = $derived([
		{
			label: 'Live listings',
			value: data.dashboard.kpis.liveListings,
			status: 'Inventory',
			href: '/admin/listings?status=published',
			action: 'Review live stock'
		},
		{
			label: 'Draft listings',
			value: data.dashboard.kpis.draftListings,
			status: 'Inventory',
			href: '/admin/listings?status=draft',
			action: 'Finish drafts'
		},
		{
			label: 'Open leads',
			value: data.dashboard.kpis.openLeads,
			status: 'Sales',
			href: '/admin/leads?status=new',
			action: 'Open inbox'
		},
		{
			label: 'Active imports',
			value: data.dashboard.kpis.activeImports,
			status: 'Pipeline',
			href: '/admin/imports',
			action: 'Move pipeline'
		},
		{
			label: 'Open chats',
			value: data.dashboard.kpis.openConversations,
			status: 'Realtime',
			href: '/admin/leads',
			action: 'Check conversations'
		},
		{
			label: 'Published posts',
			value: data.dashboard.kpis.publishedPosts,
			status: 'Content',
			href: '/admin/posts?status=published',
			action: 'Review content'
		}
	]);

	const totalOpenWork = $derived(
		data.dashboard.kpis.openLeads +
			data.dashboard.kpis.activeImports +
			data.dashboard.kpis.openConversations
	);

	const publishingHealth = $derived(
		data.dashboard.kpis.liveListings + data.dashboard.kpis.publishedPosts
	);
</script>

<svelte:head>
	<title>Admin - Analytics</title>
</svelte:head>

<AdminShell title="Analytics" activePath="/admin/analytics">
	<section class="grid grid-cols-1 gap-4 px-4 lg:grid-cols-[minmax(0,1fr)_24rem] lg:px-6">
		<Card.Root class="bg-sidebar text-sidebar-foreground">
			<Card.Header>
				<div>
					<Card.Description class="text-sidebar-foreground/60">CMS workload</Card.Description>
					<Card.Title class="text-2xl font-semibold">
						{formatNumber(totalOpenWork)} open work items across sales and imports
					</Card.Title>
				</div>
				<Card.Action>
					<Badge variant="outline" class="border-sidebar-border text-sidebar-foreground">
						<BarChart3 aria-hidden="true" />
						Live readout
					</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Content class="grid gap-3 sm:grid-cols-3">
				<a
					class="border-sidebar-border bg-sidebar-accent/55 hover:bg-sidebar-accent rounded-lg border p-3 transition-colors"
					href={resolve('/admin/leads?status=new')}
				>
					<span class="flex items-center justify-between gap-2 text-sm font-medium">
						New leads
						<ArrowUpRight aria-hidden="true" />
					</span>
					<span class="mt-2 block text-2xl font-semibold tabular-nums">
						{formatNumber(data.dashboard.kpis.openLeads)}
					</span>
				</a>
				<a
					class="border-sidebar-border bg-sidebar-accent/55 hover:bg-sidebar-accent rounded-lg border p-3 transition-colors"
					href={resolve('/admin/imports')}
				>
					<span class="flex items-center justify-between gap-2 text-sm font-medium">
						Active imports
						<ArrowUpRight aria-hidden="true" />
					</span>
					<span class="mt-2 block text-2xl font-semibold tabular-nums">
						{formatNumber(data.dashboard.kpis.activeImports)}
					</span>
				</a>
				<a
					class="border-sidebar-border bg-sidebar-accent/55 hover:bg-sidebar-accent rounded-lg border p-3 transition-colors"
					href={resolve('/admin/listings?status=draft')}
				>
					<span class="flex items-center justify-between gap-2 text-sm font-medium">
						Draft cars
						<ArrowUpRight aria-hidden="true" />
					</span>
					<span class="mt-2 block text-2xl font-semibold tabular-nums">
						{formatNumber(data.dashboard.kpis.draftListings)}
					</span>
				</a>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Description>Publishing health</Card.Description>
				<Card.Action><Gauge class="text-muted-foreground" aria-hidden="true" /></Card.Action>
				<Card.Title class="text-3xl font-semibold tabular-nums">
					{formatNumber(publishingHealth)}
				</Card.Title>
			</Card.Header>
			<Card.Content class="text-muted-foreground text-sm">
				Published vehicles plus live content records currently available for public surfaces.
			</Card.Content>
		</Card.Root>
	</section>

	<section class="grid grid-cols-1 gap-4 px-4 lg:grid-cols-12 lg:px-6">
		<Card.Root class="lg:col-span-8">
			<Card.Header class="border-b">
				<div>
					<Card.Title>Operations mix</Card.Title>
					<Card.Description>Every row links to the CMS area that owns the work.</Card.Description>
				</div>
			</Card.Header>
			<Card.Content class="p-0">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Area</Table.Head>
							<Table.Head>Status</Table.Head>
							<Table.Head class="text-right">Count</Table.Head>
							<Table.Head class="text-right">Action</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each metricCards as metric (metric.label)}
							<Table.Row>
								<Table.Cell class="font-medium">{metric.label}</Table.Cell>
								<Table.Cell>
									<Badge variant="outline" class="capitalize">{metric.status}</Badge>
								</Table.Cell>
								<Table.Cell class="text-right tabular-nums">{formatNumber(metric.value)}</Table.Cell
								>
								<Table.Cell class="text-right">
									<Button href={metric.href} variant="outline" size="sm">
										{metric.action}
										<ArrowUpRight data-icon="inline-end" aria-hidden="true" />
									</Button>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</Card.Content>
		</Card.Root>

		<Card.Root class="lg:col-span-4">
			<Card.Header class="border-b">
				<Card.Title>Priority queue</Card.Title>
				<Card.Description>Fast links for the admin desk</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-2 p-4">
				<Button href={resolve('/admin/leads?status=new')} variant="outline" class="justify-between">
					New leads
					<ArrowUpRight data-icon="inline-end" aria-hidden="true" />
				</Button>
				<Button
					href={resolve('/admin/imports?status=sourcing')}
					variant="outline"
					class="justify-between"
				>
					Sourcing requests
					<ArrowUpRight data-icon="inline-end" aria-hidden="true" />
				</Button>
				<Button
					href={resolve('/admin/listings?status=draft')}
					variant="outline"
					class="justify-between"
				>
					Draft listings
					<ArrowUpRight data-icon="inline-end" aria-hidden="true" />
				</Button>
				<Button
					href={resolve('/admin/posts?status=draft')}
					variant="outline"
					class="justify-between"
				>
					Draft posts
					<ArrowUpRight data-icon="inline-end" aria-hidden="true" />
				</Button>
			</Card.Content>
		</Card.Root>
	</section>
</AdminShell>
