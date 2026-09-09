<script lang="ts">
	import { resolve } from '$app/paths';
	import Activity from '@lucide/svelte/icons/activity';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import CarFront from '@lucide/svelte/icons/car-front';
	import CheckCircle2 from '@lucide/svelte/icons/check-circle-2';
	import ClipboardList from '@lucide/svelte/icons/clipboard-list';
	import Inbox from '@lucide/svelte/icons/inbox';
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import Newspaper from '@lucide/svelte/icons/newspaper';
	import Truck from '@lucide/svelte/icons/truck';
	import AdminShell from '$lib/components/admin/AdminShell.svelte';
	import {
		formatDate,
		formatNumber,
		formatPrice,
		formatStatus,
		formatVehicleMeta,
		statusVariant
	} from '$lib/components/admin/format';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	type RecentLead = PageProps['data']['dashboard']['recentLeads'][number];
	type RecentImport = PageProps['data']['dashboard']['recentImports'][number];

	const openWork = $derived(
		data.dashboard.kpis.openLeads +
			data.dashboard.kpis.activeImports +
			data.dashboard.kpis.openConversations
	);

	const stats = $derived([
		{
			label: 'Live listings',
			value: data.dashboard.kpis.liveListings,
			detail: 'published inventory',
			icon: CarFront,
			tone: 'Live'
		},
		{
			label: 'Open leads',
			value: data.dashboard.kpis.openLeads,
			detail: 'buyer follow-up',
			icon: Inbox,
			tone: 'Inbox'
		},
		{
			label: 'Active imports',
			value: data.dashboard.kpis.activeImports,
			detail: 'sourcing pipeline',
			icon: Truck,
			tone: 'Pipeline'
		},
		{
			label: 'Open chats',
			value: data.dashboard.kpis.openConversations,
			detail: 'customer conversations',
			icon: MessageSquare,
			tone: 'Realtime'
		},
		{
			label: 'Draft listings',
			value: data.dashboard.kpis.draftListings,
			detail: 'ready to finish',
			icon: ClipboardList,
			tone: 'Draft'
		},
		{
			label: 'Published posts',
			value: data.dashboard.kpis.publishedPosts,
			detail: 'content live',
			icon: Newspaper,
			tone: 'Site'
		}
	]);

	function formatLeadValue(lead: RecentLead) {
		return lead.value ? `${formatNumber(lead.value)} EUR` : 'Lead';
	}

	function formatImportVehicle(request: RecentImport) {
		return [request.desired_make, request.desired_model].filter(Boolean).join(' ') || 'Open brief';
	}

	function handleVehicleImageError(event: Event) {
		const image = event.currentTarget as HTMLImageElement | null;
		const fallbackSrc = resolve('/inventory/21776348634522888-1.webp');

		if (!image || image.getAttribute('src') === fallbackSrc) return;

		image.src = fallbackSrc;
	}
</script>

<svelte:head>
	<title>Admin - Dashboard</title>
</svelte:head>

<AdminShell
	title="Dashboard"
	activePath="/admin"
	primaryAction={{ label: 'Add listing', href: '/admin/listings/new' }}
>
	<section
		class="grid gap-4 px-4 lg:px-6 @6xl/main:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]"
	>
		<Card.Root class="bg-sidebar text-sidebar-foreground">
			<Card.Header>
				<div>
					<Card.Description class="text-sidebar-foreground/60">Operations overview</Card.Description
					>
					<Card.Title class="text-2xl font-semibold">
						{formatNumber(data.dashboard.kpis.liveListings)} live cars,
						{formatNumber(openWork)} active work items
					</Card.Title>
				</div>
				<Card.Action>
					<Badge variant="outline" class="border-sidebar-border text-sidebar-foreground">
						<Activity aria-hidden="true" />
						Live CMS
					</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Content class="grid gap-3 sm:grid-cols-3">
				<a
					class="border-sidebar-border bg-sidebar-accent/55 hover:bg-sidebar-accent rounded-lg border p-3 transition-colors"
					href={resolve('/admin/listings')}
				>
					<span class="flex items-center justify-between gap-2 text-sm font-medium">
						Inventory
						<ArrowUpRight aria-hidden="true" />
					</span>
					<span class="mt-2 block text-2xl font-semibold tabular-nums">
						{formatNumber(data.dashboard.kpis.liveListings)}
					</span>
					<span class="text-sidebar-foreground/60 text-xs">published listings</span>
				</a>
				<a
					class="border-sidebar-border bg-sidebar-accent/55 hover:bg-sidebar-accent rounded-lg border p-3 transition-colors"
					href={resolve('/admin/leads')}
				>
					<span class="flex items-center justify-between gap-2 text-sm font-medium">
						Lead inbox
						<ArrowUpRight aria-hidden="true" />
					</span>
					<span class="mt-2 block text-2xl font-semibold tabular-nums">
						{formatNumber(data.dashboard.kpis.openLeads)}
					</span>
					<span class="text-sidebar-foreground/60 text-xs">buyer follow-up</span>
				</a>
				<a
					class="border-sidebar-border bg-sidebar-accent/55 hover:bg-sidebar-accent rounded-lg border p-3 transition-colors"
					href={resolve('/admin/imports')}
				>
					<span class="flex items-center justify-between gap-2 text-sm font-medium">
						Imports
						<ArrowUpRight aria-hidden="true" />
					</span>
					<span class="mt-2 block text-2xl font-semibold tabular-nums">
						{formatNumber(data.dashboard.kpis.activeImports)}
					</span>
					<span class="text-sidebar-foreground/60 text-xs">active requests</span>
				</a>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="border-b">
				<div>
					<Card.Title>Publishing queue</Card.Title>
					<Card.Description>Drafts, feeds, and content readiness</Card.Description>
				</div>
				<Card.Action><CheckCircle2 class="text-muted-foreground" aria-hidden="true" /></Card.Action>
			</Card.Header>
			<Card.Content class="grid gap-3">
				<div class="bg-muted/50 flex items-center justify-between gap-4 rounded-lg border p-3">
					<span class="text-sm">Draft listings</span>
					<Badge variant="outline">{formatNumber(data.dashboard.kpis.draftListings)}</Badge>
				</div>
				<div class="bg-muted/50 flex items-center justify-between gap-4 rounded-lg border p-3">
					<span class="text-sm">Published posts</span>
					<Badge variant="outline">{formatNumber(data.dashboard.kpis.publishedPosts)}</Badge>
				</div>
				<div class="bg-muted/50 flex items-center justify-between gap-4 rounded-lg border p-3">
					<span class="text-sm">Open conversations</span>
					<Badge variant="outline">{formatNumber(data.dashboard.kpis.openConversations)}</Badge>
				</div>
			</Card.Content>
		</Card.Root>
	</section>

	<section
		class="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:px-6 @5xl/main:grid-cols-3 @7xl/main:grid-cols-6"
		aria-label="Dashboard metrics"
	>
		{#each stats as stat (stat.label)}
			{@const Icon = stat.icon}
			<Card.Root size="sm">
				<Card.Header>
					<Card.Description>{stat.label}</Card.Description>
					<Card.Action>
						<Badge variant="outline">{stat.tone}</Badge>
					</Card.Action>
					<Card.Title class="text-2xl font-semibold tabular-nums">
						{formatNumber(stat.value)}
					</Card.Title>
				</Card.Header>
				<Card.Footer class="items-center justify-between text-sm">
					<span class="text-muted-foreground truncate">{stat.detail}</span>
					<Icon class="text-muted-foreground" aria-hidden="true" />
				</Card.Footer>
			</Card.Root>
		{/each}
	</section>

	<section class="grid grid-cols-1 gap-4 px-4 lg:px-6 @6xl/main:grid-cols-12">
		<Card.Root class="self-start @6xl/main:col-span-8">
			<Card.Header class="border-b">
				<div>
					<Card.Title>Recent inventory</Card.Title>
					<Card.Description>
						{formatNumber(data.dashboard.kpis.liveListings)} live listings,
						{formatNumber(data.dashboard.kpis.draftListings)} drafts
					</Card.Description>
				</div>
				<Card.Action>
					<Button href={resolve('/admin/listings')} variant="outline" size="sm">
						View inventory
					</Button>
				</Card.Action>
			</Card.Header>
			<Card.Content class="p-0">
				{#if data.dashboard.recentVehicles.length}
					<div class="overflow-x-auto">
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>Vehicle</Table.Head>
									<Table.Head>Status</Table.Head>
									<Table.Head class="hidden text-right sm:table-cell">Price</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{#each data.dashboard.recentVehicles as vehicle (vehicle.id)}
									<Table.Row>
										<Table.Cell>
											<a class="flex min-w-60 items-center gap-3" href={resolve('/admin/listings')}>
												<img
													class="ring-border size-12 rounded-md object-cover ring-1"
													src={vehicle.image || '/inventory/21776348634522888-1.webp'}
													alt=""
													onerror={handleVehicleImageError}
												/>
												<span class="min-w-0">
													<span class="block truncate font-medium">{vehicle.short_title}</span>
													<span class="text-muted-foreground block truncate text-xs">
														{formatVehicleMeta(vehicle)}
													</span>
													<span class="text-muted-foreground block truncate text-xs sm:hidden">
														{formatPrice(vehicle)}
													</span>
												</span>
											</a>
										</Table.Cell>
										<Table.Cell>
											<Badge variant={statusVariant(vehicle.status)} class="capitalize">
												{formatStatus(vehicle.status)}
											</Badge>
										</Table.Cell>
										<Table.Cell class="hidden text-right font-medium sm:table-cell">
											{formatPrice(vehicle)}
										</Table.Cell>
									</Table.Row>
								{/each}
							</Table.Body>
						</Table.Root>
					</div>
				{:else}
					<p class="text-muted-foreground p-6 text-sm">No inventory records yet.</p>
				{/if}
			</Card.Content>
		</Card.Root>

		<div class="grid gap-4 @6xl/main:col-span-4">
			<Card.Root>
				<Card.Header class="border-b">
					<div>
						<Card.Title>Lead inbox</Card.Title>
						<Card.Description>{formatNumber(openWork)} open work items</Card.Description>
					</div>
					<Card.Action>
						<Button href={resolve('/admin/leads')} variant="outline" size="sm">Open</Button>
					</Card.Action>
				</Card.Header>
				<Card.Content class="grid gap-1 px-2">
					{#if data.dashboard.recentLeads.length}
						{#each data.dashboard.recentLeads as lead (lead.id)}
							<a
								class="hover:bg-muted flex items-start justify-between gap-3 rounded-lg px-2 py-2 text-sm"
								href={resolve('/admin/leads')}
							>
								<span class="min-w-0">
									<span class="block truncate font-medium">{lead.customer_name}</span>
									<span class="text-muted-foreground block truncate text-xs">
										{lead.source} / {formatDate(lead.created_at)}
									</span>
								</span>
								<span class="grid justify-items-end gap-1">
									<Badge variant={statusVariant(lead.status)} class="capitalize">
										{formatStatus(lead.status)}
									</Badge>
									<span class="text-muted-foreground text-xs">{formatLeadValue(lead)}</span>
								</span>
							</a>
						{/each}
					{:else}
						<p class="text-muted-foreground px-2 py-3 text-sm">No buyer leads yet.</p>
					{/if}
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header class="border-b">
					<div>
						<Card.Title>Import requests</Card.Title>
						<Card.Description>Sourcing pipeline</Card.Description>
					</div>
					<Card.Action>
						<Button href={resolve('/admin/imports')} variant="outline" size="sm">Manage</Button>
					</Card.Action>
				</Card.Header>
				<Card.Content class="grid gap-1 px-2">
					{#if data.dashboard.recentImports.length}
						{#each data.dashboard.recentImports as request (request.id)}
							<a
								class="hover:bg-muted flex items-start justify-between gap-3 rounded-lg px-2 py-2 text-sm"
								href={resolve('/admin/imports')}
							>
								<span class="min-w-0">
									<span class="block truncate font-medium">{request.customer_name}</span>
									<span class="text-muted-foreground block truncate text-xs">
										{request.origin_country} -> {request.destination_country}
									</span>
								</span>
								<span class="grid justify-items-end gap-1">
									<Badge variant={statusVariant(request.status)} class="capitalize">
										{formatStatus(request.status)}
									</Badge>
									<span class="text-muted-foreground max-w-32 truncate text-xs">
										{formatImportVehicle(request)}
									</span>
								</span>
							</a>
						{/each}
					{:else}
						<p class="text-muted-foreground px-2 py-3 text-sm">No import requests yet.</p>
					{/if}
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Description>Open queue</Card.Description>
					<Card.Action>
						<ClipboardList class="text-muted-foreground" aria-hidden="true" />
					</Card.Action>
					<Card.Title class="text-2xl font-semibold tabular-nums">
						{formatNumber(openWork)}
					</Card.Title>
				</Card.Header>
				<Card.Footer class="text-muted-foreground text-sm">
					Open leads, active imports, and conversations waiting for staff action.
				</Card.Footer>
			</Card.Root>
		</div>
	</section>
</AdminShell>
